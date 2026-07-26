document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('gpxFile');
    const fileNameSpan = document.getElementById('fileName');
    const welcomeMessage = document.getElementById('welcome-message');
    
    const summarySection = document.getElementById('summary-section');
    const mapSection = document.getElementById('map-section');
    const chartSection = document.getElementById('chart-section');
    const portsSection = document.getElementById('ports-section');
    
    let map = null;
    let altitudeChart = null;

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

                // Processar dades i mostrar seccions
                welcomeMessage.classList.add('hidden');
                summarySection.classList.remove('hidden');
                mapSection.classList.remove('hidden');
                chartSection.classList.remove('hidden');
                portsSection.classList.remove('hidden');

                displaySummary(trackData);
                initMap(trackData.points);
                initChart(trackData.points);
                
                // Analitzar ports de muntanya (Criteri APM simplificat)
                const ports = detectCols(trackData.points);
                displayPorts(ports);

            } catch (error) {
                console.error(error);
                alert("Error al llegir o parsejar l'arxiu GPX. Comprova que el format sigui correcte.");
            }
        };

        reader.readAsText(file);
    });

    // --- 1. PARSEJAR GPX ---
    function parseGPX(gpxText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, "text/xml");
        
        const trkpts = xmlDoc.querySelectorAll("trkpt");
        let points = [];
        let totalDistance = 0;
        let elevationGain = 0;
        let elevationLoss = 0;
        let maxElevation = -Infinity;
        let minElevation = Infinity;

        let prevPoint = null;

        trkpts.forEach((pt, index) => {
            const lat = parseFloat(pt.getAttribute("lat"));
            const lon = parseFloat(pt.getAttribute("lon"));
            const eleEl = pt.querySelector("ele");
            const ele = eleEl ? parseFloat(eleEl.textContent) : 0;
            const timeEl = pt.querySelector("time");
            const time = timeEl ? new Date(timeEl.textContent) : null;

            if (ele > maxElevation) maxElevation = ele;
            if (ele < minElevation) minElevation = ele;

            let distIncrement = 0;
            if (prevPoint) {
                distIncrement = getDistanceFromLatLonInKm(prevPoint.lat, prevPoint.lon, lat, lon);
                totalDistance += distIncrement;

                const eleDiff = ele - prevPoint.ele;
                if (eleDiff > 0) {
                    elevationGain += eleDiff;
                } else {
                    elevationLoss += Math.abs(eleDiff);
                }
            }

            const currentPoint = {
                lat,
                lon,
                ele,
                time,
                distance: totalDistance,
                index
            };

            points.push(currentPoint);
            prevPoint = currentPoint;
        });

        // Càlcul de temps total si existeix
        let totalTimeSeconds = 0;
        if (points.length > 0 && points[0].time && points[points.length - 1].time) {
            totalTimeSeconds = (points[points.length - 1].time - points[0].time) / 1000;
        }

        return {
            points,
            totalDistance,
            elevationGain,
            elevationLoss,
            maxElevation: maxElevation === -Infinity ? 0 : maxElevation,
            minElevation: minElevation === Infinity ? 0 : minElevation,
            totalTimeSeconds
        };
    }

    // Fórmula Haversine per calcular distància entre dos punts GPS
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radi de la terra en km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // --- 2. MOSTRAR RESUM ---
    function displaySummary(data) {
        const statsGrid = document.getElementById('statsGrid');
        
        let timeFormatted = "--:--";
        if (data.totalTimeSeconds > 0) {
            const hours = Math.floor(data.totalTimeSeconds / 3600);
            const minutes = Math.floor((data.totalTimeSeconds % 3600) / 60);
            timeFormatted = `${hours}h ${minutes}m`;
        }

        statsGrid.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Distància Total</div>
                <div class="stat-value">${data.totalDistance.toFixed(2)} km</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Desnivell Positiu</div>
                <div class="stat-value">${Math.round(data.elevationGain)} m</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Altitud Màxima</div>
                <div class="stat-value">${Math.round(data.maxElevation)} m</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Temps en moviment</div>
                <div class="stat-value">${timeFormatted}</div>
            </div>
        `;
    }

    // --- 3. MAPA (LEAFLET) ---
    function initMap(points) {
        if (map) {
            map.remove();
        }

        const latlngs = points.map(p => [p.lat, p.lon]);
        
        map = L.map('map').setView([points[0].lat, points[0].lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const polyline = L.polyline(latlngs, {color: '#2563eb', weight: 4}).addTo(map);
        map.fitBounds(polyline.getBounds(), {padding: [30, 30]});
    }

    // --- 4. GRÀFICA (CHART.JS) ---
    function initChart(points) {
        const ctx = document.getElementById('altitudeChart').getContext('2d');
        
        if (altitudeChart) {
            altitudeChart.destroy();
        }

        // Mostrem mostres per evitar sobrecarregar si hi ha molts punts
        const step = Math.max(1, Math.floor(points.length / 300));
        const chartPoints = points.filter((_, i) => i % step === 0);

        const labels = chartPoints.map(p => p.distance.toFixed(1));
        const elevations = chartPoints.map(p => Math.round(p.ele));

        altitudeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Altitud (m)',
                    data: elevations,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Distància (km)' },
                        grid: { display: false }
                    },
                    y: {
                        title: { display: true, text: 'Altitud (m)' }
                    }
                }
            }
        });
    }

    // --- 5. DETECCIÓ DE PORTS DE MUNTANYA (Algorisme Cicloturista / APM simplificat) ---
    function detectCols(points) {
        // Suavitzat previ d'altitud (mitjana mòbil senzilla per evitar soroll GPS)
        const windowSize = 5;
        let smoothedEle = points.map((p, idx, arr) => {
            let sum = 0;
            let count = 0;
            for (let i = Math.max(0, idx - Math.floor(windowSize/2)); i <= Math.min(arr.length - 1, idx + Math.floor(windowSize/2)); i++) {
                sum += arr[i].ele;
                count++;
            }
            return sum / count;
        });

        // Cerca de pujades contínues: pendent mitjà > 3% i desnivell > 60m
        let ports = [];
        let inClimb = false;
        let startIndex = 0;
        let maxEleInClimb = -Infinity;
        let maxGradeInClimb = 0;

        for (let i = 1; i < points.length; i++) {
            const distDiff = points[i].distance - points[i-1].distance;
            if (distDiff === 0) continue;

            const eleDiff = smoothedEle[i] - smoothedEle[i-1];
            const grade = (eleDiff / (distDiff * 1000)) * 100; // pendent en %

            if (!inClimb) {
                // Inici de port potencial si pendent >= 3%
                if (grade >= 3.0) {
                    inClimb = true;
                    startIndex = i - 1;
                    maxEleInClimb = smoothedEle[i];
                    maxGradeInClimb = grade;
                }
            } else {
                if (smoothedEle[i] > maxEleInClimb) {
                    maxEleInClimb = smoothedEle[i];
                }
                if (grade > maxGradeInClimb) {
                    maxGradeInClimb = grade;
                }

                // S'acaba el port si el pendent baixa molt o hi ha baixada prolongada (< 0% durant uns metres o pla)
                if (grade < -1.0 || (smoothedEle[startIndex] > smoothedEle[i] && (smoothedEle[maxEleInClimbIndex(smoothedEle, startIndex, i)] - smoothedEle[i] > 30))) {
                    // Tancament del port
                    // Reculem fins al punt més alt real del segment
                    let endIndex = findPeakIndex(smoothedEle, startIndex, i);
                    let climbDist = points[endIndex].distance - points[startIndex].distance;
                    let climbEleGain = smoothedEle[endIndex] - smoothedEle[startIndex];
                    let avgGrade = climbDist > 0 ? (climbEleGain / (climbDist * 1000)) * 100 : 0;

                    // Filtrem ports molt petits o falsos plans (mínim 1 km i 60m desnivell)
                    if (climbDist >= 1.0 && climbEleGain >= 60 && avgGrade >= 3.0) {
                        let apm = calculateAPM(climbDist, avgGrade, maxGradeInClimb);
                        let category = getCategory(apm);

                        ports.push({
                            startKm: points[startIndex].distance,
                            endKm: points[endIndex].distance,
                            distance: climbDist,
                            elevationGain: climbEleGain,
                            avgGrade: avgGrade,
                            maxGrade: maxGradeInClimb,
                            apm: apm,
                            category: category
                        });
                    }

                    inClimb = false;
                }
            }
        }
        return ports;
    }

    function maxEleInClimbIndex(arr, start, end) {
        let maxIdx = start;
        let maxVal = arr[start];
        for (let i = start; i <= end; i++) {
            if (arr[i] > maxVal) {
                maxVal = arr[i];
                maxIdx = i;
            }
        }
        return maxIdx;
    }

    function findPeakIndex(arr, start, end) {
        let maxIdx = start;
        let maxVal = arr[start];
        for (let i = start; i <= end; i++) {
            if (arr[i] > maxVal) {
                maxVal = arr[i];
                maxIdx = i;
            }
        }
        return maxIdx;
    }

    // Càlcul estimat d'index APM (Análisis de Puertos de Montaña)
    // Fórmula empírica: Distància (km) * Pendent Mitjà (%) * Factor de correcció
    function calculateAPM(dist, avgGrade, maxGrade) {
        let base = dist * avgGrade;
        let bonus = (avgGrade > 6) ? (avgGrade - 6) * dist * 1.5 : 0;
        return Math.round(base + bonus);
    }

    function getCategory(apm) {
        if (apm > 160) return { name: 'Especial (HC)', class: 'badge-hc' };
        if (apm > 110) return { name: '1a Categoria', class: 'badge-1' };
        if (apm > 70)  return { name: '2a Categoria', class: 'badge-2' };
        if (apm > 35)  return { name: '3a Categoria', class: 'badge-3' };
        return { name: '4a Categoria', class: 'badge-4' };
    }

    function displayPorts(ports) {
        const tbody = document.getElementById('portsTbody');
        tbody.innerHTML = '';

        if (ports.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No s'han detectat ports de muntanya significatius en aquesta ruta.</td></tr>`;
            return;
        }

        ports.forEach((port, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${index + 1}</strong></td>
                <td>${port.startKm.toFixed(1)} km - ${port.endKm.toFixed(1)} km</td>
                <td>${port.distance.toFixed(2)} km</td>
                <td>${Math.round(port.elevationGain)} m</td>
                <td>${port.avgGrade.toFixed(1)}%</td>
                <td>${port.maxGrade.toFixed(1)}%</td>
                <td><strong>${port.apm}</strong></td>
                <td><span class="badge ${port.category.class}">${port.category.name}</span></td>
            `;
            tbody.appendChild(row);
        });
    }
});
