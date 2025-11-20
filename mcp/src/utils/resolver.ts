/**
 * Resolver helpers som försöker Supabase först och faller tillbaka på råa API:er.
 */

import fetch from 'node-fetch';
import { getSupabase } from './supabase.js';

interface ResolverOptions<T> {
  supabaseQuery: () => Promise<T | null>;
  fallbackApi?: () => Promise<T>;
  persist?: (data: T) => Promise<void>;
  onMiss?: () => Promise<void> | void;
}

/**
 * Kör en supabase-fråga och returnerar data, annars försöker fallback API och sparar resultatet.
 */
export async function resolveData<T>(options: ResolverOptions<T>): Promise<{ data: T | null; source: 'supabase' | 'live_api'; fetchedAt: string }> {
  const { supabaseQuery, fallbackApi, persist, onMiss } = options;

  const supabaseResult = await supabaseQuery();
  if (supabaseResult) {
    return {
      data: supabaseResult,
      source: 'supabase',
      fetchedAt: new Date().toISOString(),
    };
  }

  if (!fallbackApi) {
    return {
      data: null,
      source: 'supabase',
      fetchedAt: new Date().toISOString(),
    };
  }

  if (onMiss) {
    try {
      await onMiss();
    } catch {
      // ignore
    }
  }

  const liveData = await fallbackApi();
  if (liveData && persist) {
    try {
      await persist(liveData);
    } catch {
      // swallow persistence errors for now
    }
  }

  return {
    data: liveData,
    source: 'live_api',
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Helper för att hämta Riksdagens dokument live vid behov.
 */
export async function fetchRiksdagenDokument(dokId: string): Promise<any | null> {
  const url = `https://data.riksdagen.se/dokument/${dokId}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fel vid livehämtning från Riksdagen: ${response.statusText}`);
  }

  const json: any = await response.json();
  return json?.dokgrupp?.dokument?.[0] ?? null;
}

export async function saveJsonToStorage(bucket: string, path: string, payload: unknown) {
  try {
    const supabase = getSupabase();
    await supabase.storage.from(bucket).upload(path, JSON.stringify(payload), {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (error) {
    console.warn(`Kunde inte spara data i bucket ${bucket}:`, (error as Error).message);
  }
}
