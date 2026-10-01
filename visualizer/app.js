/* ==========================================================================
   LRU CACHE EDUCATIONAL VISUALIZER - APPLICATION CORE LOGIC
   ========================================================================== */

let eventsData = typeof LRU_EVENTS_DATA !== 'undefined' ? LRU_EVENTS_DATA : [];
let currentStepIndex = 0;
let isPlaying = false;
let playInterval = null;
let playSpeed = 2000;

// MediaRecorder state
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;

// DOM Elements
const badgeStep = document.getElementById('badge-step');
const badgeAction = document.getElementById('badge-action');
const badgeEdge = document.getElementById('badge-edge');
const textCommand = document.getElementById('text-command');
const hashBucketsContainer = document.getElementById('hash-buckets-container');
const doublyListContainer = document.getElementById('doubly-list-container');
const cacheCapacityPill = document.getElementById('cache-capacity-pill');
const textDescription = document.getElementById('text-description');
const textComplexity = document.getElementById('text-complexity');
const timelineTrack = document.getElementById('timeline-track');
const timelineCounter = document.getElementById('timeline-counter');
const pointerSvg = document.getElementById('pointer-svg');

// Playback Buttons
const btnStart = document.getElementById('btn-start');
const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnNext = document.getElementById('btn-next');
const btnEnd = document.getElementById('btn-end');
const selectSpeed = document.getElementById('select-speed');
const btnRecordVideo = document.getElementById('btn-record-video');
const recordText = document.getElementById('record-text');
const recordDot = document.getElementById('record-dot');
const fileUpload = document.getElementById('file-upload');

// Presentation Elements
const btnTogglePres = document.getElementById('btn-toggle-presentation');
const presOverlay = document.getElementById('presentation-overlay');
const btnClosePres = document.getElementById('btn-close-presentation');
const presContent = document.getElementById('presentation-content');
const presSlideNum = document.getElementById('pres-slide-num');
const presDots = document.getElementById('pres-dots');
const btnPresPrev = document.getElementById('btn-pres-prev');
const btnPresNext = document.getElementById('btn-pres-next');

// Presentation Slides Data (3-6 min educational video content)
let currentSlide = 0;
const slides = [
  {
    title: "LRU Cache (Least Recently Used)",
    subtitle: "CS2023 Algoritmos y Estructuras de Datos • UTEC 2026-2",
    content: `
      <p class="slide-text">
        Bienvenidos a la demostración educativa de <strong>LRU Cache</strong>, una estructura de datos fundamental en sistemas de alto rendimiento que administra recursos en memoria limitada aplicando el principio de <em>Localidad Temporal</em>.
      </p>
      <div class="slide-grid">
        <div class="slide-card">
          <h4>🎯 Objetivo del Proyecto</h4>
          <p>Demostrar formalmente cómo alcanzar una complejidad temporal estricta de <strong>O(1)</strong> tanto en lecturas como en escrituras mediante una implementación híbrida en C++.</p>
        </div>
        <div class="slide-card">
          <h4>⚙️ Implementación Real</h4>
          <p>Desarrollada desde cero sin dependencias de la biblioteca estándar (sin <code>std::unordered_map</code> ni <code>std::list</code>), registrando snapshots de memoria reales.</p>
        </div>
      </div>
    `
  },
  {
    title: "Introducción Conceptual y TDA",
    subtitle: "¿Qué es el TDA LRU Cache y dónde se utiliza?",
    content: `
      <p class="slide-text">
        El <strong>Tipo de Dato Abstracto (TDA) Caché</strong> almacena pares clave-valor de capacidad fija \(C\). Cuando la memoria se llena y entra un nuevo elemento, se descarta (<em>desaloja</em>) el que no ha sido accedido por más tiempo.
      </p>
      <div class="slide-grid">
        <div class="slide-card">
          <h4>Operaciones Principales</h4>
          <p>• <strong>GET(k)</strong>: Retorna el valor asociado a \(k\) y lo marca como el más recientemente usado (MRU).<br>
             • <strong>PUT(k, v)</strong>: Inserta o actualiza el par \((k, v)\), desalojando el elemento LRU si excede la capacidad.</p>
        </div>
        <div class="slide-card">
          <h4>Aplicaciones en el Mundo Real</h4>
          <p>• <strong>Bases de Datos</strong>: Buffer Pool en PostgreSQL / MySQL (InnoDB).<br>
             • <strong>Sistemas Operativos</strong>: Algoritmos de reemplazo de páginas de memoria virtual.<br>
             • <strong>Sistemas Distribuidos</strong>: Redis, Memcached, CDNs de Cloudflare.</p>
        </div>
      </div>
    `
  },
  {
    title: "El Desafío: ¿Por qué O(1)?",
    subtitle: "¿Por qué las estructuras tradicionales no son suficientes?",
    content: `
      <p class="slide-text">
        Si intentamos construir un LRU Cache con estructuras individuales, encontramos cuellos de botella inevitables:
      </p>
      <div class="slide-grid">
        <div class="slide-card">
          <h4>❌ Si usamos solo un Arreglo o Lista</h4>
          <p>Para buscar una clave requerimos <strong>O(N)</strong>. En arreglos, desplazar elementos cuesta O(N). En listas simples, ubicar y desconectar un nodo también toma O(N).</p>
        </div>
        <div class="slide-card">
          <h4>❌ Si usamos solo una Tabla Hash</h4>
          <p>La Tabla Hash encuentra la clave en <strong>O(1)</strong> promedio, pero <em>carece de orden secuencial</em>. No sabe qué elemento es el más antiguo sin un escaneo O(N).</p>
        </div>
      </div>
      <div class="slide-card" style="margin-top:1rem; border-color: var(--color-cyan);">
        <h4 style="color:var(--color-cyan);">💡 La Solución Híbrida Óptima: Hash Table + Doubly Linked List</h4>
        <p>Combinamos ambas estructuras para obtener lo mejor de los dos mundos en tiempo <strong>O(1)</strong> garantizado.</p>
      </div>
    `
  },
  {
    title: "Arquitectura Interna Dual",
    subtitle: "Sinergia entre Tabla Hash y Lista Doblemente Enlazada",
    content: `
      <div class="slide-grid">
        <div class="slide-card">
          <h4 style="color:var(--color-cyan);">1. Tabla Hash (Separate Chaining)</h4>
          <p>Almacena la clave y un <strong>puntero directo en memoria</strong> al nodo en la lista doble. Permite ubicar cualquier nodo en <strong>O(1)</strong> sin tener que recorrer la lista.</p>
        </div>
        <div class="slide-card">
          <h4 style="color:var(--color-magenta);">2. Lista Doblemente Enlazada</h4>
          <p>Mantiene el orden temporal estricto:<br>
          • <strong>HEAD (MRU)</strong>: Elemento más reciente.<br>
          • <strong>TAIL (LRU)</strong>: Elemento más antiguo candidato a desalojo.<br>
          Gracias a los punteros <code>prev</code> y <code>next</code>, cualquier nodo se desconecta y se mueve al frente en <strong>O(1)</strong>.</p>
        </div>
      </div>
    `
  },
  {
    title: "Casos Borde Relevantes Analizados",
    subtitle: "Validación de robustez según la rúbrica",
    content: `
      <p class="slide-text">
        Nuestra simulación en C++ cubre explícitamente todos los casos extremos del TDA:
      </p>
      <div class="slide-grid">
        <div class="slide-card">
          <h4>1. Estructura Vacía a 1 Elemento</h4>
          <p>El nodo inicial se convierte simultáneamente en HEAD y TAIL sin desbordamiento de punteros nulos.</p>
        </div>
        <div class="slide-card">
          <h4>2. Cache Miss (Clave Inexistente)</h4>
          <p>Búsqueda en bucket vacío retorna <code>nullptr</code> en O(1) sin alterar el orden de la lista.</p>
        </div>
        <div class="slide-card">
          <h4>3. Actualización de Clave (PUT_UPDATE)</h4>
          <p>El valor existente cambia in-place y el nodo se promueve a MRU sin duplicar entradas en el hash.</p>
        </div>
        <div class="slide-card">
          <h4>4. Desalojo en Capacidad Máxima (EVICTION)</h4>
          <p>Tail se remueve en O(1), su clave se borra del bucket en O(1) y el nuevo entra como MRU.</p>
        </div>
      </div>
    `
  },
  {
    title: "Análisis de Complejidad y Conclusiones",
    subtitle: "Rendimiento y aprendizajes del proyecto",
    content: `
      <div class="slide-grid">
        <div class="slide-card">
          <h4>⚡ Complejidad Teórica</h4>
          <p>• <strong>Tiempo GET</strong>: O(1) promedio.<br>
             • <strong>Tiempo PUT</strong>: O(1) promedio.<br>
             • <strong>Tiempo EVICT</strong>: O(1) estricto.<br>
             • <strong>Espacio</strong>: O(C), donde C es la capacidad máxima.</p>
        </div>
        <div class="slide-card">
          <h4>🎓 Conclusiones</h4>
          <p>1. La cooperación de una tabla hash con punteros directos y una lista doble es el estándar industrial para implementar cachés en tiempo constante.<br>
             2. El manejo manual de punteros en C++ demuestra la vital importancia de una gestión de memoria precisa para prevenir fugas y referencias colgantes.</p>
        </div>
      </div>
    `
  }
];

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function init() {
  buildTimeline();
  setupEventListeners();
  renderStep(0);
}

// Build timeline steps
function buildTimeline() {
  timelineTrack.innerHTML = '';
  eventsData.forEach((evt, idx) => {
    const btn = document.createElement('div');
    btn.className = `timeline-step-btn ${idx === currentStepIndex ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="timeline-step-num">#${idx}</span>
      <span class="timeline-step-action">${evt.action}</span>
    `;
    btn.addEventListener('click', () => {
      pause();
      renderStep(idx);
    });
    timelineTrack.appendChild(btn);
  });
}

// ==========================================================================
// RENDER STEP FUNCTION
// ==========================================================================
function renderStep(index) {
  if (index < 0 || index >= eventsData.length) return;
  currentStepIndex = index;

  const event = eventsData[currentStepIndex];
  const state = event.state;

  // 1. Update Header Badges
  badgeStep.textContent = `Paso ${event.step} / ${eventsData.length - 1}`;
  badgeAction.textContent = event.action;

  // Colorize Action Badge
  badgeAction.className = 'badge badge-action';
  if (event.action === 'GET_HIT') badgeAction.style.borderColor = 'var(--color-green)';
  else if (event.action === 'GET_MISS') badgeAction.style.borderColor = 'var(--color-magenta)';
  else if (event.action === 'EVICT') badgeAction.style.borderColor = 'var(--color-magenta)';
  else if (event.action === 'PUT_UPDATE') badgeAction.style.borderColor = 'var(--color-amber)';
  else badgeAction.style.borderColor = 'var(--color-cyan)';

  // Edge case badge
  if (event.is_edge_case) {
    badgeEdge.classList.remove('hidden');
    badgeEdge.textContent = event.edge_case_type || 'CASO BORDE';
  } else {
    badgeEdge.classList.add('hidden');
  }

  // 2. Command text
  if (event.action === 'INIT') {
    textCommand.textContent = `LRUCache(capacidad = ${state.capacity})`;
  } else if (event.action.startsWith('GET')) {
    textCommand.textContent = `cache.get(${event.key}) -> ${event.action === 'GET_HIT' ? event.value : '-1 (MISS)'}`;
  } else if (event.action.startsWith('PUT')) {
    textCommand.textContent = `cache.put(key = ${event.key}, val = ${event.value})`;
  } else if (event.action === 'EVICT') {
    textCommand.textContent = `EVICTION: Desalojando LRU (key = ${event.evicted_key})`;
  }

  // 3. Explanation and Complexity notes
  textDescription.textContent = event.description;
  textComplexity.textContent = event.complexity_note;

  // 4. Render Hash Table
  renderHashTable(state.hash_table, event.target_bucket, event.key);

  // 5. Render Doubly Linked List
  renderDoublyList(state.list, event);

  // 6. Update Capacity Pill
  cacheCapacityPill.textContent = `Elementos: ${state.size} / ${state.capacity}`;

  // 7. Update Timeline scrubber
  updateTimeline();

  // 8. Draw Curved Pointer Lines
  setTimeout(drawPointerArrows, 50);
}

// Render Hash Table Buckets
function renderHashTable(buckets, targetBucket, activeKey) {
  hashBucketsContainer.innerHTML = '';
  buckets.forEach(b => {
    const bucketCard = document.createElement('div');
    const isTarget = (b.bucket === targetBucket);
    bucketCard.className = `bucket-card ${isTarget ? 'active-bucket' : ''}`;
    bucketCard.id = `bucket-col-${b.bucket}`;

    let entriesHtml = '';
    if (b.entries.length === 0) {
      entriesHtml = `<div class="bucket-empty-hint">nullptr</div>`;
    } else {
      b.entries.forEach(entry => {
        const isEntryActive = (entry.key === activeKey);
        entriesHtml += `
          <div class="bucket-entry" id="hash-entry-${entry.key}" style="${isEntryActive ? 'border-color: var(--color-cyan); box-shadow: 0 0 10px rgba(0,240,255,0.4);' : ''}">
            <span class="entry-key">Key: ${entry.key}</span>
            <span class="entry-ptr-badge">ptr → &Node[${entry.points_to_key}]</span>
          </div>
        `;
      });
    }

    bucketCard.innerHTML = `
      <div class="bucket-header">
        <span>Bucket [${b.bucket}]</span>
        <span>${b.entries.length} ${b.entries.length === 1 ? 'nodo' : 'nodos'}</span>
      </div>
      <div class="bucket-entries-list">
        ${entriesHtml}
      </div>
    `;

    hashBucketsContainer.appendChild(bucketCard);
  });
}

// Render Doubly Linked List
function renderDoublyList(nodes, event) {
  doublyListContainer.innerHTML = '';

  if (!nodes || nodes.length === 0) {
    doublyListContainer.innerHTML = `<div class="empty-list-indicator">La lista doblemente enlazada está vacía (head = nullptr, tail = nullptr).</div>`;
    return;
  }

  nodes.forEach((node, idx) => {
    const isHead = node.is_head;
    const isTail = node.is_tail;

    let highlightClass = '';
    if (event.action === 'GET_HIT' && event.key === node.key) {
      highlightClass = 'highlight-hit';
    } else if (event.action === 'PUT_UPDATE' && event.key === node.key) {
      highlightClass = 'highlight-update';
    } else if (event.action === 'EVICT' && event.evicted_key === node.key) {
      highlightClass = 'highlight-evict';
    }

    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'node-container';
    nodeContainer.id = `node-item-${node.key}`;

    nodeContainer.innerHTML = `
      <div class="node-box ${highlightClass}">
        <div class="node-header">
          ${isHead ? '<span class="node-badge head">HEAD (MRU)</span>' : '<span></span>'}
          ${isTail ? '<span class="node-badge tail">TAIL (LRU)</span>' : '<span></span>'}
        </div>
        <div class="node-data">
          <div class="data-item">
            <span class="data-label">Key</span>
            <span class="data-value" style="color:var(--color-cyan);">${node.key}</span>
          </div>
          <div class="data-item">
            <span class="data-label">Value</span>
            <span class="data-value" style="color:#f8fafc;">${node.value}</span>
          </div>
        </div>
        <div class="node-pointers-info">
          <span>prev: ${node.prev_key !== null ? node.prev_key : 'null'}</span>
          <span>next: ${node.next_key !== null ? node.next_key : 'null'}</span>
        </div>
      </div>
      ${idx < nodes.length - 1 ? `
        <div class="node-connector-arrows">
          <span class="arrow-next" title="puntero next">⇄</span>
        </div>
      ` : ''}
    `;

    doublyListContainer.appendChild(nodeContainer);
  });
}

// Draw Curved Pointer Arrows with SVG
function drawPointerArrows() {
  pointerSvg.innerHTML = '';
  const event = eventsData[currentStepIndex];
  if (!event || !event.state) return;

  const svgRect = pointerSvg.getBoundingClientRect();
  const hashEntries = event.state.hash_table.flatMap(b => b.entries);

  hashEntries.forEach(entry => {
    const entryEl = document.getElementById(`hash-entry-${entry.key}`);
    const nodeEl = document.getElementById(`node-item-${entry.points_to_key}`);

    if (entryEl && nodeEl) {
      const entryRect = entryEl.getBoundingClientRect();
      const nodeRect = nodeEl.getBoundingClientRect();

      const startX = entryRect.left + entryRect.width / 2 - svgRect.left;
      const startY = entryRect.bottom - svgRect.top;

      const endX = nodeRect.left + nodeRect.width / 2 - svgRect.left;
      const endY = nodeRect.top - svgRect.top;

      const isCurrentActive = (entry.key === event.key);
      const color = isCurrentActive ? '#00f0ff' : 'rgba(0, 240, 255, 0.35)';
      const strokeWidth = isCurrentActive ? 2.5 : 1.5;

      const controlY1 = startY + (endY - startY) * 0.5;
      const controlY2 = endY - (endY - startY) * 0.3;

      const pathData = `M ${startX} ${startY} C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', strokeWidth);
      path.setAttribute('stroke-dasharray', isCurrentActive ? 'none' : '4,4');

      pointerSvg.appendChild(path);

      // Arrowhead dot
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', endX);
      circle.setAttribute('cy', endY);
      circle.setAttribute('r', isCurrentActive ? '4' : '3');
      circle.setAttribute('fill', color);
      pointerSvg.appendChild(circle);
    }
  });
}

// Update Timeline Scrubber
function updateTimeline() {
  timelineCounter.textContent = `Paso ${currentStepIndex} / ${eventsData.length - 1}`;
  const buttons = timelineTrack.querySelectorAll('.timeline-step-btn');
  buttons.forEach((btn, idx) => {
    if (idx === currentStepIndex) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      btn.classList.remove('active');
    }
  });
}

// Playback Logic
function play() {
  if (isPlaying) return;
  isPlaying = true;
  btnPlay.innerHTML = '⏸';
  btnPlay.title = 'Pausar';

  playInterval = setInterval(() => {
    if (currentStepIndex < eventsData.length - 1) {
      renderStep(currentStepIndex + 1);
    } else {
      pause();
    }
  }, playSpeed);
}

function pause() {
  isPlaying = false;
  btnPlay.innerHTML = '▶';
  btnPlay.title = 'Reproducir';
  if (playInterval) clearInterval(playInterval);
}

// ==========================================================================
// VIDEO RECORDING (Native Screen & Canvas MediaRecorder)
// ==========================================================================
async function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: 'browser',
        frameRate: 60
      },
      audio: true
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Demostracion_LRU_Cache_AED_${new Date().toISOString().slice(0,10)}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      resetRecordingUI();
    };

    mediaRecorder.start();
    isRecording = true;
    btnRecordVideo.classList.add('recording');
    recordText.textContent = 'Detener Grabación';
    recordDot.textContent = '⏹';

    // Auto-stop if user stops sharing from browser banner
    stream.getVideoTracks()[0].onended = () => {
      if (isRecording) stopRecording();
    };
  } catch (err) {
    console.error('Grabación cancelada o error:', err);
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  resetRecordingUI();
}

function resetRecordingUI() {
  isRecording = false;
  btnRecordVideo.classList.remove('recording');
  recordText.textContent = 'Grabar Video';
  recordDot.textContent = '⏺';
}

// ==========================================================================
// PRESENTATION OVERLAY / WALKTHROUGH SLIDES
// ==========================================================================
function renderSlide(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;

  const s = slides[currentSlide];
  presSlideNum.textContent = `Diapositiva ${currentSlide + 1} / ${slides.length}`;
  presContent.innerHTML = `
    <h2 class="slide-title">${s.title}</h2>
    <h3 class="slide-subtitle">${s.subtitle}</h3>
    ${s.content}
  `;

  // Render Dots
  presDots.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `dot ${idx === currentSlide ? 'active' : ''}`;
    dot.addEventListener('click', () => renderSlide(idx));
    presDots.appendChild(dot);
  });

  btnPresPrev.disabled = (currentSlide === 0);
  btnPresNext.textContent = (currentSlide === slides.length - 1) ? 'Finalizar y Ver Animación' : 'Siguiente ▶';
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
  btnPlay.addEventListener('click', () => {
    if (isPlaying) pause();
    else play();
  });

  btnStart.addEventListener('click', () => { pause(); renderStep(0); });
  btnPrev.addEventListener('click', () => { pause(); renderStep(currentStepIndex - 1); });
  btnNext.addEventListener('click', () => { pause(); renderStep(currentStepIndex + 1); });
  btnEnd.addEventListener('click', () => { pause(); renderStep(eventsData.length - 1); });

  selectSpeed.addEventListener('change', (e) => {
    playSpeed = parseInt(e.target.value, 10);
    if (isPlaying) {
      pause();
      play();
    }
  });

  btnRecordVideo.addEventListener('click', toggleRecording);

  // File Upload
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          eventsData = parsed;
          buildTimeline();
          renderStep(0);
        } catch (err) {
          alert('Error al leer el archivo JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  });

  // Presentation Mode Toggle
  btnTogglePres.addEventListener('click', () => {
    presOverlay.classList.remove('hidden');
    renderSlide(0);
  });

  btnClosePres.addEventListener('click', () => {
    presOverlay.classList.add('hidden');
  });

  btnPresPrev.addEventListener('click', () => {
    if (currentSlide > 0) renderSlide(currentSlide - 1);
  });

  btnPresNext.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      renderSlide(currentSlide + 1);
    } else {
      presOverlay.classList.add('hidden');
    }
  });

  // Redraw arrows on window resize
  window.addEventListener('resize', drawPointerArrows);
}

// Start visualizer on load
document.addEventListener('DOMContentLoaded', init);
