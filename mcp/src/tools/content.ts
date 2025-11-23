import { z } from 'zod';
import { stripHtml, truncate } from '../utils/helpers.js';
import { fetchDokumentDirect } from '../utils/riksdagenApi.js';
import { fetchG0vDocuments, fetchG0vDocumentContent } from '../utils/g0vApi.js';
import { safeFetch } from '../utils/apiHelpers.js';

const RIKSDAG_API_BASE = 'https://data.riksdagen.se';

/**
 * Hämta dokument direkt via dokument-ID endpoint (samma som get_dokument)
 * Detta är mer pålitligt än att söka via dokumentlista
 */
async function loadDocument(dokId: string) {
  const url = `${RIKSDAG_API_BASE}/dokument/${dokId}.json`;
  try {
    const data = await safeFetch(url);
    return data?.dokumentstatus?.dokument ?? null;
  } catch (error) {
    // If direct fetch fails, try searching as fallback
    try {
      const result = await fetchDokumentDirect({ sok: dokId, sz: 5 });
      return result.data.find((doc: any) => doc.dok_id?.toLowerCase() === dokId.toLowerCase()) || null;
    } catch {
      return null;
    }
  }
}

async function loadDocumentText(doc: any): Promise<string | null> {
  if (!doc) return null;
  const url = doc.dokument_url_text || doc.dokument_url_html;
  if (!url) return null;
  const absoluteUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https:${url}`;
  const response = await fetch(absoluteUrl, {
    headers: { 'User-Agent': 'Wget/1.21 (riksdag-regering-mcp)' },
  });
  if (!response.ok) {
    return null;
  }
  return await response.text();
}

// === GENERISKA REGERINGSDOKUMENT TOOLS (NY DESIGN) ===

export const getRegeringDocumentSchema = z.object({
  document_id: z.string().describe('ID eller URL-del för dokumentet'),
  type: z.enum(['pressmeddelanden', 'propositioner', 'sou', 'ds', 'dir', 'remisser', 'regeringsuppdrag', 'rapporter', 'tal', 'debattartiklar', 'uttalanden', 'artiklar'])
    .optional()
    .describe('Dokumenttyp (om känd). Om inte angiven, söks i alla typer.'),
});

export async function getRegeringDocument(args: z.infer<typeof getRegeringDocumentSchema>) {
  try {
    // If it's a full regeringen.se URL, use it directly
    if (args.document_id.toLowerCase().includes('regeringen.se')) {
      const content = await fetchG0vDocumentContent(args.document_id);
      return {
        titel: 'Regeringsdokument',
        publicerad: null,
        avsandare: null,
        url: args.document_id,
        typ: args.type || 'unknown',
        markdown: content,
        notice: 'Hämtade dokument direkt via URL. Metadata kan vara begränsad.'
      };
    }

    // Determine which types to search in
    const typesToSearch = args.type
      ? [args.type]
      : ['pressmeddelanden', 'propositioner', 'sou', 'ds', 'rapporter', 'tal'];

    const searchLower = args.document_id.toLowerCase();

    // Search through specified types
    for (const docType of typesToSearch) {
      try {
        const data = await fetchG0vDocuments(docType as any, { limit: 500 });

        const match = data.find((doc) => {
          if (!doc || !doc.url) return false;

          // Try to match exact URL if it's a full URL
          if (searchLower.startsWith('http')) {
            return doc.url.toLowerCase() === searchLower;
          }

          // Try to match URL slug (last meaningful part of URL)
          const docSlug = doc.url.split('/').filter(Boolean).pop()?.toLowerCase();
          const searchSlug = searchLower.split('/').filter(Boolean).pop()?.toLowerCase();
          if (docSlug && searchSlug) {
            if (docSlug === searchSlug) return true;
            if (docSlug.includes(searchSlug)) return true;
            if (searchSlug.includes(docSlug)) return true;
          }

          // Try exact title match
          if (doc.title && doc.title.toLowerCase() === searchLower) {
            return true;
          }

          // Fallback to title includes (but require more than 3 chars)
          if (searchLower.length > 3) {
            return doc.title && doc.title.toLowerCase().includes(searchLower);
          }

          return false;
        });

        if (match && match.url) {
          const content = await fetchG0vDocumentContent(match.url);
          return {
            titel: match.title,
            publicerad: match.published,
            avsandare: match.sender,
            url: match.url,
            typ: match.type,
            markdown: content,
          };
        }
      } catch (error) {
        // Continue to next type if this one fails
        continue;
      }
    }

    // Not found in any type
    return {
      error: `Dokumentet "${args.document_id}" hittades inte${args.type ? ` i ${args.type}` : ' i något dokumenttyp'}.`,
      searched_types: typesToSearch,
      suggestions: [
        'Använd en mer specifik sökterm (minst 4 tecken)',
        'Använd full URL från regeringen.se (t.ex. från search_regering)',
        'Prova med search_regering först för att hitta exakt URL',
        'Ange dokumenttyp om du vet den (t.ex. type: "propositioner")',
      ]
    };
  } catch (error) {
    return {
      error: `Kunde inte hämta dokument: ${error instanceof Error ? error.message : String(error)}`,
      document_id: args.document_id,
      suggestions: ['Försök igen om en stund', 'Använd search_regering istället', 'Kontrollera att URL:en är korrekt']
    };
  }
}

export const summarizeRegeringDocumentSchema = z.object({
  document_id: z.string().describe('ID eller URL-del för dokumentet'),
  type: z.enum(['pressmeddelanden', 'propositioner', 'sou', 'ds', 'dir', 'remisser', 'regeringsuppdrag', 'rapporter', 'tal', 'debattartiklar', 'uttalanden', 'artiklar'])
    .optional()
    .describe('Dokumenttyp (om känd)'),
  max_length: z.number().optional().default(500).describe('Max längd på sammanfattning'),
});

export async function summarizeRegeringDocument(args: z.infer<typeof summarizeRegeringDocumentSchema>) {
  try {
    // If it's a full regeringen.se URL, use it directly
    if (args.document_id.toLowerCase().includes('regeringen.se')) {
      const markdown = await fetchG0vDocumentContent(args.document_id);
      const clean = stripHtml(markdown || '');
      return {
        meta: {
          titel: 'Regeringsdokument',
          publicerad: null,
          url: args.document_id,
          departement: null,
        },
        summary: truncate(clean, args.max_length || 500),
        notice: 'Hämtade dokument direkt via URL. Metadata kan vara begränsad.'
      };
    }

    // Determine which types to search in
    const typesToSearch = args.type
      ? [args.type]
      : ['pressmeddelanden', 'propositioner', 'sou', 'ds', 'rapporter', 'tal'];

    const searchLower = args.document_id.toLowerCase();

    // Search through specified types
    for (const docType of typesToSearch) {
      try {
        const data = await fetchG0vDocuments(docType as any, { limit: 500 });

        const match = data.find((doc) => {
          if (!doc || !doc.url) return false;

          if (searchLower.startsWith('http')) {
            return doc.url.toLowerCase() === searchLower;
          }

          const docSlug = doc.url.split('/').filter(Boolean).pop()?.toLowerCase();
          const searchSlug = searchLower.split('/').filter(Boolean).pop()?.toLowerCase();
          if (docSlug && searchSlug) {
            if (docSlug === searchSlug) return true;
            if (docSlug.includes(searchSlug)) return true;
            if (searchSlug.includes(docSlug)) return true;
          }

          if (doc.title && doc.title.toLowerCase() === searchLower) {
            return true;
          }

          if (searchLower.length > 3) {
            return doc.title && doc.title.toLowerCase().includes(searchLower);
          }

          return false;
        });

        if (match && match.url) {
          const markdown = await fetchG0vDocumentContent(match.url);
          const clean = stripHtml(markdown || '');

          return {
            meta: {
              titel: match.title,
              publicerad: match.published,
              url: match.url,
              departement: match.sender,
              typ: match.type,
            },
            summary: truncate(clean, args.max_length || 500),
          };
        }
      } catch (error) {
        continue;
      }
    }

    return {
      error: `Dokumentet "${args.document_id}" hittades inte${args.type ? ` i ${args.type}` : ''}.`,
      searched_types: typesToSearch,
      suggestions: [
        'Använd en mer specifik sökterm (minst 4 tecken)',
        'Använd full URL från regeringen.se',
        'Prova med search_regering först',
        'Ange dokumenttyp om du vet den',
      ]
    };
  } catch (error) {
    return {
      error: `Kunde inte sammanfatta dokument: ${error instanceof Error ? error.message : String(error)}`,
      document_id: args.document_id,
      suggestions: ['Försök igen om en stund', 'Använd search_regering eller get_regering_document istället']
    };
  }
}

// === DEPRECATED: Legacy pressmeddelande-specifika tools ===
// Dessa behålls för bakåtkompatibilitet men rekommenderas inte för ny användning.
// Använd get_regering_document och summarize_regering_document istället.

export const getPressmeddelandeSchema = z.object({
  document_id: z.string().describe('ID eller URL-del för pressmeddelandet'),
});

/**
 * @deprecated Använd get_regering_document({ document_id, type: 'pressmeddelanden' }) istället
 */
export async function getPressmeddelande(args: z.infer<typeof getPressmeddelandeSchema>) {
  try {
    // If it's a full regeringen.se URL, use it directly
    if (args.document_id.toLowerCase().includes('regeringen.se')) {
      const content = await fetchG0vDocumentContent(args.document_id);
      return {
        titel: 'Pressmeddelande',
        publicerad: null,
        avsandare: null,
        url: args.document_id,
        typ: 'pressmeddelanden',
        markdown: content,
        notice: 'Hämtade dokument direkt via URL. Metadata kan vara begränsad.'
      };
    }

    const data = await fetchG0vDocuments('pressmeddelanden', { limit: 500 });
    const searchLower = args.document_id.toLowerCase();

    const match = data.find((doc) => {
      if (!doc || !doc.url) return false;

      // Try to match exact URL if it's a full URL
      if (searchLower.startsWith('http')) {
        return doc.url.toLowerCase() === searchLower;
      }

      // Try to match URL slug (last meaningful part of URL)
      const docSlug = doc.url.split('/').filter(Boolean).pop()?.toLowerCase();
      const searchSlug = searchLower.split('/').filter(Boolean).pop()?.toLowerCase();
      if (docSlug && searchSlug) {
        // Exact slug match
        if (docSlug === searchSlug) return true;
        // Slug contains search term
        if (docSlug.includes(searchSlug)) return true;
        // Search term contains slug (for shorter IDs)
        if (searchSlug.includes(docSlug)) return true;
      }

      // Try exact title match
      if (doc.title && doc.title.toLowerCase() === searchLower) {
        return true;
      }

      // Fallback to title includes (but require more than 3 chars to avoid too broad matches)
      if (searchLower.length > 3) {
        return doc.title && doc.title.toLowerCase().includes(searchLower);
      }

      return false;
    });

    if (!match || !match.url) {
      return {
        error: `Pressmeddelandet "${args.document_id}" hittades inte via g0v.se.`,
        searched_in: `${data.length} pressmeddelanden`,
        suggestions: [
          'Använd en mer specifik sökterm (minst 4 tecken)',
          'Använd full URL från regeringen.se (t.ex. från search_regering)',
          'Prova med search_regering först för att hitta exakt URL',
          'Exempel: använd hela URL-sluggen från regeringen.se'
        ]
      };
    }

    const content = await fetchG0vDocumentContent(match.url);

    return {
      titel: match.title,
      publicerad: match.published,
      avsandare: match.sender,
      url: match.url,
      typ: match.type,
      markdown: content,
    };
  } catch (error) {
    return {
      error: `Kunde inte hämta pressmeddelande: ${error instanceof Error ? error.message : String(error)}`,
      document_id: args.document_id,
      suggestions: ['Försök igen om en stund', 'Använd search_regering istället', 'Kontrollera att URL:en är korrekt']
    };
  }
}

export const getDokumentInnehallSchema = z.object({
  dok_id: z.string().describe('Dokument ID'),
  include_full_text: z.boolean().optional().default(false),
});

export async function getDokumentInnehall(args: z.infer<typeof getDokumentInnehallSchema>) {
  try {
    const doc = await loadDocument(args.dok_id);
    if (!doc) {
      return {
        error: `Dokument ${args.dok_id} hittades inte i Riksdagens API.`,
        suggestions: [
          'Kontrollera att dokument-ID är korrekt (t.ex. HD0144, H901FiU1)',
          'Använd search_dokument för att hitta dokument',
          'Använd get_dokument för grundläggande metadata utan fulltext'
        ]
      };
    }

    const text = await loadDocumentText(doc);
    const cleanText = text ? stripHtml(text) : null;

    // Build proper URL avoiding double https: prefix
    let url = doc.relurl || '';
    if (doc.dokument_url_html) {
      const htmlUrl = doc.dokument_url_html;
      url = htmlUrl.startsWith('http://') || htmlUrl.startsWith('https://')
        ? htmlUrl
        : `https:${htmlUrl}`;
    }

    const result: any = {
      dok_id: doc.dok_id,
      titel: doc.titel,
      datum: doc.datum,
      doktyp: doc.doktyp,
      rm: doc.rm,
      summary: doc.summary,
      snippet: cleanText ? truncate(cleanText, 400) : null,
      text: args.include_full_text ? cleanText : null,
      url,
      fulltext_available: !!cleanText,
    };

    // Add notice if fulltext is not available
    if (!cleanText) {
      result.notice = 'Fulltext kunde inte hämtas för detta dokument. Metadata och summary är tillgängliga.';
    }

    return result;
  } catch (error) {
    return {
      error: `Fel vid hämtning av dokumentinnehåll: ${error instanceof Error ? error.message : String(error)}`,
      dok_id: args.dok_id,
      suggestions: ['Försök igen om en stund', 'Använd get_dokument eller search_dokument istället']
    };
  }
}

export const summarizePressmeddelandeSchema = z.object({
  document_id: z.string(),
  max_length: z.number().optional().default(500),
});

/**
 * @deprecated Använd summarize_regering_document({ document_id, type: 'pressmeddelanden' }) istället
 */
export async function summarizePressmeddelande(args: z.infer<typeof summarizePressmeddelandeSchema>) {
  try {
    // If it's a full regeringen.se URL, use it directly
    if (args.document_id.toLowerCase().includes('regeringen.se')) {
      const markdown = await fetchG0vDocumentContent(args.document_id);
      const clean = stripHtml(markdown || '');
      return {
        meta: {
          titel: 'Pressmeddelande',
          publicerad: null,
          url: args.document_id,
          departement: null,
        },
        summary: truncate(clean, args.max_length || 500),
        notice: 'Hämtade dokument direkt via URL. Metadata kan vara begränsad.'
      };
    }

    const data = await fetchG0vDocuments('pressmeddelanden', { limit: 500 });
    const searchLower = args.document_id.toLowerCase();

    const match = data.find((doc) => {
      if (!doc || !doc.url) return false;

      // Try to match exact URL if it's a full URL
      if (searchLower.startsWith('http')) {
        return doc.url.toLowerCase() === searchLower;
      }

      // Try to match URL slug (last meaningful part of URL)
      const docSlug = doc.url.split('/').filter(Boolean).pop()?.toLowerCase();
      const searchSlug = searchLower.split('/').filter(Boolean).pop()?.toLowerCase();
      if (docSlug && searchSlug) {
        // Exact slug match
        if (docSlug === searchSlug) return true;
        // Slug contains search term
        if (docSlug.includes(searchSlug)) return true;
        // Search term contains slug (for shorter IDs)
        if (searchSlug.includes(docSlug)) return true;
      }

      // Try exact title match
      if (doc.title && doc.title.toLowerCase() === searchLower) {
        return true;
      }

      // Fallback to title includes (but require more than 3 chars)
      if (searchLower.length > 3) {
        return doc.title && doc.title.toLowerCase().includes(searchLower);
      }

      return false;
    });

    if (!match || !match.url) {
      return {
        error: `Pressmeddelandet "${args.document_id}" hittades inte.`,
        searched_in: `${data.length} pressmeddelanden`,
        suggestions: [
          'Använd en mer specifik sökterm (minst 4 tecken)',
          'Använd full URL från regeringen.se (t.ex. från search_regering)',
          'Prova med search_regering först för att hitta exakt URL',
          'Använd get_pressmeddelande för fullständigt innehåll'
        ]
      };
    }

    const markdown = await fetchG0vDocumentContent(match.url);
    const clean = stripHtml(markdown || '');

    return {
      meta: {
        titel: match.title,
        publicerad: match.published,
        url: match.url,
        departement: match.sender,
      },
      summary: truncate(clean, args.max_length || 500),
    };
  } catch (error) {
    return {
      error: `Kunde inte sammanfatta pressmeddelande: ${error instanceof Error ? error.message : String(error)}`,
      document_id: args.document_id,
      suggestions: ['Försök igen om en stund', 'Använd search_regering eller get_pressmeddelande istället', 'Kontrollera att URL:en är korrekt']
    };
  }
}
