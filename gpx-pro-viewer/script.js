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
            try {
                const gpxText = event.target.result;

                const gpx = new gpxParser();
                gpx.parse(gpxText);

                // Busquem punts tant en Tracks, Routes o Waypoints per no fallar mai
                let points = [];
                let totalDist = 0;
                let posElev = 0;
                let maxElev = 0;

                if (gpx.tracks && gpx.tracks.length > 0 && gpx.tracks[0].points.length > 0) {
                    const trk = gpx.tracks[0];
                    points = trk.points;
                    totalDist = trk.distance.total;
                    posElev = trk.elevation.pos;
                    maxElev = trk.elevation.max;
                } else if (gpx.routes && gpx.routes.length > 0 && gpx.routes[0].points.length > 0) {
                    const rte = gpx.routes[0];
                    points = rte.points;
                    totalDist = rte.distance.total || 0;
                    posElev = 0; // Si és ruta pura, calculem desnivell bàsic
                    maxElev = Math.max(...points.map(p => p.ele || 0));
                } else if (gpx.waypoints && gpx.waypoints.length > 0) {
                    points = gpx.waypoints;
                    maxElev = Math.max(...points.map(p => p.ele || 0));
                }

                if (!points || points.length === 0) {
                    alert("L'arxiu s'ha obert però no conté cap punt geogràfic de ruta vàlid.");
                    return;
                }

                welcomeBox.classList.add('hidden');
                appSection.classList.remove('hidden');

                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                document.getElementById('rTitle').textContent = cleanName;
                document.getElementById('mDist').textContent = `${(totalDist / 1000).toFixed(1)} km`;
                document.getElementById('mElev').textContent = `${Math.round(posElev)} m`;
                document.getElementById('mMax').textContent = `${Math.round(maxElev)} m`;

                initMap(points);

            } catch (err) {
                console.error("Error al parsejar:", err);
                alert("No s'ha pogut llegir l'arxiu. Comprova que sigui un fitxer GPX estàndard.");
            }
        };

        reader.readAsText(file);
    });

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

        let latlngs = points.map(p => [p.lat, p.lon, p.ele !== undefined && p.ele !== null ? p.ele : 0]);

        for (let i = 1; i < latlngs.length; i++) {
            let p1 = latlngs[i - 1];
            let p2 = latlngs[i];

            let distMeters = map.distance([p1[0], p1[1]], [p2[0], p2[1]]);
            let eleDiff = p2[2] - p1[2];
            let grade = distMeters > 0 ? (eleDiff / distMeters) * 100 : 0;

            let color = '#22c55e'; // Verd
            if (grade >= 10) color = '#ef4444'; // Vermell
            else if (grade >= 7) color = '#f97316'; // Taronja
            else if (grade >= 4) color = '#eab308'; // Groc

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
