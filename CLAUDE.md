# CLAUDE.md — Shift Tracker

Project context for Claude Code. Read this before touching the repo.

## What this is
A single-file PWA for logging delivery-porter shifts — parsed from route-email
screenshots via on-device OCR — and generating weekly invoices. Built for Ali's
own use, now opening to a small beta of fellow workers for feedback. Personal-tool
ethos throughout: small, fast, no ceremony.

## Structure
- `index.html` — the whole app (vanilla JS, one `<script>`). No framework, no build step.
- `sw.js` — offline-first service worker. Precaches the app + the Tesseract bundle.
- `manifest.json` — PWA manifest.
- `vendor/tesseract/` — vendored Tesseract.js + LSTM cores + `eng.traineddata.gz` (~24MB).
  This is what makes OCR work offline. It must deploy in full or OCR silently breaks.
- `icon-192.png`, `icon-512.png`.
- Data lives in `localStorage`: `shifts-v1`, `settings-v1`. The SW Cache is separate (`shifts-v2`).

Static site on Vercel — framework "Other", no build command, output = root.
Live: https://shift-pwa.vercel.app · Repo: https://github.com/AliGym19/shift-pwa

## Versioning
- The build number is **AOSRI-N** (Claude-in-chat names each delivered zip this way and bumps N
  every build). This single number is the source of truth — the zip name, the in-app stamp, and
  the commit all use the same N. No parallel "vN"/folder counters; that offset caused confusion.
- The app shows its version at the **bottom of Settings** ("Shift Tracker · AOSRI-N"). This stamp
  is **baked into the authored `index.html`** — Claude-in-chat owns and bumps it. **You (Claude Code)
  do NOT hand-edit the stamp**; it arrives in the dropped file already correct. (It used to be a
  hand-edit re-added each drop — that's gone now, so don't reintroduce it.)
- Commit message: descriptive summary + the same number, e.g. `AOSRI-14: close-out label, version stamp`.

## Source of truth — don't break this
`index.html` is authored in chat (Claude), Ali downloads it, and **you (Claude Code)
commit and deploy it — you do not hand-edit `index.html`.** Two agents editing the same
file means silent overwrites and conflicts. Your lane is git, deploy, and diagnostics —
not app code. If a code change is needed, say so; don't make it here.

## Deploy flow
- Auto-deploy is **live**: the Vercel GitHub App is authorized on the AliGym19 account, so a
  push to `main` auto-deploys to https://shift-pwa.vercel.app within ~1 min. No `vercel --prod`,
  no `--force`. (Sanity check: git-triggered deploys get a `shift-pwa-git-main-…` alias; CLI
  deploys don't — so that alias confirms the webhook fired.)
- Flow: Ali drops a new `index.html` → you commit + push → Vercel builds and aliases itself.
  Verify by fetching `/index.html` with a cache-buster and grepping for the change.
- When shipping a new `index.html`, bump `CACHE` in `sw.js` only if cached *assets* changed
  (vendor bundle, icons). Navigation is network-first, so `index.html` itself refreshes on
  reload without a bump.

## Design ethos
- Minimal. No tests, no deployment bloat, no speculative features. Add complexity only when
  a real need shows up.
- Financial and personal data stay **on-device only**. If a backend is ever added it takes
  anonymous usage events only — never invoice, earnings, or identity data. Data-minimise by default.
- Deliver a PDF alongside any Office format (mobile preview mis-renders DOCX/PPTX).

## How to work here
- **Think one step ahead.** Before calling a task done, ask what breaks *next* and surface it.
  Real examples from this project: will the 24MB vendor bundle actually deploy or fail silently;
  a placeholder feedback number would ship dead unless the new build lands; two agents editing
  `index.html` will collide. Catch these before they bite, not after.
- **Do the thing that leaves the project working**, not just the literal ask. If a request
  leaves a loose end, name it.
- **Flag the risk that matters, concisely**, then proceed. Don't bury the one real caveat under
  five that don't matter.
- **Confirm before irreversible or side-effectful actions** — pushes, prod deploys, anything
  destructive. State what you're about to do in one line, then do it.
- **Explain the *why* of non-obvious choices**, briefly — decisions and tradeoffs, not syntax.
  Ali reads the code; skip the obvious.
- **Keep momentum.** Eliminate idle time; don't wait around when there's useful work to do.
- **Be direct.** Genuine over polished. Push back when something's a bad idea. When Ali says
  something's done, take it as done and move on.
