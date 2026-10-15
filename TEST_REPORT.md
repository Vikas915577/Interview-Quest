# Test Report — Interview Quest v2.1.1

**Test date:** 15 October 2026  
**Status:** Static/content checks PASS; browser/device and live deployment tests are not yet verified.

## Executed checks

| Check | Status | Evidence |
|---|---|---|
| JavaScript syntax (`node --check app.js`) | PASS | Run after the final app.js edits; exit code 0. |
| Service-worker syntax (`node --check sw.js`) | PASS | Run after cache-version bump; exit code 0. |
| Question-bank required fields, unique IDs and normalized question text | PASS | `node tests/validate-question-bank.mjs` checked all 155 records. |
| Question-bank generator reproducibility | PASS | `python make_bank.py` regenerated 155 questions; SHA-256 before/after was identical (`7db78bfbff9f489e6501ff96d3a502e2aac55f9b0baa8134884b6918f663f2b1`). |
| Category/difficulty values, examples, follow-ups and source-reference integrity | PASS | Validator checked all 12 categories and all referenced source IDs. |
| Static HTML element IDs, expected asset references, service-worker cache list and legacy storage migration marker | PASS | Covered by the validator script. |
| Local HTTP smoke check for `/`, `index.html`, `style.css`, `app.js`, `data/questions.json`, `data/sources.json`, `sw.js`, `manifest.webmanifest`, `icon.svg` | PASS | All nine local HTTP requests returned 200. This checks serving only, not interactive browser behaviour. |
| Browser automation / full DOM interaction | BLOCKED | A headless Chromium attempt did not complete in this environment; no browser PASS is claimed. |
| Android real-device usability | UNTESTED | Requires opening the deployed site on a real Android phone. |
| GitHub Pages deployment | UNTESTED | Source package is prepared locally. The remote repository is currently empty; this build has not been uploaded to GitHub from this environment. |
| Service-worker offline reopening/update behaviour | UNTESTED | Requires HTTPS deployment and a browser cache/offline test. |
| Cross-device progress sync and in-app AI grading | NOT IMPLEMENTED | Static/local-only release; no cloud backend or real AI grader is claimed. |

## Bug fixes in this pass

- Fixed nested list markup in the common-mistakes section.
- Added basic relevance ordering for question searches instead of sorting search results only by ID.
- Removed a duplicate role-filter exclusion condition.
- Bumped the service-worker cache key to `interview-quest-v2.1.1` so an eventual deployment can distinguish this patch from an earlier cache.

## What PASS means

PASS means the stated check was executed and succeeded. HTTP 200 does not prove that every button works. BLOCKED means a test attempt could not finish in this environment. UNTESTED means no execution is claimed. Do not describe the application as fully QA-certified until a browser test, actual GitHub Pages deployment, Android test and offline test are completed.
