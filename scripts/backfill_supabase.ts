/**
 * Backfill script för Supabase-tabeller med data från Riksdagens öppna API.
 *
 * Körs via: npx ts-node scripts/backfill_supabase.ts --entities ledamoter,voteringar
 */

import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running backfill.');
  process.exit(1);
}

type Entity = 'ledamoter' | 'voteringar' | 'fragor' | 'interpellationer';

const args = process.argv.slice(2);
const entitiesArg = args.find(arg => arg.startsWith('--entities='));
const entities: Entity[] = entitiesArg
  ? (entitiesArg.split('=')[1].split(',').filter(Boolean) as Entity[])
  : ['ledamoter', 'voteringar', 'fragor', 'interpellationer'];

async function upsert(table: string, rows: any[]) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase upsert failed (${table}): ${response.status} ${text}`);
  }
}

async function backfillLedamoter() {
  console.log('Fetching ledamöter...');
  const url = 'https://data.riksdagen.se/personlista/?utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const ledamoter = json?.personlista?.person || [];
  const mapped = ledamoter.map((item: any) => ({
    intressent_id: item.intressent_id,
    tilltalsnamn: item.tilltalsnamn,
    fornamn: item.fornamn,
    efternamn: item.efternamn,
    parti: item.parti,
    valkrets: item.valkrets,
    status: item.status,
    bild_url: item.bild_url,
  }));
  await upsert('riksdagen_ledamoter', mapped);
  console.log(`Upserted ${mapped.length} ledamöter.`);
}

async function backfillVoteringar() {
  console.log('Fetching voteringar...');
  const url = 'https://data.riksdagen.se/voteringlista/?sz=500&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const list = json?.voteringlista?.votering || [];
  const mapped = list.map((item: any) => ({
    votering_id: item.votering_id,
    rm: item.rm,
    beteckning: item.beteckning,
    punkt: parseInt(item.punkt, 10) || null,
    ja_roster: parseInt(item.ja, 10) || 0,
    nej_roster: parseInt(item.nej, 10) || 0,
    avstar_roster: parseInt(item.avstar, 10) || 0,
    franvarande_roster: parseInt(item.frvar, 10) || 0,
  }));
  await upsert('riksdagen_voteringar', mapped);
  console.log(`Upserted ${mapped.length} voteringar.`);
}

async function backfillFragor() {
  console.log('Fetching frågor...');
  const url = 'https://data.riksdagen.se/dokumentlista/?sok=fraga&doktyp=fra&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const docs = json?.dokumentlista?.dokument || [];
  const mapped = docs.map((item: any) => ({
    dokument_id: item.dok_id,
    titel: item.titel,
    publicerad_datum: item.publicerad,
    fraga_stallare_intressent_id: item.intressent_id,
    fraga_stallare_namn: item.avsnittsrubrik,
    status: item.status,
    url: item.dokument_url_html,
  }));
  await upsert('riksdagen_fragor', mapped);
  console.log(`Upserted ${mapped.length} frågor.`);
}

async function backfillInterpellationer() {
  console.log('Fetching interpellationer...');
  const url = 'https://data.riksdagen.se/dokumentlista/?doktyp=interp&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const docs = json?.dokumentlista?.dokument || [];
  const mapped = docs.map((item: any) => ({
    dokument_id: item.dok_id,
    titel: item.titel,
    publicerad_datum: item.publicerad,
    fraga_stallare_intressent_id: item.intressent_id,
    fraga_stallare_namn: item.avsnittsrubrik,
    status: item.status,
    url: item.dokument_url_html,
  }));
  await upsert('riksdagen_interpellationer', mapped);
  console.log(`Upserted ${mapped.length} interpellationer.`);
}

async function main() {
  for (const entity of entities) {
    switch (entity) {
      case 'ledamoter':
        await backfillLedamoter();
        break;
      case 'voteringar':
        await backfillVoteringar();
        break;
      case 'fragor':
        await backfillFragor();
        break;
      case 'interpellationer':
        await backfillInterpellationer();
        break;
      default:
        console.warn(`Unknown entity: ${entity}`);
    }
  }
  console.log('Backfill complete.');
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
