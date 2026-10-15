'use strict';

const STORAGE_KEY = 'interviewQuest.v2';
const LEGACY_STORAGE_KEY = 'interviewQuest.v1';
const PAGE_SIZE = 20;
const MAX_LOG = 5000;
const TRACKS = [
  {id:'telephonic',icon:'📞',title:'Telephonic Interview',short:'Recruiter calls, phone screening, notice period and salary.',time:'10 min',description:'Phone par natural conversation, greeting, introduction aur recruiter ke common questions.'},
  {id:'hr',icon:'🤝',title:'HR & Non-Technical',short:'Strengths, job change, teamwork and behavioural questions.',time:'10 min',description:'Honest, structured HR answers with STAR practice and simple English.'},
  {id:'sql',icon:'🗄️',title:'SQL Practice',short:'Queries, joins, aggregation, windows and debugging.',time:'15 min',description:'Practical SQL from basics through entry-level interview scenarios.'},
  {id:'excel',icon:'📈',title:'Excel & MIS',short:'Formulas, PivotTables, reconciliation and reporting.',time:'15 min',description:'Excel interview questions and realistic reporting tasks.'},
  {id:'powerbi',icon:'📊',title:'Power BI',short:'Power Query, data models, DAX and dashboard quality.',time:'15 min',description:'Learn modelling concepts and explain measures with examples.'},
  {id:'birst',icon:'🧩',title:'Infor Birst',short:'Subject areas, attributes, measures, BQL and reports.',time:'15 min',description:'Birst concepts grounded in available Infor documentation.'},
  {id:'python',icon:'🐍',title:'Python & Pandas',short:'Data structures, cleaning, merge, groupby and testing.',time:'15 min',description:'Try code before revealing an explanation and sample solution.'},
  {id:'analytics',icon:'🔎',title:'Data Analysis & Statistics',short:'KPIs, trends, statistics and business cases.',time:'15 min',description:'Explain what data means, not just how to calculate it.'},
  {id:'data-engineering',icon:'⚙️',title:'Junior Data Engineer',short:'ETL/ELT, pipelines, idempotency and data quality.',time:'15 min',description:'Entry-level data pipeline concepts and troubleshooting.'},
  {id:'ba-mis',icon:'📝',title:'Business Analyst & MIS',short:'Requirements, acceptance criteria and report quality.',time:'15 min',description:'Translate business needs into testable reports and metrics.'},
  {id:'english',icon:'🗣️',title:'English & Confidence',short:'Simple English answers and polite clarification phrases.',time:'5–10 min',description:'Build interview speaking confidence without memorising scripts.'},
  {id:'resume-project',icon:'🧾',title:'Resume & Portfolio',short:'Explain your actual role and portfolio honestly.',time:'10 min',description:'Practice project deep dives without fabricated metrics or experience.'}
];

let questions = [];
let sources = [];
let questionsById = new Map();
let state = loadState();
let currentQuestionId = null;
let returnTab = 'bank';
let visibleLimit = PAGE_SIZE;
let mockSession = null;
let toastTimer = null;

function emptyState() {
  return {version:2, practiceLog:[], lifetimeXp:0, activityDates:[], attempts:{}, bookmarks:[], dailyGoal:5, theme:'dark', mockHistory:[]};
}
function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (parsed && parsed.version === 2) return sanitizeState(parsed);
  } catch (_) { /* Continue to legacy migration/defaults. */ }
  try {
    const old = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || 'null');
    if (old && Array.isArray(old.sessions)) {
      const migrated = emptyState();
      migrated.practiceLog = old.sessions.filter(s => s && typeof s.date === 'string').map((s, i) => ({
        id:`legacy-${i}-${String(s.date)}`, date:s.date, at:s.at || `${s.date}T12:00:00.000Z`,
        questionId:null, moduleId:typeof s.moduleId === 'string' ? s.moduleId : null,
        status:'legacy-complete', xp:Number.isFinite(Number(s.xp)) ? Number(s.xp) : 10, legacy:true
      })).slice(-MAX_LOG);
      migrated.lifetimeXp = migrated.practiceLog.reduce((sum,x)=>sum+(Number(x.xp)||0),0);
      migrated.activityDates = [...new Set(migrated.practiceLog.map(x=>x.date))].sort();
      return migrated;
    }
  } catch (_) { /* Corrupt legacy state is ignored, not fatal. */ }
  return emptyState();
}
function sanitizeState(raw) {
  const base = emptyState();
  const validLog = Array.isArray(raw.practiceLog) ? raw.practiceLog.filter(x => x && typeof x.date === 'string') : [];
  const attempts = raw.attempts && typeof raw.attempts === 'object' && !Array.isArray(raw.attempts) ? raw.attempts : {};
  base.practiceLog = validLog.slice(-MAX_LOG).map((x, i) => ({
    id: typeof x.id === 'string' ? x.id : `import-${i}-${x.date}`,
    date: String(x.date).slice(0,10), at: typeof x.at === 'string' ? x.at : `${String(x.date).slice(0,10)}T12:00:00.000Z`,
    questionId: typeof x.questionId === 'string' ? x.questionId : null,
    moduleId: typeof x.moduleId === 'string' ? x.moduleId : null,
    status: ['mastered','review','legacy-complete'].includes(x.status) ? x.status : 'review',
    xp: Math.max(0, Math.min(10, Number(x.xp) || 0)), legacy: Boolean(x.legacy)
  }));
  base.lifetimeXp = Number.isFinite(Number(raw.lifetimeXp)) && Number(raw.lifetimeXp) >= 0 ? Number(raw.lifetimeXp) : base.practiceLog.reduce((sum,x)=>sum+(Number(x.xp)||0),0);
  const rawDates = Array.isArray(raw.activityDates) ? raw.activityDates.filter(d=>typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) : base.practiceLog.map(x=>x.date);
  base.activityDates = [...new Set(rawDates)].sort().slice(-10000);
  base.attempts = {};
  for (const [id, a] of Object.entries(attempts)) {
    if (!a || typeof a !== 'object') continue;
    base.attempts[id] = {
      status: a.status === 'mastered' ? 'mastered' : 'review',
      lastAttemptDate: typeof a.lastAttemptDate === 'string' ? a.lastAttemptDate.slice(0,10) : '',
      attemptCount: Math.max(1, Math.min(100000, Number(a.attemptCount) || 1))
    };
  }
  base.bookmarks = Array.isArray(raw.bookmarks) ? [...new Set(raw.bookmarks.filter(x => typeof x === 'string'))] : [];
  base.dailyGoal = [3,5,8,10].includes(Number(raw.dailyGoal)) ? Number(raw.dailyGoal) : 5;
  base.theme = raw.theme === 'light' ? 'light' : 'dark';
  base.mockHistory = Array.isArray(raw.mockHistory) ? raw.mockHistory.filter(x => x && typeof x.date === 'string').slice(-100) : [];
  return base;
}
function saveState(quiet = false) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch (_) { if (!quiet) showToast('Browser storage full/unavailable. Export a backup or free some space.'); return false; }
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function getTrack(id) { return TRACKS.find(t => t.id === id) || TRACKS[0]; }
function getAttemptCount() { return Object.keys(state.attempts).filter(id => questionsById.has(id)).length; }
function getMasteredCount() { return Object.entries(state.attempts).filter(([id,a]) => questionsById.has(id) && a.status === 'mastered').length; }
function getRevisionIds() { return Object.entries(state.attempts).filter(([id,a]) => questionsById.has(id) && a.status === 'review').map(([id]) => id); }
function getXp() { return Number(state.lifetimeXp) || 0; }
function getStreak() {
  const days = new Set([...(state.activityDates || []), ...state.practiceLog.map(x => x.date)]);
  if (!days.size) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate()-1);
  let cursor = days.has(dateKey(today)) ? today : (days.has(dateKey(yesterday)) ? yesterday : null);
  if (!cursor) return 0;
  let count = 0;
  while (days.has(dateKey(cursor))) { count++; cursor.setDate(cursor.getDate()-1); }
  return count;
}
function attemptsToday() { const today = dateKey(); return new Set(state.practiceLog.filter(x => x.date === today && x.questionId).map(x => x.questionId)).size; }
function attemptedToday(qid) { return state.practiceLog.some(x => x.date === dateKey() && x.questionId === qid); }
function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2700);
}
function addAttempt(question, status, source = 'practice') {
  const id = question.id;
  const today = dateKey();
  const alreadyEarned = attemptedToday(id);
  const xp = alreadyEarned ? 0 : 10;
  const previous = state.attempts[id];
  state.attempts[id] = {status, lastAttemptDate:today, attemptCount:(previous?.attemptCount || 0) + 1};
  state.practiceLog.push({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,date:today,at:new Date().toISOString(),questionId:id,moduleId:question.category,status,xp,source});
  if (state.practiceLog.length > MAX_LOG) state.practiceLog = state.practiceLog.slice(-MAX_LOG);
  state.lifetimeXp = (Number(state.lifetimeXp) || 0) + xp;
  state.activityDates = [...new Set([...(state.activityDates || []), today])].sort().slice(-10000);
  const persisted = saveState(true);
  return {xp, persisted};
}
function trackIcon(id) { return getTrack(id).icon; }
function sourceById(id) { return sources.find(s => s.id === id); }
function fillBankFilters() {
  const category = document.getElementById('filter-category');
  const categoryKeep = category.value;
  category.innerHTML = '<option value="">All categories</option>' + TRACKS.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join('');
  category.value = TRACKS.some(t => t.id === categoryKeep) ? categoryKeep : '';
  const types = [...new Set(questions.map(q => q.type))].sort();
  const type = document.getElementById('filter-type'); const typeKeep = type.value;
  type.innerHTML = '<option value="">All types</option>' + types.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(labelize(v))}</option>`).join('');
  type.value = types.includes(typeKeep) ? typeKeep : '';
  const roles = [...new Set(questions.flatMap(q => q.roles))].filter(r => r !== 'All target roles').sort();
  const role = document.getElementById('filter-role'); const roleKeep = role.value;
  role.innerHTML = '<option value="">All roles</option>' + roles.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  role.value = roles.includes(roleKeep) ? roleKeep : '';
}
function labelize(text) { return String(text).replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function moduleCard(track) {
  const count = questions.filter(q => q.category === track.id).length;
  const tried = questions.filter(q => q.category === track.id && state.attempts[q.id]).length;
  return `<button class="module-card" type="button" data-category="${track.id}" aria-label="Open ${escapeHtml(track.title)} questions"><div class="module-top"><span class="module-icon" aria-hidden="true">${track.icon}</span><span class="module-time">${track.time}</span></div><h3>${escapeHtml(track.title)}</h3><p>${escapeHtml(track.short)}</p><div class="module-bottom"><span>${count} questions · ${tried} tried</span><span aria-hidden="true">→</span></div></button>`;
}
function renderHome() {
  document.getElementById('bank-count').textContent = `${questions.length} questions`;
  document.getElementById('home-xp').textContent = `${getXp()} XP`;
  document.getElementById('home-streak').textContent = `${getStreak()} ${getStreak() === 1 ? 'day' : 'days'}`;
  document.getElementById('home-mastered').textContent = `${getMasteredCount()}`;
  document.getElementById('home-modules').innerHTML = TRACKS.slice(0,4).map(moduleCard).join('');
  const q = questions.find(x => !state.attempts[x.id]) || questions[0];
  document.getElementById('start-today').innerHTML = `Start today's mission <span aria-hidden="true">→</span>`;
  document.getElementById('next-step-title').textContent = getRevisionIds().length ? 'Revise one weak question' : (q ? `Next: ${getTrack(q.category).title}` : 'Keep practising');
  document.getElementById('next-step-copy').textContent = getRevisionIds().length ? 'A short repeat session is better than rereading everything. Try to answer before opening the explanation.' : 'Answer a question in your own words, reveal the model answer, and mark your self-review.';
  document.getElementById('continue-learning').textContent = getRevisionIds().length ? 'Revise a weak question →' : 'Continue learning →';
  const done = attemptsToday(), goal = state.dailyGoal;
  document.getElementById('daily-done').textContent = `${Math.min(done,goal)} / ${goal}`;
  document.getElementById('daily-progress').style.width = `${Math.min(100, done / goal * 100)}%`;
}
function renderTracks(filter = '') {
  const needle = filter.trim().toLowerCase();
  const filtered = TRACKS.filter(t => `${t.title} ${t.short} ${t.description}`.toLowerCase().includes(needle));
  document.getElementById('all-modules').innerHTML = filtered.map(moduleCard).join('');
  document.getElementById('module-no-results').classList.toggle('hidden', filtered.length > 0);
}
function questionCard(q) {
  const attempted = state.attempts[q.id];
  const status = attempted ? (attempted.status === 'mastered' ? 'Understood' : 'Needs revision') : 'Not attempted';
  const bookmarked = state.bookmarks.includes(q.id);
  return `<article class="question-result"><div class="question-result-main"><button class="question-open" type="button" data-question="${q.id}">${escapeHtml(q.question)}</button><div class="chips"><span class="chip accent">${escapeHtml(getTrack(q.category).title)}</span><span class="chip">${escapeHtml(q.difficulty)}</span><span class="chip">${escapeHtml(labelize(q.type))}</span><span class="chip">${escapeHtml(status)}</span></div><p>${escapeHtml(q.shortAnswer)}</p></div><button class="icon-button bookmark-toggle" type="button" data-bookmark="${q.id}" aria-label="${bookmarked ? 'Remove bookmark' : 'Bookmark question'}" title="${bookmarked ? 'Remove bookmark' : 'Bookmark question'}">${bookmarked ? '★' : '☆'}</button></article>`;
}
function applyFilters() {
  const search = document.getElementById('question-search').value.trim().toLowerCase();
  const cat = document.getElementById('filter-category').value;
  const diff = document.getElementById('filter-difficulty').value;
  const type = document.getElementById('filter-type').value;
  const role = document.getElementById('filter-role').value;
  const onlyBookmarks = document.getElementById('filter-bookmarks').checked;
  const onlyRevision = document.getElementById('filter-revision').checked;
  const onlyUnseen = document.getElementById('filter-unseen').checked;
  let found = questions.filter(q => {
    if (cat && q.category !== cat) return false;
    if (diff && q.difficulty !== diff) return false;
    if (type && q.type !== type) return false;
    if (role && !q.roles.includes(role) && !q.roles.includes('All target roles')) return false;
    if (onlyBookmarks && !state.bookmarks.includes(q.id)) return false;
    if (onlyRevision && state.attempts[q.id]?.status !== 'review') return false;
    if (onlyUnseen && state.attempts[q.id]) return false;
    if (search) {
      const haystack = [q.question,q.shortAnswer,q.explanation,q.example,q.category,q.subcategory,q.difficulty,q.type,...q.tags,...q.roles].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
  const sort = document.getElementById('sort-questions').value;
  const levels = {Beginner:1,Intermediate:2,Advanced:3};
  if (sort === 'easy') found.sort((a,b) => levels[a.difficulty]-levels[b.difficulty] || a.id.localeCompare(b.id));
  else if (sort === 'hard') found.sort((a,b) => levels[b.difficulty]-levels[a.difficulty] || a.id.localeCompare(b.id));
  else if (sort === 'unseen') found.sort((a,b) => Number(Boolean(state.attempts[a.id]))-Number(Boolean(state.attempts[b.id])) || a.id.localeCompare(b.id));
  else if (sort === 'relevance' && search) {
    const tokens = search.split(/\s+/).filter(Boolean);
    const score = q => {
      const question = String(q.question || '').toLowerCase();
      const title = `${q.category} ${q.subcategory} ${q.tags.join(' ')}`.toLowerCase();
      const body = `${q.shortAnswer} ${q.explanation} ${q.example} ${q.roles.join(' ')}`.toLowerCase();
      return tokens.reduce((n,t) => n + (question.includes(t) ? 5 : 0) + (title.includes(t) ? 3 : 0) + (body.includes(t) ? 1 : 0), 0);
    };
    found.sort((a,b) => score(b)-score(a) || a.id.localeCompare(b.id));
  } else if (!search) found.sort((a,b) => a.id.localeCompare(b.id));
  return found;
}
function renderQuestionBank(reset = true) {
  if (reset) visibleLimit = PAGE_SIZE;
  const found = applyFilters();
  const toShow = found.slice(0,visibleLimit);
  document.getElementById('question-results-count').textContent = `${found.length} question${found.length === 1 ? '' : 's'} found`;
  document.getElementById('question-results').innerHTML = toShow.map(questionCard).join('');
  document.getElementById('question-no-results').classList.toggle('hidden', found.length > 0);
  document.getElementById('load-more').classList.toggle('hidden', found.length <= visibleLimit);
  document.getElementById('load-more').textContent = `Load more (${Math.min(PAGE_SIZE,found.length-visibleLimit)} next)`;
}
function sourcesFor(q) { return (q.sourceRefs || []).map(sourceById).filter(Boolean); }
function renderQuestion(qid, tab = 'bank') {
  const q = questionsById.get(qid);
  if (!q) { showToast('Question nahi mila. Question bank refresh karke try karo.'); showTab('bank'); return; }
  currentQuestionId = q.id; returnTab = tab;
  const attempted = state.attempts[q.id];
  const savedStatus = attempted ? (attempted.status === 'mastered' ? 'Marked understood' : 'Saved for revision') : 'Not attempted yet';
  const bookmarked = state.bookmarks.includes(q.id);
  const srcLinks = sourcesFor(q).map(s => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)} ↗</a>`).join('<span class="source-separator"> · </span>');
  const code = q.sampleCode ? `<h3>Sample code/query</h3><pre><code>${escapeHtml(q.sampleCode)}</code></pre>` : '';
  const mistakes = (q.commonMistakes || []).map(x => escapeHtml(x)).map(x => `<li>${x}</li>`).join('');
  document.getElementById('question-detail').innerHTML = `
    <div class="question-head"><div class="row-between"><span class="question-id">${escapeHtml(q.id.toUpperCase())} · ${escapeHtml(savedStatus)}</span><button class="icon-button bookmark-toggle" type="button" data-bookmark="${q.id}" aria-label="${bookmarked?'Remove bookmark':'Bookmark question'}">${bookmarked?'★':'☆'}</button></div><div class="chips"><span class="chip accent">${escapeHtml(getTrack(q.category).title)}</span><span class="chip">${escapeHtml(q.difficulty)}</span><span class="chip">${escapeHtml(labelize(q.type))}</span></div><h1 id="question-title">${escapeHtml(q.question)}</h1><p class="muted-copy">Relevant roles: ${escapeHtml(q.roles.join(', '))}</p></div>
    <div class="answer-box"><label for="candidate-answer">Your answer (Hindi, Hinglish or English is okay)</label><textarea id="candidate-answer" placeholder="Pehle apna answer khud try karo…" rows="5" spellcheck="true" autocomplete="off"></textarea><p class="answer-hint">Answer is not saved to your history by default. Only your attempt status is saved on this device.</p></div>
    <div class="answer-actions"><button id="reveal-answer" class="btn btn-secondary" type="button">Reveal sample answer</button><button id="chatgpt-feedback" class="btn btn-primary" type="button">Ask ChatGPT for feedback ↗</button><button id="copy-coach-prompt" class="btn btn-secondary" type="button">Copy coach prompt</button></div>
    <div id="answer-reveal" class="answer-reveal hidden"><span class="score-pill">Model answer · Review, not a guaranteed only answer</span><h2>Short answer</h2><p>${escapeHtml(q.shortAnswer)}</p><h2>Explanation</h2><p>${escapeHtml(q.explanation)}</p><h3>Practical example</h3><p>${escapeHtml(q.example)}</p>${code}<h3>Common mistakes to avoid</h3><ul>${mistakes}</ul><h3>Interviewer follow-up</h3><p>${escapeHtml(q.followUp)}</p><h3>Suggested answer structure</h3><p>${escapeHtml(q.answerStructure)}</p>${srcLinks ? `<h3>References</h3><p class="reference-links">${srcLinks}</p>` : ''}
      <div class="note-box">Offline practice does not automatically grade free-text answers. Compare your attempt with this guide. Use the ChatGPT button for optional external feedback.</div>
      <div class="quality-actions"><button id="mark-mastered" class="btn btn-mint" type="button">I understand this (+10 XP once/day)</button><button id="mark-review" class="btn btn-secondary" type="button">Needs revision (+10 XP once/day)</button></div>
    </div>
    <div class="plain-note">Source handling: content is a learning guide, not a claim that this exact wording is frequently asked. Use follow-up questions to check real understanding.</div>`;
  showTab('question');
  document.getElementById('reveal-answer').addEventListener('click', () => {
    document.getElementById('answer-reveal').classList.remove('hidden');
    document.getElementById('reveal-answer').textContent = 'Sample answer shown';
    document.getElementById('answer-reveal').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  document.getElementById('chatgpt-feedback').addEventListener('click', () => openChatGPT(q, document.getElementById('candidate-answer').value));
  document.getElementById('copy-coach-prompt').addEventListener('click', () => copyText(coachPrompt(q, document.getElementById('candidate-answer').value)));
  document.getElementById('mark-mastered').addEventListener('click', () => markQuestion(q,'mastered'));
  document.getElementById('mark-review').addEventListener('click', () => markQuestion(q,'review'));
}
function coachPrompt(q, draft = '') {
  const base = `TUM MERE PERSONAL INTERVIEW COACH HO. Main Data Analyst / BI Analyst / MIS / Junior Data Engineer interviews ki practice kar raha hoon. Simple Hindi/Hinglish mein feedback do aur natural, easy English sample answer do. Fake experience, metrics ya projects invent mat karna. Ek waqt par ek hi follow-up poochhna.\n\nInterview question: ${q.question}\n\nExpected key points for the coach (do not blindly force one wording): ${q.shortAnswer}\n\nExplanation/context: ${q.explanation}\n\n`; 
  if (draft.trim()) return `${base}Mera answer:\n${draft.trim()}\n\nMere answer ko 10 mein se score karo, kya sahi tha batao, missing points simple Hindi mein samjhao, phir mera answer natural easy English mein improve karo. Mere real facts ko change mat karna.`;
  return `${base}Ab yahi question mujhse interviewer ki tarah poochho aur mere jawab ka wait karo. Correct answer pehle mat dikhana.`;
}
function openChatGPT(q, draft = '') {
  const url = `https://chatgpt.com/?q=${encodeURIComponent(coachPrompt(q,draft))}`;
  const opened = window.open(url,'_blank','noopener,noreferrer');
  if (!opened) showToast('Popup blocked ho sakta hai. Copy coach prompt use karo.');
  else showToast('ChatGPT separate tab mein khulega. Prefill na ho toh prompt copy karke paste karo.');
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); showToast('Prompt copied. ChatGPT chat mein paste kar do.'); }
  catch (_) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly','');
    Object.assign(ta.style,{position:'fixed',opacity:'0',left:'-9999px',top:'0'}); document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) { ok = false; } ta.remove();
    showToast(ok ? 'Prompt copied. ChatGPT mein paste kar do.' : 'Copy automatically nahi hua. Long-press karke select/copy karo.');
  }
}
function markQuestion(q,status,source='practice') {
  const answer = document.getElementById('candidate-answer')?.value?.trim() || '';
  if (answer.length < 5) { showToast('Pehle apna answer likho — stuck ho toh “I am not sure yet” bhi likh sakte ho.'); document.getElementById('candidate-answer')?.focus(); return; }
  const result = addAttempt(q,status,source);
  renderAll();
  const reveal = document.getElementById('answer-reveal');
  if (reveal) reveal.classList.remove('hidden');
  renderQuestion(q.id,returnTab);
  document.getElementById('answer-reveal')?.classList.remove('hidden');
  showToast(!result.persisted ? 'Browser storage failed. Your attempt may not survive a refresh; export a backup if available.' : (status === 'mastered' ? `Saved as understood. +${result.xp} XP${result.xp===0?' (already earned today)':''}.` : `Saved for revision. +${result.xp} XP${result.xp===0?' (already earned today)':''}.`));
  showTab('question');
}
function toggleBookmark(id) {
  if (!questionsById.has(id)) return;
  if (state.bookmarks.includes(id)) { state.bookmarks = state.bookmarks.filter(x => x !== id); showToast('Bookmark removed.'); }
  else { state.bookmarks.push(id); showToast('Question bookmarked.'); }
  const persisted = saveState(true); if(!persisted) showToast('Bookmark changed for this session, but browser storage failed.'); renderHome(); renderTracks(document.getElementById('module-search').value); renderQuestionBank(false); renderProgress();
  if (currentQuestionId === id && document.getElementById('question-view').classList.contains('active')) renderQuestion(id,returnTab);
}
function openCategory(id) {
  showTab('bank'); document.getElementById('filter-category').value = TRACKS.some(t => t.id === id) ? id : '';
  document.getElementById('question-search').value = ''; document.getElementById('filter-bookmarks').checked = false; document.getElementById('filter-revision').checked = false; document.getElementById('filter-unseen').checked = false;
  renderQuestionBank();
}
function chooseNextQuestion() {
  const review = getRevisionIds().map(id => questionsById.get(id)).filter(Boolean);
  if (review.length) return review[Math.floor(Math.random()*review.length)];
  const unseen = questions.filter(q => !state.attempts[q.id]);
  return (unseen.length ? unseen : questions)[0] || null;
}
function renderProgress() {
  document.getElementById('progress-xp').textContent = `${getXp()} XP`;
  document.getElementById('progress-attempts').textContent = `${getAttemptCount()}`;
  document.getElementById('progress-review').textContent = `${getRevisionIds().length}`;
  document.getElementById('progress-streak').textContent = `${getStreak()} ${getStreak()===1?'day':'days'}`;
  const goal = state.dailyGoal, done = attemptsToday();
  document.getElementById('progress-goal').textContent = `${Math.min(done,goal)} / ${goal}`;
  document.getElementById('progress-goal-bar').style.width = `${Math.min(100,done/goal*100)}%`;
  document.getElementById('daily-goal-setting').value = String(goal);
  document.getElementById('progress-by-track').innerHTML = TRACKS.map(t => {
    const qs = questions.filter(q => q.category === t.id); const tried=qs.filter(q=>state.attempts[q.id]).length; const mastered=qs.filter(q=>state.attempts[q.id]?.status==='mastered').length; const review=qs.filter(q=>state.attempts[q.id]?.status==='review').length;
    const percent = qs.length ? Math.round(tried/qs.length*100) : 0;
    return `<div class="progress-row"><span class="row-icon" aria-hidden="true">${t.icon}</span><div class="row-main"><strong>${escapeHtml(t.title)}</strong><small>${tried}/${qs.length} tried · ${mastered} understood · ${review} to revise</small><div class="progress-track"><span style="width:${percent}%"></span></div></div><span class="row-count">${percent}%</span></div>`;
  }).join('');
  const recent = state.practiceLog.filter(x=>x.questionId && questionsById.has(x.questionId)).slice(-10).reverse();
  document.getElementById('recent-attempts').innerHTML = recent.length ? recent.map(x => {const q=questionsById.get(x.questionId); return `<div class="progress-row"><span class="row-icon">${x.status==='mastered'?'✓':'↻'}</span><div class="row-main"><strong><button type="button" class="inline-question-link" data-question="${q.id}">${escapeHtml(q.question)}</button></strong><small>${escapeHtml(x.date)} · ${x.status==='mastered'?'Understood':'Needs revision'} · +${Number(x.xp)||0} XP</small></div></div>`;}).join('') : '<p class="empty-state">Abhi attempts nahi hain. Question bank se easy question choose karo.</p>';
}
function renderSources() {
  document.getElementById('source-list').innerHTML = sources.map(s => `<div class="source-item"><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)} ↗</a><p><strong>${escapeHtml(s.publisher)}</strong> · ${escapeHtml(s.use)}<br>${escapeHtml(s.note || '')}</p></div>`).join('');
}
function showTab(tab) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`${tab}-view`); if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active',b.dataset.tab===tab));
  if (tab === 'practice') renderTracks(document.getElementById('module-search').value);
  if (tab === 'bank') renderQuestionBank();
  if (tab === 'progress') renderProgress();
  window.scrollTo({top:0,behavior:'smooth'});
}
function startMock() {
  const mode = document.getElementById('mock-mode').value;
  const length = Number(document.getElementById('mock-length').value) || 8;
  let pool = mode === 'mixed' ? questions.slice() : questions.filter(q => q.category === mode);
  if (pool.length < 1) { showToast('Is mode ke liye question available nahi.'); return; }
  // Prefer questions not attempted recently, then fill from remaining distinct questions.
  const fresh = pool.filter(q => !state.attempts[q.id]);
  const old = pool.filter(q => state.attempts[q.id]);
  const shuffle = arr => arr.map(v=>({v,k:Math.random()})).sort((a,b)=>a.k-b.k).map(x=>x.v);
  pool = [...shuffle(fresh),...shuffle(old)].slice(0,Math.min(length,pool.length));
  mockSession = {mode,questions:pool,index:0,awaitingRating:false,answers:[],ratings:[]};
  document.getElementById('mock-setup').classList.add('hidden'); document.getElementById('mock-results').classList.add('hidden'); document.getElementById('mock-stage').classList.remove('hidden');
  renderMockStage();
}
function renderMockStage() {
  if (!mockSession) return;
  const {questions: list,index,awaitingRating,answers} = mockSession;
  if (index >= list.length) { finishMock(); return; }
  const q = list[index];
  const pct = Math.round(index/list.length*100);
  if (!awaitingRating) {
    document.getElementById('mock-stage').innerHTML = `<div class="panel mock-question"><div class="mock-question-number">QUESTION ${index+1} OF ${list.length}</div><div class="progress-track mock-progress"><span style="width:${pct}%"></span></div><div class="chips"><span class="chip accent">${escapeHtml(getTrack(q.category).title)}</span><span class="chip">${escapeHtml(q.difficulty)}</span></div><h2>${escapeHtml(q.question)}</h2><div class="answer-box"><label for="mock-answer">Your answer</label><textarea id="mock-answer" rows="5" placeholder="Interview mein jaise answer dete, waise likho…"></textarea></div><p class="muted-copy">Sample answer answer-submit karne ke baad hi show hoga. Take a breath and try.</p><button id="submit-mock-answer" class="btn btn-primary btn-wide" type="button">Submit answer →</button></div>`;
    document.getElementById('submit-mock-answer').addEventListener('click', () => {
      const answer = document.getElementById('mock-answer').value.trim();
      if (answer.length < 5) { showToast('Pehle apna answer likho. “I am not sure yet” bhi acceptable hai.'); document.getElementById('mock-answer').focus(); return; }
      mockSession.answers[index] = answer; mockSession.awaitingRating = true; renderMockStage();
    });
  } else {
    document.getElementById('mock-stage').innerHTML = `<div class="panel mock-question"><div class="mock-question-number">REVIEW ${index+1} OF ${list.length}</div><div class="progress-track mock-progress"><span style="width:${Math.round((index+1)/list.length*100)}%"></span></div><h2>${escapeHtml(q.question)}</h2><div class="mock-feedback"><h3>Model answer</h3><p>${escapeHtml(q.shortAnswer)}</p><p>${escapeHtml(q.explanation)}</p>${q.sampleCode?`<pre><code>${escapeHtml(q.sampleCode)}</code></pre>`:''}<p><strong>Example:</strong> ${escapeHtml(q.example)}</p><p><strong>Follow-up:</strong> ${escapeHtml(q.followUp)}</p></div><p class="muted-copy">Self-review only: choose whether your answer covered the key points. This score is not an AI judgement.</p><div class="quality-actions"><button id="mock-good" class="btn btn-mint" type="button">I covered the key points</button><button id="mock-review" class="btn btn-secondary" type="button">I need to revise</button><button id="mock-chatgpt" class="btn btn-secondary" type="button">Ask ChatGPT ↗</button></div></div>`;
    document.getElementById('mock-good').addEventListener('click',()=>rateMock('mastered'));
    document.getElementById('mock-review').addEventListener('click',()=>rateMock('review'));
    document.getElementById('mock-chatgpt').addEventListener('click',()=>openChatGPT(q,mockSession.answers[index]||''));
  }
}
function rateMock(status) {
  const q = mockSession.questions[mockSession.index];
  const result = addAttempt(q,status,'mock');
  mockSession.ratings.push({questionId:q.id,status,xp:result.xp});
  mockSession.index++; mockSession.awaitingRating=false; renderAll(); renderMockStage();
  if(!result.persisted) showToast('Browser storage failed. Mock progress may not survive refresh.');
}
function finishMock() {
  const total = mockSession.questions.length, good = mockSession.ratings.filter(x=>x.status==='mastered').length;
  const pct = total ? Math.round(good/total*100) : 0;
  state.mockHistory.push({date:dateKey(),mode:mockSession.mode,total,good,percent:pct}); state.mockHistory=state.mockHistory.slice(-100); saveState(true);
  document.getElementById('mock-stage').classList.add('hidden'); document.getElementById('mock-results').classList.remove('hidden');
  document.getElementById('mock-results').innerHTML = `<div class="panel"><p class="kicker">SESSION COMPLETE</p><h2>${escapeHtml(labelize(mockSession.mode))} mock interview finished</h2><strong class="big-stat">${good} / ${total}</strong><p>${pct}% self-rated as understood. This is a reflection score, not an automatic assessment of answer quality.</p><div class="progress-track"><span style="width:${pct}%"></span></div><p class="muted-copy">Review the questions marked for revision. Repeating a question on the same day does not award extra XP.</p><div class="button-row"><button id="mock-review-weak" class="btn btn-secondary" type="button">Review weak questions</button><button id="mock-again" class="btn btn-primary" type="button">Start another mock</button></div></div>`;
  document.getElementById('mock-review-weak').addEventListener('click',()=>{showTab('bank');document.getElementById('filter-revision').checked=true;document.getElementById('filter-category').value='';renderQuestionBank();});
  document.getElementById('mock-again').addEventListener('click',()=>{mockSession=null;document.getElementById('mock-results').classList.add('hidden');document.getElementById('mock-setup').classList.remove('hidden');});
  mockSession=null; renderProgress();
}
function exportBackup(filename = 'interview-quest-backup.json') {
  const bundle = {app:'Interview Quest',backupVersion:2,exportedAt:new Date().toISOString(),state};
  const blob = new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast('Backup downloaded. Keep it somewhere safe.');
}
function handleImport(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onerror = () => showToast('File read nahi ho saka.');
  reader.onload = () => {
    try {
      const bundle = JSON.parse(String(reader.result));
      const candidate = bundle && bundle.state ? bundle.state : bundle;
      if (!candidate || !Array.isArray(candidate.practiceLog) || typeof candidate !== 'object') throw new Error('Invalid backup format');
      const clean = sanitizeState(candidate);
      clean.bookmarks = clean.bookmarks.filter(id => questionsById.has(id));
      for (const id of Object.keys(clean.attempts)) if (!questionsById.has(id)) delete clean.attempts[id];
      if (!confirm('Import karne se current local practice history replace ho jayegi. Current state ka backup abhi download karna hai?')) return;
      exportBackup('interview-quest-before-import.json');
      state = clean;
      saveState(); applyTheme(); renderAll(); renderProgress(); showToast('Backup import ho gaya. Imported question IDs that are not in this build were skipped.');
    } catch (err) { showToast(`Backup file invalid hai: ${err.message}`); }
    finally { document.getElementById('import-file').value=''; }
  };
  reader.readAsText(file);
}
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.getElementById('theme-toggle').textContent = state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}
function resetProgress() {
  if (!state.practiceLog.length && !Object.keys(state.attempts).length && !state.bookmarks.length) { showToast('Reset karne ke liye progress nahi hai.'); return; }
  if (!confirm('Kya tum bookmarks, XP, attempts aur mock history reset karna chahte ho? Pehle Export backup kar sakte ho.')) return;
  state.practiceLog=[]; state.lifetimeXp=0; state.activityDates=[]; state.attempts={}; state.bookmarks=[]; state.mockHistory=[];
  saveState(); renderAll(); renderProgress(); showToast('Progress reset ho gayi. Fresh start!');
}
function validateQuestionBank(items) {
  const errors=[]; const required=['id','category','subcategory','question','difficulty','roles','type','shortAnswer','explanation','example','sampleCode','commonMistakes','followUp','answerStructure','sourceRefs','tags','revisionStatus'];
  if (!Array.isArray(items) || !items.length) return ['Question bank empty or not an array.'];
  const ids=new Set(), questionsNorm=new Set();
  items.forEach((q,i)=>{
    const prefix=`row ${i+1}`;
    for (const key of required) if (!(key in q)) errors.push(`${prefix}: missing ${key}`);
    if (ids.has(q.id)) errors.push(`${prefix}: duplicate ID ${q.id}`); ids.add(q.id);
    const norm=String(q.question||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    if (questionsNorm.has(norm)) errors.push(`${prefix}: duplicate question text`); questionsNorm.add(norm);
    if (!TRACKS.some(t=>t.id===q.category)) errors.push(`${prefix}: unknown category ${q.category}`);
    if (!['Beginner','Intermediate','Advanced'].includes(q.difficulty)) errors.push(`${prefix}: invalid difficulty`);
    if (!Array.isArray(q.roles)||!Array.isArray(q.commonMistakes)||!Array.isArray(q.sourceRefs)||!Array.isArray(q.tags)) errors.push(`${prefix}: expected array fields`);
    if (!String(q.shortAnswer||'').trim() || !String(q.explanation||'').trim()) errors.push(`${prefix}: missing answer/explanation`);
  });
  return errors;
}
async function init() {
  try {
    const [qResponse,sResponse] = await Promise.all([fetch('./data/questions.json',{cache:'no-cache'}),fetch('./data/sources.json',{cache:'no-cache'})]);
    if (!qResponse.ok) throw new Error(`Question bank load failed (${qResponse.status})`);
    if (!sResponse.ok) throw new Error(`Research sources load failed (${sResponse.status})`);
    const qJson = await qResponse.json(); sources = await sResponse.json();
    questions = Array.isArray(qJson.questions) ? qJson.questions : [];
    const errors = validateQuestionBank(questions);
    if (errors.length) throw new Error(`Question bank validation failed: ${errors.slice(0,5).join('; ')}`);
    questionsById = new Map(questions.map(q=>[q.id,q]));
    state.bookmarks = state.bookmarks.filter(id=>questionsById.has(id));
    for (const id of Object.keys(state.attempts)) if (!questionsById.has(id)) delete state.attempts[id];
    fillBankFilters(); applyTheme(); renderAll(); renderSources(); saveState(true);
    document.getElementById('bank-count').textContent = `${questions.length} questions`;
    const top = questions[0]; if (top) document.getElementById('start-today').addEventListener('click',()=>renderQuestion(chooseNextQuestion()?.id || top.id,'home'));
    document.getElementById('start-random').addEventListener('click',()=>{const q=questions[Math.floor(Math.random()*questions.length)];if(q)renderQuestion(q.id,'home');});
    document.getElementById('continue-learning').addEventListener('click',()=>{const q=chooseNextQuestion();if(q)renderQuestion(q.id,'home');});
    document.getElementById('back-from-question').addEventListener('click',()=>showTab(returnTab));
    document.getElementById('module-search').addEventListener('input',e=>renderTracks(e.target.value));
    document.getElementById('question-search').addEventListener('input',()=>renderQuestionBank());
    ['filter-category','filter-difficulty','filter-type','filter-role','sort-questions','filter-bookmarks','filter-revision','filter-unseen'].forEach(id=>document.getElementById(id).addEventListener('change',()=>renderQuestionBank()));
    document.getElementById('clear-filters').addEventListener('click',()=>{document.getElementById('question-search').value='';['filter-category','filter-difficulty','filter-type','filter-role'].forEach(id=>document.getElementById(id).value='');['filter-bookmarks','filter-revision','filter-unseen'].forEach(id=>document.getElementById(id).checked=false);document.getElementById('sort-questions').value='relevance';renderQuestionBank();});
    document.getElementById('load-more').addEventListener('click',()=>{visibleLimit+=PAGE_SIZE;renderQuestionBank(false);});
    document.getElementById('begin-mock').addEventListener('click',startMock);
    document.getElementById('daily-goal-setting').addEventListener('change',e=>{state.dailyGoal=[3,5,8,10].includes(Number(e.target.value))?Number(e.target.value):5;saveState();renderHome();renderProgress();});
    document.getElementById('theme-toggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';applyTheme();saveState();});
    document.getElementById('export-data').addEventListener('click',()=>exportBackup());
    document.getElementById('import-file').addEventListener('change',e=>handleImport(e.target.files?.[0]));
    document.getElementById('reset-progress').addEventListener('click',resetProgress);
    document.addEventListener('click',e=>{
      const tab=e.target.closest('[data-tab]'); if(tab){showTab(tab.dataset.tab);return;}
      const category=e.target.closest('[data-category]'); if(category){openCategory(category.dataset.category);return;}
      const qbutton=e.target.closest('[data-question]'); if(qbutton){const from=document.querySelector('.view.active')?.id==='practice-view'?'practice':'bank';renderQuestion(qbutton.dataset.question,from);return;}
      const bookmark=e.target.closest('[data-bookmark]'); if(bookmark){e.preventDefault();toggleBookmark(bookmark.dataset.bookmark);return;}
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){e.preventDefault();showTab('bank');document.getElementById('question-search').focus();}
      if(e.key==='Escape' && document.getElementById('question-view').classList.contains('active'))showTab(returnTab);
    });
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  } catch (error) {
    console.error(error);
    document.getElementById('bank-count').textContent='Questions unavailable';
    document.getElementById('home-title').textContent='Question bank could not load';
    const hero = document.querySelector('.hero > p'); if(hero) hero.textContent='Open the app through GitHub Pages or a local web server, not file://. If this continues, check that data/questions.json and data/sources.json are present.';
    showToast('Load error: check project files or network, then refresh.');
  }
}
function renderAll(){renderHome();renderTracks(document.getElementById('module-search').value);renderQuestionBank();renderProgress();}

init();
