// Estat de l'aplicació
let currentMode = 'exploracio';
let comarquesData = [];
let relleuData = [];
let riusData = [];

let score = 0;
let streak = 0;
let questionCount = 0;
const MAX_QUESTIONS = 10;
let currentTarget = null;
let awaitingNext = false;

// Inicialitzar el mapa centrat a Catalunya
const map = L.map('map', {
  center: [41.75, 1.7],
  zoom: 8.4,
  minZoom: 7,
  maxZoom: 13
});

// Capa base estil Positron (neta, ideal per no revelar noms si juguem)
const baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
}).addTo(map);

// Grups de capes Leaflet
const layerCapitals = L.layerGroup().addTo(map);
const layerCims = L.layerGroup().addTo(map);
const layerRius = L.layerGroup().addTo(map);

// Carregar dades
Promise.all([
  fetch('data/comarques.json').then(r => r.json()),
  fetch('data/relleu.json').then(r => r.json()),
  fetch('data/rius.json').then(r => r.json())
]).then(([comarques, relleu, rius]) => {
  comarquesData = comarques;
  relleuData = relleu;
  riusData = rius;
  renderLayers();
  setupEventListeners();
  updateUI();
});

function renderLayers() {
  layerCapitals.clearLayers();
  layerCims.clearLayers();
  layerRius.clearLayers();

  const showLabels = document.getElementById('toggle-labels').checked;

  // 1. Capitals i Comarques
  comarquesData.forEach(item => {
    // Cercles interactius per comarca
    const marker = L.circleMarker([item.lat, item.lon], {
      radius: 7,
      fillColor: '#3b82f6',
      color: '#1d4ed8',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    });

    if (showLabels && currentMode === 'exploracio') {
      marker.bindTooltip(`<b>${item.nom}</b><br>Capital: ${item.capital}`, {
        permanent: false,
        direction: 'top'
      });
    }

    marker.on('click', () => handleItemClick('comarca', item, marker));
    layerCapitals.addLayer(marker);
  });

  // 2. Cims i Relleu
  relleuData.forEach(cim => {
    const icon = L.divIcon({
      className: 'custom-pin pin-cim',
      html: '▲',
      iconSize: [18, 18]
    });
    const marker = L.marker([cim.lat, cim.lon], { icon });

    if (showLabels && currentMode === 'exploracio') {
      marker.bindTooltip(`<b>${cim.nom}</b> (${cim.altitud}m)<br>${cim.tipus}`, {
        permanent: false,
        direction: 'top'
      });
    }

    marker.on('click', () => handleItemClick('relleu', cim, marker));
    layerCims.addLayer(marker);
  });

  // 3. Rius
  riusData.forEach(riu => {
    const polyline = L.polyline(riu.coords, {
      color: '#0284c7',
      weight: 4,
      opacity: 0.85,
      dashArray: '2, 4'
    });

    if (showLabels && currentMode === 'exploracio') {
      polyline.bindTooltip(`<b>${riu.nom}</b><br>${riu.descripcio}`, {
        sticky: true
      });
    }

    polyline.on('click', () => handleItemClick('riu', riu, polyline));
    layerRius.addLayer(polyline);
  });
}

function handleItemClick(type, item, layer) {
  if (currentMode === 'exploracio') {
    let html = '';
    if (type === 'comarca') {
      html = `<b>Comarca:</b> ${item.nom}<br><b>Capital:</b> ${item.capital}<br><b>Província:</b> ${item.prov}`;
    } else if (type === 'relleu') {
      html = `<b>Cim:</b> ${item.nom}<br><b>Altitud:</b> ${item.altitud} m<br><b>Unitat:</b> ${item.tipus}`;
    } else if (type === 'riu') {
      html = `<b>Riu:</b> ${item.nom}<br>${item.descripcio}`;
    }
    L.popup().setLatLng(layer.getLatLng ? layer.getLatLng() : layer.getLatLngs()[0]).setContent(html).openOn(map);
    return;
  }

  if (awaitingNext) return;

  // Comprovacions de resposta segons el mode
  let encert = false;
  if (currentMode === 'joc-comarques' && type === 'comarca' && item.nom === currentTarget.nom) {
    encert = true;
  } else if (currentMode === 'joc-capitals' && type === 'comarca' && item.capital === currentTarget.capital) {
    encert = true;
  } else if (currentMode === 'joc-relleu' && type === 'relleu' && item.nom === currentTarget.nom) {
    encert = true;
  } else if (currentMode === 'joc-rius' && type === 'riu' && item.nom === currentTarget.nom) {
    encert = true;
  }

  avaluarResposta(encert);
}

function avaluarResposta(encert) {
  const feedback = document.getElementById('feedback-msg');
  if (encert) {
    score += 10 + streak * 2;
    streak += 1;
    feedback.innerText = 'Molt bé! Resposta correcta! 🎉';
    feedback.className = 'feedback-msg feedback-success';
  } else {
    streak = 0;
    feedback.innerText = `Incorrecte! Era: ${currentTarget.nom || currentTarget.capital} ❌`;
    feedback.className = 'feedback-msg feedback-error';
  }

  questionCount += 1;
  updateStats();
  awaitingNext = true;

  if (questionCount >= MAX_QUESTIONS) {
    document.getElementById('btn-next').classList.add('hidden');
    feedback.innerText += ` Joc finalitzat! Puntuació final: ${score} punts.`;
  } else {
    document.getElementById('btn-next').classList.remove('hidden');
  }
}

function nextQuestion() {
  awaitingNext = false;
  document.getElementById('btn-next').classList.add('hidden');
  document.getElementById('feedback-msg').innerText = '';

  if (currentMode === 'joc-comarques') {
    currentTarget = comarquesData[Math.floor(Math.random() * comarquesData.length)];
    document.getElementById('target-name').innerText = currentTarget.nom;
    document.getElementById('target-hint').innerText = "Fes clic sobre el punt de la comarca indicada.";
  } else if (currentMode === 'joc-capitals') {
    currentTarget = comarquesData[Math.floor(Math.random() * comarquesData.length)];
    document.getElementById('target-name').innerText = `Capital: ${currentTarget.capital}`;
    document.getElementById('target-hint').innerText = `On se situa la capital de la comarca ${currentTarget.nom}? Fes-hi clic!`;
  } else if (currentMode === 'joc-relleu') {
    currentTarget = relleuData[Math.floor(Math.random() * relleuData.length)];
    document.getElementById('target-name').innerText = currentTarget.nom;
    document.getElementById('target-hint').innerText = `Altitud aproximada: ${currentTarget.altitud}m (${currentTarget.tipus})`;
  } else if (currentMode === 'joc-rius') {
    currentTarget = riusData[Math.floor(Math.random() * riusData.length)];
    document.getElementById('target-name').innerText = currentTarget.nom;
    document.getElementById('target-hint').innerText = currentTarget.descripcio;
  }
}

function resetGame() {
  score = 0;
  streak = 0;
  questionCount = 0;
  awaitingNext = false;
  updateStats();
  document.getElementById('feedback-msg').innerText = '';
  document.getElementById('btn-next').classList.add('hidden');

  if (currentMode === 'exploracio') {
    document.getElementById('target-name').innerText = "Mode Exploració";
    document.getElementById('target-hint').innerText = "Fes clic a qualsevol element del mapa per veure'n la informació.";
  } else {
    nextQuestion();
  }
}

function updateStats() {
  document.getElementById('score').innerText = score;
  document.getElementById('streak').innerText = streak;
  document.getElementById('question-count').innerText = `${questionCount}/${MAX_QUESTIONS}`;
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      renderLayers();
      resetGame();
    });
  });

  document.getElementById('btn-next').addEventListener('click', nextQuestion);
  document.getElementById('btn-restart').addEventListener('click', resetGame);

  document.getElementById('toggle-capitals').addEventListener('change', (e) => {
    if (e.target.checked) map.addLayer(layerCapitals); else map.removeLayer(layerCapitals);
  });
  document.getElementById('toggle-cims').addEventListener('change', (e) => {
    if (e.target.checked) map.addLayer(layerCims); else map.removeLayer(layerCims);
  });
  document.getElementById('toggle-rius').addEventListener('change', (e) => {
    if (e.target.checked) map.addLayer(layerRius); else map.removeLayer(layerRius);
  });
  document.getElementById('toggle-labels').addEventListener('change', () => {
    renderLayers();
  });
}
