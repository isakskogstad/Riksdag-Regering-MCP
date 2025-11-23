#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try multiple possible locations for README.md
const possiblePaths = [
  resolve(__dirname, '..', '..', 'README.md'),  // Local dev: mcp/scripts/ -> root
  resolve(__dirname, '..', 'README.md'),         // Docker: /app/scripts/ -> /app/
  resolve(process.cwd(), 'README.md'),            // CWD fallback
  resolve(process.cwd(), '..', 'README.md'),      // Parent of CWD
];

let readmePath = null;
let readmeContent = null;

for (const path of possiblePaths) {
  if (existsSync(path)) {
    readmePath = path;
    readmeContent = readFileSync(path, 'utf-8');
    console.log(`✅ Found README.md at: ${path}`);
    break;
  }
}

if (!readmeContent) {
  console.error('❌ README.md not found in any of these locations:');
  possiblePaths.forEach(p => console.error(`   - ${p}`));
  process.exit(1);
}

// Create TypeScript file with embedded content
const tsContent = `// Auto-generated file - do not edit manually
// Generated from ../../README.md at build time

export const EMBEDDED_README = ${JSON.stringify(readmeContent)};
`;

// Write to src/data/embeddedReadme.ts
const outputPath = resolve(__dirname, '..', 'src', 'data', 'embeddedReadme.ts');
writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ README.md embedded successfully');
