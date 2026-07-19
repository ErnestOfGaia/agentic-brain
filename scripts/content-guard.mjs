#!/usr/bin/env node
/**
 * content-guard.mjs — pre-merge audit for the agentic-brain knowledge base.
 *
 * This repo is PUBLIC, and every markdown file is embedded into the RAG index
 * (brain.json) and served verbatim by the ernestofgaia.xyz chat agents. A
 * private phone number or personal email committed here doesn't just sit in a
 * repo — the live site hands it to visitors. On 2026-07-18 the recruiter agent
 * was caught giving out a personal phone number that had leaked in via a
 * resume file. This guard fails the build if that class of data — or he/him
 * for Ernest (who uses they/them) — reappears.
 *
 * Runs in CI on every PR/push (.github/workflows/content-guard.yml) and locally:
 *   node scripts/content-guard.mjs
 *
 * By design it contains NO copies of the actual private values — it matches
 * generic patterns and allows only the PUBLIC brand channels. Hardcoding the
 * real values here would just re-leak them.
 *
 * Escape hatch: to allow a genuine, reviewed match on one line (e.g. a third
 * party's "he" in a reference), append this marker to that line:
 *   <!-- content-guard: allow -->
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALLOW_MARKER = 'content-guard: allow';

// The ONLY contact channels allowed to appear in the knowledge base.
const APPROVED_PHONE_DIGITS = new Set(['5036640546', '15036640546']);
const APPROVED_EMAIL_DOMAIN = 'ernestofgaia.xyz';

// Generic patterns — no literal private values, so this file leaks nothing.
const PHONE           = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/g;
const PERSONAL_EMAIL  = /\b[a-z0-9._%+-]+@(?:gmail|hotmail|yahoo|outlook|live|msn|aol|icloud|proton(?:mail)?|pm)\.[a-z.]+/gi;
const GOOGLE_DOC_URL  = /https?:\/\/(?:drive|docs)\.google\.com\/[^\s)"']+/gi;
const ERNEST_HE       = /\b(?:he|him|his|himself)\b/gi;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

const violations = [];
function flag(file, lineNo, line, category, detail) {
  if (line.includes(ALLOW_MARKER)) return;
  violations.push({
    file: path.relative(ROOT, file).replace(/\\/g, '/'),
    lineNo, category, detail,
  });
}

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const lineNo = i + 1;

    for (const m of line.matchAll(PHONE)) {
      if (!APPROVED_PHONE_DIGITS.has(m[0].replace(/\D/g, ''))) {
        flag(file, lineNo, line, 'unapproved-phone',
             'phone number that is not the public 503-664-0546');
      }
    }
    if (PERSONAL_EMAIL.test(line)) {
      flag(file, lineNo, line, 'personal-email',
           `personal email address — use eog@${APPROVED_EMAIL_DOMAIN}`);
    }
    if (GOOGLE_DOC_URL.test(line)) {
      flag(file, lineNo, line, 'google-drive-url',
           'internal Drive/Docs link must not be in the public knowledge base');
    }
    if (ERNEST_HE.test(line)) {
      flag(file, lineNo, line, 'he-him-pronoun',
           'Ernest uses they/them — remove he/him/his');
    }
    // Reset lastIndex on the reused /g-with-.test() regexes.
    PERSONAL_EMAIL.lastIndex = GOOGLE_DOC_URL.lastIndex = ERNEST_HE.lastIndex = 0;
  });
}

if (violations.length === 0) {
  console.log('content-guard: OK — no private contact data or he/him found.');
  process.exit(0);
}

console.error(`content-guard: ${violations.length} violation(s) found:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.lineNo}  [${v.category}] ${v.detail}`);
}
console.error(
  '\nFix the lines above, or append "<!-- content-guard: allow -->" to a line ' +
  'that is a genuine, reviewed exception.'
);
process.exit(1);
