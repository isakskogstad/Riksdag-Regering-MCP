/**
 * Enkel telemetri/loggning av MCP-anrop.
 */

import { getSupabase } from './supabase.js';

interface ToolLogPayload extends Record<string, unknown> {
  tool_name: string;
  status: 'success' | 'error';
  duration_ms: number;
  error_message?: string;
  args?: Record<string, unknown>;
}

interface DataMissPayload extends Record<string, unknown> {
  entity: string;
  identifier: string;
  reason?: string;
}

async function insertAdminLog(action: string, metadata: Record<string, unknown>) {
  try {
    const supabase = getSupabase();
    await supabase.from('admin_activity_log').insert({
      action,
      metadata,
    });
  } catch (error) {
    // Felsäkert: skriv bara till stderr om loggtabellen saknas eller RLS blockerar.
    console.warn(`Kunde inte logga admin-aktivitet (${action}):`, (error as Error).message);
  }
}

/**
 * Försök skriva ett logg-event till admin_activity_log (ignorerar fel).
 */
export async function logToolCall(payload: ToolLogPayload): Promise<void> {
  await insertAdminLog('mcp_tool_call', payload);
}

export async function logDataMiss(payload: DataMissPayload): Promise<void> {
  await insertAdminLog('mcp_data_miss', payload);
  try {
    const supabase = getSupabase();
    await supabase.from('data_sync_queue').insert({
      entity: payload.entity,
      identifier: payload.identifier,
      reason: payload.reason || 'unknown',
      status: 'pending',
    });
  } catch (error) {
    console.warn('Kunde inte lägga till post i data_sync_queue:', (error as Error).message);
  }
}
