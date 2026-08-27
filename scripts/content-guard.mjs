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

// ─── Added 2026-07-29 — the class this guard was missing ────────────────────
// Ernest has NO PAYING CLIENTS YET. Any sentence implying a client base, an
// observed outcome, or a popularity ranking is unverifiable, and the agents
// serve this file verbatim to prospects. Eight such claims survived the
// 2026-07-06 website sweep *inside this repo* because the sweep covered the
// website, and this is a mirror of the website. Found 2026-07-28.
//
// The worst was not a label but a schedule: "Most people notice a shift by
// their 3rd session — by 6 sessions, workflows are running. By 12, AI is part
// of their daily toolkit." A visitor asking "how long until this works?" could
// be handed that verbatim.
const TRACK_RECORD    = /\bmost\s+(?:people|clients|students|customers)\b|\bmost\s+popular\b|\bclients\s+(?:often|usually|typically|tend\s+to|love|say)\b|\bby\s+(?:their|your)\s+\d+(?:st|nd|rd|th)\s+session\b|\bby\s+\d+\s+sessions\b|\bbest[-\s]?seller\b/gi;

// Invented metrics written as finished claims. Deliberately narrow: requires
// an explicit "N+ clients", a percentage OF a client group, or an "average …: N%"
// construction. "once you have 3–5 clients" is a planning note and must NOT fire.
const FABRICATED_STAT = /\b\d+\+\s*clients\b|\b\d{1,3}\s?%\s+of\s+(?:clients|students|customers|people)\b|\baverage\b[^.\n]{0,40}:\s*\d{1,3}\s?%/gi;

// Copy scaffolding has no business in a retrieval corpus: a chunk can be
// retrieved without its "(PLACEHOLDER)" heading attached.
//
// ⚠️ NARROWED on first run, 2026-07-29 — the first version matched the bare word
// PLACEHOLDER and bracket tokens like [Client Name], and fired on SEVEN pieces of
// legitimate content. "Placeholder" is domain vocabulary here: the Last Mile
// service exists to fix "broken forms, placeholder copy, missing SEO", and the
// Claude Project setup blocks use [Client Name] / [TIER] as real naming
// conventions. A rule that fires on true content is evidence about the RULE.
//
// So this targets the actual hazard instead: a placeholder presented AS COPY —
// a bracketed token inside quotation marks (a fake testimonial), an explicit
// "(To Add)" list, or a "Testimonial N Placeholder" heading.
const SCAFFOLDING     = /["“]\s*\[[^\]]{5,}\]|\(To Add\)|Testimonial\s+\d+\s+Placeholder|\bLorem ipsum\b/gi;

// ─── Added 2026-08-26 — the categories the phrasing rules structurally miss ──
// The corpus-wide sweep found that a clean run proved very little. This guard
// was green against a corpus that still held unpublished plan pricing, an
// internal server runbook, a pasted transcript from another assistant, and the
// names of places Ernest had applied for work. Those are not phrasings — they
// are KINDS of content, so they are matched by shape below.
//
// Deliberately no literal values. Writing a withdrawn price into this file in
// order to detect that price would put the number back in the repo, which is
// the exact trap the sweep was about.

// Published prices are per-session and two or three digits. A four-figure sum
// in the corpus is a plan total, a project quote, or someone else's rate card.
const LARGE_SUM     = /\$\s?\d{1,3},\d{3}\b|\$\s?\d{4,}\b/g;

// Machine-local paths, server-side paths, and the names of secrets. No value
// needs to leak for this to be a map of where to look.
const INTERNAL_PATH = /[A-Za-z]:\\Users\\|(?:^|[\s(`])\/root\/|\.env(?:\.local)?\b|\b\w*_(?:API_KEY|SECRET|TOKEN)\b/g;

// Host, OS and port inventory: reconnaissance value to a stranger, no value to
// a visitor asking about coaching.
const INFRA_DETAIL  = /\b(?:hostinger|digitalocean|linode|vultr)\b|\bubuntu\s+\d\d\.\d\d\b|\bport\s+\d{4}\b/gi;

// Text addressed to an operator instead of describing the business. A retrieved
// chunk of it can steer the serving model rather than inform the visitor.
const OPERATOR_VOICE = /\b(?:would you like me to|shall i (?:build|create|start)|feel free to answer|do not deviate)\b/gi;

// Draft scaffolding shapes that the narrower SCAFFOLDING rule does not reach.
const DRAFT_MARKER  = /_\[(?:add|to )|\btodo\s*=|\bacme[-\s]?corp\b|\bTBD\b/gi;

// Sprint-relative status. "Week 2" is true for about a week, and this corpus is
// re-read by agents for months.
const STALE_STATUS  = /\bweek\s+\d+\s*[-–]\s*\d+\b|\bspring sprint\b|\bcurrently a stub\b|\bstubbed\b/gi;

// ─── Scan scope must MIRROR ingest scope ────────────────────────────────────
// This must match ingest-brain.mjs > walkMarkdown() exactly, and that function
// has one exclusion rule: `if (entry.startsWith('.')) continue`. Everything
// else that ends in .md is embedded and can be served to a visitor.
//
// So the guard skips dot-prefixed entries and nothing else. In particular it
// does NOT special-case `scripts/`: that directory is outside the corpus today
// only because it happens to contain no markdown. The moment a .md lands there
// the ingest WILL embed it, and a guard that had hardcoded `scripts` as
// not-ingested would wave it through. Mirroring the ingest's own rule keeps the
// two in step without anyone having to remember.
//
// The corpus audit lives in `.github/` precisely because an audit trail and a
// served corpus must be two different places — and an audit necessarily quotes
// the hazards it found. `.github/` is dot-prefixed, so both the ingest and this
// guard skip it for the same structural reason, not by special pleading.
//
// If the ingest's exclusion rule ever changes, change this with it.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue;
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
    if (TRACK_RECORD.test(line)) {
      flag(file, lineNo, line, 'implied-track-record',
           'implies a client base or observed outcome — there are no paying clients yet; describe the offer instead');
    }
    if (FABRICATED_STAT.test(line)) {
      flag(file, lineNo, line, 'fabricated-metric',
           'a statistic about clients that cannot be true yet — remove it, do not soften it');
    }
    if (SCAFFOLDING.test(line)) {
      flag(file, lineNo, line, 'placeholder-scaffolding',
           'draft scaffolding in a retrieval corpus — a chunk can be served without its heading; keep placeholders in the vault');
    }
    if (LARGE_SUM.test(line)) {
      flag(file, lineNo, line, 'unpublished-pricing',
           'a four-figure sum — published pricing is per-session; plan totals and quotes are internal');
    }
    if (INTERNAL_PATH.test(line)) {
      flag(file, lineNo, line, 'internal-path',
           'a local/server path or the name of a secret — internal, and of no use to a visitor');
    }
    if (INFRA_DETAIL.test(line)) {
      flag(file, lineNo, line, 'infrastructure-detail',
           'host, OS or port inventory — reconnaissance value to a stranger, none to a visitor');
    }
    if (OPERATOR_VOICE.test(line)) {
      flag(file, lineNo, line, 'operator-voice',
           'text addressed to an operator, not describing the business — a retrieved chunk of it can steer the model');
    }
    if (DRAFT_MARKER.test(line)) {
      flag(file, lineNo, line, 'draft-marker',
           'draft scaffolding — the label does not survive chunking; keep it in the vault');
    }
    if (STALE_STATUS.test(line)) {
      flag(file, lineNo, line, 'stale-status',
           'sprint-relative status goes stale in days and is then served as current; state what is true now');
    }
    // Reset lastIndex on the reused /g-with-.test() regexes.
    PERSONAL_EMAIL.lastIndex = GOOGLE_DOC_URL.lastIndex = ERNEST_HE.lastIndex = 0;
    TRACK_RECORD.lastIndex = FABRICATED_STAT.lastIndex = SCAFFOLDING.lastIndex = 0;
    LARGE_SUM.lastIndex = INTERNAL_PATH.lastIndex = INFRA_DETAIL.lastIndex = 0;
    OPERATOR_VOICE.lastIndex = DRAFT_MARKER.lastIndex = STALE_STATUS.lastIndex = 0;
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
