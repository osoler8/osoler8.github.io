class MultiplicationDecomposer {
    constructor() {
        this.num1 = 0;
        this.num2 = 0;
        this.decomposition1 = [];
        this.decomposition2 = [];
        this.currentStep = 0;
        this.helpSteps = [];
        this.isHelpMode = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateGrid());
        document.getElementById('helpBtn').addEventListener('click', () => this.toggleHelp());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('solveBtn').addEventListener('click', () => this.showSolution());
        
        // Detectar canvis en els inputs
        document.getElementById('num1').addEventListener('input', () => this.clearGrid());
        document.getElementById('num2').addEventListener('input', () => this.clearGrid());
    }

    decompose(number) {
        const digits = number.toString().split('').reverse();
        const decomposition = [];
        
        for (let i = 0; i < digits.length; i++) {
            const digit = parseInt(digits[i]);
            if (digit > 0) {
                const value = digit * Math.pow(10, i);
                decomposition.push(value);
            }
        }
        
        return decomposition.reverse();
    }

    generateGrid() {
        this.num1 = parseInt(document.getElementById('num1').value);
        this.num2 = parseInt(document.getElementById('num2').value);
        
        if (!this.num1 || !this.num2) {
            alert('Si us plau, introdueix dos números vàlids.');
            return;
        }

        this.decomposition1 = this.decompose(this.num1);
        this.decomposition2 = this.decompose(this.num2);
        
        // Mostrar el contenidor de la graella
        document.querySelector('.grid-container').classList.add('visible');
        
        this.createGrid();
        this.prepareHelpSteps();
        this.updateResultSection();
    }

    createGrid() {
        const gridContainer = document.getElementById('decomposition-grid');
        gridContainer.innerHTML = '';
        
        const table = document.createElement('table');
        table.className = 'multiplication-table';
        
        // Fila de capçalera amb la descomposició del primer número
        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('td')); // Cel·la buida
        
        this.decomposition1.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.className = 'header-cell';
            headerRow.appendChild(td);
        });
        table.appendChild(headerRow);
        
        // Files amb la descomposició del segon número i les cel·les de multiplicació
        this.decomposition2.forEach(value2 => {
            const row = document.createElement('tr');
            
            // Primera cel·la amb el valor de la descomposició
            const headerCell = document.createElement('td');
            headerCell.textContent = value2;
            headerCell.className = 'header-cell';
            row.appendChild(headerCell);
            
            // Cel·les de multiplicació
            this.decomposition1.forEach(value1 => {
                const td = document.createElement('td');
                td.className = 'multiplication-cell';
                td.contentEditable = true;
                td.dataset.value1 = value1;
                td.dataset.value2 = value2;
                td.dataset.result = value1 * value2;
                
                // Afegir event listener per validar l'entrada
                td.addEventListener('input', (e) => this.validateInput(e.target));
                td.addEventListener('blur', (e) => this.checkAnswer(e.target));
                
                row.appendChild(td);
            });
            
            table.appendChild(row);
        });
        
        gridContainer.appendChild(table);
    }

    validateInput(cell) {
        const value = cell.textContent.replace(/\D/g, ''); // Només números
        cell.textContent = value;
    }

    checkAnswer(cell) {
        const userAnswer = parseInt(cell.textContent);
        const correctAnswer = parseInt(cell.dataset.result);
        
        if (userAnswer === correctAnswer) {
            cell.classList.add('correct');
            cell.classList.remove('incorrect');
        } else if (userAnswer && userAnswer !== correctAnswer) {
            cell.classList.add('incorrect');
            cell.classList.remove('correct');
        } else {
            cell.classList.remove('correct', 'incorrect');
        }
        
        this.updateResultSection();
    }

    prepareHelpSteps() {
        this.helpSteps = [];
        
        // Pas 1: Explicar la descomposició
        this.helpSteps.push({
            type: 'explanation',
            message: `Descomposem ${this.num1} = ${this.decomposition1.join(' + ')} i ${this.num2} = ${this.decomposition2.join(' + ')}`
        });
        
        // Passos per omplir cada cel·la
        this.decomposition2.forEach(value2 => {
            this.decomposition1.forEach(value1 => {
                this.helpSteps.push({
                    type: 'fill',
                    value1: value1,
                    value2: value2,
                    result: value1 * value2,
                    message: `${value1} × ${value2} = ${value1 * value2}`
                });
            });
        });
        
        // Pas final: Sumar tots els resultats
        this.helpSteps.push({
            type: 'sum',
            message: 'Ara sumem tots els resultats per obtenir el resultat final'
        });
        
        this.currentStep = 0;
    }

    toggleHelp() {
        if (!this.helpSteps.length) {
            alert('Primer genera una graella!');
            return;
        }
        
        this.isHelpMode = !this.isHelpMode;
        const helpBtn = document.getElementById('helpBtn');
        const helpInstructions = document.getElementById('helpInstructions');
        
        if (this.isHelpMode) {
            helpBtn.textContent = '⏸️ Aturar Ajuda';
            helpInstructions.style.display = 'block';
            this.showNextStep();
        } else {
            helpBtn.textContent = '🔍 Ajuda pas a pas';
            helpInstructions.style.display = 'none';
            this.currentStep = 0;
            document.getElementById('stepInfo').innerHTML = '';
        }
    }

    showNextStep() {
        if (!this.isHelpMode || this.currentStep >= this.helpSteps.length) {
            this.isHelpMode = false;
            document.getElementById('helpBtn').textContent = '🔍 Ajuda pas a pas';
            document.getElementById('stepInfo').innerHTML = '<p class="success">✅ Ajuda completada!</p>';
            return;
        }
        
        const step = this.helpSteps[this.currentStep];
        const stepInfo = document.getElementById('stepInfo');
        
        stepInfo.innerHTML = `
            <div class="step">
                <strong>Pas ${this.currentStep + 1}:</strong> ${step.message}
                <button onclick="app.nextStep()" class="btn btn-small">Següent →</button>
            </div>
        `;
        
        if (step.type === 'fill') {
            // Trobar i omplir la cel·la corresponent
            const cells = document.querySelectorAll('.multiplication-cell');
            cells.forEach(cell => {
                if (parseInt(cell.dataset.value1) === step.value1 && 
                    parseInt(cell.dataset.value2) === step.value2) {
                    cell.textContent = step.result;
                    cell.classList.add('help-filled');
                    this.checkAnswer(cell);
                }
            });
        }
    }

    nextStep() {
        this.currentStep++;
        this.showNextStep();
    }

    showSolution() {
        const cells = document.querySelectorAll('.multiplication-cell');
        cells.forEach(cell => {
            cell.textContent = cell.dataset.result;
            cell.classList.add('solution-filled');
            this.checkAnswer(cell);
        });
        
        this.updateResultSection();
    }

    updateResultSection() {
        const resultSection = document.getElementById('result-section');
        
        if (!this.decomposition1.length || !this.decomposition2.length) {
            resultSection.innerHTML = '';
            return;
        }
        
        const cells = document.querySelectorAll('.multiplication-cell');
        const multiplications = [];
        const results = [];
        let allFilled = true;
        
        // Recollir les multiplicacions de les caselles que tenen contingut
        cells.forEach(cell => {
            if (cell.textContent && cell.textContent.trim() !== '') {
                const value = parseInt(cell.textContent);
                const value1 = parseInt(cell.dataset.value1);
                const value2 = parseInt(cell.dataset.value2);
                
                if (!isNaN(value) && !isNaN(value1) && !isNaN(value2)) {
                    multiplications.push(`${value1} × ${value2} = ${value}`);
                    results.push(value);
                }
            } else {
                allFilled = false;
            }
        });
        
        if (multiplications.length > 0) {
            const sum = results.reduce((a, b) => a + b, 0);
            const expectedSum = this.num1 * this.num2;
            
            let html = `
                <div class="result-calculation">
                    <h3>Càlcul:</h3>
                    ${multiplications.map(mult => `<p>${mult}</p>`).join('')}
            `;
            
            // Només mostrar la verificació si totes les caselles estan omplides
            if (allFilled) {
                html += `
                    <p><strong>${results.join(' + ')} = ${sum}</strong></p>
                    <p class="verification">
                        Verificació: ${this.num1} × ${this.num2} = ${expectedSum}
                        ${sum === expectedSum ? '✅' : '❌'}
                    </p>
                `;
            }
            
            html += `</div>`;
            resultSection.innerHTML = html;
        }
    }

    clearGrid() {
        document.getElementById('decomposition-grid').innerHTML = '';
        document.getElementById('result-section').innerHTML = '';
        document.getElementById('stepInfo').innerHTML = '';
        document.getElementById('helpInstructions').style.display = 'none';
        this.helpSteps = [];
        this.currentStep = 0;
        this.isHelpMode = false;
        document.getElementById('helpBtn').textContent = '🔍 Ajuda pas a pas';
    }

    reset() {
        document.getElementById('num1').value = '';
        document.getElementById('num2').value = '';
        // Ocultar el contenidor de la graella
        document.querySelector('.grid-container').classList.remove('visible');
        this.clearGrid();
    }
}

// Inicialitzar l'aplicació
const app = new MultiplicationDecomposer();

// Inicialització sense valors per defecte
window.addEventListener('load', () => {
    // Les caixes d'entrada es mantenen buides per defecte
});