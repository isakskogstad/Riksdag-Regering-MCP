/**
 * Tools for retrieving full document content (pressmeddelanden, riksdagens dokument).
 */

import { getSupabase } from '../utils/supabase.js';
import { z } from 'zod';
import { resolveData, fetchRiksdagenDokument, saveJsonToStorage } from '../utils/resolver.js';
import { stripHtml, truncate } from '../utils/helpers.js';
import { logDataMiss } from '../utils/telemetry.js';

/**
 * Hämta pressmeddelande med full text
 */
export const getPressmeddelandeSchema = z.object({
  document_id: z.string().describe('Pressmeddelandets ID'),
  include_full_text: z.boolean().optional().default(false).describe('Returnera hela textinnehållet'),
});

export async function getPressmeddelande(args: z.infer<typeof getPressmeddelandeSchema>) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('regeringskansliet_pressmeddelanden')
    .select('*')
    .eq('document_id', args.document_id)
    .single();

  if (error || !data) {
    throw new Error(`Pressmeddelande ${args.document_id} hittades inte (${error?.message ?? 'okänt fel'})`);
  }

  const clean = stripHtml(data.innehall || '');
  const summary = truncate(clean, 500);

  return {
    metadata: {
      document_id: data.document_id,
      titel: data.titel,
      departement: data.departement,
      publicerad_datum: data.publicerad_datum,
    },
    summary,
    content: args.include_full_text ? clean : null,
  };
}

/**
 * Hämta Riksdagens dokument med fulltext (cache + bucket).
 */
export const getDokumentInnehallSchema = z.object({
  dok_id: z.string().describe('Dokument ID'),
  include_full_text: z.boolean().optional().default(false),
});

export async function getDokumentInnehall(args: z.infer<typeof getDokumentInnehallSchema>, log?: (text: string) => Promise<void>) {
  const supabase = getSupabase();

  const { data, source, fetchedAt } = await resolveData({
    supabaseQuery: async () => {
      const { data, error } = await supabase
        .from('riksdagen_dokument')
        .select('*')
        .eq('dok_id', args.dok_id)
        .single();
      if (error) return null;
      return data || null;
    },
    fallbackApi: async () => {
      return await fetchRiksdagenDokument(args.dok_id);
    },
    persist: async (doc) => {
      await supabase.from('riksdagen_dokument').upsert({
        dok_id: doc.dok_id,
        doktyp: doc.doktyp,
        rm: doc.rm,
        beteckning: doc.beteckning,
        datum: doc.datum,
        titel: doc.titel,
        organ: doc.organ,
        text: doc.text ?? null,
      }, { onConflict: 'dok_id' });
      if (doc.html) {
        await saveJsonToStorage('riksdagen-dokument', `${args.dok_id}.html`, doc.html);
      }
    },
    onMiss: async () => {
      await logDataMiss({
        entity: 'riksdagen_dokument',
        identifier: args.dok_id,
        reason: 'saknar fulltext',
      });
    },
  });

  if (!data) {
    throw new Error(`Dokument ${args.dok_id} hittades inte`);
  }

  const text = data.text || data.dokutskrift || '';
  const summary = truncate(stripHtml(text), 600);

  await log?.(`📄 Dokument ${args.dok_id} laddat (${source})`);

  return {
    metadata: {
      dok_id: data.dok_id,
      titel: data.titel,
      doktyp: data.doktyp,
      rm: data.rm,
      datum: data.datum,
    },
    source,
    fetchedAt,
    summary,
    content: args.include_full_text ? text : null,
    download_url: `https://riksdag-regering-ai.onrender.com/files/${args.dok_id}.html`,
  };
}
