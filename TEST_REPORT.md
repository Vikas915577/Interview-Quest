# Test Report — Interview Quest v2.2.0

**Date:** 15 October 2026  
**Scope:** Static files, question-bank integrity, UI regression assertions, and local HTTP routes.  
**Not claimed:** bug-free, hosted, real Android, or offline visual success.

## Test summary

| Test | Status | Details |
|---|---|---|
| JavaScript syntax (`node --check app.js`) | PASS | Script parses without syntax errors. |
| Loader regression tests | PASS | Unit tests cover root JSON, nested fallback, HTML 404, and complete failure diagnostics. |
| HTML/CSS parsing | PASS | BeautifulSoup found 65 unique IDs with no duplicates; TinyCSS2 reported no CSS parse errors. |
| Question bank schema and unique text/IDs | PASS | 227 questions; 12 categories; required answers/examples/follow-ups and source IDs checked. |
| Static DOM ID reference audit | PASS | Required static and dynamically generated IDs are present or documented as optional. |
| UX structural regression tests | PASS | `node tests/validate-ux.mjs` passed for four-tab navigation, collapsed filters/settings, simplified Home and readable controls. |
| Asset/data HTTP smoke test | PASS | Local server on port 8765: all 9 routes returned HTTP 200 and both JSON data files parsed; question count = 227. |
| Chromium headless visual smoke test | BLOCKED | Chromium did not complete even for `about:blank` in this container; no screenshot or interactive-browser pass is claimed. |
| Live GitHub Pages deploy | UNTESTED | GitHub content write integration returned 403; user must upload release ZIP. |
| Real Android phone layout/voice | UNTESTED | Requires post-upload check on target phone/browser. |
| Offline service-worker reopening | UNTESTED | Must be tested after deployment over HTTPS. |

## v2.2.0 UX regression checks

- Bottom navigation has exactly four primary items (Today, Learn, Mock, Progress).
- Question Bank remains discoverable through Home/Learn and keeps search visible.
- Advanced filters/sorting are contained in a closed `details` panel by default.
- Settings and long progress lists use expandable panels.
- `app.js` references the flat root question/source JSON first and then nested `/data/` fallback paths.
- Service-worker cache name is bumped to `interview-quest-v2.2.0`.
- No frontend secret/API key pattern should appear.

## Manual test checklist after upload

1. Open the Pages URL in Chrome on a phone. Confirm question count loads and no load-error message appears.
2. Today: tap Start practice, answer, show the sample, and mark understood/revision.
3. Learn: select Telephonic or SQL, start a 5-question path, use Next/Previous, finish the path.
4. Question Bank: search “JOIN”, open Filters & sorting, choose category/difficulty, clear filters, load more.
5. Mock: run a 5-question session, enter an answer, self-rate, finish and revisit revision.
6. Progress: refresh; confirm attempts/XP/bookmarks remain. Export backup and verify the downloaded JSON parses.
7. More: switch theme, export/import a small test backup, inspect research references.
8. Voice: read the question aloud; if speech recognition is unavailable, verify the UI explains keyboard microphone fallback.
9. Test viewport widths 320, 360, 390, 430 and desktop. Confirm no horizontal scrolling, no tiny nav labels and bottom nav does not cover buttons.
10. Once question data is loaded, enable offline mode and reopen the page. Record result separately; do not clear storage until progress is backed up.
