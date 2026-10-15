import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = fs.existsSync(path.join(here, 'questions.json')) ? here : path.resolve(here, '..');
const bankPath = fs.existsSync(path.join(root, 'data', 'questions.json')) ? path.join(root, 'data', 'questions.json') : path.join(root, 'questions.json');
const sourcesPath = fs.existsSync(path.join(root, 'data', 'sources.json')) ? path.join(root, 'data', 'sources.json') : path.join(root, 'sources.json');
const htmlPath = path.join(root, 'index.html');
const appPath = path.join(root, 'app.js');
const swPath = path.join(root, 'sw.js');
const bankFile = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const questions = bankFile.questions;
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
const html = fs.readFileSync(htmlPath, 'utf8');
const app = fs.readFileSync(appPath, 'utf8');
const sw = fs.readFileSync(swPath, 'utf8');

const required = ['id','category','subcategory','question','difficulty','roles','type','shortAnswer','explanation','example','sampleCode','commonMistakes','followUp','answerStructure','sourceRefs','tags','revisionStatus'];
const categories = new Set(['telephonic','hr','sql','excel','powerbi','birst','python','analytics','data-engineering','ba-mis','english','resume-project']);
const difficulties = new Set(['Beginner','Intermediate','Advanced']);
const ids = new Set();
const normalizedQuestions = new Set();
const sourceIds = new Set();

assert.ok(Array.isArray(questions), 'questions must be an array');
assert.equal(bankFile.questionCount, questions.length, 'bank metadata count must match the actual count');
assert.ok(questions.length >= 100, `Expected a substantive first batch, found ${questions.length}`);

for (const source of sources) {
  assert.ok(source.id && source.title && source.publisher && source.url && source.use, 'source metadata is incomplete');
  assert.ok(/^https:\/\//.test(source.url), `source URL must use HTTPS: ${source.id}`);
  assert.ok(!sourceIds.has(source.id), `duplicate source ID: ${source.id}`);
  sourceIds.add(source.id);
}

const categoryCounts = new Map();
for (const [index, q] of questions.entries()) {
  const where = `question row ${index + 1} (${q.id || 'missing-id'})`;
  for (const field of required) assert.ok(Object.hasOwn(q, field), `${where}: missing field ${field}`);
  assert.ok(typeof q.id === 'string' && q.id.trim(), `${where}: invalid ID`);
  assert.ok(!ids.has(q.id), `${where}: duplicate ID`); ids.add(q.id);
  assert.ok(typeof q.question === 'string' && q.question.trim().length >= 12, `${where}: question too short`);
  const normal = q.question.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  assert.ok(!normalizedQuestions.has(normal), `${where}: duplicate normalized question text`); normalizedQuestions.add(normal);
  assert.ok(categories.has(q.category), `${where}: invalid category ${q.category}`);
  assert.ok(difficulties.has(q.difficulty), `${where}: invalid difficulty`);
  for (const field of ['roles','commonMistakes','sourceRefs','tags']) assert.ok(Array.isArray(q[field]), `${where}: ${field} must be an array`);
  assert.ok(q.roles.length > 0, `${where}: roles missing`);
  assert.ok(q.shortAnswer.trim().length >= 10, `${where}: short answer too short`);
  assert.ok(q.explanation.trim().length >= 20, `${where}: explanation too short`);
  assert.ok(q.example.trim().length >= 8, `${where}: example missing`);
  assert.ok(q.followUp.trim().length >= 8, `${where}: follow-up missing`);
  assert.ok(q.commonMistakes.length > 0 && q.commonMistakes.every(x => typeof x === 'string' && x.trim()), `${where}: common mistakes missing`);
  for (const src of q.sourceRefs) assert.ok(sourceIds.has(src), `${where}: unknown source reference ${src}`);
  categoryCounts.set(q.category, (categoryCounts.get(q.category) || 0) + 1);
}

const missingCategories = [...categories].filter(c => !categoryCounts.has(c));
assert.deepEqual(missingCategories, [], `some app categories have no questions: ${missingCategories.join(', ')}`);

// Static JS-to-HTML reference audit; IDs created by the practice/mock templates are whitelisted.
const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
const dynamicIds = new Set(['candidate-answer','question-title','answer-reveal','reveal-answer','chatgpt-feedback','copy-coach-prompt','mark-mastered','mark-review','mock-answer','submit-mock-answer','mock-good','mock-review','mock-chatgpt','mock-review-weak','mock-again','voice-language','voice-status','speak-question','voice-answer','stop-voice','start-topic-path','path-prev','path-next','speak-answer']);
const referencedIds = new Set([...app.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]));
const missingIds = [...referencedIds].filter(id => !htmlIds.has(id) && !dynamicIds.has(id));
assert.deepEqual(missingIds, [], `JavaScript references IDs missing from HTML/templates: ${missingIds.join(', ')}`);

for (const asset of ['./index.html','./style.css','./app.js','./manifest.webmanifest','./icon.svg']) {
  assert.ok(fs.existsSync(path.join(root, asset)), `missing app asset: ${asset}`);
}
assert.ok(fs.existsSync(bankPath), 'question bank must exist in either root or data/');
assert.ok(fs.existsSync(sourcesPath), 'source catalog must exist in either root or data/');
for (const asset of ['./questions.json','./sources.json','./data/questions.json','./data/sources.json']) {
  assert.ok(sw.includes(asset), `service worker must support optional data path ${asset}`);
}

assert.ok(app.includes('interviewQuest.v1'), 'legacy progress migration key should be retained');
assert.ok(app.includes('saveState'), 'local progress persistence should exist');
assert.ok(app.includes('question-search') && app.includes('filter-category') && app.includes('filter-revision'), 'search/filter flows should exist');
assert.ok(app.includes('fetchJsonFromFirstAvailable') && app.includes('./questions.json'), 'loader must support flat GitHub root files as well as /data files');
assert.ok(app.includes('function startGuidedPath') && app.includes('function moveInPath'), 'guided step-by-step learning paths must exist');
assert.ok(app.includes('function startVoiceInput') && app.includes('function speakText'), 'browser voice and read-aloud controls must exist');
assert.ok(html.includes('id="start-guided-path"') && html.includes('id="path-category"'), 'guided path launcher must exist in HTML');
assert.ok(!/sk-[A-Za-z0-9]{20,}/.test(app), 'an apparent API secret must not be committed in frontend code');

console.log(`PASS: ${questions.length} questions; ${categoryCounts.size} categories; ${sourceIds.size} research sources.`);
console.log('PASS: required fields, unique IDs/text, category/difficulty values, examples, follow-ups and source references.');
console.log('PASS: static HTML IDs, expected assets, service-worker cache list and legacy storage migration checks.');
console.log('NOTE: these are content/static checks; they do not prove real-device/browser, GitHub Pages or offline behaviour.');
