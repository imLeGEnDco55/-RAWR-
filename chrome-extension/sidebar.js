const API_URL = "http://localhost:8000/api";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsDiv = document.getElementById('results');
const quickSaveInput = document.getElementById('quick-save');
const tagsInput = document.getElementById('tags-input');
const saveBtn = document.getElementById('save-btn');
const statusMsg = document.getElementById('status-msg');
const compressBtn = document.getElementById('compress-btn');
const closeBtn = document.getElementById('close-btn');
const healthDot = document.getElementById('health-dot');
const promptBtn = document.getElementById('prompt-btn');
const promptStatus = document.getElementById('prompt-status');

// ── §Prompt: the RAWR system prompt for any LLM ──
const RAWR_PROMPT = `§.RAWR.§ — Exocórtex Protocol

Soy un usuario que usa §.RAWR.§, un sistema de memoria persistente. Cuando te dé información para guardar, genera un bloque optimizado con este formato:

---
**Contenido:** [Resumen claro y conciso de la información, sin redundancia, en máximo 3-5 oraciones]

**Tags sugeridos:** [3-6 tags relevantes separados por coma, en lowercase, guiones para multi-palabra]
Ejemplo: proyecto-rawr, arquitectura, decision, stack-tech

**Source:** [categoría: manual | extension | mcp | conversation]
---

Reglas:
1. El contenido debe ser AUTOSUFICIENTE — alguien que lo lea sin contexto debe entender qué es
2. Prioriza HECHOS y DECISIONES sobre explicaciones largas
3. Los tags deben permitir encontrar esta memoria buscando por tema, proyecto, o tipo
4. Si la información es sobre preferencias personales, usa tag "preferencia"
5. Si es una decisión técnica, usa tag "decision"
6. Si es sobre un proyecto, incluye el nombre del proyecto como tag
7. NO incluyas saludos, preámbulos ni relleno — solo el bloque

Cuando te pida "guarda esto en §.RAWR.§" o "genera bloque §", responde SOLO con el bloque formateado arriba, listo para copiar y pegar en mi extensión.`;

function setStatus(msg, type = 'info') {
  statusMsg.textContent = msg;
  statusMsg.style.color = type === 'error' ? '#ff5555' : '#888';
  setTimeout(() => statusMsg.textContent = '', 3000);
}

function setPromptStatus(msg) {
  promptStatus.textContent = msg;
  setTimeout(() => promptStatus.textContent = '', 3000);
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

checkHealth();
setInterval(checkHealth, 30000);

// ── Close Button ──
closeBtn.onclick = () => {
  window.parent.postMessage({ type: 'RAWR_CLOSE_SIDEBAR' }, '*');
};

// ── 📋 Copy §Prompt ──
promptBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(RAWR_PROMPT);
    setPromptStatus('✅ Copiado al clipboard');
  } catch {
    // Fallback for iframe restrictions
    const ta = document.createElement('textarea');
    ta.value = RAWR_PROMPT;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    setPromptStatus('✅ Copiado');
  }
};

// ── Parse tags from input ──
function parseTags() {
  const raw = tagsInput.value.trim();
  if (!raw) return ['quick_save'];
  return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

// ── 🔍 Search (semantic or #tag) ──
async function searchMemories() {
  const raw = searchInput.value.trim();
  if (!raw) return;

  setStatus('Buscando...');
  resultsDiv.innerHTML = '';

  // Route: #tag1,tag2 → tag search | anything else → semantic
  const isTagSearch = raw.startsWith('#');
  const query = isTagSearch ? raw.slice(1).trim() : raw;
  if (!query) return;

  try {
    const url = isTagSearch
      ? `${API_URL}/search-tags?tag=${encodeURIComponent(query)}&limit=20`
      : `${API_URL}/retrieve?query=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      data.results.forEach(mem => {
        const el = document.createElement('div');
        el.className = 'memory-item';

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

        // Show tags if present
        if (mem.tags && mem.tags.length > 0 && !(mem.tags.length === 1 && mem.tags[0] === 'quick_save')) {
          const tagsDiv = document.createElement('div');
          tagsDiv.className = 'memory-tags';
          tagsDiv.textContent = mem.tags.map(t => `#${t}`).join(' ');
          el.appendChild(metaDiv);
          el.appendChild(contentDiv);
          el.appendChild(tagsDiv);
        } else {
          el.appendChild(metaDiv);
          el.appendChild(contentDiv);
        }

        // Click to inject
        el.onclick = () => {
          window.parent.postMessage({ type: 'RAWR_INJECT', content: mem.content }, '*');
        };
        resultsDiv.appendChild(el);
      });
      setStatus(`${isTagSearch ? '🏷️' : '🔍'} ${data.count} encontrados`);
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

  const tags = parseTags();
  setStatus('Guardando...');
  try {
    const res = await fetch(`${API_URL}/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        source: 'extension',
        tags: tags
      })
    });
    
    if (res.ok) {
      quickSaveInput.value = '';
      tagsInput.value = '';
      setStatus(`✅ Guardado [${tags.join(', ')}]`);
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
      
      window.parent.postMessage({ type: 'RAWR_INJECT', content: data.compressed }, '*');
      setStatus(`📉 Ahorro: ${data.savings.savings_percent}%`);
    } catch (err) {
      setStatus('Error comprimiendo', 'error');
    }
  }
});
