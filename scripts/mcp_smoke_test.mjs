#!/usr/bin/env node
/**
 * Enkel smoke-test som kallar ett urval MCP-verktyg via HTTP.
 */

import fetch from 'node-fetch';

const MCP_URL = process.env.MCP_URL || 'https://riksdag-regering-ai.onrender.com/mcp';
const API_TOKEN = process.env.MCP_TOKEN || 'unused';

const tests = [
  { name: 'tools/list', payload: { method: 'tools/list', params: {} } },
  { name: 'search_ledamoter', payload: { method: 'tools/call', params: { name: 'search_ledamoter', arguments: { namn: 'Andersson', limit: 1 } } } },
  { name: 'get_dokument', payload: { method: 'tools/call', params: { name: 'get_dokument', arguments: { dok_id: 'HD10113' } } } },
];

async function runTest(test) {
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_TOKEN}` },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), ...test.payload }),
  });
  if (!response.ok) {
    throw new Error(`${test.name} failed with status ${response.status}`);
  }
  const json = await response.json();
  if (json.error || json.result?.isError) {
    throw new Error(`${test.name} responded with error ${JSON.stringify(json.error || json.result)}`);
  }
  console.log(`✔ ${test.name}`);
}

async function main() {
  for (const test of tests) {
    await runTest(test);
  }
  console.log('Smoke tests completed.');
}

main().catch((error) => {
  console.error('Smoke tests failed:', error);
  process.exit(1);
});
