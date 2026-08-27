# Corpus-wide hardening audit — agentic-brain
**Date:** 2026-08-26 · **Scope:** every ingested source in the repo
**Status:** 29 findings; all six remediation stages applied on this branch (§7). Not merged.

> **Why this file lives in `.github/`.** `.github/` and `scripts/` are not ingested. An audit trail
> and a served corpus must be two different places — that is the whole finding of the 2026-07-29
> sweep, restated. Putting this report in `marketing/` or at the repo root would embed a document
> full of quoted fabrications into the exact index it is warning about.

---

## 0. Headline

`node scripts/content-guard.mjs` **passes clean** on the corpus audited below.

That is the finding. The guard is green against a corpus that still contains unpublished pricing,
outcome claims about clients who do not exist, placeholder client names, a third-party AI's cost
estimates, a dead link inside the client welcome packet, and the full server inventory. **A green
guard is not evidence of a safe corpus** — it is evidence that seven regexes did not match.

The 2026-07-28 incident was diagnosed correctly: retrieval hands the model *text*, not document
semantics, so a `(To Add)` label is not a scope guard. This sweep finds that the same failure runs
much wider than the one heading, and that a mitigation written up at the time was **asserted but
never implemented** (F1).

---

## 1. Method

> **Correction (added on the second pass).** This section originally claimed all 27 ingested files
> were read in full. It was **26** — `business-dna/EOGbook_Project_Summary.md` was missed. Reading it
> produced three further findings, two of them HIGH (F25, F26, F28). Recorded here rather than quietly
> fixed, because "I read everything" is exactly the kind of claim this audit exists to distrust.

- Read all 27 ingested markdown files in full (`README.md`, `business-dna/`, `marketing/`,
  `recruiter/`, `router/`, `secretary/`). No sampling.
- Ran `scripts/content-guard.mjs` for a baseline.
- Verified every advertised URL and repo by request, not by reading. Results in §5.
- Confirmed the vault ledger `Reference - Content Correction Ledger (2026-07-28).md` already
  holds the three fabricated statistics verbatim, in five places (lines 27, 294, 331–332, 339).

**Test applied to each candidate:** *if a chunker split this file mid-section and handed only this
passage to the model, with no heading and no neighbouring line, could a visitor be told something
untrue, unpublished, private, or embarrassing?*

---

## 2. Findings by severity

| # | Severity | File | Lines | Class |
|---|---|---|---|---|
| F1 | **Critical** | `business-dna/…Pricing Tiers & Plans.md` | 165–216 | Unpublished pricing — the "removed" economics, in full |
| F2 | **Critical** | `business-dna/…Pricing Tiers & Plans.md` | 183–185, 198–200, 213–215 | Outcome claims about clients who don't exist |
| F3 | **High** | `marketing/Website_Master_Copy.md` | 141–154 | Removal notice quoting unpublished monthly pricing verbatim |
| F4 | **High** | `marketing/Website_Master_Copy.md` | 342–345, 352 | Removal notice quoting the three fabricated stats verbatim *(the known residual)* |
| F5 | **High** | `marketing/Website_Master_Copy.md` | 209–218 | "By your 3rd or 4th session, you'll notice…" — guard misses by two words |
| F6 | **High** | `recruiter/rough draft - Work History…md` | 74–294 | 220 lines of another AI's chat transcript, incl. cost estimates + imperative text |
| F7 | **High** | `recruiter/ernest_resume_library_master_draft.md` | 356–372 | Private job-application targets (four named orgs) |
| F8 | **High** | `secretary/infrastructure-vps.md` + `router/*` | multiple | Full server inventory, `/root/` paths, API-key file locations |
| F9 | **High** | `marketing/Client_Welcome_Packet.md` | 85 | Client-facing link to a subdomain with no certificate — **verified dead** |
| F10 | **High** | `router/…MVP Brief (Final).md` | 171–172 | "Routing agent: currently a stub" — the agent can describe itself as fake |
| F11 | **High** | `business-dna/…Pricing Tiers & Plans.md` | 37–41, 44, 277–281 | Unsourced market/competitor statistics, incl. a named real organisation's price |
| F12 | **High** | `business-dna/…Services Profile.md`, `marketing/australia-expansion.md` | 199–202 / 21, 29, 35–41 | Unsourced AU statistics + unpublished AU hourly rate |
| F13 | **Medium** | `business-dna/…Pricing Tiers & Plans.md` | 267–268 | Placeholder client names in quotes ("Maria — Coastal Bakery") |
| F14 | **Medium** | `business-dna/…Services Profile.md` | 25, 29, 53, 107–111, 118, 127–128, 137–139, 143, 145, 151–152, 188–190 | ~18 `_[add …]_` placeholders |
| F15 | **Medium** | `marketing/Client_Welcome_Packet.md` | 40–42 | Raw TODO under a heading, incl. an unpublished travel-cost policy |
| F16 | **Medium** | `marketing/Website_Master_Copy.md` | 267–273 | "Real Impact" — a giveback program that has never run |
| F17 | **Medium** | `recruiter/rough draft…md` | 101 | Google account avatar URL — the guard's Google rule misses the host |
| F18 | **Medium** | `router/resume…MVP Brief (Phase 1).md` | 219 | Discloses that the public number is a Google Voice number |
| F19 | **Medium** | 4 files | — | Four-way contradiction on whether `resume.ernestofgaia.xyz` exists |
| F20 | **Medium** | `recruiter/…master_draft.md`, `roles/2017-…md` | 199–203 / 35–36 | Unverified certifications ("wildland firefighter", "black mold") |
| F21 | **Medium** | `marketing/Welcome_to_AI_Coaching.md` | 56–65, 67–69 | Internal sales playbook + a stray instruction-shaped line |
| F22 | **Medium** | `router/*`, `marketing/marketing-content-pipeline.md` | multiple | Stale status served as current ("Week 1–3 of Spring Sprint") |
| F23 | **Low** | `router/resume…Phase 1.md` | 143 | `2024-acme-corp-ai-engineer.md` placeholder role |
| F24 | **Low** | `recruiter/…master_draft.md` | 23, 289 | Discord handle — a contact channel outside the published hierarchy |
| F25 | **High** | `business-dna/EOGbook_Project_Summary.md` | 48, 166 | The site's own IA specifies a page holding "3–5 client quotes" |
| F26 | **High** | `business-dna/EOGbook_Project_Summary.md` | 121–142 | A ~20-route navigation tree; **4 of 12 sampled routes 404** |
| F27 | **Medium** | `business-dna/EOGbook_Project_Summary.md` | 281, 293, 299, 306 | Local filesystem paths ×4 |
| F28 | **High** | `business-dna/EOGbook_Project_Summary.md` | 302–312 | An embedded system-prompt block: *"You are implementing… Do not deviate."* |
| F29 | **Medium** | `scripts/content-guard.mjs` | — | Scan scope ≠ ingest scope *(see §6.4)* |

---

## 3. The findings that matter most

### F1 — The pricing economics were never actually removed *(Critical)*

`marketing/Website_Master_Copy.md:145–146` states:

> *"…the pricing DNA doc states plainly that the session-count economics are Ernest's internal
> planning only — agents must not quote them."*

**The pricing DNA doc says no such thing.** There is no such statement anywhere in
`business-dna/AI Coaching & Tutoring Business — Pricing Tiers & Plans.md`. What it does contain,
unredacted and formatted as finished tables, is the complete economics that the master-copy notice
claims were withdrawn:

| Line | Content |
|---|---|
| 165–170 | Plan table with the **Sessions** column: 12 / 24 / 36 |
| 180–181 | Habit: Foundations 12 × $75 = **$900**; Builder 12 × $110 = **$1,320** |
| 195–196 | Rhythm: **$71.25**/session → **$1,710**; **$104.50**/session → **$2,508** |
| 210–211 | Craft: **$67.50**/session → **$2,430**; **$99**/session → **$3,564** |

The mitigation was written down and never carried out. A visitor asking *"what does six months of
coaching cost?"* retrieves this table and is quoted **$2,508** — a total Ernest has never published
and is not committed to. This is the same breach the 2026-07-29 note describes as *"the 'never
invent prices' rule broken from the inside"*, still live, in the file that was named as the fix.

Published figures are only: **$75 / 60 min**, **$110 / 75 min**, **5%** and **10%** plan savings.

### F2 — "What clients achieve in 3 / 6 / 9 months" *(Critical)*

Three headings in the same file (183, 198, 213), each followed by achieved-outcome bullets:

> *"Foundations: Full AI toolkit in daily use, training 1–2 staff members, content workflow
> producing consistently"*

There are no clients. This is the precise class the `TRACK_RECORD` rule was added for — the rule
just doesn't match this phrasing. Serving it answers *"does this actually work?"* with invented
evidence.

### F5 — The guard misses the reworded version of its own founding case *(High)*

The guard was built around: *"Most people notice a shift by their 3rd session."* Its regex is
`\bby\s+(?:their|your)\s+\d+(?:st|nd|rd|th)\s+session\b`.

`Website_Master_Copy.md:209–213` says:

> **STEP 5: See Real Results** — *"By your 3rd or 4th session, you'll notice: You're comfortable
> using AI tools without help…"*

`by your 3rd` matches up to the ordinal, then the regex needs ` session` and finds ` or`. **It
misses by two words.** Lines 215–217 continue: *"By 6 months … Tier 1: You're teaching others."*
The claim the guard exists to stop is sitting three sections above the guard's own removal notice.

### F3 / F4 — Removal notices as a hazard class *(High)*

Two `[!warning]` blocks quote the withdrawn material verbatim inside the served corpus:

- **141–154** quotes **"$300–$405/month"** and **"$415–$577/month"** — the dollar figures on line
  143 carry *no* allow marker, because no rule matches them. The chunk is retrievable on any
  monthly-cost query.
- **342–345, 352** quote *"15+ clients coached since 2025"*, *"95% of clients complete their first
  month"*, *"Average session homework completion: 87%"* — the known residual.

Not retrieved today is not unreachable. Both notices are prose *about* removed claims, and a
chunker has no way to know the difference between a fabricated statistic and a fabricated statistic
in quotation marks. **The record belongs in the vault ledger, which already holds all three
statistics verbatim in five places (lines 27, 294, 331–332, 339) — verified.** Deleting the numbers
here costs nothing and closes the last copy inside the index.

### F6 — 220 lines of another AI's conversation *(High)*

`recruiter/rough draft - Work History - project brief.md:74–294` is a pasted Abacus "Deep Agent"
chat, ingested whole. Three distinct hazards:

1. **Cost estimates that are not Ernest's** (154–175): *"$10-50/month"*, *"$0.10-0.30 per minute"*,
   *"~3,000-5,000 credits"*. Ernest sells a website-finishing service by flat quote. A visitor
   asking what a build costs can retrieve another vendor's numbers.
2. **Instruction-shaped text in a retrieval corpus** (99, 285–292): *"Would you like me to: 1. Build
   the Phase 1 MVP now?"* Imperative text in a retrieved chunk is an injection surface.
3. **Third-party marketing voice** ("This is a fantastic concept!", "Your library metaphor is
   brilliant") served as Ernest's own knowledge base.

The file also contradicts itself in eight lines: **line 16** *"Status: Concept / ideation — not yet
built"*, **line 20** *"Live URL: https://resume.ernestofgaia.xyz ( live !! )"*.

### F7 — Private job-application targets *(High, privacy)*

`ernest_resume_library_master_draft.md:356–372` lists the source `.docx` filenames, which name
**where Ernest has applied or drafted letters**: *Nate Hagens*, *NetNada*, *Milk Road*,
*Climate Works*. The recruiter agent is public. Asked *"where has Ernest applied?"*, it can answer.

This is a class the guard does not model at all — it covers phone numbers, personal emails and
Drive URLs, not third-party names in a private context. Same shape as the 2026-07-18 leak,
different vector.

### F8 — The secretary agent is a reconnaissance endpoint *(High, security)*

Publicly served, across `secretary/` and `router/`: host provider and OS (Hostinger, Ubuntu 24.04),
CPU/RAM/disk, proxy software, Node **v22.14.0**, internal ports **8080** and **3000**, source paths
under **`/root/`**, the full SSH/scp deploy workflow, host nginx config paths, Let's Encrypt cert
paths, and — in two files — **`.env.local (ANTHROPIC_API_KEY)`**, naming the secret's file and
location. `ernestofgaia.xyz` resolves to a single public IP, so this is not abstract.

No secret value is exposed and nothing here is fabricated. The problem is placement: this is an
internal runbook with zero visitor value, sitting in a customer-facing index.

### F9 — A dead link in the client welcome packet *(High, verified)*

`Client_Welcome_Packet.md:85` lists **"Projects Orchard — orchard.ernestofgaia.xyz"** in the
client-facing contact table. Verified this session:

- DNS resolves (`72.61.56.148`), but **HTTPS fails the TLS handshake** — no certificate.
- HTTP returns the **Nginx Proxy Manager "Default Site"** placeholder.
- `secretary/infrastructure-vps.md:58` marks it **"(planned)"** and still lists *"Add
  orchard.ernestofgaia.xyz to Nginx Proxy Manager"* as an open next step.

A client following the welcome packet gets a browser certificate error. Same failure for
`mobile.ernestofgaia.xyz`, advertised as a live "Key Link" in
`router/projects-wiki/ernest-of-gaia-main-site.md:48`.

### F10 — The site's docs say the agents are stubs *(High)*

`router/ernestofgaia.xyz - MVP Brief (Final).md` carries **no** historical banner and states in the
present tense (171–172):

> *"Routing agent: Currently a stub with keyword classifier."* · *"Sub-agents: Stubbed with sensible
> defaults."*

A visitor asking whether the chat is real AI can be told, by the agent itself, that it is a stub.
Line 184 also states *"Contact capture working (email/phone collection) ✓"* — a data-collection
disclosure with no privacy policy attached.

### F11 / F12 — Metrics with no verifiable source *(High)*

Served as fact, no citation travelling with the chunk:

- *"Oregon median household income (2024) $83,011"*, *"Small biz AI spend growth (2025) ~36% YoY"*,
  and **unemployment broken out by race** — *"3.9% (white), 5.5% (Black), 5.2% (Hispanic/Latino)"*.
  An uncited racial-disparity statistic served by a coaching chatbot is the worst-shaped item here.
- **Named real organisations with prices attached**: *"Oregon Coast SBDC group workshops — $25/2hr"*,
  *"Portland AI agencies (retainer) $2,000–$10,000/month"*, and in the AU brief four named firms —
  *Immersive AI, Mindset AI, AI Avenue, Harbour Edge Intelligence* — at *"$399–$1,249 per session"*.
- **Unpublished AU pricing**: *"$150–$200/hr"*, *"6-month engagement ~$7,200–$9,600 total"*, in a
  market Ernest does not yet operate in.

Note the structural point: `marketing/Australia Market Research — Sydney Penrith.md` **does** carry
a Sources section (96–103). The same statistics appear un-sourced in two *other* files. **The
citation lives in a different file from the claim, so it never travels with the chunk.**

### F25 / F26 / F28 — the file the first pass missed *(High)*

`business-dna/EOGbook_Project_Summary.md` is the build spec for the site's information architecture.
It is a third pasted-artifact file, and it carries three distinct hazards:

**F25 — testimonials specified as a deliverable.** Line 48 defines page 6 as *"Trust & FAQs |
Testimonials + objection handling | **3–5 client quotes**, 8 FAQs"*, and line 166 budgets
*"Testimonials (3–5) | Page 6 | 300–500"* words. The corpus elsewhere states correctly that there are
none. Here the site's own blueprint says a page exists to hold them.

**F26 — a navigation tree that partly 404s.** Lines 121–142 document ~20 `/eogbook/…` routes, while
line 22 notes routes actually live under `/begin-learning`. Verified rather than assumed, because the
obvious guess was wrong: the redirect layer *does* cover the rename, so most top-level pages resolve.
Of 12 routes sampled, **4 return 404 after redirects**:

| Route | Final |
|---|---|
| `/eogbook/who-is-ernest/origin-story` | **404** |
| `/eogbook/what-i-do/plain-english` | **404** |
| `/eogbook/giveback/overview` | **404** |
| `/eogbook/trust-faqs` | **404** |
| the other 8 sampled | 200 |

An agent asked *"where can I read Ernest's origin story?"* hands the visitor a dead link. Note that
the one page named in F25 — the testimonials page — is among the four that do not exist.

**F28 — an embedded system prompt.** Lines 302–312 contain a complete instruction block in the second
person: *"You are implementing EOGbook… Read the complete specification at… Then implement it exactly
as specified. Do not deviate."* Of every hazard in this repo this is the one most likely to change a
serving model's behaviour rather than just its output, because it is shaped like a system prompt and
sits in a corpus that gets retrieved into one.

---

## 4. `content-guard: allow` markers — all six enumerated

Every marker in an ingested file, with a judgment. All six are in `marketing/Website_Master_Copy.md`.

| Line | Silenced text | Rule it silences | Verdict |
|---|---|---|---|
| 144 | *"…and \"most popular\" labels were all removed"* | `TRACK_RECORD` | **Legitimate but misplaced.** Correctly exempts prose *about* a removed label. The prose should not be in the corpus at all (F3). |
| 342 | *"…two testimonial templates (`[CLIENT NAME]`, `"[3–5 sentence quote…]"`)"* | `SCAFFOLDING` | **Silencing a real hazard.** A quoted fake-testimonial template, kept as an example of a quoted fake-testimonial template. |
| 343 | *"\"Trust Signals (To Add)\" list containing invented statistics…"* | `SCAFFOLDING` | **Silencing a real hazard.** Reintroduces the exact `(To Add)` string the rule targets. |
| 344 | *"15+ clients coached since 2025", "95% of clients complete their first month", "Average session…"* | `FABRICATED_STAT` | **Silencing the original hazard verbatim.** This is the residual named in the brief. All three numbers survive here in full. |
| 352 | *"A retrieved fragment reading \"95% of clients complete their first month\"…"* | `FABRICATED_STAT` | **Silencing a real hazard.** A second copy of the same statistic. |
| 381 | *"Text CTAs should be prominent on mobile since most people browse on phones"* | `TRACK_RECORD` | **Legitimate exemption.** "Most people" here means the general public, not Ernest's clients — a true generalisation, correctly exempted. *(The surrounding internal implementation notes are a separate, lower-severity issue.)* |

**Two of six are genuine general/product vocabulary. Four of six are the CI being deliberately
silenced so that a description of a fabrication could keep the fabrication in it.** Each was a
defensible call in isolation and reviewed at the time; together they mean the guard's strongest
rules are switched off on the one file that most needs them.

**The rule this suggests:** an allow marker is appropriate for real vocabulary the rule cannot
distinguish (line 381), and inappropriate as a way to keep quoted hazardous material in the index.
When the marker exists to preserve a *quotation of a violation*, the quotation belongs in the vault.

---

## 5. Verification performed (fail-capable, and it did fail)

| Check | Result |
|---|---|
| `node scripts/content-guard.mjs` on `main` | **PASS** — 0 violations *(the headline: green ≠ safe)* |
| `ernestofgaia.xyz` | HTTP 200 |
| `resume.ernestofgaia.xyz` | HTTP 200 — so the "Concept phase / not yet built" statuses are the stale ones |
| `mvp.ernestofgaia.xyz` | HTTP 200 |
| **`mobile.ernestofgaia.xyz`** | **TLS handshake fails — no certificate.** HTTP 200 → NPM "Default Site" |
| **`orchard.ernestofgaia.xyz`** | **TLS handshake fails — no certificate.** HTTP 200 → NPM "Default Site" |
| **`pelican.ernestofgaia.xyz`** | **HTTP 502 Bad Gateway** — but see the note below |
| DNS for all five subdomains | Resolves to `72.61.56.148` — the failures are proxy/cert, not DNS |
| `github.com/ErnestOfGaia/ai-tutoring-website` | 200 |
| `github.com/ErnestOfGaia/ernestofgaia-resume` | 200 — so *"(to be created)"* is stale |
| `github.com/ErnestOfGaia/ernestofgaia-website` | **301 → `ernestofgaia-website-mvp`** — the URL in `DEPLOYMENT_STANDARDS` is stale |
| Vault ledger holds the 3 stats | **Yes** — lines 27, 294, 331–332, 339 |

Three advertised endpoints are broken, and one of them is in the client welcome packet.

> **Note on `pelican.` — the 502 is real but it is not the Pellito app.** The app is live and
> healthy at **`pelican.mechanicalcupcakes.fun`** (HTTP 200, including `/login`). Both hostnames
> point at the same VPS (`72.61.56.148`); `pelican.ernestofgaia.xyz` is a **stale proxy host left
> behind when the app moved to the mechanicalcupcakes.fun domain**. So the finding was accurate
> about the hostname the corpus advertised, and misleading about the app — worth stating plainly,
> because "Pellito is down" and "an old proxy entry points at nothing" are very different problems.
> The row lived in `secretary/infrastructure-vps.md`, which is evicted, so the corpus side is
> already closed. What remains is a dangling Nginx Proxy Manager host, which is tidy-up, not an
> outage.

---

## 6. What the guard can and cannot do

The guard is well-built, and its narrowing note (lines 63–68) — *"a rule that fires on true content
is evidence about the RULE"* — is the right instinct. Three structural limits are worth stating
plainly, because they explain why a green run means less than it looks:

1. **`flag()` returns on any allow marker, for every category.** One marker silences all seven
   rules on that line. There is no way to exempt a line from `TRACK_RECORD` while keeping
   `FABRICATED_STAT` active on it. Line 344 is exactly that case.
2. **The rules match phrasings, and phrasings are unbounded.** F2 and F5 are the same claims the
   guard was written for, reworded. Regex hardening will always trail the drafting.
3. **Whole categories were unmodelled** — *six of them now are, as of Stage 6.* Unpublished pricing
   (F1, F3, F12), infrastructure disclosure (F8), local paths and secret names, operator-voice text
   (F6, F28), draft scaffolding beyond the narrow rule (F14), and sprint-relative status (F22) are
   now matched **by shape, not by value** — no withdrawn figure is written into the guard, because
   detecting a price by hardcoding it would put the price back in the repo.

   Still unmodelled, and probably unmodellable by regex: unsourced statistics (F11), third-party
   names in a private context (F7), and dead links (F9, F26). Those need a human or a fetch, which
   is why §5 exists.
4. **The scan scope did not match the ingest scope** — *fixed in this PR (F25).* `walk()` collected
   every `.md` in the repo, including `.github/` and `scripts/`, which are never embedded and never
   served. This surfaced the moment this audit was written: the guard raised 10 violations against
   the audit's own quotations of the hazards it had found. The only ways to keep such a record in
   the repo were to fail CI permanently or to bury it in allow markers — and a marker whose purpose
   is to preserve a quoted violation is precisely the failure mode §4 identifies. `walk()` now skips
   the two non-ingested top-level directories, so the rules apply to exactly the files an agent can
   read, and a truthful audit can live in the repo without weakening the guard.

**A note on the shape of that fix.** Narrowing scope to remove a warning looks like the same move as
adding an allow marker, and it is worth being explicit about why it isn't. An allow marker asserts
*"this hazardous text is fine to serve."* The scope change asserts *"this file is never served."*
The first is a judgment that can be wrong about content; the second is a fact about paths, checkable
against the ingest config. If `.github/` ever becomes ingested, this change becomes wrong — and that
is the right property for it to have.

The durable fix is not a longer regex list. It is **the placement rule the 2026-07-29 note already
wrote down and this sweep found unenforced**: *anything in `agentic-brain/` should read as a true
statement about the business today.* Internal runbooks, sprint history, market-research working
notes, resume drafting scaffolds and removal notices all fail that test regardless of wording — and
the cheap, checkable version of it is **whether the file belongs in the corpus at all**, which is a
question about paths, not about text.

---

## 7. Resolution log

All six stages are applied on this branch, one commit each, in the order below. Everything is
reviewable per-commit; nothing is merged.

| Stage | Findings | Outcome |
|---|---|---|
| 1 | F3, F4 | Both removal notices rewritten; the quoted fabrications and unpublished monthly figures are gone. Ledger verified to hold them. |
| 2 | F1, F2, F5, F11, F13, F16 | Session-count tables and plan totals deleted; "What clients achieve" ×3 deleted; the timeline claim and the "Real Impact" block rewritten; competitor rate tables made qualitative. |
| 3 | F6, F7, F8, F10, F18, F20, F21, F24, F25, F26, F27, F28 | 8 files evicted, each verified to have a vault home first. Section-level removals for the job-application targets and the internal playbook. |
| 4/5 | F9, F12, F14, F15, F19, F22, F23 | Australia files evicted; 20 placeholders removed; dead links dropped; sprint-relative status replaced with what is true now. |
| 6 | F29 + the six unmodelled categories | Scan scope fixed; six shape-based rules added. |

**Corpus went from 27 files to 17.** Nothing was deleted without first confirming the original in the
vault — these were exports, not originals.

### What deliberately was *not* changed

- **`secretary/` is now empty.** Its two files were an internal runbook and a server inventory;
  neither served the scheduling role the agent actually has. The agent is not left contextless — six
  other files are tagged for it and carry contact routes, tiers, booking flow and the giveback. A
  purpose-built scheduling doc is content for Ernest to write, not for me to invent.
- **The wildland firefighter certification is REMOVED** (2026-08-27). Ernest confirmed the
  certification has lapsed and the training was ~20 years ago. It was also mis-filed: a ~2006
  credential sitting under a role dated "2017 – present". **`Riverwatch training` is in the same
  undated list and may have the same problem — flagged, not touched.** Separately, the black-mold
  entry was internally inconsistent in one file (training in one line, certification in another)
  and was made consistent as training.
- **`orchard.` and `mobile.` are no longer advertised**, but they are still unconfigured on the VPS.
  Fixing that is a proxy change, not a corpus change.
- **The four 404 routes** (F26) are a site issue, not a corpus issue, now that the file naming them
  is gone.

### Verification of the finished state

A 12-category regression sweep — fabricated stats, plan pricing, market stats, AU pricing, outcome
claims, infra pointers, local paths, private job targets, scaffolding, allow markers, dead
subdomains, stale status — run against both trees:

| Tree | Result |
|---|---|
| pre-sweep `main` | **12 of 12 categories detect a hazard** |
| this branch | **12 of 12 clean** |

And the hardened guard itself, run against both:

| Tree | `content-guard` |
|---|---|
| this branch | **0 violations** |
| pre-sweep `main` | **88 violations** — 23 draft-marker, 20 stale-status, 18 infrastructure-detail, 13 internal-path, 10 unpublished-pricing, 4 operator-voice |

One detail in that second row is worth reading twice. `track-record`, `fabricated-metric` and
`placeholder-scaffolding` do **not** appear in the `main` results — not because those lines were
clean, but because they carried allow markers. On the corpus that was serving fabricated statistics
to visitors, the three rules written specifically to catch them were switched off.

---

## 8. After any merge — the ingest trap

Merging changes nothing an agent says. Corrected content is only reachable after:

1. Delete the affected chunks from `/app/data/brain.json` **by `source`**
   *(ingest dedups by chunk ID, not content — re-running without deleting is a no-op)*
2. `docker exec ernestofgaia_mastra node /app/src/scripts/ingest-brain.mjs`
3. Restart mastra

Ernest runs all VPS commands. Verify **by query**, never by reading the file:
`.claude\scripts\verify-brain-claims.mjs`
