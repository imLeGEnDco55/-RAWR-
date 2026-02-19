const API_URL = "http://localhost:8000/api";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const quickSaveInput = document.getElementById('quick-save');
const saveBtn = document.getElementById('save-btn');
const statusMsg = document.getElementById('status-msg');
const compressBtn = document.getElementById('compress-btn');
const closeBtn = document.getElementById('close-btn');
const healthDot = document.getElementById('health-dot');

function setStatus(msg, type = 'info') {
  statusMsg.textContent = msg;
  statusMsg.style.color = type === 'error' ? '#ff5555' : '#888';
  setTimeout(() => statusMsg.textContent = '', 3000);
}

// Fix 3: Sanitize content before rendering (prevent XSS from stored memories)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Fix 5: Health Check ──
async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      healthDot.className = 'health-dot online';
      healthDot.title = 'Backend conectado';
    } else {
      healthDot.className = 'health-dot offline';
      healthDot.title = 'Backend error';
    }
  } catch {
    healthDot.className = 'health-dot offline';
    healthDot.title = 'Backend offline — inicia el servidor';
  }
}

// Check on load + every 30s
checkHealth();
setInterval(checkHealth, 30000);

// ── Fix 4: Close Button ──
closeBtn.onclick = () => {
  window.parent.postMessage({ type: 'RAWR_CLOSE_SIDEBAR' }, '*');
};

// ── 🔍 Search ──
async function searchMemories() {
  const query = searchInput.value.trim();
  if (!query) return;

  setStatus('Buscando...');
  resultsDiv.innerHTML = '';

  try {
    const res = await fetch(`${API_URL}/retrieve?query=${encodeURIComponent(query)}&limit=5`);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      data.results.forEach(mem => {
        const el = document.createElement('div');
        el.className = 'memory-item';

        // Fix 3: Use textContent for user-generated data
        const metaDiv = document.createElement('div');
        metaDiv.className = 'memory-meta';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = new Date(mem.created_at).toLocaleDateString();
        
        const simSpan = document.createElement('span');
        simSpan.textContent = `${(mem.similarity * 100).toFixed(0)}%`;

        metaDiv.appendChild(dateSpan);
        metaDiv.appendChild(simSpan);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'memory-content';
        const preview = mem.content.length > 150 ? mem.content.substring(0, 150) + '...' : mem.content;
        contentDiv.textContent = preview;

        el.appendChild(metaDiv);
        el.appendChild(contentDiv);

        // Click to inject
        el.onclick = () => {
          window.parent.postMessage({ type: 'RAWR_INJECT', content: mem.content }, '*');
        };
        resultsDiv.appendChild(el);
      });
      setStatus(`Encontrados ${data.count}`);
    } else {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center; color:#666; padding:10px;';
      empty.textContent = 'Sin resultados 🦕';
      resultsDiv.appendChild(empty);
      setStatus('Nada por aquí');
    }
  } catch (err) {
    console.error(err);
    setStatus('Error de conexión', 'error');
  }
}

searchBtn.onclick = searchMemories;
searchInput.onkeypress = (e) => { if (e.key === 'Enter') searchMemories(); };

// ── 💾 Save ──
saveBtn.onclick = async () => {
  const content = quickSaveInput.value.trim();
  if (!content) return;

  setStatus('Guardando...');
  try {
    const res = await fetch(`${API_URL}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        source: 'extension',
        tags: ['quick_save']
      })
    });
    
    if (res.ok) {
      quickSaveInput.value = '';
      setStatus('✅ Guardado');
    } else {
      setStatus('Error al guardar', 'error');
    }
  } catch (err) {
    console.error(err);
    setStatus('Error de red', 'error');
  }
};

// ── 📉 Compress Selection ──
compressBtn.onclick = () => {
  window.parent.postMessage({ type: 'RAWR_GET_SELECTION' }, '*');
};

// Listen for messages from content script
window.addEventListener('message', async (event) => {
  if (event.data.type === 'RAWR_SELECTION_TEXT') {
    const text = event.data.text;
    if (!text) return setStatus('Selecciona texto primero', 'error');

    setStatus('Comprimiendo...');
    try {
      const res = await fetch(`${API_URL}/compress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      
      // Send compressed back to inject
      window.parent.postMessage({ type: 'RAWR_INJECT', content: data.compressed }, '*');
      setStatus(`📉 Ahorro: ${data.savings.savings_percent}%`);
    } catch (err) {
      setStatus('Error comprimiendo', 'error');
    }
  }
});
