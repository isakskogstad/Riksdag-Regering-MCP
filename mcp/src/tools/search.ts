/**
 * Sökverktyg för Riksdagen och Regeringskansliet
 */

import { getSupabase } from '../utils/supabase.js';
import { stripHtml, truncate, normalizeLimit } from '../utils/helpers.js';
import { z } from 'zod';

/**
 * Sök efter ledamöter
 */
export const searchLedamoterSchema = z.object({
  namn: z.string().optional().describe('Namn att söka efter (förnamn eller efternamn)'),
  parti: z.string().optional().describe('Parti (t.ex. S, M, SD, V, MP, C, L, KD)'),
  valkrets: z.string().optional().describe('Valkrets'),
  status: z.string().optional().describe('Status (tjänstgörande, tjänstledig, etc.)'),
  limit: z.number().min(1).max(200).optional().default(50).describe('Max antal resultat'),
});

export async function searchLedamoter(args: z.infer<typeof searchLedamoterSchema>) {
  const supabase = getSupabase();

  const limit = normalizeLimit(args.limit, 50);

  let query = supabase
    .from('riksdagen_ledamoter')
    .select('*')
    .limit(limit);

  if (args.namn) {
    query = query.or(`tilltalsnamn.ilike.%${args.namn}%,efternamn.ilike.%${args.namn}%`);
  }

  if (args.parti) {
    query = query.eq('parti', args.parti.toUpperCase());
  }

  if (args.valkrets) {
    query = query.ilike('valkrets', `%${args.valkrets}%`);
  }

  if (args.status) {
    query = query.ilike('status', `%${args.status}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Fel vid sökning av ledamöter: ${error.message}`);
  }

  return {
    count: data?.length || 0,
    ledamoter: data || [],
  };
}

/**
 * Sök efter dokument
 */
export const searchDokumentSchema = z.object({
  titel: z.string().optional().describe('Titel att söka efter'),
  doktyp: z.string().optional().describe('Dokumenttyp (t.ex. mot, prop, bet, skr)'),
  rm: z.string().optional().describe('Riksmöte (t.ex. 2024/25)'),
  organ: z.string().optional().describe('Organ (t.ex. KU, FiU, UU)'),
  from_date: z.string().optional().describe('Från datum (YYYY-MM-DD)'),
  to_date: z.string().optional().describe('Till datum (YYYY-MM-DD)'),
  limit: z.number().min(1).max(200).optional().default(50).describe('Max antal resultat'),
});

export async function searchDokument(args: z.infer<typeof searchDokumentSchema>, log?: (text: string) => Promise<void>) {
  const supabase = getSupabase();

  const limit = normalizeLimit(args.limit, 50);

  let query = supabase
    .from('riksdagen_dokument')
    .select('*')
    .limit(limit)
    .order('datum', { ascending: false });

  if (args.titel) {
    query = query.ilike('titel', `%${args.titel}%`);
  }

  if (args.doktyp) {
    query = query.eq('doktyp', args.doktyp);
  }

  if (args.rm) {
    query = query.eq('rm', args.rm);
  }

  if (args.organ) {
    query = query.eq('organ', args.organ);
  }

  if (args.from_date) {
    query = query.gte('datum', args.from_date);
  }

  if (args.to_date) {
    query = query.lte('datum', args.to_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Fel vid sökning av dokument: ${error.message}`);
  }

  const dokument = data || [];

  if (log) {
    await log(`📄 Hittade ${dokument.length} dokument`);
  }

  const chunkSize = 20;
  const chunks = [];
  for (let i = 0; i < dokument.length; i += chunkSize) {
    const chunk = dokument.slice(i, i + chunkSize);
    chunks.push({
      type: 'text' as const,
      text: JSON.stringify({ chunk: i / chunkSize + 1, items: chunk }),
    });
  }

  return {
    count: dokument.length,
    dokument,
    chunks,
  };
}

/**
 * Fulltext-sök i dokument.
 */
export const searchDokumentFulltextSchema = z.object({
  query: z.string().min(2).describe('Text att söka efter'),
  limit: z.number().min(1).max(200).optional().default(20),
});

export async function searchDokumentFulltext(args: z.infer<typeof searchDokumentFulltextSchema>, log?: (text: string) => Promise<void>) {
  const supabase = getSupabase();
  const limit = normalizeLimit(args.limit, 20);
  await log?.(`🔍 Fulltextsök: “${args.query}”`);

  const { data, error } = await supabase
    .from('riksdagen_dokument')
    .select('dok_id, titel, doktyp, rm, datum, text')
    .ilike('text', `%${args.query}%`)
    .limit(limit);

  if (error) {
    throw new Error(`Fel vid fulltextsökning: ${error.message}`);
  }

  const hits = (data || []).map(doc => ({
    dok_id: doc.dok_id,
    titel: doc.titel,
    doktyp: doc.doktyp,
    rm: doc.rm,
    datum: doc.datum,
    snippet: truncate(stripHtml(doc.text || ''), 200),
  }));

  await log?.(`📄 Träffar: ${hits.length}`);

  return {
    count: hits.length,
    hits,
  };
}

/**
 * Sök efter anföranden
 */
export const searchAnforandenSchema = z.object({
  talare: z.string().optional().describe('Talare att söka efter'),
  parti: z.string().optional().describe('Parti'),
  debattnamn: z.string().optional().describe('Debattnamn'),
  text: z.string().optional().describe('Text att söka i anförandet'),
  from_date: z.string().optional().describe('Från datum (YYYY-MM-DD)'),
  to_date: z.string().optional().describe('Till datum (YYYY-MM-DD)'),
  limit: z.number().min(1).max(200).optional().default(50).describe('Max antal resultat'),
});

export async function searchAnforanden(args: z.infer<typeof searchAnforandenSchema>) {
  const supabase = getSupabase();

  const limit = normalizeLimit(args.limit, 50);

  let query = supabase
    .from('riksdagen_anforanden')
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (args.talare) {
    query = query.ilike('talare', `%${args.talare}%`);
  }

  if (args.parti) {
    query = query.eq('parti', args.parti.toUpperCase());
  }

  if (args.debattnamn) {
    query = query.ilike('avsnittsrubrik', `%${args.debattnamn}%`);
  }

  if (args.text) {
    query = query.ilike('replik', `%${args.text}%`);
  }

  if (args.from_date) {
    query = query.gte('created_at', args.from_date);
  }

  if (args.to_date) {
    query = query.lte('created_at', args.to_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Fel vid sökning av anföranden: ${error.message}`);
  }

  return {
    count: data?.length || 0,
    anforanden: data || [],
  };
}

/**
 * Sök efter voteringar
 */
export const searchVoteringarSchema = z.object({
  titel: z.string().optional().describe('Titel att söka efter'),
  rm: z.string().optional().describe('Riksmöte (t.ex. 2024/25)'),
  from_date: z.string().optional().describe('Från datum (YYYY-MM-DD)'),
  to_date: z.string().optional().describe('Till datum (YYYY-MM-DD)'),
  limit: z.number().min(1).max(200).optional().default(50).describe('Max antal resultat'),
});

export async function searchVoteringar(args: z.infer<typeof searchVoteringarSchema>) {
  const supabase = getSupabase();

  const limit = normalizeLimit(args.limit, 50);

  let query = supabase
    .from('riksdagen_voteringar')
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (args.titel) {
    query = query.ilike('beteckning', `%${args.titel}%`);
  }

  if (args.rm) {
    query = query.eq('rm', args.rm);
  }

  if (args.from_date) {
    query = query.gte('created_at', args.from_date);
  }

  if (args.to_date) {
    query = query.lte('created_at', args.to_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Fel vid sökning av voteringar: ${error.message}`);
  }

  return {
    count: data?.length || 0,
    voteringar: data || [],
  };
}

/**
 * Sök i regeringskansliets dokument
 */
export const searchRegeringSchema = z.object({
  dataType: z.enum([
    'pressmeddelanden',
    'propositioner',
    'departementsserien',
    'sou',
    'remisser',
    'rapporter',
  ]).describe('Typ av dokument att söka i'),
  titel: z.string().optional().describe('Titel att söka efter'),
  departement: z.string().optional().describe('Departement'),
  from_date: z.string().optional().describe('Från datum (YYYY-MM-DD)'),
  to_date: z.string().optional().describe('Till datum (YYYY-MM-DD)'),
  limit: z.number().min(1).max(200).optional().default(50).describe('Max antal resultat'),
});

export async function searchRegering(args: z.infer<typeof searchRegeringSchema>) {
  const supabase = getSupabase();

  const limit = normalizeLimit(args.limit, 50);

  const tableMap: Record<string, string> = {
    'pressmeddelanden': 'regeringskansliet_pressmeddelanden',
    'propositioner': 'regeringskansliet_propositioner',
    'departementsserien': 'regeringskansliet_departementsserien',
    'sou': 'regeringskansliet_sou',
    'remisser': 'regeringskansliet_remisser',
    'rapporter': 'regeringskansliet_rapporter',
  };

  const tableName = tableMap[args.dataType];

  let query = supabase
    .from(tableName)
    .select('*')
    .limit(limit)
    .order('publicerad_datum', { ascending: false });

  if (args.titel) {
    query = query.ilike('titel', `%${args.titel}%`);
  }

  if (args.departement) {
    query = query.ilike('departement', `%${args.departement}%`);
  }

  if (args.from_date) {
    query = query.gte('publicerad_datum', args.from_date);
  }

  if (args.to_date) {
    query = query.lte('publicerad_datum', args.to_date);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Fel vid sökning i ${args.dataType}: ${error.message}`);
  }

  return {
    dataType: args.dataType,
    count: data?.length || 0,
    dokument: data || [],
  };
}
