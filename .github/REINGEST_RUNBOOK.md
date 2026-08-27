# Re-ingest runbook — making a corpus change reach the agents

**Companion to `CORPUS_HARDENING_AUDIT_2026-08-26.md`.** Lives in `.github/` for the same reason the
audit does: dot-prefixed directories are skipped by the ingest's `walkMarkdown()`, so nothing here is
embedded or served.

> **The one-sentence version.** Merging a corpus change alters what an agent says **not at all**.
> `pending = chunks.filter(c => !store.has(c.id))` — an id that already exists is never updated, and
> `saveStore()` never prunes. Until the old chunks are gone from `brain.json`, the agents keep
> serving them.

Measured against today's live store: re-running the ingest after merging, without deleting anything,
would leave **201 of 205 chunks holding their old text**. That is not a partial fix; it is no fix.

---

## Decisions, and why

| Question | Decision | Why |
|---|---|---|
| Delete 360 chunks surgically, or rebuild the store from empty? | **Rebuild from empty** | The surgical path saves ~45 seconds of embedding and buys back every hand-editing risk. A store built from an empty map cannot contain an orphan by construction. Only 19 of 205 chunks would have survived anyway. |
| `rm brain.json` and restart, or build to the side and swap? | **Build to the side, then swap** | `rm` + restart serves a *growing partial store* to real visitors for ~8 minutes. Retrieval has no minimum-similarity floor, so a partial store answers **confidently** from whatever few chunks are nearest — worse than serving the old one. |
| Build on the laptop and upload, or on the VPS? | **On the VPS, staging directory** | Same guarantee, no upload over a weak uplink, and the artifact is built by the same OS, git and Node that production uses. |
| Hard-code the expected chunk count as a gate? | **No — derive it** | A "202 chunks" gate was proposed from a Windows working tree where `core.autocrlf` had rewritten every file to CRLF. The chunker splits paragraphs on `/\n\n+/`, which does not match `\r\n\r\n`, so CRLF text under-splits. The container clones raw LF and produces **205**. A hard-coded gate would have failed a correct build. `survey-brain.js` re-chunks the corpus instead, so the number never has to be typed. |
| Restart mastra afterwards? | **Not required; verify instead** | `searchKnowledgeTool` re-reads `brain.json` when its mtime changes. A restart *during* an ingest can start a second one. |

## Do not

1. **Do not hand-edit `brain.json`.** There is no `jq` in the container (`node:22-slim` + git/curl/ca-certificates), and it is one 2.6 MB line.
2. **Do not run an ingest before the corpus change is merged.** `syncBrainRepo()` clones `main`. Running early re-embeds the old corpus at full price.
3. **Do not run two ingests at once, or restart while one is running.** Each holds its own in-memory Map; the last to save wins.
4. **Do not `cd` before a *production* ingest.** All three paths are `path.resolve()` against the CWD (`__dirname` is computed but never used). Staging depends on this; a stray `cd` elsewhere writes to the wrong place silently.
5. **Do not use `npm run ingest` in the container** — no `package.json`/`.env` at `/app`. Use `node /app/src/scripts/ingest-brain.mjs`.
6. **Never `docker compose down -v` or remove the data volume.** `mastra.db` (agent memory) lives there.
7. **Do not treat "Done" as proof.** Only `VERDICT: CLEAN` from `survey-brain.js` counts.
8. **Do not type a corpus filename anywhere.** No step needs one, which is what keeps the em-dash and `&` filenames away from a shell.

---

## Phase A — merge first

**A1.** Confirm the branch is clean and the PR's Content Guard check is green on GitHub (the local run is not the gate that protects `main`).

```bash
node scripts/content-guard.mjs; echo "exit=$?"
```

**A2.** Merge the PR. **Squash-merge** if the branch history contains anything that should not land in `main`'s history.

**A3. 🚦 GATE — prove `main` carries the new corpus.**

```bash
git fetch origin && git ls-tree -r -z --name-only origin/main | tr '\0' '\n' | grep -v '^\.' | grep -c '\.md$'
```

`-z` matters: without it git quotes the em-dash filenames and a naive count is wrong. Expect the
post-sweep file count (**18**). If it prints 27 or 28 the merge did not land — stop.

---

## Phase B — VPS preflight (read-only)

**B1. 🚦 GATE — is the box ready?**

```bash
docker ps --filter name=ernestofgaia_mastra --format '{{.Names}}  {{.Status}}'
docker exec ernestofgaia_mastra sh -c '[ -n "$VOYAGE_API_KEY" ] && echo "VOYAGE_API_KEY: set (${#VOYAGE_API_KEY} chars)" || echo "VOYAGE_API_KEY: MISSING"'
docker exec ernestofgaia_mastra ls -la /app/data
df -h /var/lib/docker
```

Stop if the key is missing, or if disk is nearly full (`saveStore` truncates before writing).

**If `.brain-ingest-incomplete` is present**, it is either a live ingest or a leftover. `node:22-slim`
has no `ps`, so read `/proc`:

```bash
docker exec ernestofgaia_mastra sh -c 'for p in /proc/[0-9]*; do tr "\0" " " < $p/cmdline 2>/dev/null | grep -q ingest-brain && echo "RUNNING: $p"; done; echo "(scan done)"'
```

Nothing running means it is a leftover — and a leftover silently arms a **production** ingest at the
next restart. Clear it before continuing:

```bash
docker exec ernestofgaia_mastra rm -f /app/data/.brain-ingest-incomplete
```

**B2. Install the survey tool** (from this directory, once):

```bash
docker cp .github/survey-brain.js ernestofgaia_mastra:/app/survey-brain.js
```

**B3. Record the "before" state.** Keep this output — it is the evidence of what was being served.

```bash
docker exec ernestofgaia_mastra node /app/survey-brain.js /app/data/brain.json /app/data/agentic-brain-cache
```

Expect `VERDICT: FAIL` with a large orphan and drift count. That is the problem, quantified.

**B4. Capture what the agents currently say.** After the swap this is unrecoverable, and the record
is the point. Run the verifier and keep its output:

```bash
node .claude/scripts/verify-brain-claims.mjs | tee "before-$(date +%F).txt"
```

> ⛔ **That transcript quotes what the agents served — which is the hazard text itself. It does not
> go in this repo.** File it in the vault beside `Reference - Content Correction Ledger
> (2026-07-28).md`. Putting evidence of a leak into a public repo is how the first version of the
> audit went wrong; the same rule applies to the proof.

**Baseline captured 2026-08-27**, before any merge — `❌ 4 claims served across 3 probes`:

| Probe | What the live agent disclosed |
|---|---|
| `infra` | the host, the OS version, the container runtime and the whole deploy chain |
| `market-stats` | an unsourced market statistic |
| `other-sites` | directed the visitor to a subdomain that has **no TLS certificate** |

The four original probes passed — that class was genuinely fixed on 2026-07-29. Everything the
extension added, failed. Note the reverse is not proof: a probe that passes may mean the *agent
prompt* refused, not that the chunk is gone. Only the corpus survey can tell you that.

**B5. Back up the store.**

```bash
docker exec ernestofgaia_mastra cp /app/data/brain.json /app/data/brain.json.bak
docker exec ernestofgaia_mastra ls -la /app/data/brain.json /app/data/brain.json.bak
```

---

## Phase C — build the new store beside the live one

**C1. Start from a guaranteed-empty staging directory.** `mkdir -p` is not enough: a leftover partial
store there would be loaded by `loadStore()` and its ids skipped, destroying the built-from-empty
guarantee.

```bash
docker exec ernestofgaia_mastra rm -rf /app/data/staging
docker exec ernestofgaia_mastra mkdir -p /app/data/staging/data
docker exec ernestofgaia_mastra sh -c 'ls -A /app/data/staging/data | wc -l'   # must print 0
```

**C2. Build.** The `-w` is the whole mechanism — every path the ingest touches is CWD-relative, so
this writes `staging/data/brain.json` and clones a *fresh* copy of `main` into
`staging/data/agentic-brain-cache`. The live store is untouched throughout.

```bash
docker exec -w /app/data/staging ernestofgaia_mastra node /app/src/scripts/ingest-brain.mjs
```

Takes ~8 minutes (batches of 10, 22s apart, free-tier rate).

**C3. 🚦 GATE — read the log, not just the exit code.**

- `Found 18 markdown files` — a different number means the wrong corpus.
- **Any line containing `WARNING`** is a stop. In particular `WARNING: git pull failed … Continuing
  with the cached copy` means it ingested a stale checkout. On a first run staging has no cache so a
  clone failure is loud — but **after any retry the cache exists**, and that fallback is live again.
  If you retry after a `WARNING` or a wrong file count, go back to **C1** and wipe staging first.
- A 429 retry is safe to resume in place (same corpus, same ids).

**C4. 🚦 GATE — verify the staged store against the corpus it was built from.**

```bash
docker exec ernestofgaia_mastra node /app/survey-brain.js /app/data/staging/data/brain.json /app/data/staging/data/agentic-brain-cache
```

Required: `orphans 0`, `missing 0`, `drift 0`, `VERDICT: CLEAN`. No count is typed or compared by
hand — the expectation is derived from the corpus.

**C5. Faithfulness spot-check (optional, free).** The files untouched by the change must come back
byte-identical. If their text differs, the chunker or the clone is not reproducing the corpus and
every other check is suspect.

```bash
docker exec ernestofgaia_mastra node -e '
const fs=require("node:fs");
const a=new Map(JSON.parse(fs.readFileSync("/app/data/brain.json","utf8")).map(r=>[r.id,r.content]));
const b=new Map(JSON.parse(fs.readFileSync("/app/data/staging/data/brain.json","utf8")).map(r=>[r.id,r.content]));
const keep=[...b.keys()].filter(id=>a.has(id));
const diff=keep.filter(id=>a.get(id)!==b.get(id));
console.log("shared ids:",keep.length,"  text differs:",diff.length);
if(diff.length) console.log(diff.slice(0,5).join("\n"));
'
```

Every id shared between the two stores that belongs to an unchanged file should show identical text.

---

## Phase D — swap and verify

**D1. Swap.** `mv` within the same filesystem is atomic — no torn read.

```bash
docker exec ernestofgaia_mastra mv /app/data/staging/data/brain.json /app/data/brain.json
docker exec ernestofgaia_mastra stat -c '%n  %s bytes  mtime=%y' /app/data/brain.json
```

**D2. 🚦 GATE — survey the live store.**

```bash
docker exec ernestofgaia_mastra node /app/survey-brain.js /app/data/brain.json /app/data/staging/data/agentic-brain-cache
```

Required: `VERDICT: CLEAN`.

**D3. Confirm the process picked it up.** Read **both** streams — every failure line in
`searchKnowledgeTool` is `console.warn`/`console.error`, which a plain pipe misses:

```bash
curl -s -m 40 https://ernestofgaia.xyz/api/chat -H 'Content-Type: application/json' -d '{"message":"What are Ernest'\''s pricing tiers?"}' >/dev/null
docker logs --since 10m -t ernestofgaia_mastra 2>&1 | grep -i searchknowledge | tail -5
```

The newest line should report the new chunk count, timestamped after the swap. `Could not read
brain.json` or `not found` is a hard stop. **Silence is inconclusive, not success** — the log only
prints on an mtime change and only when an agent actually calls the tool; ask a different question
and look again before concluding anything.

**D4. Verify by query — the only check that tests the artifact.**

```bash
node .claude/scripts/verify-brain-claims.mjs --self-test   # prove every rule can fire
node .claude/scripts/verify-brain-claims.mjs               # then the real run
```

Add at least one probe whose correct answer is **nothing**, targeting content that was removed. If
the agents can no longer describe the hosting setup, the old chunks are genuinely gone — which
merging alone never accomplishes.

**D5. Clean up.**

```bash
docker exec ernestofgaia_mastra rm -rf /app/data/staging
```

Keep `brain.json.bak` for a week, then delete it — it is a full copy of the old store, one `cp` from
live.

---

## What this does not do

- **It does not remove anything from the public repo's history.** Deleted files remain readable at
  earlier commits. That is a separate decision.
- **It does not touch the trace store.** Mastra persists tool inputs and outputs in `mastra.db` on
  the same volume, so text already retrieved and served is still recorded there, and thread memory
  can carry it into a returning visitor's next turn. Worth measuring; do **not** delete `mastra.db`.
- **It does not fix retrieval behaviour on a gap.** `searchKnowledgeTool` takes the top K nearest
  chunks with no minimum similarity, so a question about removed content still returns the nearest
  surviving chunks and the agent answers from them confidently. Removing bad content narrows what
  can be quoted; it does not stop confident answers to unanswerable questions.
