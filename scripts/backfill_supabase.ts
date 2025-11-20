/**
 * Backfill script för Supabase-tabeller med data från Riksdagens öppna API.
 *
 * Usage examples:
 * - Import all entities: npx ts-node scripts/backfill_supabase.ts
 * - Import specific entities: npx ts-node scripts/backfill_supabase.ts --entities motioner,propositioner
 * - Import motions only: npx ts-node scripts/backfill_supabase.ts --entities motioner
 * - Import with tsx: npx tsx scripts/backfill_supabase.ts --entities motioner,propositioner,betankanden,votering_ledamoter
 *
 * Available entities:
 * - ledamoter: Members of Parliament
 * - voteringar: Voting summaries
 * - fragor: Questions (frågor)
 * - interpellationer: Interpellations
 * - motioner: Motions
 * - propositioner: Propositions
 * - betankanden: Committee reports (betänkanden)
 * - votering_ledamoter: Individual member voting data
 *
 * Environment variables required:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role API key for authentication
 */

import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running backfill.');
  process.exit(1);
}

type Entity = 'ledamoter' | 'voteringar' | 'fragor' | 'interpellationer' | 'motioner' | 'propositioner' | 'betankanden' | 'votering_ledamoter';

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

async function backfillMotioner() {
  console.log('Fetching motioner...');
  const url = 'https://data.riksdagen.se/dokumentlista/?doktyp=mot&sz=500&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const docs = json?.dokumentlista?.dokument || [];
  const mapped = docs.map((item: any) => {
    // Extract organ/committee code from beteckning if not provided
    // Example: "2024/25:353 (S)" -> organ would be extracted from struktur if available
    let organ = item.organ || item.utskott || '';

    return {
      dokument_id: item.dok_id,
      rm: item.rm,
      beteckning: item.beteckning,
      doktyp: 'mot',
      titel: item.titel,
      subtitel: item.subtitel,
      organ: organ,
      publicerad_datum: item.publicerad,
      datum: item.publicerad, // Alternative field name
      status: item.status,
      url: item.dokument_url_html,
      dokument_url_text: item.dokument_url_text,
      dokument_url_html: item.dokument_url_html,
    };
  });
  // Use riksdagen_dokument table if it exists, otherwise create documents
  try {
    await upsert('riksdagen_dokument', mapped);
    console.log(`Upserted ${mapped.length} motioner.`);
  } catch (error) {
    console.warn(`Failed to upsert motioner: ${error}`);
  }
}

async function backfillPropositioner() {
  console.log('Fetching propositioner...');
  const url = 'https://data.riksdagen.se/dokumentlista/?doktyp=prop&sz=500&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const docs = json?.dokumentlista?.dokument || [];
  const mapped = docs.map((item: any) => {
    // Propositions are typically handled by committees, extract organ if available
    let organ = item.organ || item.utskott || '';

    return {
      dokument_id: item.dok_id,
      rm: item.rm,
      beteckning: item.beteckning,
      doktyp: 'prop',
      titel: item.titel,
      subtitel: item.subtitel,
      organ: organ,
      publicerad_datum: item.publicerad,
      datum: item.publicerad,
      status: item.status,
      url: item.dokument_url_html,
      dokument_url_text: item.dokument_url_text,
      dokument_url_html: item.dokument_url_html,
    };
  });
  try {
    await upsert('riksdagen_dokument', mapped);
    console.log(`Upserted ${mapped.length} propositioner.`);
  } catch (error) {
    console.warn(`Failed to upsert propositioner: ${error}`);
  }
}

async function backfillBetankanden() {
  console.log('Fetching betänkanden...');
  const url = 'https://data.riksdagen.se/dokumentlista/?doktyp=bet&sz=500&utformat=json';
  const response = await fetch(url);
  const json = await response.json();
  const docs = json?.dokumentlista?.dokument || [];
  const mapped = docs.map((item: any) => {
    // Betänkanden (committee reports) should have organ/utskott code
    // Example beteckning: "2024/25:KU5" - KU is the committee code
    let organ = item.organ || item.utskott || '';

    // Try to extract committee code from beteckning if organ is empty
    if (!organ && item.beteckning) {
      const match = item.beteckning.match(/([A-ZÅÄÖ]+)[\d]/);
      if (match) {
        organ = match[1];
      }
    }

    return {
      dokument_id: item.dok_id,
      rm: item.rm,
      beteckning: item.beteckning,
      doktyp: 'bet',
      titel: item.titel,
      subtitel: item.subtitel,
      organ: organ,
      publicerad_datum: item.publicerad,
      datum: item.publicerad,
      status: item.status,
      url: item.dokument_url_html,
      dokument_url_text: item.dokument_url_text,
      dokument_url_html: item.dokument_url_html,
    };
  });
  try {
    await upsert('riksdagen_dokument', mapped);
    console.log(`Upserted ${mapped.length} betänkanden.`);
  } catch (error) {
    console.warn(`Failed to upsert betänkanden: ${error}`);
  }
}

async function backfillVoteringLedamoter() {
  console.log('Fetching individual voting data (voteringsaldramanshistorik)...');
  // Fetch recent voteringar and get individual votes for each
  const voteringsUrl = 'https://data.riksdagen.se/voteringlista/?sz=100&utformat=json';
  const voteringsResponse = await fetch(voteringsUrl);
  const voteringsJson = await voteringsResponse.json();
  const voteringar = voteringsJson?.voteringlista?.votering || [];

  let totalVotes = 0;
  const votes: any[] = [];

  for (const votering of voteringar) {
    try {
      // Fetch voting details for this specific votering
      const detailUrl = `https://data.riksdagen.se/voteringsaldramanshistorik/?votering_id=${votering.votering_id}&sz=349&utformat=json`;
      const detailResponse = await fetch(detailUrl);
      const detailJson = await detailResponse.json();
      const ledamoterRostningar = detailJson?.voteringsaldramanshistorik?.ledamot_rostning || [];

      const mapped = ledamoterRostningar.map((item: any) => ({
        votering_id: votering.votering_id,
        intressent_id: item.intressent_id,
        namn: item.namn,
        parti: item.parti,
        valkrets: item.valkrets,
        rostning: item.rost, // ja, nej, avstar, frvar
        beteckning: votering.beteckning,
      }));

      votes.push(...mapped);
      totalVotes += mapped.length;
    } catch (error) {
      console.warn(`Failed to fetch voting details for ${votering.votering_id}: ${error}`);
      // Continue with next votering
    }
  }

  if (votes.length > 0) {
    try {
      await upsert('riksdagen_votering_ledamoter', votes);
      console.log(`Upserted ${totalVotes} individual voting records.`);
    } catch (error) {
      console.warn(`Failed to upsert voting records: ${error}`);
    }
  } else {
    console.log('No individual voting data to upsert.');
  }
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
      case 'motioner':
        await backfillMotioner();
        break;
      case 'propositioner':
        await backfillPropositioner();
        break;
      case 'betankanden':
        await backfillBetankanden();
        break;
      case 'votering_ledamoter':
        await backfillVoteringLedamoter();
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
