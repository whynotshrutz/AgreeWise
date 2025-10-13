//  Content.js


/* =============================
   THEME
============================= */
function sysDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
async function getTheme(){
  const { agreeSmartThemeMode='auto' } = await chrome.storage.local.get('agreeSmartThemeMode');
  const final = agreeSmartThemeMode === 'auto' ? (sysDark() ? 'dark' : 'light') : agreeSmartThemeMode;
  return final === 'dark' ? 'dark' : 'white';
}
function setPanelTheme(panel, theme){ panel.setAttribute('data-theme', theme); }

/* =============================
   I18N (only headings/status; no "Translate" label)
============================= */
const UI_STRINGS = {
  // headings + labels
  jurisdiction: { en:"Jurisdiction:", hi:"अधिकार क्षेत्र:", es:"Jurisdicción:", fr:"Juridiction :", de:"Gerichtsbarkeit:", it:"Giurisdizione:", "pt-BR":"Jurisdição:", "pt-PT":"Jurisdição:", ja:"法域:", ko:"관할권:", "zh-CN":"司法管辖区：", "zh-TW":"司法管轄區：", ar:"الاختصاص:", ru:"Юрисдикция:", bn:"বিচারঅধিক্ষেত্র:", ta:"அதிகாரப் பிரிவு:", te:"న్యాయ పరిధి:", mr:"क्षेत्राधिकार:", gu:"અધિકક્ષેત્ર:" },
  data_retention: { en:"Data retention:", hi:"डेटा संरक्षण अवधि:", es:"Conservación de datos:", fr:"Conservation des données :", de:"Datenspeicherung:", it:"Conservazione dei dati:", "pt-BR":"Retenção de dados:", "pt-PT":"Conservação de dados:", ja:"データ保持期間：", ko:"데이터 보관 기간:", "zh-CN":"数据保留：", "zh-TW":"資料保存：", ar:"الاحتفاظ بالبيانات:", ru:"Срок хранения данных:", bn:"ডাটা সংরক্ষণ:", ta:"தரவு சேமிப்பு:", te:"డేటా నిల్వ:", mr:"डेटा साठवण:", gu:"ડેટા સંગ્રક્ષણ:" },
  account_deletion: { en:"Account deletion:", hi:"खाता हटाना:", es:"Eliminación de cuenta:", fr:"Suppression du compte :", de:"Kontolöschung:", it:"Eliminazione dell’account:", "pt-BR":"Exclusão de conta:", "pt-PT":"Eliminação de conta:", ja:"アカウント削除：", ko:"계정 삭제:", "zh-CN":"账户删除：", "zh-TW":"帳戶刪除：", ar:"حذف الحساب:", ru:"Удаление аккаунта:", bn:"অ্যাকাউন্ট মুছুন:", ta:"கணக்கு நீக்கம்:", te:"ఖాతా తొలగింపు:", mr:"खाते विलोपन:", gu:"ખાતું કાઢવું:" },
  age: { en:"Age:", hi:"आयु:", es:"Edad:", fr:"Âge :", de:"Alter:", it:"Età:", "pt-BR":"Idade:", "pt-PT":"Idade:", ja:"年齢：", ko:"연령:", "zh-CN":"年龄：", "zh-TW":"年齡：", ar:"العمر:", ru:"Возраст:", bn:"বয়স:", ta:"வயது:", te:"వయస్సు:", mr:"वय:", gu:"વય:" },
  other_risks: { en:"Other risks:", hi:"अन्य जोखिम:", es:"Otros riesgos:", fr:"Autres risques :", de:"Andere Risiken:", it:"Altri rischi:", "pt-BR":"Outros riscos:", "pt-PT":"Outros riscos:", ja:"その他のリスク：", ko:"기타 위험:", "zh-CN":"其他风险：", "zh-TW":"其他風險：", ar:"مخاطر أخرى:", ru:"Прочие риски:", bn:"অন্যান্য ঝুঁকি:", ta:"பிற ஆபத்துகள்:", te:"ఇతర ప్రమాదాలు:", mr:"इतर धोके:", gu:"અન્ય જોખમો:" },
  section_score: { en:"Section safety score:", hi:"खंड सुरक्षा स्कोर:", es:"Puntuación de seguridad de la sección:", fr:"Score de sécurité de la section :", de:"Sicherheitswert (Abschnitt):", it:"Punteggio di sicurezza (sezione):", "pt-BR":"Pontuação de segurança (seção):", "pt-PT":"Pontuação de segurança (secção):", ja:"セクション安全スコア：", ko:"섹션 안전 점수:", "zh-CN":"分区安全分：", "zh-TW":"章節安全分：", ar:"درجة أمان القسم:", ru:"Оценка безопасности раздела:", bn:"সেকশনের সুরক্ষা স্কোর:", ta:"பகுதி பாதுகாப்பு மதிப்பெண்:", te:"విభాగ భద్రతా స్కోరు:", mr:"विभाग सुरक्षा गुण:", gu:"વિભાગ સલામતી સ્કોર:" },
  page_score: { en:"Safety score:", hi:"सुरक्षा स्कोर:", es:"Puntuación de seguridad:", fr:"Score de sécurité :", de:"Sicherheitswert:", it:"Punteggio di sicurezza:", "pt-BR":"Pontuação de segurança:", "pt-PT":"Pontuação de segurança:", ja:"安全スコア：", ko:"안전 점수:", "zh-CN":"安全分：", "zh-TW":"安全分：", ar:"درجة الأمان:", ru:"Оценка безопасности:", bn:"সুরক্ষা স্কোর:", ta:"பாதுகாப்பு மதிப்பெண்:", te:"భద్రతా స్కోరు:", mr:"सुरक्षा गुण:", gu:"સુરક્ષા સ્કોર:" },
  selected_heading: { en:"Selected section — what it says", hi:"चयनित अनुभाग — इसका सार", es:"Sección seleccionada — lo que dice", fr:"Section sélectionnée — ce qu’elle dit", de:"Ausgewählter Abschnitt — Inhalt", it:"Sezione selezionata — contenuto", "pt-BR":"Seção selecionada — conteúdo", "pt-PT":"Secção selecionada — conteúdo", ja:"選択セクション — 要旨", ko:"선택된 섹션 — 요약", "zh-CN":"所选段落—要点", "zh-TW":"所選段落—要點", ar:"القسم المحدد — ما يرد فيه", ru:"Выбранный раздел — содержание", bn:"নির্বাচিত অংশ — সারাংশ", ta:"தேர்ந்தெடுக்கப்பட்ட பகுதி — சாரம்", te:"ఎంచుకున్న విభాగం — సారం", mr:"निवडलेला विभाग — सार", gu:"પસંદ કરેલ વિભાગ — સાર" },
  page_heading: { en:"What you're agreeing to", hi:"आप किससे सहमत हो रहे हैं", es:"A qué aceptas", fr:"À quoi vous consentez", de:"Wozu Sie zustimmen", it:"A cosa acconsenti", "pt-BR":"Ao que você concorda", "pt-PT":"Ao que concorda", ja:"同意内容", ko:"동의하는 내용", "zh-CN":"你同意的内容", "zh-TW":"你同意的內容", ar:"على ماذا توافق", ru:"С чем вы соглашаетесь", bn:"আপনি কীতে সম্মত হচ্ছেন", ta:"நீங்கள் ஒப்புக்கொள்பவை", te:"మీరు ఏదికి అంగీకరిస్తున్నారు", mr:"आपण कशास सहमती देता आहात", gu:"તમે શું સ્વીકારી રહ્યા છો" },

  // risk flags
  collects: { en:"Personal data collected", hi:"व्यक्तिगत डेटा एकत्रित", es:"Datos personales recopilados", fr:"Données personnelles collectées", de:"Personenbezogene Daten erfasst", it:"Dati personali raccolti", "pt-BR":"Dados pessoais coletados", "pt-PT":"Dados pessoais recolhidos", ja:"個人データ収集", ko:"개인 데이터 수집", "zh-CN":"收集个人数据", "zh-TW":"蒐集個人資料", ar:"جمع البيانات الشخصية", ru:"Сбор персональных данных", bn:"ব্যক্তিগত ডেটা সংগ্রহ", ta:"தனிப்பட்ட தரவு சேகரிப்பு", te:"వ్యక్తిగత డేటా సేకరణ", mr:"वैयक्तिक डेटा संकलन", gu:"વ્યક્તિગત ડેટા એકત્રિત" },
  shares:   { en:"Third-party sharing", hi:"तीसरे पक्ष के साथ साझा", es:"Compartición con terceros", fr:"Partage avec des tiers", de:"Weitergabe an Dritte", it:"Condivisione con terzi", "pt-BR":"Compartilhamento com terceiros", "pt-PT":"Partilha com terceiros", ja:"第三者共有", ko:"제3자 공유", "zh-CN":"与第三方共享", "zh-TW":"與第三方共享", ar:"مشاركة مع جهات خارجية", ru:"Передача третьим лицам", bn:"তৃতীয় পক্ষের সাথে ভাগ", ta:"மூன்றாம் தரப்புகளுடன் பகிர்வு", te:"తృతీయ పక్షాలతో పంచుకోవడం", mr:"तृतीय पक्षांसोबत शेअरिंग", gu:"તિજાં પક્ષ સાથે શેરિંગ" },
  ads:      { en:"Ad tracking", hi:"विज्ञापन ट्रैकिंग", es:"Seguimiento publicitario", fr:"Suivi publicitaire", de:"Werbetracking", it:"Tracciamento pubblicitario", "pt-BR":"Rastreamento de anúncios", "pt-PT":"Rastreamento de anúncios", ja:"広告トラッキング", ko:"광고 추적", "zh-CN":"广告跟踪", "zh-TW":"廣告追蹤", ar:"تتبّع الإعلانات", ru:"Рекламный трекинг", bn:"বিজ্ঞাপন ট্র্যাকিং", ta:"விளம்பர கண்காணிப்பு", te:"ప్రకటన ట్రాకింగ్", mr:"जाहिरात ट्रॅकिंग", gu:"જાહેરાત ટ્રેકિંગ" },
  arbitration:{ en:"Arbitration / class-action waiver", hi:"मध्यस्थता / सामूहिक कार्रवाई छूट", es:"Arbitraje / renuncia a demanda colectiva", fr:"Arbitrage / renonciation action collective", de:"Schiedsverfahren / Sammelklageverzicht", it:"Arbitrato / rinuncia ad azione collettiva", "pt-BR":"Arbitragem / renúncia à ação coletiva", "pt-PT":"Arbitragem / renúncia à ação coletiva", ja:"仲裁 / 集団訴訟の放棄", ko:"중재 / 집단소송 포기", "zh-CN":"仲裁/放弃集体诉讼", "zh-TW":"仲裁／放棄集體訴訟", ar:"تحكيم / التنازل عن الدعوى الجماعية", ru:"Арбитраж / отказ от коллективных исков", bn:"মধ্যস্থতা / সমষ্টিগত মামলার ছাড়", ta:"மத்தியஸ்தம் / குழுச் சட்டவழக்கு விலக்கு", te:"తిర్పు / సమూహ దావా వావర్", mr:"मध्यस्थी / सामूहिक दावा माफी", gu:"મધ્યસ્થી / વર્ગ-કાર્ય રદ" },
  autorenew:{ en:"Auto-renewal", hi:"स्वतः नवीनीकरण", es:"Renovación automática", fr:"Renouvellement automatique", de:"Automatische Verlängerung", it:"Rinnovo automatico", "pt-BR":"Renovação automática", "pt-PT":"Renovação automática", ja:"自動更新", ko:"자동 갱신", "zh-CN":"自动续订", "zh-TW":"自動續訂", ar:"تجديد تلقائي", ru:"Автопродление", bn:"স্বয়ংক্রিয় নবায়ন", ta:"தானியங்கி புதுப்பிப்பு", te:"ఆటో-రివ్యువల్", mr:"स्वयंचलित नूतनीकरण", gu:"ઓટો-રીન્યૂઅલ" },

  // statuses
  parsing: { en:"Parsing…", hi:"पार्स किया जा रहा है…", es:"Analizando…", fr:"Analyse…", de:"Analyse…", it:"Analisi…", "pt-BR":"Analisando…", "pt-PT":"A analisar…", ja:"解析中…", ko:"분석 중…", "zh-CN":"解析中…", "zh-TW":"解析中…", ar:"جارٍ التحليل…", ru:"Анализ…", bn:"বিশ্লেষণ হচ্ছে…", ta:"பகுப்பாய்வு செய்கிறது…", te:"విశ్లేషణలో…", mr:"विश्लेषण चालू…", gu:"વિશ્લેષણ ચાલુ…" },
  reading_selection: { en:"Reading selection…", hi:"चयन पढ़ा जा रहा है…", es:"Leyendo selección…", fr:"Lecture de la sélection…", de:"Auswahl wird gelesen…", it:"Lettura della selezione…", "pt-BR":"Lendo a seleção…", "pt-PT":"A ler a seleção…", ja:"選択範囲を読込中…", ko:"선택 영역 읽는 중…", "zh-CN":"读取所选内容…", "zh-TW":"讀取所選內容…", ar:"جارٍ قراءة التحديد…", ru:"Чтение выделенного…", bn:"নির্বাচিত অংশ পড়া হচ্ছে…", ta:"தேர்ந்தெடுத்ததைப் படிக்கிறது…", te:"ఎంపికను చదవుతోంది…", mr:"निवड वाचत आहे…", gu:"પસંદ વાંચી રહ્યું છે…" },
  summarizing_section: { en:"Summarizing section…", hi:"अनुभाग सारांशित किया जा रहा है…", es:"Resumiendo sección…", fr:"Résumé de la section…", de:"Abschnitt wird zusammengefasst…", it:"Sintesi della sezione…", "pt-BR":"Resumindo a seção…", "pt-PT":"A resumir a secção…", ja:"セクション要約中…", ko:"섹션 요약 중…", "zh-CN":"分段摘要…", "zh-TW":"段落摘要…", ar:"جارٍ تلخيص القسم…", ru:"Резюмирование раздела…", bn:"সেকশন সারসংক্ষেপ…", ta:"பகுதி சுருக்கம்…", te:"విభాగ సారాంశం…", mr:"विभाग संक्षेप…", gu:"વિભાગ સારાંશ…" },
  extracting_risks: { en:"Extracting risk signals…", hi:"जोखिम संकेत निकाले जा रहे हैं…", es:"Extrayendo riesgos…", fr:"Extraction des risques…", de:"Risikosignale werden ermittelt…", it:"Estrazione dei rischi…", "pt-BR":"Extraindo sinais de risco…", "pt-PT":"A extrair sinais de risco…", ja:"リスク抽出中…", ko:"위험 신호 추출 중…", "zh-CN":"提取风险信号…", "zh-TW":"提取風險訊號…", ar:"جارٍ استخراج مؤشرات المخاطر…", ru:"Выделение рисков…", bn:"ঝুঁকি সংকেত বের করা হচ্ছে…", ta:"அபாயக் குறிகள் எடுக்கிறது…", te:"ప్రమాద సంకేతాలు వెలికితీస్తోంది…", mr:"धोका संकेत काढत आहे…", gu:"જોખમ સંકેતો કાઢી રહ્યું છે…" },
  following_links: { en:"Following links in section…", hi:"अनुभाग के लिंक पढ़े जा रहे हैं…", es:"Leyendo enlaces de la sección…", fr:"Lecture des liens de la section…", de:"Links im Abschnitt werden gelesen…", it:"Lettura dei link nella sezione…", "pt-BR":"Lendo links da seção…", "pt-PT":"A ler ligações da secção…", ja:"セクション内リンク読込中…", ko:"섹션 링크 분석 중…", "zh-CN":"读取本段链接…", "zh-TW":"讀取本段連結…", ar:"جارٍ تتبّع الروابط في القسم…", ru:"Обрабатываем ссылки в секции…", bn:"সেকশনের লিঙ্ক পড়া হচ্ছে…", ta:"பகுதியில் உள்ள இணைப்புகள்…", te:"విభాగ లింకులు చదవుతోంది…", mr:"विभागातील दुवे वाचत आहे…", gu:"વિભાગની કડીઓ વાંચી રહ્યું છે…" },
  translating: { en:"Translating…", hi:"अनुवाद किया जा रहा है…", es:"Traduciendo…", fr:"Traduction…", de:"Übersetzung…", it:"Traduzione…", "pt-BR":"Traduzindo…", "pt-PT":"A traduzir…", ja:"翻訳中…", ko:"번역 중…", "zh-CN":"翻译中…", "zh-TW":"翻譯中…", ar:"جارٍ الترجمة…", ru:"Перевод…", bn:"অনুবাদ চলছে…", ta:"மொழிபெயர்ப்பு…", te:"అనువాదం…", mr:"भाषांतर…", gu:"અનુવાદ…" },
  translating_fallback: { en:"Translating (LM fallback)…", hi:"अनुवाद (LM फॉलबैक)…", es:"Traduciendo (retroceso LM)…", fr:"Traduction (secours LM)…", de:"Übersetzung (LM-Fallback)…", it:"Traduzione (fallback LM)…", "pt-BR":"Traduzindo (fallback LM)…", "pt-PT":"A traduzir (substituição LM)…", ja:"翻訳中（LMフォールバック）…", ko:"번역 중 (LM 대체)…", "zh-CN":"翻译中（LM 备用）…", "zh-TW":"翻譯中（LM 備援）…", ar:"جارٍ الترجمة (بديل LM)…", ru:"Перевод (резерв LM)…", bn:"অনুবাদ (LM বিকল্প)…", ta:"மொழிபெயர்ப்பு (LM மாற்று)…", te:"అనువాదం (LM ఫాల్‌బ్యాక్)…", mr:"भाषांतर (LM फॉलबॅक)…", gu:"અનુવાદ (LM બેકઅપ)…" },
  done: { en:"Done.", hi:"पूर्ण.", es:"Hecho.", fr:"Terminé.", de:"Fertig.", it:"Fatto.", "pt-BR":"Concluído.", "pt-PT":"Concluído.", ja:"完了。", ko:"완료.", "zh-CN":"完成。", "zh-TW":"完成。", ar:"تمّ.", ru:"Готово.", bn:"সম্পন্ন.", ta:"முடிந்தது.", te:"పూర్తి.", mr:"पूर्ण.", gu:"પૂર્ણ." },
  error_prefix: { en:"AgreeWise error:", hi:"AgreeWise त्रुटि:", es:"Error de AgreeWise:", fr:"Erreur AgreeWise :", de:"AgreeWise-Fehler:", it:"Errore AgreeWise:", "pt-BR":"Erro do AgreeWise:", "pt-PT":"Erro do AgreeWise:", ja:"AgreeWise エラー：", ko:"AgreeWise 오류:", "zh-CN":"AgreeWise 错误：", "zh-TW":"AgreeWise 錯誤：", ar:"خطأ AgreeWise:", ru:"Ошибка AgreeWise:", bn:"AgreeWise ত্রুটি:", ta:"AgreeWise பிழை:", te:"AgreeWise లోపం:", mr:"AgreeWise त्रुटी:", gu:"AgreeWise ભૂલ:" }
};
function tr(key, lang){ const row = UI_STRINGS[key]; return (row && (row[lang] || row.en)) || key; }
function currentLang(panel){
  const v = panel.querySelector('#agree-smart-translate')?.value || 'en';
  return v || 'en';
}

/* =============================
   STATE (for re-translation)
============================= */
let __agreewise_lastParsed = null;       // raw English parsed risk object
let __agreewise_lastLinkSums = null;     // [{href, summary}] in English
let __agreewise_lastSummaryRaw = '';     // English markdown summary (section/page)

/* =============================
   PANEL
============================= */
async function ensurePanel(){
  let el = document.getElementById('agree-smart-panel');
  if (el) return el;

  el = document.createElement('section');
  el.id = 'agree-smart-panel';
  el.innerHTML = `
    <header>
      <strong>AgreeWise</strong>
      <div style="display:flex;gap:8px;align-items:center">
        <select id="agree-smart-translate"
                aria-label="Language"
                style="padding:4px 6px;border-radius:8px;border:1px solid var(--border);background:var(--btn);color:var(--fg)">
          <option value="en" selected>English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt-BR">Portuguese (Brazil)</option>
          <option value="pt-PT">Portuguese (Portugal)</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="zh-TW">Chinese (Traditional)</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="bn">Bengali</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
        </select>
        <button id="agree-smart-close">✕</button>
      </div>
    </header>
    <div class="body">
      <div id="agree-smart-status" class="muted">Parsing…</div>
      <div id="agree-smart-risk"></div>
      <div id="agree-smart-summary"></div>
      <div id="agree-smart-links"></div>
    </div>`;
  document.documentElement.appendChild(el);
  el.querySelector('#agree-smart-close').onclick = () => el.remove();

  const theme = await getTheme(); setPanelTheme(el, theme);

  // On language change: re-render from stored English
  el.querySelector('#agree-smart-translate').addEventListener('change', async ()=>{
    const lang2   = currentLang(el);
    const status  = el.querySelector('#agree-smart-status');
    const riskEl  = el.querySelector('#agree-smart-risk');
    const sumEl   = el.querySelector('#agree-smart-summary');
    const linksEl = el.querySelector('#agree-smart-links');

    const tgt = el.querySelector('#agree-smart-translate').value || 'en';

    // Summary
    if (__agreewise_lastSummaryRaw){
      if (tgt === 'en'){
        sumEl.innerHTML = `<div style="margin-top:8px">${__agreewise_lastSummaryRaw.replace(/\n/g,'<br/>')}</div>`;
      } else {
        status.textContent = tr('translating', lang2);
        const rendered = await maybeTranslate(__agreewise_lastSummaryRaw, tgt, status, lang2);
        sumEl.innerHTML = `<div style="margin-top:8px">${rendered.replace(/\n/g,'<br/>')}</div>`;
      }
    }

    // Risk block
    if (__agreewise_lastParsed){
      await renderRiskBlock(
        riskEl,
        __agreewise_lastParsed,
        __agreewise_lastParsed.__score,
        lang2,
        (tgt !== 'en' ? tgt : null),
        status
      );
    }

    // Linked page summaries
    if (__agreewise_lastLinkSums){
      await renderLinkSummaries(
        linksEl,
        __agreewise_lastLinkSums,
        lang2,
        (tgt !== 'en' ? tgt : null),
        status
      );
    }

    status.textContent = tr('done', lang2);
  });

  return el;
}

/* =============================
   SELECTION UTILITIES
============================= */
function getSelectedRange(){
  const s = window.getSelection && window.getSelection(); if (!s || s.rangeCount===0) return null;
  const r = s.getRangeAt(0); if (String(s).trim().length===0) return null; return r;
}
function getSectionContainerFromNode(node){
  let el = (node && node.nodeType===Node.TEXT_NODE) ? node.parentElement : node;
  const isSectionish = e => e && (/^(SECTION|ARTICLE|MAIN|ASIDE)$/i.test(e.tagName) || e.getAttribute('role')==='region' ||
    e.classList.contains('terms') || e.classList.contains('privacy') || e.classList.contains('policy'));
  let cur = el; while (cur && cur!==document.body && cur!==document.documentElement){ if (isSectionish(cur)) return cur; cur = cur.parentElement; }
  cur = el; while (cur && cur!==document.body && cur!==document.documentElement){ if (cur.tagName==='DIV' && (cur.innerText||'').length>200) return cur; cur = cur.parentElement; }
  return el || document.body;
}
function extractSectionTextAndLinks(container){
  const text = (container.innerText||'').replace(/\s+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
  const hrefs = Array.from(container.querySelectorAll('a[href]')).map(a=>a.href).filter(Boolean)
    .map(h=>{ try{ return new URL(h, location.href).href; }catch{ return null; } }).filter(Boolean);
  const uniq = Array.from(new Set(hrefs)); return { text, links: uniq.slice(0,6) };
}

/* =============================
   PDF SUPPORT
============================= */
async function extractPdfTextFromArrayBuffer(ab){
  if (!window.pdfjsLib){
    try{ const u = chrome.runtime.getURL('lib/pdf.min.js'); await import(u); }catch{}
  }
  if (!window.pdfjsLib) throw new Error('PDF.js not loaded');
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
  const loadingTask = pdfjsLib.getDocument({ data: ab });
  const pdf = await loadingTask.promise;
  let out = ''; const maxPages = Math.min(pdf.numPages, 30);
  for (let p=1; p<=maxPages; p++){
    const page = await pdf.getPage(p); const content = await page.getTextContent();
    out += '\n\n' + content.items.map(it=>it.str).join(' ');
    if (out.length>200000) break;
  }
  return out.trim();
}

/* =============================
   PAGE T&C FALLBACK
============================= */
async function extractTermsTextFromPage(){
  const pageText = document.body.innerText || '';
  const link = Array.from(document.querySelectorAll('a[href]')).map(a=>a.href)
    .find(h => /terms|conditions|privacy|policy/i.test(h) && (()=>{try{return new URL(h).origin===location.origin;}catch{return false;}})());
  let linked = '';
  if (link){
    try{
      const r = await fetch(link, {credentials:'include'});
      if (r.ok){
        const ct = r.headers.get('content-type')||'';
        if (/pdf/i.test(ct) || /\.pdf($|\?)/i.test(link)){
          linked = await extractPdfTextFromArrayBuffer(await r.arrayBuffer());
        } else {
          const html = await r.text(); const tmp = document.createElement('div'); tmp.innerHTML = html; linked = tmp.innerText || '';
        }
      }
    }catch{}
  }
  const primary = linked.length > pageText.length*1.2 ? linked : pageText;
  return primary.replace(/\s+\n/g,'\n').replace(/\n{3,}/g,'\n\n').slice(0,120000);
}

/* =============================
   AI HELPERS
============================= */
function chunk(text, size=4000){ const out=[]; for(let i=0;i<text.length;i+=size) out.push(text.slice(i,i+size)); return out; }

async function summarizeChunks(chunks, mode='key-points'){
  if ('Summarizer' in self && typeof Summarizer.availability==='function'){
    try{
      const a = await Summarizer.availability();
      if (a && a!=='unavailable'){
        const summarizer = await Summarizer.create({ type: mode==='key-points'?'key-points':'default', format:'markdown', length:'medium' });
        const parts=[]; for (const c of chunks){ parts.push(await summarizer.summarize(c)); if (parts.length>=6) break; } return parts.join('\n');
      }
    }catch(e){ console.warn('Summarizer failed; using Prompt API', e); }
  }
  if (!('LanguageModel' in self) || typeof LanguageModel.availability!=='function') throw new Error('No on-device model available');
  const av = await LanguageModel.availability(); if (av==='unavailable') throw new Error('Language model unavailable');
  const session = await LanguageModel.create({ expectedInputs:[{type:'text',languages:['en']}], expectedOutputs:[{type:'text',languages:['en']}] });
  const out=[]; for (const c of chunks){ const prompt = mode==='key-points'
    ? `Summarize as concise markdown bullet points (max 6 bullets). Be factual and neutral.\n\n${c}`
    : `Write a short plain-English summary focusing on user rights, obligations, and data practices.\n\n${c}`;
    out.push(await session.prompt(prompt)); if (out.length>=6) break; }
  return out.join('\n');
}

async function extractRisks(fullText){
  if (!('LanguageModel' in self) || typeof LanguageModel.availability!=='function') throw new Error('Prompt API not supported');
  const av = await LanguageModel.availability(); if (av==='unavailable') throw new Error('Language model unavailable');
  const session = await LanguageModel.create({ expectedInputs:[{type:'text',languages:['en']}], expectedOutputs:[{type:'text',languages:['en']}] });
  const schema = {
    type:"object", properties:{
      collectsPersonalData:{type:"boolean"}, sharesWithThirdParties:{type:"boolean"}, tracksForAds:{type:"boolean"},
      arbitrationOrClassActionWaiver:{type:"boolean"}, autoRenewalOrSubscription:{type:"boolean"},
      accountDeletionProcess:{type:"string"}, dataRetentionPeriod:{type:"string"}, jurisdictionGoverningLaw:{type:"string"},
      ageRestrictions:{type:"string"}, notableOtherRisks:{type:"array", items:{type:"string"}}
    },
    required:["collectsPersonalData","sharesWithThirdParties","tracksForAds","arbitrationOrClassActionWaiver","autoRenewalOrSubscription"]
  };
  const prompt = `You are a compliance summarizer. Extract fields tersely from the Terms below.
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitration / class-action waiver (true/false)
- autoRenewalOrSubscription (true/false)
- accountDeletionProcess (<= 20 words)
- dataRetentionPeriod (<= 15 words)
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words)
- notableOtherRisks (<= 5 short items)
If unknown, set booleans=false and strings="".

TERMS:
${fullText.slice(0,40000)}`;
  const raw = await session.prompt(prompt, { responseConstraint: schema });
  const parsed = JSON.parse(raw);
  let score=100;
  if (parsed.collectsPersonalData) score-=15;
  if (parsed.sharesWithThirdParties) score-=20;
  if (parsed.tracksForAds) score-=10;
  if (parsed.arbitrationOrClassActionWaiver) score-=20;
  if (parsed.autoRenewalOrSubscription) score-=10;
  parsed.__score = Math.max(0, Math.min(100, score));
  return parsed;
}

/* =============================
   TRANSLATOR (progress + fallback + batching)
============================= */
async function maybeTranslate(text, targetLang, statusEl, langForStatus='en') {
  if (!targetLang || targetLang === 'en') return text;

  if ('Translator' in self && typeof Translator.create === 'function') {
    try {
      let lastBytes = 0;
      const t = await Translator.create({
        sourceLanguage: "en",
        targetLanguage: targetLang,
        monitor(m) {
          m.addEventListener("downloadprogress", () => {});
          m.addEventListener("error", (e) => console.warn("[AgreeWise] Translator monitor error:", e));
          }
      });
      if (statusEl) statusEl.textContent = tr('translating', langForStatus);
      const out = await t.translate(text);
      if (statusEl) statusEl.textContent = tr('done', langForStatus);
      return out;
    } catch (e) {
      console.warn("[AgreeWise] Translator.create failed; fallback:", e);
      if (statusEl) statusEl.textContent = tr('translating_fallback', langForStatus);
    }
  }

  // Fallback to Prompt API (Gemini Nano)
  try {
    if ('LanguageModel' in self && typeof LanguageModel.availability === 'function') {
      const lmAvail = await LanguageModel.availability();
      if (lmAvail !== 'unavailable') {
        const session = await LanguageModel.create({
          expectedInputs: [{ type: 'text', languages: ['en'] }],
          expectedOutputs: [{ type: 'text', languages: [targetLang] }]
        });
        const prompt = `Translate the following text into ${targetLang}. Preserve bullet points and formatting:\n\n${text}`;
        const out = await session.prompt(prompt);
        if (statusEl) statusEl.textContent = tr('done', langForStatus);
        return out;
      }
    }
  } catch (e) {
    console.warn("[AgreeWise] LM translation fallback failed:", e);
  }

  if (statusEl) statusEl.textContent = tr('done', langForStatus);
  return text;
}
async function translateArray(arr, targetLang, statusEl, langForStatus='en'){
  if (!targetLang || targetLang === 'en' || !arr || !arr.length) return arr;
  const SEP = '\n<<<AWSEP>>>\n';
  const joined = arr.join(SEP);
  const translated = await maybeTranslate(joined, targetLang, statusEl, langForStatus);
  return translated.split(SEP);
}

/* =============================
   LINK FETCHERS
============================= */
async function fetchLinkText(url){
  try{
    const r = await fetch(url, {credentials:'include'});
    if (!r.ok) throw new Error('fetch failed');
    const ct = r.headers.get('content-type')||'';
    if (/pdf/i.test(ct) || /\.pdf($|\?)/i.test(url)){
      if (!window.pdfjsLib){
        try{ const u = chrome.runtime.getURL('lib/pdf.min.js'); await import(u); }catch{}
      }
      if (!window.pdfjsLib) return '';
      const ab = await r.arrayBuffer(); return await extractPdfTextFromArrayBuffer(ab);
    }
    const html = await r.text(); const tmp = document.createElement('div'); tmp.innerHTML = html;
    return (tmp.innerText||'').replace(/\s+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
  }catch{ return ''; }
}
async function summarizeLinks(links){
  const out=[]; for (const href of links){
    const txt = await fetchLinkText(href);
    if (!txt || txt.length<200) continue;
    const sum = await summarizeChunks(chunk(txt), 'key-points');
    out.push({href, summary:sum});
    if (out.length>=5) break;
  } return out;
}

/* =============================
   RENDER HELPERS
============================= */
function dot(ok){ return ok?'<span class="ok">●</span>':'<span class="bad">●</span>'; }

async function renderRiskBlock(riskEl, parsedRaw, score, lang, targetLang, statusEl){
  const vals = [
    parsedRaw.jurisdictionGoverningLaw||'—',
    parsedRaw.dataRetentionPeriod||'—',
    parsedRaw.accountDeletionProcess||'—',
    parsedRaw.ageRestrictions||'—',
    ...(parsedRaw.notableOtherRisks||[]).slice(0,5)
  ];
  let [jur, retention, deletion, age, ...other] =
    (targetLang ? await translateArray(vals, targetLang, statusEl, lang) : vals);

  const flags = [
    [tr('collects', lang), parsedRaw.collectsPersonalData],
    [tr('shares', lang), parsedRaw.sharesWithThirdParties],
    [tr('ads', lang), parsedRaw.tracksForAds],
    [tr('arbitration', lang), parsedRaw.arbitrationOrClassActionWaiver],
    [tr('autorenew', lang), parsedRaw.autoRenewalOrSubscription]
  ].map(([label,v])=>`<div>${v ? dot(false) : dot(true)} ${label}</div>`).join('');

  riskEl.innerHTML = `
    <div class="grid" style="margin-bottom:8px">${flags}</div>
    <div class="muted" style="margin-bottom:6px">${tr('jurisdiction', lang)}</div><div>${jur}</div>
    <div class="muted" style="margin-top:6px">${tr('data_retention', lang)}</div><div>${retention}</div>
    <div class="muted" style="margin-top:6px">${tr('account_deletion', lang)}</div><div>${deletion}</div>
    <div class="muted" style="margin-top:6px">${tr('age', lang)}</div><div>${age}</div>
    <div class="muted" style="margin-top:6px">${tr('other_risks', lang)}</div><div>${(other||[]).join(' · ')||'—'}</div>
    <div style="margin-top:10px"><strong>${tr('page_score', lang)}</strong> ${score}/100</div>
  `;
}

async function renderLinkSummaries(linksEl, linkSumsRaw, lang, targetLang, statusEl){
  const bodies = linkSumsRaw.map(x=>x.summary);
  const translatedBodies = targetLang ? await translateArray(bodies, targetLang, statusEl, lang) : bodies;

  const items = linkSumsRaw.map((item, i)=>({
    href: item.href,
    summary: translatedBodies[i] || item.summary
  }));

  if (items.length){
    const html = [
      `<div class="muted" style="margin-top:10px">${/* i18n */ tr('selected_heading', lang)}</div>`,
      ...items.map(({href,summary})=>`<div style="margin-top:8px">
        <div style="font-size:12px;word-break:break-all"><a href="${href}" target="_blank" rel="noreferrer noopener">${href}</a></div>
        <div style="margin-top:4px">${summary.replace(/\n/g,'<br/>')}</div>
      </div>`)
    ].join('');
    linksEl.innerHTML = html;
  } else {
    linksEl.innerHTML = '';
  }
}

/* =============================
   MESSAGING
============================= */
chrome.runtime.onMessage.addListener((msg, _s, sendResponse)=>{
  if (msg?.type==='AGREE_SMART_PING'){ sendResponse({ok:true}); return true; }
});
chrome.runtime.onMessage.addListener(async (msg)=>{
  if (msg?.type==='AGREE_SMART_THEME_CHANGED'){
    const el = document.getElementById('agree-smart-panel'); if (el) setPanelTheme(el, msg.theme==='dark'?'dark':'white');
  }
});

/* =============================
   ANALYSIS FLOWS
============================= */
async function analyzeSelection(status, riskEl, sumEl, linksEl, panel){
  const lang = currentLang(panel);
  const targetLang = panel.querySelector('#agree-smart-translate')?.value || 'en';

  status.textContent = tr('reading_selection', lang);
  const r = getSelectedRange(); if (!r) throw new Error('No selection detected');
  const container = getSectionContainerFromNode(r.commonAncestorContainer);
  const {text, links} = extractSectionTextAndLinks(container);
  if (!text || text.trim().length<120) throw new Error('Selected section is too short');

  status.textContent = tr('summarizing_section', lang);
  const sectionSummary = await summarizeChunks(chunk(text), 'key-points');

  status.textContent = tr('extracting_risks', lang);
  const parsed = await extractRisks(text);
  __agreewise_lastParsed = parsed;

  await renderRiskBlock(riskEl, parsed, parsed.__score, lang, (targetLang!=='en'?targetLang:null), status);

  let out = `### ${tr('selected_heading', lang)}\n${sectionSummary}`;
  __agreewise_lastSummaryRaw = out;
  if (targetLang && targetLang !== 'en'){
    status.textContent = tr('translating', lang);
    out = await maybeTranslate(out, targetLang, status, lang);
  }
  sumEl.innerHTML = `<div style="margin-top:8px">${out.replace(/\n/g,'<br/>')}</div>`;

  // Links
  if (links && links.length){
    status.textContent = tr('following_links', lang);
    const linkSums = await summarizeLinks(links);
    __agreewise_lastLinkSums = linkSums;
    await renderLinkSummaries(linksEl, linkSums, lang, (targetLang!=='en'?targetLang:null), status);
  } else {
    __agreewise_lastLinkSums = null;
    linksEl.innerHTML = '';
  }

  status.textContent = tr('done', lang);
}

async function analyzePage(status, riskEl, sumEl, panel){
  const lang = currentLang(panel);
  const targetLang = panel.querySelector('#agree-smart-translate')?.value || 'en';

  status.textContent = tr('parsing', lang);
  const text = await extractTermsTextFromPage();
  if (!text || text.length<800) throw new Error('Could not find substantial Terms text on this page');

  status.textContent = tr('summarizing_section', lang);
  const parts = await summarizeChunks(chunk(text), 'key-points');

  status.textContent = tr('extracting_risks', lang);
  const parsed = await extractRisks(text);
  __agreewise_lastParsed = parsed;

  await renderRiskBlock(riskEl, parsed, parsed.__score, lang, (targetLang!=='en'?targetLang:null), status);

  let out = `### ${tr('page_heading', lang)}\n${parts}`;
  __agreewise_lastSummaryRaw = out;
  if (targetLang && targetLang !== 'en'){
    status.textContent = tr('translating', lang);
    out = await maybeTranslate(out, targetLang, status, lang);
  }
  sumEl.innerHTML = `<div style="margin-top:8px">${out.replace(/\n/g,'<br/>')}</div>`;
  __agreewise_lastLinkSums = null;

  status.textContent = tr('done', lang);
}

/* =============================
   ENTRY
============================= */
chrome.runtime.onMessage.addListener(async (msg)=>{
  if (msg?.type !== 'AGREE_SMART_ANALYZE' && msg?.type !== 'AGREE_SMART_ANALYZE_SELECTION') return;

  const panel = await ensurePanel();
  const status = panel.querySelector('#agree-smart-status');
  const riskEl = panel.querySelector('#agree-smart-risk');
  const sumEl = panel.querySelector('#agree-smart-summary');
  const linksEl = panel.querySelector('#agree-smart-links');

  try{
    if (msg.type==='AGREE_SMART_ANALYZE_SELECTION'){
      await analyzeSelection(status, riskEl, sumEl, linksEl, panel);
      return;
    }
    const r = getSelectedRange();
    if (r){ await analyzeSelection(status, riskEl, sumEl, linksEl, panel); }
    else { linksEl.innerHTML=''; await analyzePage(status, riskEl, sumEl, panel); }
  }catch(e){
    const lang = currentLang(panel);
    status.textContent = `${tr('error_prefix', lang)} ${e.message || e}`;
  }
});
