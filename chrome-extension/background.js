// §.RAWR.§ Background Service Worker

// Toggle sidebar when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Only act on supported sites
  const supportedSites = [
    'https://claude.ai',
    'https://chatgpt.com',
    'https://gemini.google.com',
    'https://grok.com'
  ];

  const isSupported = supportedSites.some(site => tab.url?.startsWith(site));

  if (isSupported) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'RAWR_TOGGLE_SIDEBAR' });
    } catch {
      // Content script not injected yet, inject it first
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['styles.css']
      });
      // Retry toggle after injection
      setTimeout(async () => {
        await chrome.tabs.sendMessage(tab.id, { type: 'RAWR_TOGGLE_SIDEBAR' });
      }, 500);
    }
  }
});
