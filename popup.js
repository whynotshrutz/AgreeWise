// Popup: system default theme with manual override; robust injector; cursor-follow glow.

 const UI_STRINGS = {
  analyze: {
    en:"Analyze", hi:"विश्लेषण", es:"Analizar", fr:"Analyser", de:"Analysieren",
    it:"Analizza", "pt":"Analisar", "pt-BR":"Analisar", "pt-PT":"Analisar",
    ja:"解析", ko:"분석", "zh":"分析", "zh-CN":"分析", "zh-TW":"分析",
    ar:"تحليل", ru:"Анализировать",
    bn:"বিশ্লেষণ", ta:"பகுப்பாய்வு", te:"విశ్లేషించు", mr:"विश्लेषण", gu:"વિશ્લેષણ"
  }
};
const STORAGE_KEY = 'agreeSmartThemeMode'; // 'auto' | 'light' | 'dark'
function sysDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
async function applyTheme(mode){
  const resolved = (mode === 'auto') ? (sysDark() ? 'dark' : 'light') : mode; // 'light' | 'dark'
  document.body.setAttribute('data-theme', resolved);

  const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  if (tab?.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type:'AGREE_SMART_THEME_CHANGED', theme: resolved }); // send 'light'|'dark'
    } catch {}
  }
}
(async function initTheme(){
  const saved = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY] ?? 'auto';
  await applyTheme(saved);

  if (saved === 'auto' && window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('auto');
    mq.addEventListener?.('change', onChange);
    if (!mq.addEventListener) mq.addListener(onChange);
  }
})();

document.getElementById('themeToggle').addEventListener('click', async ()=>{
  const store = await chrome.storage.local.get(STORAGE_KEY);
  const current = store[STORAGE_KEY] ?? 'auto';

  let next;
  if (current === 'auto') {
    // flip to the opposite of Chrome's current theme
    next = sysDark() ? 'light' : 'dark';
  } else {
    // go back to Auto (follow Chrome)
    next = 'auto';
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  await applyTheme(next);
});

function isBlocked(url){
  if (!url) return true;
  const u = new URL(url);
  if (['chrome:','chrome-extension:','edge:','about:','view-source:'].some(p=>url.startsWith(p))) return true;
  if (u.hostname.endsWith('chromewebstore.google.com')) return true;
  return false; // allow http/https/file
}

async function ensureHelpers(tabId){
  // Inject boot (answers ping even if content fails)
  try { await chrome.scripting.executeScript({target:{tabId}, files:['boot.js']}); } 
  catch(e){ return {ok:false, error:'boot inject failed: '+(e.message||e)}; }
  try { const ping = await chrome.tabs.sendMessage(tabId, {type:'AGREE_SMART_PING'}); if (!ping?.ok) return {ok:false, error:'boot ping not ok'}; }
  catch(e){ return {ok:false, error:'boot ping failed: '+(e.message||e)}; }

  // CSS then content
  try { await chrome.scripting.insertCSS({target:{tabId}, files:['styles.css']}); }
  catch(e){ return {ok:false, error:'CSS inject failed: '+(e.message||e)}; }
  try { await chrome.scripting.executeScript({target:{tabId}, files:['content.js']}); }
  catch(e){ /* continue; content may be already present */ }
  return {ok:true};
}

document.getElementById('analyze').addEventListener('click', async ()=>{
  const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  if (!tab?.id || !tab.url) return alert('No active tab found.');
  if (isBlocked(tab.url)) return alert('This page blocks extensions. Try a normal page (http/https/file).');

  const res = await ensureHelpers(tab.id);
  if (!res.ok) return alert('Could not initialize the page helper:\n'+res.error);

  try { await chrome.tabs.sendMessage(tab.id, {type:'AGREE_SMART_ANALYZE'}); window.close(); }
  catch(e){ alert('Analyze message failed: '+(e.message||e)); }
});

// Cursor-follow glow on Analyze button
const btn = document.getElementById('analyze');
btn.addEventListener('mousemove', (e)=>{
  const r = btn.getBoundingClientRect();
  const x = ((e.clientX - r.left)/r.width)*100;
  const y = ((e.clientY - r.top)/r.height)*100;
  btn.style.setProperty('--mx', `${x}%`);
  btn.style.setProperty('--my', `${y}%`);
});
btn.addEventListener('mouseleave', ()=>{
  btn.style.setProperty('--mx','50%'); btn.style.setProperty('--my','50%'); btn.style.setProperty('--glow','rgba(0,0,0,0)');
});
document.getElementById('settingsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage(); // opens a full settings page, or you can toggle an in-popup panel
});
function tr(key, code){
  const row = UI_STRINGS[key] || {};
  return row[code] || row[code?.split('-')[0]] || row.en || key;
}
function isRTL(code){
  const rtl = new Set(['ar','he','fa','ur']);
  const base = (code||'').split('-')[0];
  return rtl.has(base);
}
function applyAnalyzeLocale(code){
  document.documentElement.lang = code || 'en';
  document.documentElement.dir  = isRTL(code) ? 'rtl' : 'ltr';
  const btn = document.getElementById('analyze');
  const label = tr('analyze', code || 'en');
  if (btn){
    btn.textContent = label;
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }
}

// ===== ADD: detect active tab language and localize on load =====
document.addEventListener('DOMContentLoaded', async ()=>{
  try {
    const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
    let code = 'en';
    if (tab?.id) {
      // chrome returns BCP-47 like "en", "es", "pt-PT", "zh-CN"
      code = await new Promise(resolve => chrome.tabs.detectLanguage(tab.id, resolve)) || 'en';
    }
    applyAnalyzeLocale(code);
  } catch {
    applyAnalyzeLocale('en');
  }
});