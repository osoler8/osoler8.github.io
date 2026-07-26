document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('gpxFile');
    const fileNameSpan = document.getElementById('fileName');
    const welcomeMessage = document.getElementById('welcome-message');
    const visualSection = document.getElementById('visual-section');
    const resetViewBtn = document.getElementById('resetViewBtn');
    
    let map = null;
    let currentPolylineGroup = null;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameSpan.textContent = file.name;
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const gpxText = event.target.result;
                const trackData = parseGPX(gpxText);
                
                if (trackData.points.length === 0) {
                    alert("No s'han trobat punts vàlids en aquest arxiu GPX.");
                    return;
                }

                welcomeMessage.classList.add('hidden');
                visualSection.classList.remove('hidden');

                updateCardInfo(file.name.replace('.gpx', ''), trackData);
                initStyledMap(trackData.points);

            } catch (error) {
                console.error(error);
                alert("Error al llegir l'arxiu GPX.");
            }
        };

        reader.readAsText(file);
    });

    resetViewBtn.addEventListener('click', () => {
        if (map && currentPolylineGroup) {
            map.fitBounds(currentPolylineGroup.getBounds(), { padding: [40, 40] });
        }
    });

    function parseGPX(gpxText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, "text/xml");
        const trkpts = xmlDoc.querySelectorAll("trkpt");
        
        let points = [];
        let totalDistance = 0;
        let elevationGain = 0;
        let maxElevation = -Infinity;
        let prevPoint = null;

        trkpts.forEach((pt) => {
            const lat = parseFloat(pt.getAttribute("lat"));
            const lon = parseFloat(pt.getAttribute("lon"));
            if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) return;

            const eleEl = pt.querySelector("ele");
            const ele = eleEl ? parseFloat(eleEl.textContent) : 0;

            if (ele > maxElevation) maxElevation = ele;

            let distIncrement = 0;
            if (prevPoint) {
                distIncrement = getDistanceFromLatLonInKm(prevPoint.lat, prevPoint.lon, lat, lon);
                if (distIncrement > 5.0) return;
                totalDistance += distIncrement;

                const diff = ele - prevPoint.ele;
                if (diff > 0) elevationGain += diff;
            }

            const currentPoint = { lat, lon, ele, distance: totalDistance };
            points.push(currentPoint);
            prevPoint = currentPoint;
        });

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

    function updateCardInfo(routeName, data) {
        document.getElementById('cardTitle').textContent = routeName.replace(/[-_]/g, ' ');
        document.getElementById('cardDist').textContent = `${data.totalDistance.toFixed(1)} km`;
        document.getElementById('cardElev').textContent = `${Math.round(data.elevationGain)} m`;
        document.getElementById('cardMaxEle').textContent = `${Math.round(data.maxElevation)} m`;
    }

    function initStyledMap(points) {
        if (map) {
            map.remove();
        }

        map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        });

        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            subdomains: 'abc'
        }).addTo(map);

        currentPolylineGroup = L.layerGroup();

        for (let i = 1; i < points.length; i++) {
            let p1 = points[i - 1];
            let p2 = points[i];
            
            let dist = p2.distance - p1.distance;
            let eleDiff = p2.ele - p1.ele;
            let grade = dist > 0 ? (eleDiff / (dist * 1000)) * 100 : 0;

            let color = '#2563eb';
            if (grade > 10) color = '#dc2626';
            else if (grade > 6) color = '#f97316';
            else if (grade > 3) color = '#eab308';
            else if (grade >= 0) color = '#22c55e';

            let seg = L.polyline([[p1.lat, p1.lon], [p2.lat, p2.lon]], {
                color: color,
                weight: 5,
                opacity: 0.9,
                lineCap: 'round'
            });

            currentPolylineGroup.addLayer(seg);
        }

        currentPolylineGroup.addTo(map);
        map.fitBounds(currentPolylineGroup.getBounds(), { padding: [40, 40] });
    }
});
