# Test Report — Interview Quest v2.1.3

**Test date:** 15 October 2026  
**Status:** Static/content checks PASS; browser/device and live deployment tests are not yet verified.

## Executed checks

| Check | Status | Evidence |
|---|---|---|
| JavaScript syntax (`node --check app.js`) | PASS | Run after the final app.js edits; exit code 0. |
| Service-worker syntax (`node --check sw.js`) | PASS | Run after cache-version bump; exit code 0. |
| Question-bank required fields, unique IDs and normalized question text | PASS | `node tests/validate-question-bank.mjs` checked all 227 records. |
| Question-bank generator reproducibility | PASS | `python make_bank.py` regenerated 227 questions; SHA-256 before/after was measured during the final run and confirmed identical. |
| Category/difficulty values, examples, follow-ups and source-reference integrity | PASS | Validator checked all 12 categories and all referenced source IDs. |
| Static HTML element IDs, expected asset references, service-worker cache list and legacy storage migration marker | PASS | Covered by the validator script. |
| Local HTTP smoke check for `/`, `index.html`, `style.css`, `app.js`, `data/questions.json`, `data/sources.json`, `sw.js`, `manifest.webmanifest`, `icon.svg` | PASS | All 9 paths returned 200 in the nested layout. A separate no-`data/` flat-layout smoke test returned 200 for all root assets/JSON, with `/data/questions.json` returning the expected 404 that the app loader now falls back from. |
| Browser automation / full DOM interaction | BLOCKED | A headless Chromium attempt did not complete in this environment; no browser PASS is claimed. |
| Android real-device usability | UNTESTED | Requires opening the deployed site on a real Android phone. |
| GitHub Pages deployment | UNTESTED | The remote repository contains the previous flat-layout build; GitHub connector write calls returned 403, so this v2.1.3 build has not been pushed from this environment. |
| Service-worker offline reopening/update behaviour | UNTESTED | Requires HTTPS deployment and a browser cache/offline test. |
| Cross-device progress sync and in-app AI grading | NOT IMPLEMENTED | Static/local-only release; no cloud backend or real AI grader is claimed. |

## Bug fixes in this pass

- Fixed nested list markup in the common-mistakes section.
- Added basic relevance ordering for question searches instead of sorting search results only by ID.
- Removed a duplicate role-filter exclusion condition.
- Bumped the service-worker cache key to `interview-quest-v2.1.3` so an eventual deployment can distinguish this patch from an earlier cache.

## What PASS means

PASS means the stated check was executed and succeeded. HTTP 200 does not prove that every button works. BLOCKED means a test attempt could not finish in this environment. UNTESTED means no execution is claimed. Do not describe the application as fully QA-certified until a browser test, actual GitHub Pages deployment, Android test and offline test are completed.


## v2.1.2 targeted regression checks (preserved)

- Added validation coverage for the guided-path launcher and browser-native voice controls.
- Added loader fallback paths for both `/data/*.json` and root-level `*.json` files.
- Added root aliases of the 227-question bank and 21-source catalog for repositories uploaded as flat files.
- Replaced the service worker so installation is not blocked by a missing optional `data/` folder, and offline data requests never receive `index.html` as JSON. Non-JSON asset failures now return a normal fetch error instead of a misleading JSON body.
- Voice recognition remains browser/device-dependent and is reported as such; it is not considered a universal PASS.


## v2.1.3 targeted regression checks

- Confirmed GitHub's root directory contains `questions.json` and `sources.json`, while the previous loader only fetched `./data/*.json`; fallback now tries nested and flat paths.
- Generator now loads the 72-question expansion batch and regenerates both root and nested bank copies; two consecutive runs produced the same SHA-256 (`56d3ce684277b638963bb5e2baef6f70042df0010002ffe0f25f21b0a547420b`).
- The service worker only emits its JSON error payload for failed `.json` requests; other missing assets fail normally.
- Guided paths select 5, 10 or all questions for a chosen topic, in stable question-ID order.
- Voice recognition uses native browser capability only; support is not uniform and is not marked universally PASS.
- Mocked loader test: PASS; a simulated 404 for `./data/questions.json` correctly fell back to valid root `./questions.json`.
- Flat-layout package: PASS for bank-validator, generator, JavaScript syntax and local HTTP 200 on root assets/JSON. The expected missing `/data/questions.json` route returned 404, then app fallback test passed.
- Remote write/deploy: BLOCKED by connector 403.
