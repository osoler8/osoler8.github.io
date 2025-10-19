class MentalMathGame {
    constructor() {
        this.score = 0;
        this.currentQuestion = null;
        this.timer = null;
        this.timeLeft = 0;
        this.gameMode = 'timed';
        this.isGameActive = false;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.startTime = null;
        
        // Variables de gamificació
        this.totalScore = parseInt(localStorage.getItem('totalScore') || '0');
        this.userXP = parseInt(localStorage.getItem('userXP') || '0');
        this.combo = 0;
        this.maxCombo = 0;
        this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0');
        this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        
        // Calcular el nivell basant-se en el totalScore guardat
        this.userLevel = Math.floor(Math.sqrt(this.totalScore / 100)) + 1;
        
        this.initializeElements();
        this.bindEvents();
        this.updateModeVisibility();
        this.updateUserProfile();
    }

    initializeElements() {
        // Panels
        this.configPanel = document.getElementById('config-panel');
        this.gamePanel = document.getElementById('game-panel');
        this.resultsPanel = document.getElementById('results-panel');
        
        // Config elements
        this.gameModeRadios = document.querySelectorAll('input[name="gameMode"]');
        this.durationGroup = document.getElementById('duration-group');
        this.durationButtons = document.getElementById('duration-button-group');
        this.difficultyButtons = document.getElementById('difficulty-group');
        this.operationButtons = document.getElementById('operation-group');
        this.startBtn = document.getElementById('start-btn');
        
        // Game elements
        this.timerDisplay = document.getElementById('timer');
        this.scoreDisplay = document.getElementById('score');
        this.questionDisplay = document.getElementById('question');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.feedback = document.getElementById('feedback');
        
        // Results elements
        this.resultsContent = document.getElementById('results-content');
        this.playAgainBtn = document.getElementById('play-again-btn');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.stopBtn.addEventListener('click', () => this.stopGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        this.gameModeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateModeVisibility());
        });
        
        // Button selection events
        this.setupButtonGroups();
    }

    setupButtonGroups() {
        // Setup duration buttons
        this.durationButtons.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', () => {
                this.selectButton(this.durationButtons, button);
            });
        });

        // Setup difficulty buttons
        this.difficultyButtons.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', () => {
                this.selectButton(this.difficultyButtons, button);
            });
        });

        // Setup operation buttons
        this.operationButtons.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', () => {
                this.selectButton(this.operationButtons, button);
            });
        });
    }

    selectButton(group, selectedButton) {
        // Remove active class from all buttons in the group
        group.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        selectedButton.classList.add('active');
    }

    getSelectedValue(group) {
        const activeButton = group.querySelector('.option-button.active');
        return activeButton ? activeButton.dataset.value : null;
    }

    updateModeVisibility() {
        this.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
        this.durationGroup.style.display = this.gameMode === 'timed' ? 'block' : 'none';
    }

    startGame() {
        this.score = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.isGameActive = true;
        this.startTime = Date.now();
        
        this.gameMode = document.querySelector('input[name="gameMode"]:checked').value;
        
        if (this.gameMode === 'timed') {
            this.timeLeft = parseInt(this.getSelectedValue(this.durationButtons));
            this.startTimer();
        } else {
            this.timerDisplay.textContent = 'Mode lliure';
        }
        
        this.showPanel('game');
        this.generateQuestion();
        this.updateScore();
        this.updateQuestionNumber();
        this.updateUserProfile();
        this.answerInput.focus();
    }

    startTimer() {
        this.updateTimerDisplay();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    generateQuestion() {
        const difficulty = this.getSelectedValue(this.difficultyButtons);
        const operation = this.getSelectedValue(this.operationButtons);
        
        let maxNum;
        switch (difficulty) {
            case 'easy': maxNum = 10; break;
            case 'medium': maxNum = 50; break;
            case 'hard': maxNum = 100; break;
        }
        
        let operationType;
        if (operation === 'mixed') {
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            operationType = operations[Math.floor(Math.random() * operations.length)];
        } else {
            operationType = operation;
        }
        
        const num1 = Math.floor(Math.random() * maxNum) + 1;
        const num2 = Math.floor(Math.random() * maxNum) + 1;
        
        let questionText, correctAnswer;
        
        switch (operationType) {
            case 'addition':
                questionText = `${num1} + ${num2}`;
                correctAnswer = num1 + num2;
                break;
            case 'subtraction':
                // Assegurem que el resultat sigui positiu
                const larger = Math.max(num1, num2);
                const smaller = Math.min(num1, num2);
                questionText = `${larger} - ${smaller}`;
                correctAnswer = larger - smaller;
                break;
            case 'multiplication':
                // Per multiplicació, usem números més petits
                const mult1 = Math.floor(Math.random() * Math.min(maxNum / 2, 12)) + 1;
                const mult2 = Math.floor(Math.random() * Math.min(maxNum / 2, 12)) + 1;
                questionText = `${mult1} × ${mult2}`;
                correctAnswer = mult1 * mult2;
                break;
            case 'division':
                // Per divisió, generem primer el resultat i després el dividend
                const divisor = Math.floor(Math.random() * Math.min(maxNum / 2, 12)) + 1;
                const quotient = Math.floor(Math.random() * Math.min(maxNum / 2, 12)) + 1;
                const dividend = divisor * quotient; // Assegurem divisió exacta
                questionText = `${dividend} ÷ ${divisor}`;
                correctAnswer = quotient;
                break;
        }
        
        this.currentQuestion = {
            text: questionText,
            answer: correctAnswer
        };
        
        this.questionDisplay.textContent = questionText + ' = ?';
        this.answerInput.value = '';
        this.feedback.textContent = '';
    }

    submitAnswer() {
        if (!this.isGameActive || !this.currentQuestion) return;
        
        const userAnswer = parseInt(this.answerInput.value);
        this.questionsAnswered++;
        
        const isCorrect = userAnswer === this.currentQuestion.answer;
        
        if (isCorrect) {
            this.correctAnswers++;
            const basePoints = 10;
            const comboBonus = Math.min(this.combo * 2, 20);
            const totalPoints = basePoints + comboBonus;
            
            this.score += totalPoints;
            this.addXP(totalPoints);
            this.updateCombo(true);
            
            // Efectes visuals
            const submitBtn = this.submitBtn.getBoundingClientRect();
            const centerX = submitBtn.left + submitBtn.width / 2;
            const centerY = submitBtn.top + submitBtn.height / 2;
            
            this.createParticleEffect(centerX, centerY);
            this.showFloatingPoints(totalPoints, centerX, centerY);
            
            this.showFeedback(`✅ Correcte! +${totalPoints} punts`, 'success');
        } else {
            this.updateCombo(false);
            this.showFeedback(`❌ Incorrecte. La resposta era ${this.currentQuestion.answer}`, 'error');
        }
        
        this.updateScore();
        this.updateQuestionNumber();
        
        setTimeout(() => {
            if (this.isGameActive) {
                this.generateQuestion();
                this.answerInput.focus();
            }
        }, 1000);
    }

    skipQuestion() {
        if (!this.isGameActive) return;
        
        this.questionsAnswered++;
        this.showFeedback(`⏭️ Saltada. La resposta era ${this.currentQuestion.answer}`, 'info');
        
        setTimeout(() => {
            if (this.isGameActive) {
                this.generateQuestion();
                this.answerInput.focus();
            }
        }, 1000);
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }

    stopGame() {
        this.endGame();
    }

    endGame() {
        this.isGameActive = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.showResults();
    }

    showResults() {
        const totalTime = this.gameMode === 'timed' 
            ? parseInt(this.getSelectedValue(this.durationButtons))
            : Math.floor((Date.now() - this.startTime) / 1000);
        
        const accuracy = this.questionsAnswered > 0 
            ? Math.round((this.correctAnswers / this.questionsAnswered) * 100)
            : 0;
        
        const questionsPerMinute = this.questionsAnswered > 0
            ? Math.round((this.questionsAnswered / totalTime) * 60)
            : 0;
        
        // Actualitzar estadístiques globals
        this.gamesPlayed++;
        localStorage.setItem('gamesPlayed', this.gamesPlayed.toString());
        
        this.resultsContent.innerHTML = `
            <div class="result-item">
                <span class="result-label">Puntuació final:</span>
                <span class="result-value">${this.score}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Preguntes contestades:</span>
                <span class="result-value">${this.questionsAnswered}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Respostes correctes:</span>
                <span class="result-value">${this.correctAnswers}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Precisió:</span>
                <span class="result-value">${accuracy}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Combo màxim:</span>
                <span class="result-value">${this.maxCombo}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Temps total:</span>
                <span class="result-value">${this.formatTime(totalTime)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Preguntes per minut:</span>
                <span class="result-value">${questionsPerMinute}</span>
            </div>
        `;
        
        // Mostrar medalles guanyades
        const medals = this.checkForMedals();
        this.displayMedals(medals);
        
        this.showPanel('results');
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    resetGame() {
        this.showPanel('config');
    }

    showPanel(panelName) {
        this.configPanel.classList.add('hidden');
        this.gamePanel.classList.add('hidden');
        this.resultsPanel.classList.add('hidden');
        
        switch (panelName) {
            case 'config':
                this.configPanel.classList.remove('hidden');
                break;
            case 'game':
                this.gamePanel.classList.remove('hidden');
                break;
            case 'results':
                this.resultsPanel.classList.remove('hidden');
                break;
        }
    }

    updateQuestionNumber() {
        const questionNumberElement = document.getElementById('questionNumber');
        if (questionNumberElement) {
            questionNumberElement.textContent = this.questionsAnswered + 1;
        }
    }

    // Funcions de gamificació
    updateUserProfile() {
        this.calculateLevel();
        const userLevelElement = document.getElementById('user-level');
        const currentXPElement = document.getElementById('current-xp');
        const nextLevelXPElement = document.getElementById('next-level-xp');
        const xpFillElement = document.getElementById('xp-fill');
        
        if (userLevelElement) userLevelElement.textContent = this.userLevel;
        if (currentXPElement) currentXPElement.textContent = this.userXP;
        
        const xpForNextLevel = this.getXPForLevel(this.userLevel + 1);
        const xpForCurrentLevel = this.getXPForLevel(this.userLevel);
        
        if (nextLevelXPElement) nextLevelXPElement.textContent = xpForNextLevel;
        
        if (xpFillElement) {
            const progress = ((this.userXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
            xpFillElement.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        }
        
        this.updateAchievements();
    }

    calculateLevel() {
        this.userLevel = Math.floor(Math.sqrt(this.totalScore / 100)) + 1;
    }

    getXPForLevel(level) {
        return Math.pow(level - 1, 2) * 100;
    }

    addXP(amount) {
        const oldLevel = this.userLevel;
        this.userXP += amount;
        this.totalScore += amount;
        
        // Guardar al localStorage
        localStorage.setItem('userXP', this.userXP.toString());
        localStorage.setItem('totalScore', this.totalScore.toString());
        
        this.calculateLevel();
        
        if (this.userLevel > oldLevel) {
            this.showLevelUpNotification(this.userLevel);
        }
        
        this.updateUserProfile();
    }

    showLevelUpNotification(newLevel) {
        const notification = document.getElementById('levelUpNotification');
        if (notification) {
            const content = notification.querySelector('.level-up-content');
            if (content) {
                content.innerHTML = `
                    <h3>🎉 Pujada de nivell!</h3>
                    <p>Ara ets nivell ${newLevel}!</p>
                `;
            }
            notification.classList.remove('hidden');
            
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 3000);
        }
    }

    updateCombo(correct) {
        if (correct) {
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
        } else {
            this.combo = 0;
        }
        
        const comboElement = document.getElementById('combo');
        if (comboElement) {
            comboElement.textContent = this.combo;
            comboElement.style.display = this.combo > 1 ? 'block' : 'none';
        }
    }

    createParticleEffect(x, y) {
        const container = document.getElementById('particlesContainer');
        if (!container) return;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x + (Math.random() - 0.5) * 40}px`;
            particle.style.top = `${y + (Math.random() - 0.5) * 40}px`;
            particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    showFloatingPoints(points, x, y) {
        const container = document.getElementById('floatingPoints');
        if (!container) return;
        
        const floatingPoint = document.createElement('div');
        floatingPoint.className = 'floating-point';
        floatingPoint.textContent = `+${points}`;
        floatingPoint.style.left = `${x}px`;
        floatingPoint.style.top = `${y}px`;
        
        container.appendChild(floatingPoint);
        
        setTimeout(() => {
            if (floatingPoint.parentNode) {
                floatingPoint.parentNode.removeChild(floatingPoint);
            }
        }, 1500);
    }

    updateAchievements() {
        const badges = document.getElementById('achievementBadges');
        if (!badges) return;
        
        badges.innerHTML = '';
        
        // Assoliment de combo
        if (this.maxCombo >= 5) {
            this.addAchievementBadge(badges, '🔥', 'Combo x5');
        }
        if (this.maxCombo >= 10) {
            this.addAchievementBadge(badges, '⚡', 'Combo x10');
        }
        
        // Assoliment de puntuació total
        if (this.totalScore >= 1000) {
            this.addAchievementBadge(badges, '⭐', '1000 punts');
        }
        if (this.totalScore >= 5000) {
            this.addAchievementBadge(badges, '🏆', '5000 punts');
        }
    }

    addAchievementBadge(container, icon, text) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `<span class="badge-icon">${icon}</span><span class="badge-text">${text}</span>`;
        container.appendChild(badge);
    }

    checkForMedals() {
        const medals = [];
        
        if (this.correctAnswers >= 10) {
            medals.push({ icon: '🥉', text: 'Bronze', description: '10 respostes correctes' });
        }
        if (this.correctAnswers >= 20) {
            medals.push({ icon: '🥈', text: 'Plata', description: '20 respostes correctes' });
        }
        if (this.correctAnswers >= 30) {
            medals.push({ icon: '🥇', text: 'Or', description: '30 respostes correctes' });
        }
        
        const accuracy = this.questionsAnswered > 0 ? (this.correctAnswers / this.questionsAnswered) * 100 : 0;
        if (accuracy >= 90 && this.questionsAnswered >= 10) {
            medals.push({ icon: '🎯', text: 'Precisió', description: '90% precisió' });
        }
        
        if (this.maxCombo >= 15) {
            medals.push({ icon: '🔥', text: 'Combo Master', description: 'Combo de 15' });
        }
        
        return medals;
    }

    displayMedals(medals) {
        const container = document.getElementById('earnedMedals');
        if (!container || medals.length === 0) return;
        
        container.innerHTML = '';
        medals.forEach((medal, index) => {
            setTimeout(() => {
                const medalElement = document.createElement('div');
                medalElement.className = 'medal';
                medalElement.innerHTML = `
                    <div class="medal-icon">${medal.icon}</div>
                    <div class="medal-text">${medal.text}</div>
                    <div class="medal-description">${medal.description}</div>
                `;
                container.appendChild(medalElement);
            }, index * 200);
        });
    }
}

// Inicialitzar el joc quan es carregui la pàgina
document.addEventListener('DOMContentLoaded', () => {
    new MentalMathGame();
});