const levels = [
    // --- HABITACIÓ 1: EL LABORATORI DE CIÈNCIES ---
    {
        level: 1,
        room: "Habitació 1: El Laboratori Abandonat 🧪",
        subject: "Medi Natural 🌍",
        story: "Per encendre els ordinadors del laboratori, heu d'introduir el nom del sistema que s'encarrega de portar l'oxigen i els nutrients a tot el cos humà. (Pista: Sistema...)",
        answer: "circulatori",
        hint: "Inclou el cor, les venes i les artèries."
    },
    {
        level: 2,
        room: "Habitació 1: El Laboratori Abandonat 🧪",
        subject: "Matemàtiques 🧮",
        story: "L'ordinador demana un codi numèric. Resol aquesta operació combinada per obtenir-lo: 5 + 3 x (8 - 2)",
        answer: "23",
        hint: "Recorda la jerarquia de les operacions: primer el parèntesi, després la multiplicació i finalment la suma!"
    },
    {
        level: 3,
        room: "Habitació 1: El Laboratori Abandonat 🧪",
        subject: "Català ✍️",
        story: "La porta de sortida del laboratori té un text gravat: 'El científic va anar ___ l'escola a buscar els reactius'. Quina preposició hi falta per completar la frase correctament? (a / a phel / cap a)",
        answer: "a",
        hint: "Davant de nom d'escola es fa servir la preposició 'a'."
    },
    // --- HABITACIÓ 2: LA BIBLIOTECA DELS SECRETS ---
    {
        level: 4,
        room: "Habitació 2: La Biblioteca dels Secrets 📚",
        subject: "Castellano 🇪🇸",
        story: "Encontráis un libro antiguo con una cerradura mágica. Para abrirlo, debéis escribir el antónimo de la palabra 'EFÍMERO' (que dura muy poco tiempo). Pista: Empieza por D.",
        answer: "duradero",
        hint: "Algo que dura mucho tiempo o es casi para siempre (también podría ser eterno, pero busca la que empieza por D)."
    },
    {
        level: 5,
        room: "Habitació 2: La Biblioteca dels Secrets 📚",
        subject: "Medi Social 🏛️",
        story: "Dins del llibre hi ha un mapa històric. Quina gran edat de la història comença amb l'arribada dels romans a la Península Ibèrica i la caiguda de l'Imperi Romà? (Edat Antiga, Edat Mitjana o Edat Moderna)",
        answer: "edat antiga",
        hint: "És l'època de les grans civilitzacions com Egipte, Grècia i Roma."
    },
    {
        level: 6,
        room: "Habitació 2: La Biblioteca dels Secrets 📚",
        subject: "Matemàtiques 🧮",
        story: "El cadenat de la biblioteca necessita la resposta a aquest problema: 'Si 3 llibres costen 15 €, quants euros costaran 7 llibres d'aquella mateixa col·lecció?'",
        answer: "35",
        hint: "Primer calcula quant costa UN sol llibre (15 dividit entre 3) i després multiplica-ho per 7."
    },
    // --- HABITACIÓ 3: LA SALA DE CONTROL FINAL ---
    {
        level: 7,
        room: "Habitació 3: La Sala de Control Final 🖥️",
        subject: "Català ✍️",
        story: "Per activar la palanca principal, heu de trobar el subjecte d'aquesta oració: 'Ahir a la tarda, els alumnes de sisè van guanyar el concurs'. Escrigués exactament el subjecte.",
        answer: "els alumnes de sisè",
        hint: "Pregunta-li al verb: Qui va guanyar el concurs?"
    },
    {
        level: 8,
        room: "Habitació 3: La Sala de Control Final 🖥️",
        subject: "Castellano 🇪🇸",
        story: "El sistema central emite un aviso: 'Identifica la palabra intrusa por su acentuación: camión, sofá, árbol, París'.",
        answer: "árbol",
        hint: "Tres de ellas son agudas, una es llana."
    },
    {
        level: 9,
        room: "Habitació 3: La Sala de Control Final 🖥️",
        subject: "Medi (Geografia) 🗺️",
        story: "Últim codi! Com se l'anomena al conjunt de línies imaginàries (meridians i paral·lels) que serveixen per localitzar qualsevol punt sobre la Terra? (Coordenades geogràfiques / Escala / Relleu)",
        answer: "coordenades geogràfiques",
        hint: "Utilitzen la latitud i la longitud."
    }
];

let currentLevelIndex = 0;
let timeLeft = 15 * 60; // 15 minuts en segons
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        // Formatar a 00:00
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
    document.getElementById("room-title").innerText = currentLevel.room;
    document.getElementById("subject-badge").innerText = currentLevel.subject;
    document.getElementById("story-text").innerText = currentLevel.story;
    document.getElementById("answer-input").value = "";
    document.getElementById("feedback").classList.add("hidden");
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase().replace(/[,.]/g, "");
    const correctAnswer = levels[currentLevelIndex].answer.toLowerCase();
    const feedback = document.getElementById("feedback");

    if (userAnswer === correctAnswer) {
        currentLevelIndex++;
        feedback.innerText = "🎉 CORRECTE! S'ha desbloquejat el mecanisme.";
        feedback.className = "correct";
        feedback.classList.remove("hidden");

        setTimeout(() => {
            if (currentLevelIndex < levels.length) {
                loadLevel();
            } else {
                clearInterval(timerInterval);
                showVictory();
            }
        }, 1500);
    } else {
        feedback.innerText = "❌ CODI INCORRECTE. Pista: " + levels[currentLevelIndex].hint;
        feedback.className = "incorrect";
        feedback.classList.remove("hidden");
    }
}

function showVictory() {
    document.getElementById("game-box").innerHTML = `
        <h2 style="color: #4e9f3d; font-size: 2rem;">🏆 HO HEU ACONSEGUIT! 🏆</h2>
        <p>Heu superat les 3 habitacions i resolt els 9 reptes de 6è a temps. Sou uns veritables genis de l'evasió!</p>
        <p style="font-weight: bold; margin-up: 15px;">Temps restant: ${document.getElementById("timer").innerText}</p>
        <img src="https://media.giphy.com/media/26gfZm6ZshhS6wvx6/giphy.gif" alt="Victòria" style="max-width:100%; border-radius:10px; margin-top: 15px;">
    `;
}

function showGameOver() {
    document.getElementById("game-box").innerHTML = `
        <h2 style="color: #d83a3a; font-size: 2rem;">💥 TEMPS EXHAURIT 💥</h2>
        <p>El sistema s'ha bloquejat completament. No heu pogut sortir a temps...</p>
        <button onclick="window.location.reload()" style="margin-top: 20px;">Torna-ho a intentar 🔄</button>
    `;
}

// Escuitar la tecla Enter per enviar la resposta més ràpid
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    loadLevel();
    document.getElementById("answer-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });
});
