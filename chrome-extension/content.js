// §.RAWR.§ Content Script

console.log('🦖 §.RAWR.§ Loaded');

// ── Sidebar Creation ──
const container = document.createElement('div');
container.id = 'rawr-sidebar-container';
container.innerHTML = `<iframe id="rawr-iframe" src="${chrome.runtime.getURL('sidebar.html')}"></iframe>`;
document.body.appendChild(container);

// ── Trigger Button § ──
const btn = document.createElement('div');
btn.id = 'rawr-trigger-btn';
btn.textContent = '§';
btn.title = 'Abrir Exocórtex';
btn.onclick = () => {
  container.classList.toggle('open');
};
document.body.appendChild(btn);

// ── Listen for background script toggle ──
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'RAWR_TOGGLE_SIDEBAR') {
    container.classList.toggle('open');
  }
});

// ── Listen for messages from Sidebar (origin-verified) ──
const extensionOrigin = new URL(chrome.runtime.getURL('/')).origin;

window.addEventListener('message', (event) => {
  // Fix 2: Validate origin — only accept messages from our extension iframe
  if (event.origin !== extensionOrigin) return;

  if (event.data.type === 'RAWR_INJECT') {
    injectText(event.data.content);
  } else if (event.data.type === 'RAWR_GET_SELECTION') {
    const selection = window.getSelection().toString();
    const iframe = document.getElementById('rawr-iframe');
    iframe.contentWindow.postMessage({ type: 'RAWR_SELECTION_TEXT', text: selection }, extensionOrigin);
  } else if (event.data.type === 'RAWR_CLOSE_SIDEBAR') {
    container.classList.remove('open');
  }
});

// ── Heuristic Injection Logic for LLMs ──
function injectText(text) {
  // 1. Try active element first
  const active = document.activeElement;
  if (active && (active.tagName === 'TEXTAREA' || active.getAttribute('contenteditable') === 'true')) {
    insertAtCursor(active, text);
    return;
  }

  // 2. Fix 6: Robust fallback selectors (multiple per LLM)
  const selectors = [
    // Claude
    'div[contenteditable="true"].ProseMirror',
    'div.ProseMirror[contenteditable="true"]',
    // ChatGPT (multiple known selectors)
    '#prompt-textarea',
    'div[id="prompt-textarea"]',
    'textarea[data-id="root"]',
    // Gemini
    'div[contenteditable="true"][role="textbox"]',
    'rich-textarea div[contenteditable="true"]',
    // Grok
    'textarea[placeholder]',
    'div[contenteditable="true"][data-placeholder]',
    // Generic last resort
    'div[contenteditable="true"]',
    'textarea'
  ];

  let target = null;
  for (const sel of selectors) {
    target = document.querySelector(sel);
    if (target) break;
  }

  if (target) {
    target.focus();
    // Small delay for React hydration
    setTimeout(() => insertAtCursor(target, text), 50);
  } else {
    alert('⚠️ No encontré dónde escribir. Haz click en el input del chat y prueba de nuevo.');
  }
}

// Fix 7: Modern insertion using Selection/Range API instead of execCommand
function insertAtCursor(el, text) {
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    el.value = val.substring(0, start) + text + val.substring(end);
    el.selectionStart = el.selectionEnd = start + text.length;
    // Trigger input event for React-controlled inputs
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // ContentEditable — use Selection API (modern replacement for execCommand)
    el.focus();
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      // Fallback: append at end
      el.textContent += text;
    }
    // Trigger input for frameworks
    el.dispatchEvent(new InputEvent('input', { bubbles: true, data: text, inputType: 'insertText' }));
  }
}
