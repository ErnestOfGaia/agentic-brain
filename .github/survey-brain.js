// survey-brain.js — read-only audit of a brain.json store.
//
//   node survey-brain.js <brain.json> [corpus-root]
//
// With one argument it describes the store. With a corpus root it also DERIVES
// what the store should contain, by re-running the ingest's own chunker over the
// corpus and diffing. That second mode is the point of the tool.
//
// Why derived and not a fixed count: during the 2026-08-27 planning a "202
// chunks" gate was proposed, computed from a Windows working tree where
// core.autocrlf had rewritten every file to CRLF. The chunker's paragraph
// splitter is /\n\n+/, which does not match \r\n\r\n, so CRLF text under-splits.
// The container clones raw LF and produces 205. A hard-coded gate would have
// failed a correct build and taught the operator to distrust the gates.
// Deriving the expectation from the same corpus the ingest just used makes the
// number irrelevant and catches three things a count never could:
//
//   orphans  — ids in the store with no chunk in the corpus. This is the
//              shrinking-file trap: saveStore() never prunes, so a file that
//              shrank from 12 chunks to 7 leaves :7..:11 holding old text
//              forever. A contiguity check CANNOT see this (indices stay 0..11,
//              so max+1 === length) — only a corpus diff can.
//   missing  — chunks the corpus has and the store does not: an incomplete run.
//   drift    — a shared id whose stored text differs from the corpus text. This
//              is the ingest trap itself: pending = chunks.filter(c =>
//              !store.has(c.id)), so an edited file's chunks are SKIPPED and the
//              old content is retained silently.
//
// Read-only. Never writes, never deletes.

const fs = require('node:fs');
const path = require('node:path');

const STORE_PATH = process.argv[2] || '/app/data/brain.json';
const CORPUS = process.argv[3] || null;

// ── verbatim from ingest-brain.mjs — keep in sync ────────────────────────────
const MIN_CHARS = 50;
const MAX_CHARS = 1500;

function chunkMarkdown(content) {
  const sections = content.split(/(?=^#{1,6} )/m).filter(s => s.trim().length >= MIN_CHARS);
  const chunks = [];
  const splitSection = (text) => {
    if (text.length <= MAX_CHARS) {
      if (text.trim().length >= MIN_CHARS) chunks.push(text.trim());
      return;
    }
    const paragraphs = text.split(/\n\n+/);
    let current = '';
    for (const para of paragraphs) {
      const candidate = current ? `${current}\n\n${para}` : para;
      if (candidate.length > MAX_CHARS && current) {
        if (current.trim().length >= MIN_CHARS) chunks.push(current.trim());
        current = para;
      } else {
        current = candidate;
      }
    }
    if (current.trim().length >= MIN_CHARS) chunks.push(current.trim());
  };
  if (sections.length > 0) sections.forEach(splitSection);
  else splitSection(content);
  return chunks;
}

function walkMarkdown(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) files.push(...walkMarkdown(full));
    else if (entry.endsWith('.md')) files.push(full);
  }
  return files;
}
// ── end verbatim ─────────────────────────────────────────────────────────────

let ok = true;
const fail = (msg) => { ok = false; console.log('  !! ' + msg); };

console.log('store     : ' + STORE_PATH);

if (!fs.existsSync(STORE_PATH)) {
  console.log('  !! ABSENT');
  console.log('\nVERDICT: FAIL (no store)');
  process.exit(2);
}

const st = fs.statSync(STORE_PATH);
console.log('bytes     : ' + st.size);
console.log('mtime     : ' + st.mtime.toISOString());

let recs;
try {
  recs = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
} catch (e) {
  // Both readers swallow this: searchKnowledgeTool returns [] and the agents
  // answer ungrounded; loadStore() returns an empty Map and the next ingest
  // silently rebuilds everything. Neither surfaces the problem, so surface it.
  console.log('  !! PARSE FAILED: ' + e.message);
  console.log('\nVERDICT: FAIL (unparseable)');
  process.exit(2);
}

if (!Array.isArray(recs)) fail('top level is not an array');
console.log('records   : ' + recs.length);

const bySource = {};
for (const r of recs) bySource[r.source] = (bySource[r.source] || 0) + 1;
const sources = Object.keys(bySource).sort();
console.log('sources   : ' + sources.length);
for (const s of sources) console.log('    ' + String(bySource[s]).padStart(4) + '  ' + s);

const shapes = {};
for (const r of recs) shapes[Object.keys(r).sort().join(',')] = (shapes[Object.keys(r).sort().join(',')] || 0) + 1;
console.log('shapes    : ' + JSON.stringify(shapes));

const dims = {};
let nonFinite = 0;
for (const r of recs) {
  const d = Array.isArray(r.embedding) ? r.embedding.length : 'NOT_ARRAY';
  dims[d] = (dims[d] || 0) + 1;
  if (Array.isArray(r.embedding) && r.embedding.some(v => typeof v !== 'number' || !Number.isFinite(v))) nonFinite++;
}
console.log('dims      : ' + JSON.stringify(dims));
if (dims['512'] !== recs.length) fail('not every record has a 512-d embedding');
if (nonFinite) fail(nonFinite + ' record(s) contain a non-finite vector value');

const ids = new Set(recs.map(r => r.id));
if (ids.size !== recs.length) fail('duplicate ids: ' + (recs.length - ids.size));

// ── derived expectation ──────────────────────────────────────────────────────
if (CORPUS) {
  console.log('\ncorpus    : ' + CORPUS);
  if (!fs.existsSync(CORPUS)) {
    fail('corpus root does not exist');
  } else {
    const expected = new Map();
    const files = walkMarkdown(CORPUS);
    for (const f of files) {
      const rel = path.relative(CORPUS, f).split(path.sep).join('/');
      chunkMarkdown(fs.readFileSync(f, 'utf-8')).forEach((c, i) => expected.set(rel + ':' + i, c));
    }
    const have = new Map(recs.map(r => [r.id, r.content]));
    const orphans = [...have.keys()].filter(id => !expected.has(id));
    const missing = [...expected.keys()].filter(id => !have.has(id));
    const drifted = [...expected].filter(([id, c]) => have.has(id) && have.get(id) !== c).map(([id]) => id);

    console.log('  files   : ' + files.length);
    console.log('  expected: ' + expected.size + ' chunks');
    const show = (a) => a.length ? '  e.g. ' + a.slice(0, 6).join('  ') : '';
    console.log('  orphans (in store, not in corpus) : ' + orphans.length + show(orphans));
    console.log('  missing (in corpus, not in store) : ' + missing.length + show(missing));
    console.log('  content drift on shared ids       : ' + drifted.length + show(drifted));

    if (orphans.length) fail('orphan chunks present — deleted/shrunk files still served');
    if (missing.length) fail('missing chunks — ingest incomplete');
    if (drifted.length) fail('content drift — edits did NOT reach the store (the ingest trap)');
  }
}

console.log('\nVERDICT: ' + (ok ? 'CLEAN' : 'FAIL'));
process.exit(ok ? 0 : 1);
