class AngleGame {
    constructor() {
        this.selectedAngleTypes = ['agut', 'recte', 'obtus']; // Obligatoris per defecte
        this.currentAngle = null;
        this.currentAngleType = null;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalQuestions = 0;
        this.score = 0;
        this.streak = 0; // Encerts consecutius
        this.lastTwoAngles = []; // Per evitar repeticions
        
        // Missatges encoratjadors
        this.encouragingMessages = [
            "🎉 Fantàstic!",
            "🌟 Excel·lent!",
            "🚀 Increïble!",
            "💪 Molt bé!",
            "🎯 Perfecte!",
            "⭐ Genial!",
            "🏆 Impressionant!",
            "🎊 Brutal!"
        ];
        
        this.streakMessages = [
            "🔥 Estàs en ratxa!",
            "⚡ Imparable!",
            "🌪️ Com un huracà!",
            "🎪 Ets un crack!",
            "🎨 Artista dels angles!"
        ];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Botó per començar el joc
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Botó per tornar a la configuració
        document.getElementById('back-to-setup').addEventListener('click', () => {
            this.backToSetup();
        });

        // Botons d'opcions de resposta
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.checkAnswer(e.target.dataset.type);
            });
        });

        // Botó següent angle
        document.getElementById('next-angle').addEventListener('click', () => {
            this.generateNewAngle();
        });

        // Checkboxes d'angles addicionals
        document.getElementById('pla').addEventListener('change', (e) => {
            this.updateSelectedAngles();
        });

        document.getElementById('complet').addEventListener('change', (e) => {
            this.updateSelectedAngles();
        });
    }

    updateSelectedAngles() {
        this.selectedAngleTypes = ['agut', 'recte', 'obtus']; // Sempre obligatoris
        
        if (document.getElementById('pla').checked) {
            this.selectedAngleTypes.push('pla');
        }
        
        if (document.getElementById('complet').checked) {
            this.selectedAngleTypes.push('complet');
        }
    }

    startGame() {
        this.updateSelectedAngles();
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalQuestions = 0;
        this.score = 0;
        this.streak = 0;
        this.lastTwoAngles = [];
        this.updateScore();
        
        // Canviar a la pantalla del joc
        document.getElementById('setup-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        this.generateNewAngle();
    }

    backToSetup() {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('setup-screen').classList.add('active');
    }

    generateNewAngle() {
        // Seleccionar un tipus d'angle evitant repeticions consecutives
        let availableTypes = [...this.selectedAngleTypes];
        
        // Si tenim més d'un tipus disponible, evitem repetir els últims dos
        if (availableTypes.length > 1 && this.lastTwoAngles.length > 0) {
            // Eliminar l'últim tipus si hi ha més opcions
            if (this.lastTwoAngles.length >= 1) {
                availableTypes = availableTypes.filter(type => type !== this.lastTwoAngles[this.lastTwoAngles.length - 1]);
            }
            // Si encara tenim més d'una opció, eliminar també el penúltim
            if (availableTypes.length > 1 && this.lastTwoAngles.length >= 2) {
                availableTypes = availableTypes.filter(type => type !== this.lastTwoAngles[this.lastTwoAngles.length - 2]);
            }
        }
        
        // Si no queden opcions (cas molt rar), usar tots els tipus
        if (availableTypes.length === 0) {
            availableTypes = [...this.selectedAngleTypes];
        }
        
        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        this.currentAngleType = randomType;
        
        // Actualitzar historial d'angles
        this.lastTwoAngles.push(randomType);
        if (this.lastTwoAngles.length > 2) {
            this.lastTwoAngles.shift(); // Mantenir només els últims 2
        }
        
        // Generar angle segons el tipus
        let angle;
        switch (randomType) {
            case 'agut':
                angle = Math.floor(Math.random() * 89) + 1; // 1-89 graus
                break;
            case 'recte':
                angle = 90;
                break;
            case 'obtus':
                angle = Math.floor(Math.random() * 89) + 91; // 91-179 graus
                break;
            case 'pla':
                angle = 180;
                break;
            case 'complet':
                angle = 360;
                break;
        }
        
        this.currentAngle = angle;
        this.displayAngle(angle);
        this.resetAnswerButtons();
        this.hideFeedback();
    }

    displayAngle(degrees) {
        const svg = document.getElementById('angle-svg');
        const centerX = 150;
        const centerY = 150;
        const radius = 100;
        
        // Netejar SVG
        svg.innerHTML = '';
        
        // Crear el fons
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', '#f8f9fa');
        svg.appendChild(background);
        
        // Calcular les coordenades dels braços de l'angle
        const angle1X = centerX + radius;
        const angle1Y = centerY;
        
        const radians = (degrees * Math.PI) / 180;
        const angle2X = centerX + radius * Math.cos(radians);
        const angle2Y = centerY - radius * Math.sin(radians);
        
        // Dibuixar el primer braç (horitzontal)
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', centerX);
        line1.setAttribute('y1', centerY);
        line1.setAttribute('x2', angle1X);
        line1.setAttribute('y2', angle1Y);
        line1.setAttribute('stroke', '#2d3748');
        line1.setAttribute('stroke-width', '3');
        svg.appendChild(line1);
        
        // Dibuixar el segon braç
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', centerX);
        line2.setAttribute('y1', centerY);
        line2.setAttribute('x2', angle2X);
        line2.setAttribute('y2', angle2Y);
        line2.setAttribute('stroke', '#2d3748');
        line2.setAttribute('stroke-width', '3');
        svg.appendChild(line2);
        
        // Dibuixar l'arc de l'angle
        if (degrees > 0 && degrees <= 360) {
            const arcRadius = 30;
            
            if (degrees === 360) {
                // Per a l'angle complet, dibuixar un cercle complet
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', centerX);
                circle.setAttribute('cy', centerY);
                circle.setAttribute('r', arcRadius);
                circle.setAttribute('stroke', '#4299e1');
                circle.setAttribute('stroke-width', '2');
                circle.setAttribute('fill', 'none');
                svg.appendChild(circle);
            } else {
                // Per a altres angles, dibuixar un arc
                const largeArcFlag = degrees > 180 ? 1 : 0;
                
                const arcStartX = centerX + arcRadius;
                const arcStartY = centerY;
                const arcEndX = centerX + arcRadius * Math.cos(radians);
                const arcEndY = centerY - arcRadius * Math.sin(radians);
                
                const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const pathData = `M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY}`;
                arc.setAttribute('d', pathData);
                arc.setAttribute('stroke', '#4299e1');
                arc.setAttribute('stroke-width', '2');
                arc.setAttribute('fill', 'none');
                svg.appendChild(arc);
            }
        }
        
        // Dibuixar el punt central
        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        center.setAttribute('cx', centerX);
        center.setAttribute('cy', centerY);
        center.setAttribute('r', '4');
        center.setAttribute('fill', '#2d3748');
        svg.appendChild(center);
        
        // Mostrar els graus
        document.getElementById('angle-degrees').textContent = `${degrees}°`;
        
        // Actualitzar la visibilitat dels botons segons els tipus seleccionats
        this.updateOptionButtons();
    }

    updateOptionButtons() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            const type = btn.dataset.type;
            if (this.selectedAngleTypes.includes(type)) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    checkAnswer(selectedType) {
        const isCorrect = selectedType === this.currentAngleType;
        
        // Deshabilitar tots els botons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
        });
        
        // Marcar la resposta correcta i incorrecta
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.dataset.type === this.currentAngleType) {
                btn.classList.add('correct');
            } else if (btn.dataset.type === selectedType && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Actualitzar puntuació i estadístiques
        this.totalQuestions++;
        
        if (isCorrect) {
            this.correctCount++;
            this.streak++;
            
            // Sistema de puntuació
            let points = 10; // Punts base
            if (this.streak >= 5) points += 5; // Bonus per ratxa
            if (this.streak >= 10) points += 10; // Bonus extra per ratxa llarga
            
            this.score += points;
        } else {
            this.incorrectCount++;
            this.streak = 0; // Reiniciar ratxa
        }
        
        this.updateScore();
        
        // Mostrar feedback
        this.showFeedback(isCorrect, selectedType);
    }

    showFeedback(isCorrect, selectedType) {
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedback-text');
        
        feedback.classList.remove('hidden', 'correct', 'incorrect');
        
        if (isCorrect) {
            feedback.classList.add('correct');
            
            // Seleccionar missatge encoratjador aleatori
            let message = this.encouragingMessages[Math.floor(Math.random() * this.encouragingMessages.length)];
            
            // Afegir informació de punts
            let points = 10;
            if (this.streak >= 5) points += 5;
            if (this.streak >= 10) points += 10;
            
            message += ` +${points} punts`;
            
            // Missatges especials per ratxes
            if (this.streak >= 5) {
                const streakMessage = this.streakMessages[Math.floor(Math.random() * this.streakMessages.length)];
                message += `\n${streakMessage} (${this.streak} encerts seguits)`;
            }
            
            feedbackText.textContent = message;
        } else {
            feedback.classList.add('incorrect');
            const correctTypeName = this.getAngleTypeName(this.currentAngleType);
            const selectedTypeName = this.getAngleTypeName(selectedType);
            let message = `❌ Incorrecte. Has dit "${selectedTypeName}" però era "${correctTypeName}".`;
            
            if (this.streak > 0) {
                message += `\n💔 S'ha trencat la ratxa de ${this.streak} encerts.`;
            }
            
            feedbackText.textContent = message;
        }
    }

    getAngleTypeName(type) {
        const names = {
            'agut': 'Agut',
            'recte': 'Recte',
            'obtus': 'Obtús',
            'pla': 'Pla',
            'complet': 'Complet'
        };
        return names[type] || type;
    }

    hideFeedback() {
        document.getElementById('feedback').classList.add('hidden');
    }

    resetAnswerButtons() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('disabled', 'correct', 'incorrect');
            btn.style.pointerEvents = 'auto';
        });
    }

    updateScore() {
        // Actualitzar tots els elements de la interfície
        document.getElementById('correct-count').textContent = this.correctCount;
        document.getElementById('incorrect-count').textContent = this.incorrectCount;
        document.getElementById('total-score').textContent = this.score;
        document.getElementById('streak-count').textContent = this.streak;
    }
}

// Inicialitzar el joc quan es carregui la pàgina
document.addEventListener('DOMContentLoaded', () => {
    new AngleGame();
});