
/* =============================
   THEME
============================= */
function sysDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }
async function getTheme(){
  const { agreeSmartThemeMode='auto' } = await chrome.storage.local.get('agreeSmartThemeMode');
  const final = agreeSmartThemeMode === 'auto' ? (sysDark() ? 'dark' : 'light') : agreeSmartThemeMode;
  return final === 'dark' ? 'dark' : 'light';
}
function setPanelTheme(panel, theme){ panel.setAttribute('data-theme', theme); }
// === Enterprise/location settings ===
async function getEnterpriseSettings(){
  const { agreeEnterpriseMode=false, agreeLocationCountry='' } =
    await chrome.storage.local.get(['agreeEnterpriseMode','agreeLocationCountry']);
  return { agreeEnterpriseMode, agreeLocationCountry };
}

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
  summary_heading: { 
    en:"Summary", hi:"सारांश", es:"Resumen", fr:"Résumé", de:"Zusammenfassung",
    it:"Riepilogo", "pt-BR":"Resumo", "pt-PT":"Resumo", ja:"要約", ko:"요약",
    "zh-CN":"摘要", "zh-TW":"摘要", ar:"الملخّص", ru:"Краткое содержание",
    bn:"সারাংশ", ta:"சுருக்கம்", te:"సారాంశం", mr:"सारांश", gu:"સારાંશ"
  },
    not_specified: {
    en: "Not specified",
    hi: "निर्दिष्ट नहीं",
    es: "No especificado",
    fr: "Non spécifié",
    de: "Nicht angegeben",
    it: "Non specificato",
    "pt-BR": "Não especificado",
    "pt-PT": "Não especificado",
    ja: "指定なし",
    ko: "명시되지 않음",
    "zh-CN": "未指定",
    "zh-TW": "未指定",
    ar: "غير محدد",
    ru: "Не указано",
    bn: "নির্দিষ্ট নয়",
    ta: "குறிப்பிடப்படவில்லை",
    te: "నిర్దేశించబడలేదు",
    mr: "निर्दिष्ट नाही",
    gu: "નિધિષ્ટ નથી"
  },
  show_summary: {
    en:"Show summary", hi:"सारांश दिखाएँ", es:"Mostrar resumen", fr:"Afficher le résumé", de:"Zusammenfassung anzeigen",
    it:"Mostra riepilogo", "pt-BR":"Mostrar resumo", "pt-PT":"Mostrar resumo", ja:"要約を表示", ko:"요약 보기",
    "zh-CN":"显示摘要", "zh-TW":"顯示摘要", ar:"إظهار الملخّص", ru:"Показать краткое", 
    bn:"সারাংশ দেখাও", ta:"சுருக்கத்தை காட்டு", te:"సారాంశం చూపు", mr:"सारांश दाखवा", gu:"સારાંશ બતાવો"
  },
  hide_summary: {
    en:"Hide summary", hi:"सारांश छिपाएँ", es:"Ocultar resumen", fr:"Masquer le résumé", de:"Zusammenfassung ausblenden",
    it:"Nascondi riepilogo", "pt-BR":"Ocultar resumo", "pt-PT":"Ocultar resumo", ja:"要約を隠す", ko:"요약 숨기기",
    "zh-CN":"隐藏摘要", "zh-TW":"隱藏摘要", ar:"إخفاء الملخّص", ru:"Скрыть краткое", 
    bn:"সারাংশ লুকাও", ta:"சுருக்கத்தை மறை", te:"సారాంశం దాచు", mr:"सारांश लपवा", gu:"સારાંશ છુપાવો"
  },

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
// Text normalisation function for Token Optimisation # TODO - use it in the analysis functions - Sourish 20251029
function normalizeText(text) {
   // Usage const optimized = normalizeText("Hello, World! How are you?");
    return text
        .toLowerCase()                    // Convert to lowercase
        .replace(/[^\w\s]/g, '')         // Remove punctuation
        .replace(/\s+/g, ' ')            // Normalize whitespace
        .trim();                         // Remove leading/trailing spaces
}
// Stop words removal for Token Optimisation # TODO - use it in the analysis functions - Sourish 20251029
const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
function removeStopWords(tokens) {
   /*
   Usage
   const tokens = ['the', 'quick', 'brown', 'fox', 'is', 'jumping'];
   const filtered = removeStopWords(tokens);
   */
    return tokens.filter(token => !stopWords.has(token.toLowerCase()));
}
// Stemming for Token Optimisation # TODO - use it in the analysis functions - Sourish 20251029
function simpleStem(word) {
   /*
   Usage
   const stemmed = ['running', 'jumped', 'faster'].map(simpleStem);
   */
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 's'];
    
    for (let suffix of suffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 2) {
            return word.slice(0, -suffix.length);
        }
    }
    return word;
}
function detectPageLang(){
  const attr = document.documentElement.getAttribute('lang')?.toLowerCase();
  if (attr) return attr.split('-')[0];

  const meta = document.querySelector('meta[http-equiv="content-language"], meta[name="language"]')?.content;
  if (meta) return meta.split(',')[0].trim().toLowerCase().split('-')[0];

  const sample = (document.body.innerText || '').slice(0, 100);
  // If 70 or more characters in the sample belong to a script, assume that language
  const counts = {
   hi: (sample.match(/[\u0900-\u097F]/g) || []).length,    // Devanagari (Hindi, Marathi, Nepali)
    bn: (sample.match(/[\u0980-\u09FF]/g) || []).length,    // Bengali
    gu: (sample.match(/[\u0A80-\u0AFF]/g) || []).length,    // Gujarati
    pa: (sample.match(/[\u0A00-\u0A7F]/g) || []).length,    // Gurmukhi (Punjabi) - overlaps with gu sometimes
    or: (sample.match(/[\u0B00-\u0B7F]/g) || []).length,    // Oriya / Odia
    ta: (sample.match(/[\u0B80-\u0BFF]/g) || []).length,    // Tamil
    te: (sample.match(/[\u0C00-\u0C7F]/g) || []).length,    // Telugu
    kn: (sample.match(/[\u0C80-\u0CFF]/g) || []).length,    // Kannada
    ml: (sample.match(/[\u0D00-\u0D7F]/g) || []).length,    // Malayalam
    si: (sample.match(/[\u0D80-\u0DFF]/g) || []).length,    // Sinhala
    th: (sample.match(/[\u0E00-\u0E7F]/g) || []).length,    // Thai
    vi: (sample.match(/[\u0100-\u017F]/g) || []).length,    // Latin-extended (Vietnamese often uses diacritics) — heuristic only
    zh: (sample.match(/[\u4E00-\u9FFF]/g) || []).length,    // CJK Unified Ideographs (Chinese)
    ja: (sample.match(/[\u3040-\u30FF\u31F0-\u31FF]/g) || []).length, // Hiragana/Katakana
    ko: (sample.match(/[\uAC00-\uD7AF]/g) || []).length,    // Hangul (Korean)
    ar: (sample.match(/[\u0600-\u06FF\u0750-\u077F]/g) || []).length, // Arabic
    he: (sample.match(/[\u0590-\u05FF]/g) || []).length,    // Hebrew
    fa: (sample.match(/[\u0600-\u06FF]/g) || []).length,    // Persian shares Arabic block
    ru: (sample.match(/[\u0400-\u04FF]/g) || []).length,    // Cyrillic (Russian, Ukrainian etc.)
    el: (sample.match(/[\u0370-\u03FF]/g) || []).length     // Greek (rare)
  };
//   for (const [langCode, count] of Object.entries(counts)){
//     if (count >= 70) return langCode;
//   }
let best = {lang: 'en', count: 0};
  for (const [langCode, count] of Object.entries(counts)){
    if (count > best.count) best = {lang: langCode, count};
  }

  // threshold: require at least 8 characters of that script in the sample to be confident
  if (best.count >= 8) return best.lang;
return (navigator.language || 'en').toLowerCase().split('-')[0];
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
  if (el) {
    // ——— keep theme in sync ———
    const theme = await getTheme();
    setPanelTheme(el, theme);

    // ——— make sure language is applied even when panel already exists ———
    const select = el.querySelector('#agree-smart-translate');
    // If select has no value yet, try to auto-pick from detected page lang
    if (select && !select.value) {
      const dl = detectPageLang(); // e.g., 'ar'
      const opts = Array.from(select.options);
      const hit = opts.find(o => o.value === dl) || opts.find(o => o.value.startsWith(dl));
      if (hit) select.value = hit.value;
    }

    // Apply lang/dir attributes
    const code = (select?.value || 'en').split('-')[0];
    const rtl = new Set(['ar','he','fa','ur']);
    el.setAttribute('lang', code);
    el.setAttribute('dir', rtl.has(code) ? 'rtl' : 'ltr');

    // Localize current status line
    const status = el.querySelector('#agree-smart-status');
    if (status) status.textContent = tr('parsing', code);

    // ——— IMPORTANT: also localize the already-mounted Summary UI ———
    applySummaryUILocale(el, code);

    return el;
  }

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
      <div id="agree-smart-status" class="muted"></div>
      <div id="agree-smart-risk"></div>
      <div id="agree-smart-summary"></div>
      <div id="agree-smart-links"></div>
    </div>`;
  document.documentElement.appendChild(el);
  // set theme
const theme = await getTheme();
setPanelTheme(el, theme);

// auto-pick UI language
const dl = detectPageLang();                 // e.g., 'ar'
const select = el.querySelector('#agree-smart-translate');
if (select) {
  const opts = Array.from(select.options);
  const hit = opts.find(o => o.value === dl) || opts.find(o => o.value.startsWith(dl));
  if (hit) select.value = hit.value;
}
// set writing system + localize first status line
const code = (select.value || 'en').split('-')[0];   // e.g., "ar"
const rtl = new Set(['ar','he','fa','ur']);
el.setAttribute('lang', code);
el.setAttribute('dir', rtl.has(code) ? 'rtl' : 'ltr');

// localize initial status text (was hard-coded English)
const langNow = currentLang(el);
const status = el.querySelector('#agree-smart-status');
if (status) status.textContent = tr('parsing', langNow);


// Close: stop speech and remove
const closeBtn = el.querySelector('#agree-smart-close');
closeBtn.onclick = () => { ttsCancel(); el.remove(); };

// const theme = await getTheme(); setPanelTheme(el, theme);

// On language change: stop TTS and re-render with buttons alive
el.querySelector('#agree-smart-translate').addEventListener('change', async ()=>{
  ttsCancel();

  const lang2   = currentLang(el);
  const status  = el.querySelector('#agree-smart-status');
  const riskEl  = el.querySelector('#agree-smart-risk');
  const sumEl   = el.querySelector('#agree-smart-summary');
  const linksEl = el.querySelector('#agree-smart-links');
  const tgt     = el.querySelector('#agree-smart-translate').value || 'en';

  if (__agreewise_lastSummaryRaw){
    await renderSummary(
      sumEl,
      __agreewise_lastSummaryRaw,
      (tgt !== 'en') ? tgt : null,
      lang2,
      status
    );
  }

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

  if (__agreewise_lastLinkSums){
    await renderLinkSummaries(
      linksEl,
      __agreewise_lastLinkSums,
      lang2,
      (tgt !== 'en' ? tgt : null),
      status
    );
  } else {
    linksEl.innerHTML = '';
  }

  status.textContent = tr('done', lang2);
  applySummaryUILocale(el, lang2);

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
  // Clone the container so we don't mutate the page
  const clone = container.cloneNode(true);
  // remove non-human-readable elements
  clone.querySelectorAll('script, style, noscript, code, pre').forEach(el => el.remove());
  // also remove hidden elements
  Array.from(clone.querySelectorAll('*')).forEach(el => {
    const cs = window.getComputedStyle(el);
    if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) el.remove();
  });
  const text = (clone.innerText||'').replace(/\s+\n/g,'\n').replace(/\n{3,}/g,'\n\n');
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
function cleanTermsText(text) {
  // Remove version history / update notices / meta lines
  return text
    .replace(/see previous versions?/gi, "")
    .replace(/updated on\s+\d{1,2}\s+\w+\s+\d{4}/gi, "")
    .replace(/last (updated|modified)\s+[^\n]+/gi, "")
    .replace(/version\s+\d+(\.\d+)*/gi, "")
    .replace(/©\s*\d{4}.+/gi, "")
    .replace(/\n{2,}/g, "\n") // normalize line breaks
    .trim();
}

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
          const html = await r.text();
          const tmp = document.createElement('div');
          tmp.innerHTML = html;
          // Remove scripts, styles, code blocks before extracting text
          tmp.querySelectorAll('script, style, noscript, code, pre').forEach(el => el.remove());
          // also remove hidden elements to avoid template noise
          Array.from(tmp.querySelectorAll('*')).forEach(el => {
            const cs = window.getComputedStyle(el);
            if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) el.remove();
          });
          linked = tmp.innerText || '';
        }

      }
    }catch{}
  }
  const primary = linked.length > pageText.length*1.2 ? linked : pageText;
  const cleaned = cleanTermsText(primary);
return cleaned.replace(/\s+\n/g,'\n').replace(/\n{3,}/g,'\n\n').slice(0,20000);
}

/* =============================
   AI HELPERS
============================= */
function chunk(text, size=4000){ const out=[]; for(let i=0;i<text.length;i+=size) out.push(text.slice(i,i+size)); return out; }

// Simple heuristic categorization from chunks
function analyzeCategory(chunks){
  console.log('Analyzing category...');
  try{
    const txt = (chunks||[]).join('\n').toLowerCase();
    const score = (words)=> words.reduce((s,w)=> s + (txt.includes(w)?1:0), 0);
   const categories = [
  // 1 — Social Media / Community / Communication
  [1, [
    'follow','follower','like','share','comment','friends','friend list','timeline','feed','profile',
    'post','story','stories','dm','direct message','inbox','chat','group','channel','community',
    'social media','social network','content creator','influencer','page','followers','tag','mention',
    'upload photo','upload video','livestream','live stream','react','emoji','block user','report abuse',
    'moderator','admin','followers count','engagement','reel','status update','public post','private message'
  ]],

  // 2 — Payment / Financial / Subscription / Billing
  [2, [
    'payment','payout','billing','invoice','subscription','auto-renew','renewal','card','credit card','debit card',
    'upi','net banking','wallet','transaction','bank account','refund','chargeback','emi','installment',
    'fee','fees','service fee','tax','gst','vat','discount','coupon','offer code','billing cycle','statement',
    'account balance','payouts','withdraw','transfer','funds','deposit','money','subscription plan','trial period',
    'renew automatically','cancel subscription','recurring payment','payment gateway','merchant account'
  ]],

  // 3 — E-Commerce / Marketplace / Retail
  [3, [
    'cart','add to cart','checkout','order','order id','shipment','delivery','shipping','tracking number','seller','buyer',
    'merchant','marketplace','product','item','sku','inventory','warehouse','fulfillment','return','return policy',
    'exchange','refund policy','replace','cancel order','offer','discount','deal','price','review','rating','wishlist',
    'store','shop','customer','vendor','invoice','receipt','packing','delivery partner','order confirmation','out of stock'
  ]],

  // 4 — Job / Career / Hiring / HR
  [4, [
    'job','career','employment','resume','cv','curriculum vitae','applicant','candidate','recruiter','recruitment',
    'application','apply now','job application','hiring','interview','shortlist','offer letter','background check',
    'onboarding','probation','internship','intern','employer','employee','human resources','hr','payroll',
    'salary','compensation','performance review','promotion','termination','resignation','vacancy','job portal',
    'career page','job description','skills required','qualifications','experience required','remote work','work from home'
  ]]
];

    let best = [0, 0];
    for (const [id, words] of categories){ const sc = score(words); if (sc > best[1]) best = [id, sc]; }
    return best[1] > 0 ? best[0] : 0;
  }catch{ return 0; }
}

async function summarizeChunks(chunks, mode='key-points'){
  if ('Summarizer' in self && typeof Summarizer.availability==='function'){
    try{
      const a = await Summarizer.availability();
      if (a && a!=='unavailable'){
        const summarizer = await Summarizer.create({ type: mode==='key-points'?'key-points':'default', format:'markdown', length:'medium' });
        const parts=[]; for (const c of chunks){ parts.push(await summarizer.summarize(c)); if (parts.length>=6) break; }
        const category = await analyzeCategory(chunks);
        return { text: parts.join('\n'), category };
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
  const category = await analyzeCategory(chunks);
  return { text: out.join('\n'), category };
}
async function extractRisks(fullText, category = 0, opts={}){
  if (!('LanguageModel' in self) || typeof LanguageModel.availability!=='function') throw new Error('Prompt API not supported');
  const av = await LanguageModel.availability(); if (av==='unavailable') throw new Error('Language model unavailable');
  const session = await LanguageModel.create({ expectedInputs:[{type:'text',languages:['en']}], expectedOutputs:[{type:'text',languages:['en']}] });
  const ENTERPRISE_MODE = !!opts.enterprise;
  const LOCATION_COUNTRY = (opts.locationCountry || '').toUpperCase();
  const schema = {
    type:"object", properties:{
      // Common fields (all categories)
      collectsPersonalData:{type:"boolean"}, sharesWithThirdParties:{type:"boolean"}, tracksForAds:{type:"boolean"},
      arbitrationOrClassActionWaiver:{type:"boolean"}, autoRenewalOrSubscription:{type:"boolean"},
      accountDeletionProcess:{type:"string"}, dataRetentionPeriod:{type:"string"}, jurisdictionGoverningLaw:{type:"string"},
      ageRestrictions:{type:"string"}, notableOtherRisks:{type:"array", items:{type:"string"}},
      // Category 1 (Social Media) fields
      under18HandlingAndParentalRights:{type:"string"}, prohibitedConductCoverage:{type:"string"},
      // Category 2 (Payment/Financial) fields
      financialDataStoredAndDuration:{type:"string"}, kycAmlAndAccountFreezes:{type:"string"}, unauthorizedTransactionLiability:{type:"string"},
      // Category 3 (E-commerce) fields
      warrantyDefectPolicyAndJurisdiction:{type:"string"}, buyNowPayLaterAndLateFees:{type:"string"},
      // Category 4 (Job/Career) fields
      dataRetentionAfterJobClosure:{type:"string"},
      // Enterprise/Location (optional; harmless if absent)
      ipClauseConflicts:{type:"boolean"},
      dataResidencyMatchesUser:{type:"boolean"},
      storageMechanismStrength:{type:"string"},
      securityStandards:{type:"string"},
      breachNoticeWindow:{type:"string"},
      ssoSamlSupport:{type:"boolean"},
      subprocessorDisclosure:{type:"string"},
      ipDisputeJurisdiction:{type:"string"},
      ipDisputeMatchesUser:{type:"boolean"}
    },
    required:["collectsPersonalData","sharesWithThirdParties","tracksForAds","arbitrationOrClassActionWaiver","autoRenewalOrSubscription"]
  };
  
  // ✅ Use global fallback in case prompts.js isn't loaded yet
  const promptsGlobal = (typeof window !== 'undefined' && window.RISK_EXTRACTION_PROMPTS) 
    ? window.RISK_EXTRACTION_PROMPTS 
    : (typeof RISK_EXTRACTION_PROMPTS !== 'undefined' ? RISK_EXTRACTION_PROMPTS : null);

  // Category prompt (fall back to default template)
  const categoryPrompt = (promptsGlobal && promptsGlobal[category])
    ? promptsGlobal[category]
    : (promptsGlobal && promptsGlobal[0]) || 
`# INSTRUCTIONS
Return a single valid JSON object that exactly matches the schema. DO NOT include any of the prompt text, examples, or instructions in the field values. For unknown fields, return false for booleans and an empty string for strings.
TERMS:
`;

  const chunks = chunk(fullText, 4000);
  const allResults = [];

  // small sanitizer helpers
  function isPlaceholderStringForKey(key, value){
    if (typeof value !== 'string') return false;
    const v = value.trim();
    if (!v) return true;
    if (v.toLowerCase() === key.toLowerCase()) return true;               // exact field-name echo
    if (/^<.*>$/.test(v)) return true;                                   // markup-like
    if (/not specified|n\/a|none|unspecified/i.test(v)) return true;     // obvious placeholders
    if (/^\w+$/.test(v) && /[A-Z]/.test(key)) {                          // camelCase echo heuristic
      // e.g. "jurisdictionGoverningLaw" returned as value
      if (v === key) return true;
    }
    return false;
  }

  function sanitizeStringField(key, value){
    if (value === null || value === undefined) return '';
    if (typeof value !== 'string') return String(value || '');
    let s = value.trim();
    // remove leading/trailing angle brackets and markdown bullets that sometimes leak
    s = s.replace(/^[#\-\*]+\s*/g, '').replace(/[<>]/g, '').trim();
    if (isPlaceholderStringForKey(key, s)) return '';
    return s;
  }

  // Process each chunk
  for (let i = 0; i < chunks.length; i++) {
    const policyCtx =
      `\n\n# CONTEXT\nENTERPRISE_MODE=${ENTERPRISE_MODE}\n` +
      (LOCATION_COUNTRY ? `LOCATION_COUNTRY=${LOCATION_COUNTRY}\n` : ``);

    const prompt = categoryPrompt + policyCtx + "\n" + "TERMS:\n" + chunks[i] + "\n\nReturn only valid JSON.";
    let raw;
    try {
      raw = await session.prompt(prompt, { responseConstraint: schema });
    } catch (e) {
      // model couldn't obey constraint — request relaxed JSON response
      console.warn('[AgreeWise] prompt with responseConstraint failed, retrying without constraint:', e);
      raw = await session.prompt(prompt + "\n\nPlease respond with a single JSON object that matches the schema.");
    }

    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      // attempt to extract JSON substring as a fallback
      console.warn('[AgreeWise] JSON.parse failed; attempting substring extraction. Raw:', raw);
      const m = raw.match(/\{[\s\S]*\}$/);
      try {
        parsed = m ? JSON.parse(m[0]) : {};
      } catch (e2) {
        console.warn('[AgreeWise] fallback parse also failed:', e2);
        parsed = {};
      }
    }

    // --- SANITIZE parsed object immediately ---
    // ensure fields exist, coerce types, and remove placeholder echoes
    const clean = {};
    for (const [k, v] of Object.entries(parsed || {})) {
      // booleans: keep as-is if boolean, else coerce falsy->false
      if (schema.properties[k] && schema.properties[k].type === 'boolean') {
        clean[k] = (typeof v === 'boolean') ? v : false;
        continue;
      }

      // arrays (notableOtherRisks) - coerce to array of strings and sanitize elements
      if (schema.properties[k] && schema.properties[k].type === 'array') {
        if (Array.isArray(v)) {
          clean[k] = v.map(x => sanitizeStringField(k, x)).filter(s => s);
        } else if (typeof v === 'string' && v.trim()) {
          // sometimes LM returns comma/newline separated string
          const parts = v.split(/[\n,·•;]+/).map(p => sanitizeStringField(k, p)).filter(s => s);
          clean[k] = parts;
        } else {
          clean[k] = [];
        }
        continue;
      }

      // strings and others: sanitize
      clean[k] = sanitizeStringField(k, v);
    }

    // Ensure required boolean fields are present (default false)
    for (const req of schema.required || []) {
      if (!(req in clean)) clean[req] = false;
    }

    allResults.push(clean);
  }

  // Helper function to find first non-empty string value across all results
  const findFirstNonEmpty = (fieldName) => {
    const v = allResults.find(r => r[fieldName] && String(r[fieldName]).trim());
    return v ? v[fieldName] : '';
  };

  // Merge results from all chunks
  const merged = {
    // Common boolean fields (use OR logic - if any chunk says true, it's true)
    collectsPersonalData: allResults.some(r => r.collectsPersonalData === true),
    sharesWithThirdParties: allResults.some(r => r.sharesWithThirdParties === true),
    tracksForAds: allResults.some(r => r.tracksForAds === true),
    arbitrationOrClassActionWaiver: allResults.some(r => r.arbitrationOrClassActionWaiver === true),
    autoRenewalOrSubscription: allResults.some(r => r.autoRenewalOrSubscription === true),

    // Common string fields (first non-empty)
    accountDeletionProcess: findFirstNonEmpty('accountDeletionProcess') || '',
    dataRetentionPeriod: findFirstNonEmpty('dataRetentionPeriod') || '',
    jurisdictionGoverningLaw: findFirstNonEmpty('jurisdictionGoverningLaw') || '',
    ageRestrictions: findFirstNonEmpty('ageRestrictions') || '',
    notableOtherRisks: Array.from(new Set(
      allResults
        .flatMap(r => r.notableOtherRisks || [])
        .filter(item => item && item.trim())
    )).slice(0, 5),

    // Category specific
    under18HandlingAndParentalRights: findFirstNonEmpty('under18HandlingAndParentalRights') || '',
    prohibitedConductCoverage: findFirstNonEmpty('prohibitedConductCoverage') || '',
    financialDataStoredAndDuration: findFirstNonEmpty('financialDataStoredAndDuration') || '',
    kycAmlAndAccountFreezes: findFirstNonEmpty('kycAmlAndAccountFreezes') || '',
    unauthorizedTransactionLiability: findFirstNonEmpty('unauthorizedTransactionLiability') || '',
    warrantyDefectPolicyAndJurisdiction: findFirstNonEmpty('warrantyDefectPolicyAndJurisdiction') || '',
    buyNowPayLaterAndLateFees: findFirstNonEmpty('buyNowPayLaterAndLateFees') || '',
    dataRetentionAfterJobClosure: findFirstNonEmpty('dataRetentionAfterJobClosure') || '',

    // Enterprise/location optional fields (may be undefined)
    ipClauseConflicts: allResults.some(r => r.ipClauseConflicts === true),
    dataResidencyMatchesUser: (typeof allResults.find(r => r.dataResidencyMatchesUser !== undefined)?.dataResidencyMatchesUser !== 'undefined')
      ? !!allResults.find(r => r.dataResidencyMatchesUser !== undefined).dataResidencyMatchesUser
      : undefined,
    storageMechanismStrength: findFirstNonEmpty('storageMechanismStrength') || '',
    securityStandards: findFirstNonEmpty('securityStandards') || '',
    breachNoticeWindow: findFirstNonEmpty('breachNoticeWindow') || '',
    ssoSamlSupport: (typeof allResults.find(r => typeof r.ssoSamlSupport !== 'undefined')?.ssoSamlSupport !== 'undefined')
      ? !!allResults.find(r => typeof r.ssoSamlSupport !== 'undefined').ssoSamlSupport
      : undefined,
    subprocessorDisclosure: findFirstNonEmpty('subprocessorDisclosure') || '',
    ipDisputeJurisdiction: findFirstNonEmpty('ipDisputeJurisdiction') || '',
    ipDisputeMatchesUser: (typeof allResults.find(r => typeof r.ipDisputeMatchesUser !== 'undefined')?.ipDisputeMatchesUser !== 'undefined')
      ? !!allResults.find(r => typeof r.ipDisputeMatchesUser !== 'undefined').ipDisputeMatchesUser
      : undefined
  };

  // compute score (same logic you had)
  let score=100;
  if (merged.collectsPersonalData) score-=15;
  if (merged.sharesWithThirdParties) score-=20;
  if (merged.tracksForAds) score-=10;
  if (merged.arbitrationOrClassActionWaiver) score-=20;
  if (merged.autoRenewalOrSubscription) score-=10;
  if (opts && opts.enterprise) {
    if (merged.ipClauseConflicts) score -= 10;
    if (LOCATION_COUNTRY && merged.dataResidencyMatchesUser === false) score -= 15;
    if (LOCATION_COUNTRY && merged.ipDisputeMatchesUser === false) score -= 8;
    if (merged.ssoSamlSupport === false) score -= 5;
  }
  merged.__score = Math.max(0, Math.min(100, score));
  return merged;
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
async function translateArray(arr, targetLang, statusEl, langForStatus='en') {
  if (!targetLang || targetLang === 'en' || !arr || !arr.length) return arr;

  // Use numbered tokens unlikely to be changed by translation
  const markers = arr.map((_, i) => `<<<ITEM_${i}>>>`);
  const joined = arr.map((t, i) => `${markers[i]}\n${t}`).join('\n');
  
  const translated = await maybeTranslate(joined, targetLang, statusEl, langForStatus);

  // Re-split using regex to capture clean blocks after translation
  const parts = [];
  for (let i = 0; i < markers.length; i++) {
    const regex = new RegExp(`${markers[i]}([\\s\\S]*?)(?=${markers[i+1]}|$)`, 'i');
    const match = translated.match(regex);
    if (match) {
      const clean = match[1]
        .replace(/awsep/gi, '')     // remove noise
        .replace(/<</g, '')         // remove stray brackets
        .replace(/>>/g, '')
        .trim();
      parts.push(clean);
    } else {
      parts.push('');
    }
  }

  return parts;
}


/* =============================
   TTS (queue + pause/resume + cancel)
============================= */
const LANG_TAGS = {
  "en":"en-US","hi":"hi-IN","es":"es-ES","fr":"fr-FR","de":"de-DE","it":"it-IT",
  "pt-BR":"pt-BR","pt-PT":"pt-PT","ja":"ja-JP","ko":"ko-KR","zh-CN":"zh-CN",
  "zh-TW":"zh-TW","ar":"ar-SA","ru":"ru-RU","bn":"bn-IN","ta":"ta-IN","te":"te-IN",
  "mr":"mr-IN","gu":"gu-IN"
};

let __ttsQueue = [];
let __ttsSpeaking = false;
let __ttsPaused = false;

function ttsCancel(){
  try { window.speechSynthesis?.cancel(); } catch {}
  __ttsQueue = [];
  __ttsSpeaking = false;
  __ttsPaused = false;
}

function ttsEnqueue(text, langTag='en-US', rate=1.0, pitch=1.0){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langTag;
  u.rate = rate;
  u.pitch = pitch;
  u.onend = ()=> {
    __ttsSpeaking = false;
    __ttsPaused = false;
    if (__ttsQueue.length) ttsPlayQueue();
  };
  u.onerror = ()=> { __ttsSpeaking = false; __ttsPaused = false; };
  __ttsQueue.push(u);
}

function ttsPlayQueue(){
  if (!__ttsQueue.length || __ttsSpeaking) return;
  const next = __ttsQueue.shift();
  __ttsSpeaking = true;
  __ttsPaused = false;
  window.speechSynthesis.speak(next);
}

function ttsPause(){
  if (!__ttsSpeaking || __ttsPaused) return;
  window.speechSynthesis.pause();
  __ttsPaused = true;
}

function ttsResume(){
  if (!__ttsSpeaking || !__ttsPaused) return;
  window.speechSynthesis.resume();
  __ttsPaused = false;
}

function ensureVoicesLoaded(){
  return new Promise((resolve)=>{
    const v = window.speechSynthesis?.getVoices() || [];
    if (v.length) return resolve(v);
    const on = ()=>{ resolve(window.speechSynthesis.getVoices()||[]); };
    window.speechSynthesis?.addEventListener('voiceschanged', on, {once:true});
    // Fallback ping
    setTimeout(on, 500);
  });
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
    out.push({href, summary: (sum && sum.text) ? sum.text : sum});
    if (out.length>=5) break;
  } return out;
}
function applySummaryUILocale(panel, code){
  // Summary header text
  const sumHdr = panel.querySelector('#agree-smart-summary .aw-sum strong');
  if (sumHdr) sumHdr.textContent = tr('summary_heading', code);

  // Show/Hide button text
  const showBtn = panel.querySelector('#agree-smart-summary #aw-sum-show');
  if (showBtn) {
    const expanded = panel.querySelector('#agree-smart-summary')?.dataset?.expanded === 'true';
    showBtn.textContent = expanded ? tr('hide_summary', code) : tr('show_summary', code);
  }
}

/* =============================
   RENDER HELPERS
============================= */
function dot(ok){ return ok?'<span class="ok">●</span>':'<span class="bad">●</span>'; }

// Collapsible summary
async function renderSummary(sumEl, bulletsText, targetLangOrNull, uiLang, statusEl){
  if (!sumEl) return;

  sumEl.dataset.raw = bulletsText || '';
  sumEl.dataset.tgt = targetLangOrNull || '';

  sumEl.innerHTML = `
    <div id="aw-sum-collapsible" class="aw-sum">
      <div class="aw-sum-bar" style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px">
       <strong style="font-size:13px">${tr('summary_heading', uiLang)}</strong>
        <div class="aw-sum-actions" style="display:flex;align-items:center;gap:8px">
          <button id="aw-sum-show" type="button">${tr('show_summary', uiLang)}</button>
          <button id="aw-sum-tts" type="button" title="Read aloud" style="display:none">🔊</button>
        </div>
      </div>
      <div id="aw-sum-body" hidden style="white-space:pre-wrap;margin-top:6px"></div>
    </div>
  `;

  const body   = sumEl.querySelector('#aw-sum-body');
  const show   = sumEl.querySelector('#aw-sum-show');
  const ttsBtn = sumEl.querySelector('#aw-sum-tts');

  if (!body || !show || !ttsBtn) return;

  // Prepare summary text (translate first if needed)
  let renderText = bulletsText || '';
  if (targetLangOrNull) {
    if (statusEl) statusEl.textContent = tr('translating', uiLang);
    try {
      renderText = await maybeTranslate(
        renderText.replace(/^[#]+\s+/gm, ''),
        targetLangOrNull,
        statusEl,
        uiLang
      );
    } catch {}
    if (statusEl) statusEl.textContent = tr('done', uiLang);
  }
  body.textContent = renderText.replace(/^[#]+\s+/gm, '');

  // Toggle behavior
  sumEl.dataset.expanded = 'false';
  show.addEventListener('click', ()=>{
    const open = sumEl.dataset.expanded === 'true';
    const next = !open;
    sumEl.dataset.expanded = next ? 'true' : 'false';
    body.hidden = !next;
    show.textContent = next ? tr('hide_summary', uiLang) : tr('show_summary', uiLang);
    ttsBtn.style.display = next ? '' : 'none';
    if (!next) ttsCancel(); // stop if collapsing
  });

  // TTS play/pause/resume
  ttsBtn.addEventListener('click', async ()=>{
    if (!window.speechSynthesis) return;
    await ensureVoicesLoaded();
    const panel = document.getElementById('agree-smart-panel');
    const langCode = panel?.querySelector('#agree-smart-translate')?.value || 'en';
    const langTag  = LANG_TAGS[langCode] || 'en-US';

    if (!__ttsSpeaking) {
      const text = (body.innerText || '')
        .replace(/^[#]+\s+/gm, '')
        .replace(/^\s*[-*•]\s*/gm, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      if (!text) return;
      ttsCancel();
      ttsEnqueue(text, langTag, 1.0, 1.0);
      ttsPlayQueue();
      ttsBtn.textContent = '⏸️';
      return;
    }

    if (__ttsPaused) {
      ttsResume();
      ttsBtn.textContent = '⏸️';
    } else {
      ttsPause();
      ttsBtn.textContent = '▶️';
    }
  });
}

async function renderRiskBlock(riskEl, parsedRaw, score, lang, targetLang, statusEl){
  // helper to clean values and map empty/placeholder -> localized not_specified
  function cleanAndLocalize(value, lang) {
    // if parsedRaw has no real text values, ensure fields are empty strings (not "jurisdictionGoverningLaw")
['jurisdictionGoverningLaw','dataRetentionPeriod','accountDeletionProcess','ageRestrictions']
  .forEach(k => { if (!parsedRaw[k] || String(parsedRaw[k]).trim().length===0) parsedRaw[k] = ''; });

    if (value === null || value === undefined) return tr('not_specified', lang);
    let s = String(value).trim();
    // common placeholder tokens or literal 'undefined' -> unspecified
    if (!s || s.toLowerCase() === 'undefined' || /^<<.*>>$/.test(s) || /^<.*>$/.test(s)) return tr('not_specified', lang);
    // remove stray angle brackets and excessive whitespace
    s = s.replace(/[<>]/g, '').replace(/\s{2,}/g, ' ').trim();
    return s || tr('not_specified', lang);
  }

  const rawVals = [
    parsedRaw.jurisdictionGoverningLaw,
    parsedRaw.dataRetentionPeriod,
    parsedRaw.accountDeletionProcess,
    parsedRaw.ageRestrictions,
    ...(parsedRaw.notableOtherRisks || []).slice(0, 5)
  ];

  // Translate if requested (translateArray returns array in same order)
  let [jur, retention, deletion, age, ...other] =
    (targetLang ? await translateArray(rawVals, targetLang, statusEl, lang) : rawVals);

  // Clean & localize every field (use UI language for localized "Not specified")
  jur = cleanAndLocalize(jur, lang);
  retention = cleanAndLocalize(retention, lang);
  deletion = cleanAndLocalize(deletion, lang);
  age = cleanAndLocalize(age, lang);
  other = (other || []).map(v => cleanAndLocalize(v, lang)).filter(v => v && v !== tr('not_specified', lang));

  const flags = [
    [tr('collects', lang), parsedRaw.collectsPersonalData],
    [tr('shares', lang), parsedRaw.sharesWithThirdParties],
    [tr('ads', lang), parsedRaw.tracksForAds],
    [tr('arbitration', lang), parsedRaw.arbitrationOrClassActionWaiver],
    [tr('autorenew', lang), parsedRaw.autoRenewalOrSubscription]
  ].map(([label, v]) => `<div>${v ? dot(false) : dot(true)} ${label}</div>`).join('');

  riskEl.innerHTML = `
    <div class="grid" style="margin-bottom:8px">${flags}</div>
    <div class="muted" style="margin-bottom:6px">${tr('jurisdiction', lang)}</div><div>${jur}</div>
    <div class="muted" style="margin-top:6px">${tr('data_retention', lang)}</div><div>${retention}</div>
    <div class="muted" style="margin-top:6px">${tr('account_deletion', lang)}</div><div>${deletion}</div>
    <div class="muted" style="margin-top:6px">${tr('age', lang)}</div><div>${age}</div>
    <div class="muted" style="margin-top:6px">${tr('other_risks', lang)}</div><div>${(other || []).join(' · ') || tr('not_specified', lang)}</div>
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
chrome.runtime.onMessage.addListener((msg)=>{
  if (msg?.type === 'AGREE_SMART_THEME_CHANGED') {
    const el = document.getElementById('agree-smart-panel');
    if (el) setPanelTheme(el, msg.theme === 'dark' ? 'dark' : 'light');
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
  console.log(sectionSummary.category)
  let out = (sectionSummary && sectionSummary.text) ? sectionSummary.text : sectionSummary; // just the summary text
  console.log('Section summary:', out);
  const category = sectionSummary?.category ?? 0; // Get category from summary, default to 0 if not available
  status.textContent = tr('extracting_risks', lang);
  // Token optimization: normalize -> remove stop words -> stem
  const __normSel = normalizeText(out || '');
  const __tokSel = __normSel.split(/\s+/).filter(Boolean);
  const __noStopSel = removeStopWords(__tokSel);
  const __stemSel = __noStopSel.map(simpleStem);
  const __optimizedSel = __stemSel.join(' ');
// Change both flows to pass the original full text
  const { agreeEnterpriseMode, agreeLocationCountry } = await getEnterpriseSettings();
 const parsed = await extractRisks(text, category, {
   enterprise: !!agreeEnterpriseMode,
   locationCountry: (agreeLocationCountry || '').trim()
 });

  __agreewise_lastParsed = parsed;

  await renderRiskBlock(
    riskEl,
    parsed,
    parsed.__score,
    lang,
    (targetLang!=='en'?targetLang:null),
    status
  );


  __agreewise_lastSummaryRaw = out;

  await renderSummary(
    sumEl,
    out,
    (targetLang && targetLang !== 'en') ? targetLang : null,
    lang,
    status
  );

  // if (links && links.length){
  //   status.textContent = tr('following_links', lang);
  //   const linkSums = await summarizeLinks(links);
  //   __agreewise_lastLinkSums = linkSums;
  //   await renderLinkSummaries(linksEl, linkSums, lang, (targetLang!=='en'?targetLang:null), status);
  // } else {
  //   __agreewise_lastLinkSums = null;
  //   linksEl.innerHTML = '';
  // }

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
  console.log(parts.category)
  let out = (parts && parts.text) ? parts.text : parts; // just the summary text
  const category = parts?.category ?? 0; // Get category from summary, default to 0 if not available
  status.textContent = tr('extracting_risks', lang);
  // Token optimization: normalize -> remove stop words -> stem
  const __normPage = normalizeText(out || '');
  const __tokPage = __normPage.split(/\s+/).filter(Boolean);
  const __noStopPage = removeStopWords(__tokPage);
  const __stemPage = __noStopPage.map(simpleStem);
  const __optimizedPage = __stemPage.join(' ');
 //
 const { agreeEnterpriseMode, agreeLocationCountry } = await getEnterpriseSettings();
 const parsed = await extractRisks(text, category, {
   enterprise: !!agreeEnterpriseMode,
   locationCountry: (agreeLocationCountry || '').trim()
 });
  __agreewise_lastParsed = parsed;

  await renderRiskBlock(
    riskEl,
    parsed,
    parsed.__score,
    lang,
    (targetLang!=='en'?targetLang:null),
    status
  );

  
  __agreewise_lastSummaryRaw = out;

  await renderSummary(
    sumEl,
    out,
    (targetLang && targetLang !== 'en') ? targetLang : null,
    lang,
    status
  );

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
