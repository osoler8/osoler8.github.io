const levels = [
    {
        level: 1,
        subject: "Medi Natural 🌍",
        story: "RESOL EL MISTERI: Quin sistema del cos humà transporta l'oxigen i els nutrients a través de la sang? (Introdueix només la paraula clau als engranatges).",
        // Array amb totes les respostes vàlides que el sistema acceptarà de forma intel·ligent
        validAnswers: ["circulatori", "sistema circulatori"], 
        displayLength: 11, // Longitud dels rodets de l'engranatge (ex: "circulatori")
        hint: "Té 11 lletres i inclou el cor, les venes i les artèries."
    },
    {
        level: 2,
        subject: "Matemàtiques 🧮",
        story: "CALCUL EN EQUIP: Per obrir el segon cadenat mecànic, heu de resoldre aquesta operació combinada i posar el número resultant als rodets: 12 + 4 x (15 - 5)",
        validAnswers: ["52", "052"],
        displayLength: 3, // Cadenat numèric de 3 xifres
        hint: "Primer resol el parèntesi, després multiplica per 4 i finalment suma 12."
    },
    {
        level: 3,
        subject: "Català ✍️",
        story: "ORTOGRAFIA: Troba l'error. 'Ahir vam anar d'excursió a la serra de Tramuntana i vam veure un llangardaix'. Quin és el subjecte d'aquesta oració amagada? (Nosaltres / Ells / Vosaltres)",
        validAnswers: ["nosaltres", "el subjecte el·líptic és nosaltres", "subjecte elíptic nosaltres"],
        displayLength: 9,
        hint: "És un subjecte el·líptic o tàcit. Qui 'vam anar'?"
    },
    {
        level: 4,
        subject: "Castellano 🇪🇸",
        story: "SALA DE CONTROL: ¿Cuál es la palabra intrusa por su acentuación entre estas cuatro: 'árbol', 'música', 'cálido', 'pájaro'?",
        validAnswers: ["árbol", "arbol"], // Admet amb i sense accent per si de cas!
        displayLength: 5,
        hint: "Tres son esdrújulas, una es llana."
    }
];

let currentLevelIndex = 0;
let timeLeft = 15 * 60; 
let timerInterval;
const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789 çáéíóúàèò".split(""); // Caràcters possibles dels engranatges

function startTimer() {
    timerInterval = setInterval(function() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("timer").innerText = minutes + ":" + seconds;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showGameOver();
        }
        timeLeft--;
    }, 1000);
}

function loadLevel() {
    const currentLevel = levels[currentLevelIndex];
    document.getElementById("level-num").innerText = currentLevel.level;
    document.getElementById("subject-badge").innerText = currentLevel.subject;
    document.getElementById("story-text").innerText = currentLevel.story;
    document.getElementById("feedback").classList.add("hidden");

    // Generar els engranatges/rodets visuals
    const lockContainer = document.getElementById("lock-container");
    lockContainer.innerHTML = "";

    for (let i = 0; i < currentLevel.displayLength; i++) {
        const dial = document.createElement("div");
        dial.className = "dial";
        dial.innerHTML = `
            <button class="arrow" onclick="spinDial(${i}, -1)">▲</button>
            <div class="dial-letter" id="dial-${i}">a</div>
            <button class="arrow" onclick="spinDial(${i}, 1)">▼</button>
        `;
        lockContainer.appendChild(dial);
    }
}

function spinDial(dialIndex, direction) {
    const dialTextElement = document.getElementById(`dial-${dialIndex}`);
    let currentLetter = dialTextElement.innerText.toLowerCase();
    let currentIndex = alphabet.indexOf(currentLetter);
    
    // Calcular nova posició de la roda
    let newIndex = currentIndex + direction;
    if (newIndex >= alphabet.length) newIndex = 0;
    if (newIndex < 0) newIndex = alphabet.length - 1;

    dialTextElement.innerText = alphabet[newIndex];
}

function checkLock() {
    const currentLevel = levels[currentLevelIndex];
    
    // Reconstruir la paraula que els alumnes han posat als engranatges
    let userBuiltWord = "";
    for (let i = 0; i < currentLevel.displayLength; i++) {
        userBuiltWord += document.getElementById(`dial-${i}`).innerText;
    }
    userBuiltWord = userBuiltWord.trim().toLowerCase();

    // Comprovar si coincideix amb QUALSEVOL de les opcions permeses a la base de dades
    // També netegem espais extres per si de cas
    let isCorrect = currentLevel.validAnswers.some(ans => {
        let cleanAns = ans.toLowerCase().replace(/\s+/g, '').substring(0, currentLevel.displayLength);
        let cleanUser = userBuiltWord.replace(/\s+/g, '');
        return cleanUser === cleanAns;
    });

    const feedback = document.getElementById("feedback");
    feedback.classList.remove("hidden");

    if (isCorrect) {
        currentLevelIndex++;
        feedback.innerText = "⚙️ CLIC! L'engranatge ha encaixat perfectament. Avançant...";
        feedback.className = "correct";

        setTimeout(() => {
            if (currentLevelIndex < levels.length) {
                loadLevel();
            } else {
                clearInterval(timerInterval);
                showVictory();
            }
        }, 2000);
    } else {
        feedback.innerText = "❌ Els engranatges es bloquegen. No és la combinació correcta. Pista: " + currentLevel.hint;
        feedback.className = "incorrect";
    }
}

function showVictory() {
    document.getElementById("game-box").innerHTML = `
        <h2 style="color: #4ade80; font-size: 2rem;">🏆 MISSIÓ ACONSEGUIDA! 🏆</h2>
        <p>Heu desxifrat tots els cadenats mecànics abans que s'esgotés el temps. Sou un equip increïble!</p>
        <p style="font-weight: bold;">Temps restant: ${document.getElementById("timer").innerText}</p>
    `;
}

function showGameOver() {
    document.getElementById("game-box").innerHTML = `
        <h2 style="color: #f87171; font-size: 2rem;">💥 CADENATS BLOQUEJATS 💥</h2>
        <p>El temps ha arribat a zero i el mecanisme s'ha segellat per sempre.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px;">Reiniciar Mecanisme 🔄</button>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    loadLevel();
});
