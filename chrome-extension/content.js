// §.RAWR.§ Content Script

console.log('🦖 §.RAWR.§ Loaded');

// Create Sidebar
const container = document.createElement('div');
container.id = 'rawr-sidebar-container';
container.innerHTML = `<iframe id="rawr-iframe" src="${chrome.runtime.getURL('sidebar.html')}"></iframe>`;
document.body.appendChild(container);

// Create Trigger Button
const btn = document.createElement('div');
btn.id = 'rawr-trigger-btn';
btn.textContent = '§';
btn.title = 'Abrir Exocórtex';
btn.onclick = () => {
  container.classList.toggle('open');
};
document.body.appendChild(btn);

// Listen for messages from Sidebar
window.addEventListener('message', (event) => {
  if (event.data.type === 'RAWR_INJECT') {
    injectText(event.data.content);
  } else if (event.data.type === 'RAWR_GET_SELECTION') {
    const selection = window.getSelection().toString();
    const iframe = document.getElementById('rawr-iframe');
    iframe.contentWindow.postMessage({ type: 'RAWR_SELECTION_TEXT', text: selection }, '*');
  }
});

// Heuristic Injection Logic for different LLMs
function injectText(text) {
  // 1. Try generic active element
  const active = document.activeElement;
  if (active && (active.tagName === 'TEXTAREA' || active.getAttribute('contenteditable') === 'true')) {
    insertAtCursor(active, text);
    return;
  }

  // 2. Try specific selectors if active element fails
  const claudeInput = document.querySelector('div[contenteditable="true"].ProseMirror'); // Claude
  const chatgptInput = document.querySelector('#prompt-textarea'); // ChatGPT
  const geminiInput = document.querySelector('div[contenteditable="true"][role="textbox"]'); // Gemini (approx)

  const target = claudeInput || chatgptInput || geminiInput;

  if (target) {
    target.focus();
    insertAtCursor(target, text);
  } else {
    alert('⚠️ No encontré dónde escribir using §.RAWR.§. Haz click en el input del chat y prueba de nuevo.');
  }
}

function insertAtCursor(el, text) {
  if (el.tagName === 'TEXTAREA') {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    el.value = val.substring(0, start) + text + val.substring(end);
    el.selectionStart = el.selectionEnd = start + text.length;
    // Trigger input event for React-controlled inputs
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // ContentEditable
    document.execCommand('insertText', false, text);
  }
}
