document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('gpxFile');
    const fileNameSpan = document.getElementById('fileName');
    const welcomeCard = document.getElementById('welcomeCard');
    const studioSection = document.getElementById('studioSection');
    const recenterBtn = document.getElementById('recenterBtn');
    const styleBtns = document.querySelectorAll('.style-btn');

    let map = null;
    let trackLayerGroup = null;
    let mapTileLayer = null;

    // Capes de mapa fiables
    const mapTileProviders = {
        carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    let currentTileProvider = 'carto';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameSpan.textContent = file.name;
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const gpxText = event.target.result;
                const trackData = parseGPXUltraRobust(gpxText);

                if (!trackData || trackData.points.length === 0) {
                    alert("No s'han trobat coordenadesGPS en aquest arxiu. Assegura't que conté un track o ruta.");
                    return;
                }

                welcomeCard.classList.add('hidden');
                studioSection.classList.remove('hidden');

                // Actualitzar dades a la targeta
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                document.getElementById('routeTitle').textContent = cleanName;
                document.getElementById('valDist').textContent = `${trackData.totalDistance.toFixed(1)} km`;
                document.getElementById('valGain').textContent = `${Math.round(trackData.elevationGain)} m`;
                document.getElementById('valMaxEle').textContent = `${Math.round(trackData.maxElevation)} m`;

                // Renderitzar mapa
                renderMap(trackData.points);

            } catch (err) {
                console.error("Error al carregar GPX:", err);
                alert("Error en llegir l'arxiu. Comprova que sigui un fitxer GPX vàlid.");
            }
        };

        reader.readAsText(file);
    });

    // Canvi d'estil de mapa
    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            styleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTileProvider = btn.dataset.style;
            if (map) {
                if (mapTileLayer) map.removeLayer(mapTileLayer);
                mapTileLayer = L.tileLayer(mapTileProviders[currentTileProvider], { maxZoom: 18 }).addTo(map);
            }
        });
    });

    recenterBtn.addEventListener('click', () => {
        if (map && trackLayerGroup) {
            map.fitBounds(trackLayerGroup.getBounds(), { padding: [40, 40] });
        }
    });

    // --- LECTOR GPX PARSER ULTRA-ROBUST (Regex + Fallbacks) ---
    function parseGPXUltraRobust(gpxText) {
        let rawPoints = [];

        // 1. Intent mitjançant Expressions Regulars (Sempre funciona, independentment de majúscules, namespaces o malformacions XML)
        const trkptRegex = /<trkpt[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/trkpt>/gi;
        const rteptRegex = /<rtept[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/rtept>/gi;
        
        let match;
        // Provem primer <trkpt>
        while ((match = trkptRegex.exec(gpxText)) !== null) {
            let lat = parseFloat(match[1]);
            let lon = parseFloat(match[2]);
            let innerXml = match[3] || "";
            let eleMatch = innerXml.match(/<ele[^>]*>([^<]+)<\/ele>/i);
            let ele = eleMatch ? parseFloat(eleMatch[1]) : 0;
            if (!isNaN(lat) && !isNaN(lon)) {
                rawPoints.push({ lat, lon, ele });
            }
        }

        // Si no hi ha trkpt, provem <rtept> (rutes)
        if (rawPoints.length === 0) {
            while ((match = rteptRegex.exec(gpxText)) !== null) {
                let lat = parseFloat(match[1]);
                let lon = parseFloat(match[2]);
                let innerXml = match[3] || "";
                let eleMatch = innerXml.match(/<ele[^>]*>([^<]+)<\/ele>/i);
                let ele = eleMatch ? parseFloat(eleMatch[1]) : 0;
                if (!isNaN(lat) && !isNaN(lon)) {
                    rawPoints.push({ lat, lon, ele });
                }
            }
        }

        // 2. Fallback per XML DOMParser si el Regex no ha trobat punts
        if (rawPoints.length === 0) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(gpxText, "text/xml");
                const allNodes = xmlDoc.getElementsByTagName("*");
                for (let i = 0; i < allNodes.length; i++) {
                    const node = allNodes[i];
                    if (node.nodeName.toLowerCase().endsWith('pt')) { // trkpt, rtept, wpt
                        let lat = parseFloat(node.getAttribute('lat'));
                        let lon = parseFloat(node.getAttribute('lon'));
                        if (!isNaN(lat) && !isNaN(lon)) {
                            let eleNode = node.getElementsByTagName('ele')[0];
                            let ele = eleNode ? parseFloat(eleNode.textContent) : 0;
                            rawPoints.push({ lat, lon, ele });
                        }
                    }
                }
            } catch (e) {
                console.warn("DOMParser fallback fallit:", e);
            }
        }

        if (rawPoints.length === 0) return null;

        // Processar distàncies i elevar
        let points = [];
        let totalDistance = 0;
        let elevationGain = 0;
        let maxElevation = -Infinity;
        let prev = null;

        for (let i = 0; i < rawPoints.length; i++) {
            let p = rawPoints[i];
            if (p.ele > maxElevation) maxElevation = p.ele;

            let distInc = 0;
            if (prev) {
                distInc = getDistanceFromLatLonInKm(prev.lat, prev.lon, p.lat, p.lon);
                
                // Filtre de seguretat antisalts de GPS (descarta salts irrealistes de més de 5km de cop)
                if (distInc > 5.0) continue;

                totalDistance += distInc;
                let eleDiff = p.ele - prev.ele;
                if (eleDiff > 0) elevationGain += eleDiff;
            }

            let ptObj = { lat: p.lat, lon: p.lon, ele: p.ele, distance: totalDistance };
            points.push(ptObj);
            prev = ptObj;
        }

        return {
            points,
            totalDistance,
            elevationGain,
            maxElevation: maxElevation === -Infinity ? 0 : maxElevation
        };
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2); 
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); 
    }

    // --- RENDERITZAT RÀPID DEL MAPA I SEGMENTS DE PENDENT ---
    function renderMap(points) {
        if (map) {
            map.remove();
        }

        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        });

        mapTileLayer = L.tileLayer(mapTileProviders[currentTileProvider], { maxZoom: 18 }).addTo(map);
        trackLayerGroup = L.layerGroup();

        // Agrupem punts en fusta (chunking) per a un rendiment òptim i un colorat de pendents suau
        const step = Math.max(1, Math.floor(points.length / 500)); // Màxim ~500 segments per no alentir el mapa
        let filteredPoints = points.filter((_, idx) => idx % step === 0 || idx === points.length - 1);

        for (let i = 1; i < filteredPoints.length; i++) {
            let p1 = filteredPoints[i - 1];
            let p2 = filteredPoints[i];

            let distKm = p2.distance - p1.distance;
            let eleDiff = p2.ele - p1.ele;
            let grade = distKm > 0 ? (eleDiff / (distKm * 1000)) * 100 : 0;

            // Determinar color segons el pendent
            let color = '#22c55e'; // Verd (< 4%)
            if (grade >= 10) color = '#ef4444';      // Vermell (> 10%)
            else if (grade >= 7) color = '#f97316';  // Taronja (7-10%)
            else if (grade >= 4) color = '#eab308';  // Groc (4-7%)

            let seg = L.polyline([[p1.lat, p1.lon], [p2.lat, p2.lon]], {
                color: color,
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round'
            });

            trackLayerGroup.addLayer(seg);
        }

        trackLayerGroup.addTo(map);
        map.fitBounds(trackLayerGroup.getBounds(), { padding: [40, 40] });
    }
});
