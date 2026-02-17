const API_URL = "http://localhost:8000/api";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const quickSaveInput = document.getElementById('quick-save');
const saveBtn = document.getElementById('save-btn');
const statusMsg = document.getElementById('status-msg');
const compressBtn = document.getElementById('compress-btn');

function setStatus(msg, type = 'info') {
  statusMsg.textContent = msg;
  statusMsg.style.color = type === 'error' ? '#ff5555' : '#888';
  setTimeout(() => statusMsg.textContent = '', 3000);
}

// 🔍 Search
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
        el.innerHTML = `
          <div class="memory-meta">
            <span>${new Date(mem.created_at).toLocaleDateString()}</span>
            <span>${(mem.similarity * 100).toFixed(0)}%</span>
          </div>
          <div class="memory-content">${mem.content.substring(0, 150)}${mem.content.length > 150 ? '...' : ''}</div>
        `;
        // Click to inject
        el.onclick = () => {
          // Send message to content script to inject
          window.parent.postMessage({ type: 'RAWR_INJECT', content: mem.content }, '*');
        };
        resultsDiv.appendChild(el);
      });
      setStatus(`Encontrados ${data.count}`);
    } else {
      resultsDiv.innerHTML = '<div style="text-align:center; color:#666; padding:10px;">Sin resultados 🦕</div>';
      setStatus('Nada por aquí');
    }
  } catch (err) {
    console.error(err);
    setStatus('Error de conexión', 'error');
  }
}

searchBtn.onclick = searchMemories;
searchInput.onkeypress = (e) => { if (e.key === 'Enter') searchMemories(); };

// 💾 Save
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

// 📉 Compress Selection
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
