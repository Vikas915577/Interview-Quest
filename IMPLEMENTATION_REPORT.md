# Implementation Report — Interview Quest v2.1.3

**Date:** 15 October 2026

## Confirmed repository state and root cause

- Inspected `Vikas915577/Interview-Quest` on GitHub. It is public, default branch `main`, and now contains root-level `index.html`, `app.js`, `style.css`, `sw.js`, `questions.json`, `sources.json`, scripts and docs.
- The live repository used a **flat root layout** for JSON, but the application previously requested only `./data/questions.json` and `./data/sources.json`. This path mismatch is the confirmed cause of the load error. The prior service worker also treated missing nested JSON files as cache-install assets; the refreshed worker makes question data optional and supports both layouts.
- GitHub connector read access works, but a write attempt returned `403 Resource not accessible by integration`. The v2.1.3 files below are built and tested locally; the remote files have **not** been updated by this environment. Use the provided flat-layout upload ZIP to replace root files.

## Features in v2.1.3 package

- 12 learning tracks with **227 distinct questions** across telephonic, HR, SQL, Excel, Power BI, Infor Birst, Python/Pandas, analytics/statistics, junior data engineering, BA/MIS, English/confidence, and resume/projects.
- Topic-based guided paths with 5-question, 10-question or full-topic sequences, Previous/Next navigation and path completion. The sequence is sorted by stable numeric question IDs; it starts from the first not-yet-attempted question where possible.
- Free browser read-aloud using `speechSynthesis`; browser speech-to-text when exposed by the browser. If unsupported, the UI explains the Android keyboard microphone fallback. No paid API key is required.
- Load fallback tries both `./data/*.json` and root `./*.json`, rejects HTML as a JSON response, and displays a more useful error.
- Service worker bumped to `interview-quest-v2.1.3`, safely caches whichever JSON layout exists and deletes previous app cache versions on activation.
- Question generator merges `questions-extra.json` into the base bank and writes both nested and flat root aliases, avoiding the loss of the extension during regeneration.

## Quality and honesty boundaries

- Question-bank validator checked 227 question records, 12 categories and 21 source records. IDs and normalized question text are unique; required fields and source references validate.
- `node --check app.js`, `node --check sw.js`, JSON parser checks, generator reproducibility and local HTTP checks were run successfully. See `TEST_REPORT.md` for exact scope.
- Headless browser interaction testing was blocked by the environment; real Android browser, live deployment, and offline-after-restart remain UNTESTED.
- This static app is free to host and does not need a paid AI API. Actual live AI grading, private ChatGPT embedding, cloud accounts/sync, and unrestricted two-way live AI voice are not included. Browser speech recognition support varies.

## Files

- `index.html`, `style.css`, `app.js`: application shell, visuals and practice logic.
- `questions.json`, `sources.json`: flat-layout deployment copies.
- `data/questions.json`, `data/sources.json`: structured development copies.
- `data/questions-extra.json` (nested package) or root `questions-extra.json` (flat upload package): separate 72-question expansion batch; merged by `make_bank.py`.
- `sw.js`: resilient service worker.
- `make_bank.py`, `tests/validate-question-bank.mjs`: regeneration and QA.
- `README.md`, `PHONE_SETUP_HINDI.md`, `RESEARCH_AND_ROADMAP.md`, `TEST_REPORT.md`: documentation.
