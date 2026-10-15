# Interview Quest v2.2.0 — UX redesign notes

## Design problem

The previous interface placed many equally prominent controls on the same screen: six primary navigation destinations, multiple equal-weight home actions and status cards, a question bank with a full filter wall, and large question pages with several visible panels before the answer field. The result could feel crowded, especially on a narrow Android phone.

## Decisions implemented

### Home
- One primary action: Start practice / Start revision.
- Daily target shown as one simple progress panel.
- Question Bank, learning paths and mock interview are secondary rows rather than competing cards.
- Removed the repeated track grid and redundant home statistics; statistics remain available in Progress.

### Navigation
- Four persistent destinations: Today, Learn, Mock, Progress.
- Question Bank remains reachable from Today/Learn and uses Learn as its highlighted parent destination.
- Settings, backup and source references are under the header More action.

### Learning paths
- Topic choice and Start path remain prominent.
- Session length is an optional disclosure, not another always-visible field.
- Topic cards are simple horizontal list rows on phone; grids are used on wider screens.

### Question Bank
- Search stays visible.
- Category, difficulty, type, role, bookmark/revision/unseen and sorting options are inside a collapsed “Filters & sorting” disclosure.
- Topic and level labels remain on results; lengthy explanations remain on the question detail screen.

### Question detail
- The answer field follows the question directly.
- Voice tools and copy-prompt help are optional disclosures.
- The short answer and explanation appear after the user reveals the sample. Example/code/mistakes/follow-up/references sit inside a separate disclosure.
- ChatGPT feedback remains optional and opens outside this static app.

### Progress and settings
- Summary metrics stay visible; long per-topic and recent-history lists are collapsed.
- Settings are grouped into Appearance, Backup & recovery, ChatGPT coach, Research references, and About/limitations.

### Readability/accessibility
- Primary body text 16px; answer text 16px; topic/answer summaries 14–15px; navigation labels 12px (including narrow phones).
- Common buttons and inputs target 44–48px minimum height.
- Native `details/summary`, explicit aria labels/status, visible keyboard focus, reduced-motion handling, color themes and adequate bottom safe-area padding are retained.

## Rationale and references

- Android navigation guidance recommends 3–5 primary destinations: https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- Nielsen Norman Group usability heuristics, including minimalist design and recognition over recall: https://www.nngroup.com/articles/ten-usability-heuristics/ and https://www.nngroup.com/articles/recognition-and-recall/
- WCAG 2.2 target-size minimum criterion (with exceptions): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WAI WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/

These sources inform the design choices; they do not by themselves demonstrate that the new app has passed a user study.

## Remaining validation

Chromium headless rendering did not complete in the build container, even for `about:blank`. The package has static, schema, loader and HTTP tests, but a manual usability check on a real phone and the published GitHub Pages URL is still required. The build should not be described as “100% bug-free” before those tests.
