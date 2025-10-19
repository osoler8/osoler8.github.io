class CalculMental {
    constructor() {
        this.currentOperation = null;
        this.currentDifficulty = null;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.score = 0;
        this.correct = 0;
        this.incorrect = 0;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        // Seccions
        this.operationSelector = document.querySelector('.operation-selector');
        this.difficultySelector = document.querySelector('.difficulty-selector');
        this.gameArea = document.querySelector('.game-area');
        
        // Botons d'operacions
        this.operationBtns = document.querySelectorAll('.operation-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        // Elements del joc
        this.questionEl = document.getElementById('question');
        this.answerInput = document.getElementById('answer');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.newQuestionBtn = document.getElementById('new-question-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Estadístiques
        this.scoreEl = document.getElementById('score');
        this.correctEl = document.getElementById('correct');
        this.incorrectEl = document.getElementById('incorrect');
    }
    
    bindEvents() {
        // Selecció d'operacions
        this.operationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectOperation(e.target.dataset.operation);
            });
        });
        
        // Selecció de dificultat
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(e.target.dataset.level);
            });
        });
        
        // Controls del joc
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.newQuestionBtn.addEventListener('click', () => this.generateQuestion());
        this.restartBtn.addEventListener('click', () => this.restart());
        
        // Enter per enviar resposta
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    selectOperation(operation) {
        this.currentOperation = operation;
        
        // Actualitzar estils dels botons
        this.operationBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`[data-operation="${operation}"]`).classList.add('selected');
        
        // Mostrar selector de dificultat
        this.difficultySelector.style.display = 'block';
    }
    
    selectDifficulty(level) {
        this.currentDifficulty = level;
        
        // Actualitzar estils dels botons
        this.difficultyBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`[data-level="${level}"]`).classList.add('selected');
        
        // Iniciar el joc
        this.startGame();
    }
    
    startGame() {
        this.operationSelector.style.display = 'none';
        this.difficultySelector.style.display = 'none';
        this.gameArea.style.display = 'block';
        
        this.generateQuestion();
        this.answerInput.focus();
    }
    
    generateQuestion() {
        this.clearFeedback();
        this.answerInput.value = '';
        this.answerInput.focus();
        
        const ranges = this.getDifficultyRanges();
        let num1, num2, operator, question;
        
        if (this.currentOperation === 'mixte') {
            const operations = ['suma', 'resta', 'multiplicacio', 'divisio'];
            const randomOp = operations[Math.floor(Math.random() * operations.length)];
            this.currentOperation = randomOp;
        }
        
        switch (this.currentOperation) {
            case 'suma':
                num1 = this.getRandomNumber(ranges.min, ranges.max);
                num2 = this.getRandomNumber(ranges.min, ranges.max);
                this.correctAnswer = num1 + num2;
                question = `${num1} + ${num2} = ?`;
                break;
                
            case 'resta':
                num1 = this.getRandomNumber(ranges.min, ranges.max);
                num2 = this.getRandomNumber(ranges.min, Math.min(num1, ranges.max));
                this.correctAnswer = num1 - num2;
                question = `${num1} - ${num2} = ?`;
                break;
                
            case 'multiplicacio':
                num1 = this.getRandomNumber(ranges.minMult, ranges.maxMult);
                num2 = this.getRandomNumber(ranges.minMult, ranges.maxMult);
                this.correctAnswer = num1 * num2;
                question = `${num1} × ${num2} = ?`;
                break;
                
            case 'divisio':
                // Generar divisions exactes
                num2 = this.getRandomNumber(ranges.minDiv, ranges.maxDiv);
                const quotient = this.getRandomNumber(ranges.minDiv, ranges.maxDiv);
                num1 = num2 * quotient;
                this.correctAnswer = quotient;
                question = `${num1} ÷ ${num2} = ?`;
                break;
        }
        
        this.currentQuestion = question;
        this.questionEl.textContent = question;
        
        // Restaurar operació mixta si cal
        if (this.currentOperation !== 'mixte') {
            const originalOp = document.querySelector('.operation-btn.selected').dataset.operation;
            if (originalOp === 'mixte') {
                this.currentOperation = 'mixte';
            }
        }
    }
    
    getDifficultyRanges() {
        switch (this.currentDifficulty) {
            case 'facil':
                return {
                    min: 1, max: 20,
                    minMult: 1, maxMult: 10,
                    minDiv: 1, maxDiv: 10
                };
            case 'mitja':
                return {
                    min: 10, max: 100,
                    minMult: 2, maxMult: 15,
                    minDiv: 2, maxDiv: 15
                };
            case 'dificil':
                return {
                    min: 50, max: 500,
                    minMult: 5, maxMult: 25,
                    minDiv: 3, maxDiv: 20
                };
            default:
                return { min: 1, max: 10, minMult: 1, maxMult: 10, minDiv: 1, maxDiv: 10 };
        }
    }
    
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Si us plau, introdueix un número vàlid.', 'incorrect');
            return;
        }
        
        if (userAnswer === this.correctAnswer) {
            this.correct++;
            this.score += this.getPoints();
            this.showFeedback('🎉 Correcte! Molt bé!', 'correct');
            setTimeout(() => this.generateQuestion(), 1500);
        } else {
            this.incorrect++;
            this.showFeedback(`❌ Incorrecte. La resposta correcta era ${this.correctAnswer}.`, 'incorrect');
        }
        
        this.updateStats();
    }
    
    getPoints() {
        const basePoints = {
            'facil': 10,
            'mitja': 20,
            'dificil': 30
        };
        
        const operationMultiplier = {
            'suma': 1,
            'resta': 1.2,
            'multiplicacio': 1.5,
            'divisio': 2,
            'mixte': 1.8
        };
        
        const operation = document.querySelector('.operation-btn.selected').dataset.operation;
        return Math.round(basePoints[this.currentDifficulty] * operationMultiplier[operation]);
    }
    
    showFeedback(message, type) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `feedback ${type}`;
    }
    
    clearFeedback() {
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = 'feedback';
    }
    
    updateStats() {
        this.scoreEl.textContent = this.score;
        this.correctEl.textContent = this.correct;
        this.incorrectEl.textContent = this.incorrect;
    }
    
    restart() {
        // Reiniciar estadístiques
        this.score = 0;
        this.correct = 0;
        this.incorrect = 0;
        this.updateStats();
        
        // Reiniciar seleccions
        this.operationBtns.forEach(btn => btn.classList.remove('selected'));
        this.difficultyBtns.forEach(btn => btn.classList.remove('selected'));
        
        // Mostrar selector d'operacions
        this.operationSelector.style.display = 'block';
        this.difficultySelector.style.display = 'none';
        this.gameArea.style.display = 'none';
        
        // Reiniciar variables
        this.currentOperation = null;
        this.currentDifficulty = null;
        this.clearFeedback();
    }
}

// Inicialitzar el joc quan es carregui la pàgina
document.addEventListener('DOMContentLoaded', () => {
    new CalculMental();
});