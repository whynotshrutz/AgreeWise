// Context menu: selection-first analysis
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "agreewise-analyze-selection",
      title: "Analyze selection with AgreeWise",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "agreewise-analyze-selection" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: "AGREE_SMART_ANALYZE_SELECTION" });
  }
});
chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (msg?.type === 'agreewise:settings:update') {
    const { enterprise, location } = msg.payload || {};
    // Apply policy switches here
  }
});
