#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read README.md from project root
const readmePath = resolve(__dirname, '..', '..', 'README.md');
const readmeContent = readFileSync(readmePath, 'utf-8');

// Create TypeScript file with embedded content
const tsContent = `// Auto-generated file - do not edit manually
// Generated from ../../README.md at build time

export const EMBEDDED_README = ${JSON.stringify(readmeContent)};
`;

// Write to src/data/embeddedReadme.ts
const outputPath = resolve(__dirname, '..', 'src', 'data', 'embeddedReadme.ts');
writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ README.md embedded successfully');
