let currentQuestion = 0;

let scores = {
    dev: 0,
    data: 0,
    cyber: 0,
    reseau: 0,
    embarque: 0
};

const profils = {
    dev: {
        titre: "Développement logiciel",
        emoji: "💻",
        description: "Vous aimez transformer des idées en applications concrètes, utiles et bien construites.",
        majeures: ["Software Engineering", "Digital Transformation", "IT for Finance"]
    },
    data: {
        titre: "Data & Intelligence Artificielle",
        emoji: "📊",
        description: "Vous aimez analyser, comprendre et exploiter les données pour prendre de meilleures décisions.",
        majeures: ["Big Data & Machine Learning", "Business Intelligence & Analytics", "Bio-informatique"]
    },
    cyber: {
        titre: "Cybersécurité",
        emoji: "🔐",
        description: "Vous êtes attiré par la protection des systèmes, l’analyse des risques et la défense numérique.",
        majeures: ["Cybersécurité, SI & Gouvernance", "Cybersécurité, Infrastructure & Logiciels"]
    },
    reseau: {
        titre: "Réseaux & Cloud",
        emoji: "🌐",
        description: "Vous aimez comprendre comment les systèmes communiquent et comment garder une infrastructure stable.",
        majeures: ["Networks & Cloud Infrastructure", "Sécurité & Réseaux"]
    },
    embarque: {
        titre: "Systèmes embarqués & Robotique",
        emoji: "🤖",
        description: "Vous aimez relier informatique, objets physiques, capteurs, robots et systèmes intelligents.",
        majeures: ["Systèmes embarqués", "Systèmes robotiques & drones", "Transports intelligents"]
    }
};

function answer(points) {
    for (let key in points) {
        scores[key] += points[key];
    }

    const questions = document.querySelectorAll(".question");

    questions[currentQuestion].classList.remove("active");
    currentQuestion++;

    if (currentQuestion < questions.length) {
        questions[currentQuestion].classList.add("active");
    } else {
        showResult();
    }
}

function showResult() {
    const questions = document.querySelectorAll(".question");
    const resultDiv = document.getElementById("result");
    const restartBtn = document.getElementById("restart-btn");

    questions.forEach(question => question.classList.remove("active"));

    let sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    let meilleurProfil = sorted[0][0];
    let deuxiemeProfil = sorted[1][0];

    let profilPrincipal = profils[meilleurProfil];
    let profilSecondaire = profils[deuxiemeProfil];

    resultDiv.style.display = "block";
    restartBtn.style.display = "inline-block";

    resultDiv.innerHTML = `
        <h2>${profilPrincipal.emoji} ${profilPrincipal.titre}</h2>

        <p>${profilPrincipal.description}</p>

        <h3>Majeures qui pourraient vous correspondre :</h3>

        <ul>
            ${profilPrincipal.majeures.map(majeure => `<li>${majeure}</li>`).join("")}
        </ul>

        <p class="result-secondary">
            Profil secondaire possible : <strong>${profilSecondaire.titre}</strong>
        </p>
    `;
}

function restartQuiz() {
    currentQuestion = 0;

    for (let key in scores) {
        scores[key] = 0;
    }

    const questions = document.querySelectorAll(".question");
    const resultDiv = document.getElementById("result");
    const restartBtn = document.getElementById("restart-btn");

    questions.forEach(question => question.classList.remove("active"));
    questions[0].classList.add("active");

    resultDiv.style.display = "none";
    resultDiv.innerHTML = "";

    restartBtn.style.display = "none";
}