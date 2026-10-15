# Research, Gap Analysis & Roadmap

**Research snapshot:** 15 October 2026. Pages were accessed/checked during the current research pass; third-party job pages can change or expire. This is a qualitative sample, not a census of hiring demand.

## Executive summary

The strongest early-career preparation sequence for the roles in scope is:

1. **SQL + Excel fundamentals**: filtering, grouping, joins, data cleaning, lookup formulas and PivotTables.
2. **Reporting/BI delivery**: metric definitions, Power Query, data relationships, DAX basics, dashboard usability and report validation.
3. **Business reasoning and communication**: explain what changed, segment the result, validate the cause and recommend a next check.
4. **Python/Pandas**: reading files, missing values, duplicate handling, grouping/merging and reproducible data-cleaning steps.
5. **Junior data-engineering foundations** (for that track): pipelines, SQL/Python, modelling/grain, incremental loads, idempotency, quality checks, logging/retries and relevant cloud/orchestration concepts.
6. **Role-fit practice**: telephonic screening, honest resume/project walkthroughs, behavioural answers and concise spoken English.

This is an **inferred learning order** based on the selected entry-level job descriptions and official concept documentation, not a percentage forecast of all jobs. Advanced data engineering tools should be labelled by requirement level rather than taught as mandatory for every analyst.

## Current job-description sample reviewed

| Source/listing | Observed themes | Evidence quality / caveat |
|---|---|---|
| [Indeed India — Noida fresher Data Analyst listing](https://in.indeed.com/q-fresher-data-analyst-l-noida%2C-uttar-pradesh-%E0%A4%9C%E0%A5%89%E0%A4%AC%E0%A5%8D%E0%A4%B8.html?l=noida%2C+uttar+pradesh&q=fresher+data+analyst) | SQL queries, joins/aggregations, Power BI dashboards and basic DAX, advanced Excel, data validation and business requirements; listing states 0–2 years or strong projects | Third-party listing/search page; availability and description can change. |
| [Hirist — Data Analyst, Business Intelligence, 0–2 years](https://www.hirist.tech/j/data-analyst-business-intelligence-1671030?jobPos=2) | SQL, Excel, KPI calculations, data-quality validation, documentation and basic statistics | Job-board listing rather than a systematic market sample. |
| [TymblHub — Power BI Developer / BI Analyst, 0–2 years](https://www.tymblhub.com/power-bi-developer--bi-analyst-jobs-in-pune-in-saankhya-technosystems-0-to-2-years-jid-506857) | Power BI reports/visuals, Power Query, modelling/relationships, Excel and basic DAX | Third-party listing; verify employer posting before applying. |
| [TE Connectivity — DATA ENGINEER I, Bangalore](https://careers.te.com/job/Bangalore-DATA-ENGINEER-I-KA-560076/157680-en_US/) | SQL, Python, Databricks, data quality, curated datasets and BI-ready data products | Employer careers page; requirements are specific to this role, not every junior data-engineer job. |
| [Weekday — entry-level Data Analyst listing page, updated 13 Oct 2026](https://www.weekday.works/jobs/remote-data-analyst-fresher-jobs) | SQL, Power BI, Excel, Python and communication recur in its listing summaries | Aggregator summary; listings can expire and duplicate. |

### Verified patterns vs inference

**Verified in the sampled listing texts:** SQL and data validation/report accuracy recur across analyst/BI examples; Excel and a BI tool recur in entry-level analytics roles; Python appears as a supporting or preferred skill in some analyst roles and as a core programming skill in the sampled Data Engineer I role. Communication, requirements and documentation appear alongside technical work.

**Inferred:** placing SQL/Excel before advanced DAX, cloud orchestration or Spark is a practical prioritisation for this user's target mix, not a universal ranking. The relative weight varies by employer, domain, location and exact job scope. No “35% SQL / 30% Excel” style percentages are treated as market statistics.

## Official and reputable concept references

- [PostgreSQL SQL tutorial](https://www.postgresql.org/docs/current/tutorial-sql.html) and [window functions](https://www.postgresql.org/docs/current/tutorial-window.html): query structure, joins, grouping and window calculations. SQL dialects still differ.
- [Microsoft Learn — DAX basics](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-quickstart-learn-dax-basics), [star schema](https://learn.microsoft.com/power-bi/guidance/star-schema), and [relationships](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-create-and-manage-relationships): DAX, fact/dimension concepts and modelling behaviour.
- [Microsoft Support — XLOOKUP](https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929): lookup patterns; available function support depends on Excel version.
- [Python Tutorial](https://docs.python.org/3/tutorial/) and [Pandas User Guide](https://pandas.pydata.org/docs/user_guide/index.html): language basics, errors, DataFrame transformation and data cleaning.
- [Infor Birst — preparing to use Birst](https://docs.infor.com/birst/2024.x/en-us/birstolh/intro_user/jdj1655271231404.html), [subject areas](https://docs.infor.com/birst/2026.x/en-us/birstolh/admin/adminsubjectarea.html), and [BQL basics](https://docs.infor.com/birst/latest/en-us/birstolh/birstug_bqlref/acc1717688368889.html): terminology and documented workflows. Infor notes that parts of its classic documentation may be outdated, so verify against the tenant version.
- [Indeed India — HR interview guidance](https://in.indeed.com/career-advice/interviewing/hr-interview-questions) and [Pin — phone screening guidance](https://www.pin.com/blog/phone-screening-questions/): recruiting question themes and practical answer preparation. These guides do not prove that each exact wording appears in every interview.
- [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages): static hosting model and setup.

## Gap analysis: supplied starter ZIP vs requested product

The separate starter ZIP contains seven core files: HTML, CSS, a single JavaScript file, manifest, service worker, icon and README. The starter offers a mobile-first landing page, 9 practice modules, ChatGPT prompt buttons, a seven-day plan, simple local XP/session completion and basic service-worker caching. It is not the same as the remote repository: GitHub reports `Vikas915577/Interview-Quest` as a public repository with size 0 at inspection time. Therefore, no existing remote source files were overwritten; this release initializes the remote from the supplied starter concept with an expanded implementation.

| Requirement | Supplied starter | This release | Remaining work |
|---|---|---|---|
| Separate learning tracks | 9 cards, small hard-coded sample questions | 12 tracks, 155 structured questions | Complete the requested 1,000-question bank in batches |
| Question search/filter | Module search only | Search plus category, role, type, difficulty, bookmark, revision and unseen filters | Relevance tuning and large-bank performance audit |
| Actual answer practice | Prompt is sent to external ChatGPT; no in-app answer session | Local one-question flow, reveal, self-review status and optional external ChatGPT prompt | True AI feedback needs a secured backend/API design |
| Progress | XP, sessions and streak basics | Attempt/revision/bookmark state, goal, history, XP and backup/import | Browser-device only; cross-device sync needs backend |
| Mock interviews | Prompt only | Sequential mock session, delayed answer reveal and self-rated summary | No AI scoring; deeper score rubric and voice flow are future work |
| Project accuracy | General resume prompt | Questions reflect repository README disclosures | Deep code-level project-specific questions should follow inspection of actual scripts/queries |
| Testing | No included test suite | Question-bank validation and syntax checks added | Real browser interaction, mobile-device, Pages deployment and offline checks pending/external |

## Architecture decision

### Release 1: static web app (chosen)

- Vanilla HTML/CSS/JavaScript with relative paths; no build step or external runtime dependency.
- Structured JSON question bank and sources file.
- Browser `localStorage` for non-sensitive progress state, plus JSON export/import for backup.
- Optional external ChatGPT link/prompt copy. No API key in the browser.
- GitHub Pages as static hosting target; service worker caches app assets for basic offline reopening after the first successful online load.

**Why:** It can be maintained and published from a phone, does not need a paid backend to start, and avoids exposing an AI secret. The trade-off is no user accounts, cloud sync or genuine in-app AI grading. Static `localStorage` is not a durable backup or security boundary.

### Possible future AI-backed release

If genuine automatic evaluation is added, route requests through a small server-side backend, keep credentials server-side, add rate limiting and data minimisation, disclose costs/quotas and provide a non-AI fallback. Never place an OpenAI API key in GitHub Pages JavaScript. Keep user consent before sending draft answers to an external service.

## Question schema

Every question has: `id`, `category`, `subcategory`, `question`, `difficulty`, `roles`, `type`, `shortAnswer`, `explanation`, `example`, `sampleCode`, `commonMistakes`, `followUp`, `answerStructure`, `sourceRefs`, `tags`, and `revisionStatus`. User-specific status overrides `revisionStatus` via local state. The validator checks IDs, normalized question text, core field completeness, allowed categories/difficulties and source-reference integrity.

## 1,000-question expansion plan

Current batch: 155 hand-authored records. Add further batches and run validation + editorial review after each rather than auto-filling hundreds of near-identical prompts.

| Batch | Added focus | Planned additions | Cumulative target |
|---|---|---:|---:|
| R2 | SQL coding/debugging, query edge cases, joins/window functions, database fundamentals | 200 | 355 |
| R3 | Excel/MIS tasks, Power BI model/DAX scenarios, Infor Birst documentation-backed workflows | 220 | 575 |
| R4 | Python/Pandas, analytics/statistics, business cases and junior data engineering | 250 | 825 |
| R5 | Telephonic/HR/English, resume/project follow-ups and mixed role scenarios | 175 | 1,000 |

The table is a plan, not a claim that those questions already exist. Only increment the published count after content exists and tests pass. Maintain distinct question intent, meaningful answers, code/output checks and sourced technical claims. Don't label content as “most repeated” without a defensible sample and method.

## Prioritised roadmap

1. **P0 — Stabilise core:** runtime bank validation, navigation, question reveal, honest self-rating, progress migration, backup recovery and phone layout.
2. **P1 — Content expansion:** batches R2–R5, role tags, code examples, expected outputs and question quality review.
3. **P1 — Browser QA:** run interaction tests on mobile and desktop; test empty search, import failures, localStorage quota, reload and service-worker version changes.
4. **P2 — Deeper SQL practice:** add a real SQL execution engine only if a safe local/web runtime is available. Until then, label SQL as manual practice, not executable SQL.
5. **P2 — Voice practice:** optional browser speech features after checking mobile browser support and consent.
6. **P3 — AI service:** only after backend, quota/cost, security and privacy design. No client-side secrets.
7. **P3 — Cloud sync/accounts:** separate product decision with data backup, access control and migration plan.

## QA acceptance checks

- Bank count and schema are checked automatically; no duplicate IDs or normalised question text.
- Every question's category exists and every `sourceRefs` value exists in `data/sources.json`.
- Search, filters and empty states are tested with combinations.
- Marking a question twice on the same day does not award duplicate XP for that question/day.
- A question attempt records status, date and score source but not the user's free-text draft.
- Imported backup is parsed and filtered against the active bank; current state backup is offered before replacement.
- External ChatGPT is described as separate and non-guaranteed prefill; no false claims of AI evaluation.
- Job listing claims are dated and qualified because third-party listings change.
