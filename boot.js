// Tiny, reliable responder so ping never fails.
(() => {
  if (window.__agreewiseBoot) return;
  window.__agreewiseBoot = true;
  console.debug('AgreeWise boot.js loaded on', location.href);

  chrome.runtime.onMessage.addListener((msg, _s, sendResponse)=>{
    if (msg?.type === 'AGREE_SMART_PING' || msg?.type === 'AGREEWISE_BOOT_PING'){
      try { sendResponse({ok:true, who:'boot'}); } catch {}
      return true;
    }
  });
})();
