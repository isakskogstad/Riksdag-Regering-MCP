/**
 * Direkt API-anrop till Riksdagens öppna API:er
 * Används för real-time data och sökning
 */

import { RateLimiter } from './rateLimiter.js';

const API_BASE = 'https://data.riksdagen.se';
const rateLimiter = new RateLimiter(100, 60000); // 100 req/min

/**
 * Hämta dokument direkt från Riksdagens API
 */
export async function fetchDokumentDirect(params: {
  doktyp?: string;
  sok?: string;
  rm?: string;
  sz?: number;
}) {
  await rateLimiter.waitForToken();

  const queryParams = new URLSearchParams();
  if (params.doktyp) queryParams.append('doktyp', params.doktyp);
  if (params.sok) queryParams.append('sok', params.sok);
  if (params.rm) queryParams.append('rm', params.rm);
  queryParams.append('sz', String(params.sz || 50));
  queryParams.append('utformat', 'json');

  const url = `${API_BASE}/dokumentlista/?${queryParams}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'riksdag-regering-mcp/2.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Riksdagens API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.dokumentlista?.dokument || [];
}

/**
 * Hämta anföranden direkt från Riksdagens API
 */
export async function fetchAnforandenDirect(params: {
  sok?: string;
  talare?: string;
  parti?: string;
  sz?: number;
}) {
  await rateLimiter.waitForToken();

  const queryParams = new URLSearchParams();
  if (params.sok) queryParams.append('sok', params.sok);
  if (params.talare) queryParams.append('talare', params.talare);
  if (params.parti) queryParams.append('parti', params.parti);
  queryParams.append('sz', String(params.sz || 50));
  queryParams.append('utformat', 'json');

  const url = `${API_BASE}/anforandelista/?${queryParams}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'riksdag-regering-mcp/2.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Riksdagens API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.anforandelista?.anforande || [];
}

/**
 * Hämta voteringar direkt från Riksdagens API
 */
export async function fetchVoteringarDirect(params: {
  rm?: string;
  sz?: number;
}) {
  await rateLimiter.waitForToken();

  const queryParams = new URLSearchParams();
  if (params.rm) queryParams.append('rm', params.rm);
  queryParams.append('sz', String(params.sz || 50));
  queryParams.append('utformat', 'json');
  queryParams.append('sort', 'datum');

  const url = `${API_BASE}/voteringlista/?${queryParams}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'riksdag-regering-mcp/2.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Riksdagens API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.voteringlista?.votering || [];
}

/**
 * Hämta ledamöter direkt från Riksdagens API
 */
export async function fetchLedamoterDirect(params: {
  enamn?: string;
  parti?: string;
  sz?: number;
}) {
  await rateLimiter.waitForToken();

  const queryParams = new URLSearchParams();
  if (params.enamn) queryParams.append('enamn', params.enamn);
  if (params.parti) queryParams.append('parti', params.parti);
  queryParams.append('sz', String(params.sz || 50));
  queryParams.append('utformat', 'json');

  const url = `${API_BASE}/personlista/?${queryParams}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'riksdag-regering-mcp/2.0',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Riksdagens API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.personlista?.person || [];
}
