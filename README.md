# Interview Quest — Interview Preparation Platform

**Release:** v2.1.3 · **Research snapshot:** 15 October 2026 · **Hosting target:** GitHub Pages (static)

Interview Quest is a phone-first study app for entry-level Data Analyst, BI Analyst, MIS/Reporting Analyst, Business Analyst and Junior Data Engineer interviews. It is designed for short, repeated practice rather than long memorisation sessions.

## What's in this release

- 12 dedicated tracks: telephonic screening, HR/behavioural, SQL, Excel/MIS, Power BI, Infor Birst, Python/Pandas, analytics/statistics, junior data engineering, Business Analyst/MIS, English/confidence and resume/portfolio.
- 227 distinct, structured questions in the bank. Every record has a unique ID, category, difficulty, relevant roles, type, short answer, explanation, example, common mistake, follow-up, answer structure, source references, tags and revision status.
- Searchable bank with category, role, difficulty and type filters, bookmarks, revision queue, unseen-only filter and incremental loading.
- One-question practice: candidate drafts an answer, reveals the sample, marks it understood or needing revision, and opens/copies an optional ChatGPT coaching prompt.
- **Guided learning paths:** choose a topic and a 5-question, 10-question or full-topic path. Questions run in a stable ID order with previous/next and a completion screen.
- **Free browser voice tools:** read the question/model answer aloud with speech synthesis, and dictate an answer with browser speech recognition when the browser supports it. Voice recognition support/availability varies; Android keyboard voice typing is a fallback.
- Mock interview sessions with one question at a time and answer reveal after submission. Scores are self-ratings, not AI judgements.
- Local XP, daily goal, activity streak, revision state, history and bookmarks.
- JSON export/import with basic schema checks and a pre-import backup download.
- Dark/light theme, responsive navigation, accessibility focus states and basic PWA/offline asset caching.
- Research references, beginner instructions, QA scripts and phased plan to expand the bank.

## Important scope and truthfulness notes

- This release contains **227** structured questions across 12 tracks, not the full requested 1,000-question bank. Keep adding content in QA-checked batches until at least 1,000 genuinely distinct questions exist. Do not label questions “frequently asked” unless the claim is supported by evidence.
- The static app does **not** call an AI API or automatically grade free-text answers. Voice controls use built-in browser features only; they do not call a paid API. Browser speech recognition may require an internet connection and can be unavailable on some devices. It asks the user to self-review against a model answer. Optional ChatGPT feedback opens ChatGPT separately; prompt-prefill behaviour is not a documented public API and may change. Use “Copy coach prompt” as the fallback.
- Progress is stored in this browser/device using `localStorage`; it is not synced across devices and may be lost if browser site data is cleared. Export a backup regularly.
- The project does not include accounts, cloud sync, recruiter analytics, a server, or private API keys. Those require a separate, securely designed backend.
- The portfolio-specific questions are based on public READMEs. They preserve the READMEs' disclosures that the sample metrics are synthetic and some Infor Birst implementations are blueprints rather than live tenant deployments.
- SQL and BI examples use generic concepts and in places PostgreSQL-like syntax. Validate syntax against the database/Infor Birst version used in your interview.

## Run locally

Use a local HTTP server instead of opening `index.html` as `file://`, because the app loads JSON files with `fetch` and registers a service worker only on HTTP/HTTPS.

```bash
python -m http.server 8000
```

Open `http://localhost:8000` from the `Interview-Quest` project directory.

## Publish with GitHub Pages (phone-friendly steps)

1. Open the `Interview-Quest` repository on GitHub.
2. For the current flat-layout repository and Android-friendly upload, download `Interview-Quest-v2.1.3-GitHub-Upload.zip`, extract it, and upload all files inside it to the repository root (replace files with the same names). The archive intentionally keeps `questions.json` and `sources.json` at root.
3. Alternatively, for the full development package, upload the structured contents including `data/`, `docs/` and `tests/`.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
6. Open the published URL after GitHub reports the deployment ready. First-load, mobile interaction and offline caching should be tested after the site is live over HTTPS.

This release supports both the structured `data/questions.json` + `data/sources.json` layout and flat root `questions.json` + `sources.json` layout. This prevents the previous “Load error” caused when GitHub uploads folders as flat root files. Relative asset paths make it suitable for a project-page URL such as `https://<owner>.github.io/Interview-Quest/`.

## Tests

Requirements for the local checks: Node.js 18+ and Python 3.10+ (the static site itself has no build step).

```bash
node --check app.js
node tests/validate-question-bank.mjs  # full project package
node validate-question-bank.mjs       # flat GitHub upload package
python -m http.server 8000  # optional local HTTP serving check
```

The question-bank validator checks required fields, unique IDs and normalized question text, valid category/difficulty values, source-reference integrity and topic coverage. Browser navigation, actual GitHub Pages deployment, service-worker updates and offline mode must still be verified in a real browser/device and are reported separately in `docs/TEST_REPORT.md`.

## Project structure

```text
index.html                 Main accessible app shell
style.css                  Mobile-first dark/light styling
app.js                     Navigation, search, practice, mock and local progress
manifest.webmanifest       PWA metadata
icon.svg                   App icon
sw.js                      Versioned offline asset cache
data/questions.json        Structured question bank (current bank: 227)
data/sources.json          Research references and caveats
make_bank.py               Reproducible base + extension question generator
data/questions-extra.json  Reviewed extension batch, merged during regeneration
tests/validate-question-bank.mjs

docs/RESEARCH_AND_ROADMAP.md  Evidence, gap analysis and expansion roadmap
docs/TEST_REPORT.md           Executed checks and known limitations
docs/PHONE_SETUP_HINDI.md      Phone-friendly setup and use guide
```

## Adding questions safely

1. Add a new record to the base generator or a reviewed extension batch such as `data/questions-extra.json` (nested package) or root `questions-extra.json` (flat upload package) with every required field; do not copy an existing question and merely change a role name.
2. Use a unique stable ID, correct category, supported difficulty and real question type.
3. Provide a direct answer, an explanation, a concrete example and a meaningful common mistake/follow-up.
4. Add source references only when they support the concept. Use `data/sources.json` for the reference metadata.
5. Run `node tests/validate-question-bank.mjs` and `node --check app.js`.
6. Review the new answer for correctness, wording, dialect/version limits, duplicate meaning and invented experience/results before merging it.
7. Add question content in manageable batches and update the documented count only after tests pass.

## Privacy

No question answer draft is intentionally saved to history. The app stores question attempt status, XP events, bookmarks, mock summary, daily goal and theme locally. Do not type confidential employer/client data into the app. ChatGPT prompts are only sent if you explicitly open ChatGPT and submit them there.
