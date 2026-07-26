document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('gpxFile');
    const fileNameSpan = document.getElementById('fileName');
    const welcomeBox = document.getElementById('welcomeBox');
    const appSection = document.getElementById('appSection');
    const centerBtn = document.getElementById('centerBtn');

    let map = null;
    let polylineGroup = null;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameSpan.textContent = file.name;
        const reader = new FileReader();

        reader.onload = function(event) {
            const gpxText = event.target.result;
            let points = [];
            let totalDist = 0;
            let posElev = 0;
            let maxElev = -Infinity;

            // Intent 1: Utilitzar gpxParser
            try {
                const gpx = new gpxParser();
                gpx.parse(gpxText);
                if (gpx.tracks && gpx.tracks.length > 0 && gpx.tracks[0].points.length > 0) {
                    const trk = gpx.tracks[0];
                    points = trk.points.map(p => ({ lat: p.lat, lon: p.lon, ele: p.ele || 0 }));
                    totalDist = trk.distance.total || 0;
                    posElev = trk.elevation.pos || 0;
                    maxElev = trk.elevation.max || 0;
                } else if (gpx.routes && gpx.routes.length > 0 && gpx.routes[0].points.length > 0) {
                    const rte = gpx.routes[0];
                    points = rte.points.map(p => ({ lat: p.lat, lon: p.lon, ele: p.ele || 0 }));
                    totalDist = rte.distance.total || 0;
                }
            } catch (err) {
                console.warn("gpxParser ha fallat, usant lector directe de backup:", err);
            }

            // Intent 2: Fallback absolut amb Regex si el parser extern no troba punts
            if (!points || points.length === 0) {
                const ptRegex = /<(?:trkpt|rtept|wpt)[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/(?:trkpt|rtept|wpt)>|<(?:trkpt|rtept|wpt)[^>]*lon=["']([^"']+)["'][^>]*lat=["']([^"']+)["'][^>]*>([\s\S]*?)<\/(?:trkpt|rtept|wpt)>/gi;
                
                // Regex simple per a punts tancats o oberts
                const simplePtRegex = /<[^>]*?(?:lat|LAT)=["']([^"']+)["'][^>]*?(?:lon|LON|lng|LNG)=["']([^"']+)["'][^>]*?>/g;
                
                let match;
                // Anem a cercar totes les aparicions de lat i lon al text
                let latLonRegex = /(?:lat|LAT)\s*=\s*["']([^"']+)["'][\s\S]*?(?:lon|LON|lng|LNG)\s*=\s*["']([^"']+)["']/g;
                
                let rawMatches = [];
                while ((match = latLonRegex.exec(gpxText)) !== null) {
                    let lat = parseFloat(match[1]);
                    let lon = parseFloat(match[2]);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        rawMatches.push({ lat, lon, ele: 0 });
                    }
                }

                if (rawMatches.length > 0) {
                    points = rawMatches;
                }
            }

            // Si tot i així no tenim punts
            if (!points || points.length === 0) {
                alert("No s'han pogut extreure coordenades d'aquest fitxer. Comprova que contingui dades de ruta vàlides.");
                return;
            }

            // Calcular mètriques si venen a zero
            let calculatedDist = totalDist;
            let calculatedPosElev = posElev;
            let calculatedMax = maxElev === -Infinity ? 0 : maxElev;
            let prev = null;

            let processedPoints = points.map((p, idx) => {
                let ele = p.ele !== undefined && p.ele !== null ? parseFloat(p.ele) : 0;
                if (ele > calculatedMax) calculatedMax = ele;

                let distInc = 0;
                if (prev) {
                    distInc = getDistanceFromLatLonInKm(prev.lat, prev.lon, p.lat, p.lon);
                    if (calculatedDist === 0) calculatedDist += distInc * 1000; // en metres
                    
                    let diff = ele - prev.ele;
                    if (diff > 0 && calculatedPosElev === 0) calculatedPosElev += diff;
                }
                let current = { lat: p.lat, lon: p.lon, ele: ele };
                prev = current;
                return current;
            });

            welcomeBox.classList.add('hidden');
            appSection.classList.remove('hidden');

            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            document.getElementById('rTitle').textContent = cleanName;
            document.getElementById('mDist').textContent = `${(calculatedDist / 1000).toFixed(1)} km`;
            document.getElementById('mElev').textContent = `${Math.round(calculatedPosElev)} m`;
            document.getElementById('mMax').textContent = `${Math.round(calculatedMax)} m`;

            initMap(processedPoints);
        };

        reader.readAsText(file);
    });

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2); 
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); 
    }

    centerBtn.addEventListener('click', () => {
        if (map && polylineGroup) {
            map.fitBounds(polylineGroup.getBounds(), { padding: [30, 30] });
        }
    });

    function initMap(points) {
        if (map) {
            map.remove();
        }

        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 18
        }).addTo(map);

        polylineGroup = L.layerGroup();

        let latlngs = points.map(p => [p.lat, p.lon, p.ele]);

        for (let i = 1; i < latlngs.length; i++) {
            let p1 = latlngs[i - 1];
            let p2 = latlngs[i];

            let distMeters = map.distance([p1[0], p1[1]], [p2[0], p2[1]]);
            let eleDiff = p2[2] - p1[2];
            let grade = distMeters > 0 ? (eleDiff / distMeters) * 100 : 0;

            let color = '#22c55e';
            if (grade >= 10) color = '#ef4444';
            else if (grade >= 7) color = '#f97316';
            else if (grade >= 4) color = '#eab308';

            let segment = L.polyline([[p1[0], p1[1]], [p2[0], p2[1]]], {
                color: color,
                weight: 5,
                opacity: 0.9,
                lineCap: 'round'
            });

            polylineGroup.addLayer(segment);
        }

        polylineGroup.addTo(map);
        map.fitBounds(polylineGroup.getBounds(), { padding: [30, 30] });
    }
});
