let dateLundiCourant = calculerLundi(new Date());

function calculerLundi(date) {
    let d = new Date(date);
    let jourDeLaSemaine = d.getDay();
    let difference;

    if (jourDeLaSemaine === 0) {
        difference = d.getDate() - 6;
    } else {
        difference = d.getDate() - jourDeLaSemaine + 1;
    }

    d.setDate(difference);
    return d;
}

function formaterDateSimple(date) {
    let annee = date.getFullYear();
    let mois = date.getMonth() + 1;
    let jour = date.getDate();

    if (mois < 10) {
        mois = "0" + mois;
    }

    if (jour < 10) {
        jour = "0" + jour;
    }

    return annee + "-" + mois + "-" + jour;
}

function formaterDateAffichage(date) {
    let mois = date.getMonth() + 1;
    let jour = date.getDate();

    if (mois < 10) {
        mois = "0" + mois;
    }

    if (jour < 10) {
        jour = "0" + jour;
    }

    return jour + "/" + mois;
}

function changerSemaineRDV(nombreDeJours) {
    let jourActuel = dateLundiCourant.getDate();
    dateLundiCourant.setDate(jourActuel + nombreDeJours);
    afficherCalendrierRDV();
}

function afficherCalendrierRDV() {
    let corpsTableau = document.getElementById("corps-calendrier-rdv");
    let enteteTableau = document.getElementById("entete-jours-rdv");
    let titreSemaine = document.getElementById("titre-semaine-rdv");
    
    if (corpsTableau === null) {
        return;
    }
    
    if (enteteTableau === null) {
        return;
    }

    let nomsDesJours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    let datesDeLaSemaine = [];
    
    let htmlEntete = "<th>Heure</th>";
    
    for (let i = 0; i < 5; i++) {
        let jourCalcule = new Date(dateLundiCourant);
        let jourEnPlus = jourCalcule.getDate() + i;
        jourCalcule.setDate(jourEnPlus);
        
        let dateTexte = formaterDateSimple(jourCalcule);
        datesDeLaSemaine.push(dateTexte);
        
        htmlEntete += "<th>" + nomsDesJours[i] + " " + formaterDateAffichage(jourCalcule) + "</th>";
    }
    
    enteteTableau.innerHTML = htmlEntete;
    titreSemaine.innerHTML = "Semaine du " + formaterDateAffichage(dateLundiCourant);

    corpsTableau.innerHTML = "";
    
    let heuresListe = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"];

    for (let h = 0; h < heuresListe.length; h++) {
        let heureActuelle = heuresListe[h];
        let ligne = document.createElement("tr");
        ligne.innerHTML = "<td>" + heureActuelle + ":00</td>";
        
        for (let j = 0; j < 5; j++) {
            ligne.innerHTML += "<td id='rdv-col-" + j + "-" + heureActuelle + "'></td>";
        }
        
        corpsTableau.appendChild(ligne);
    }

    let listeDesRendezVous = JSON.parse(localStorage.getItem("mesRdvEfrei"));
    
    if (listeDesRendezVous === null) {
        listeDesRendezVous = [];
    }

    for (let k = 0; k < listeDesRendezVous.length; k++) {
        let phraseRDV = listeDesRendezVous[k];
        let dateDuRDV = phraseRDV.substring(0, 10);
        let heureDuRDV = phraseRDV.substring(13, 15);
        
        let positionJour = datesDeLaSemaine.indexOf(dateDuRDV);
        
        if (positionJour !== -1) {
            let idCase = "rdv-col-" + positionJour + "-" + heureDuRDV;
            let caseTableau = document.getElementById(idCase);
            
            if (caseTableau !== null) {
                caseTableau.innerHTML = "<div class='carte-occupe'>Occupé</div>";
            }
        }
    }
}

function validerRDV() {
    let nom = document.getElementById("nom").value;
    let prenom = document.getElementById("prenom").value;
    let dateSaisie = document.getElementById("date-rdv").value;
    let heureSaisie = document.getElementById("heure-rdv").value;

    if (nom === "") {
        alert("Veuillez remplir votre nom.");
        return;
    }
    
    if (prenom === "") {
        alert("Veuillez remplir votre prénom.");
        return;
    }
    
    if (dateSaisie === "") {
        alert("Veuillez choisir une date.");
        return;
    }
    
    if (heureSaisie === "") {
        alert("Veuillez choisir une heure.");
        return;
    }

    let historiqueRDV = JSON.parse(localStorage.getItem("mesRdvEfrei"));
    
    if (historiqueRDV === null) {
        historiqueRDV = [];
    }
    
    let texteRDV = dateSaisie + " à " + heureSaisie;

    if (historiqueRDV.includes(texteRDV)) {
        alert("Ce créneau est déjà pris.");
        return;
    }

    historiqueRDV.push(texteRDV);
    localStorage.setItem("mesRdvEfrei", JSON.stringify(historiqueRDV));
    
    alert("Rendez-vous enregistré !");
    afficherCalendrierRDV();
}

window.addEventListener("load", afficherCalendrierRDV);
// ===== QUIZ INTERACTIF =====

let currentQuestion = 0;

let scores = {
    dev: 0,
    data: 0,
    cyber: 0,
    reseau: 0,
    embarque: 0
};

function answer(points) {

    // Ajouter les points
    for (let key in points) {
        scores[key] += points[key];
    }

    const questions = document.querySelectorAll(".question");

    // cacher question actuelle
    questions[currentQuestion].classList.remove("active");

    currentQuestion++;

    // afficher suivante OU résultat
    if (currentQuestion < questions.length) {
        questions[currentQuestion].classList.add("active");
    } else {
        showResult();
    }
}

function showResult() {

    document.getElementById("result").style.display = "block";

    let max = Math.max(...Object.values(scores));
    let results = [];

    for (let key in scores) {
        if (scores[key] === max) {
            results.push(key);
        }
    }

    const correspondance = {
        dev: "Software Engineering",
        data: "Data Science",
        cyber: "Cybersécurité",
        reseau: "Réseaux & Cloud",
        embarque: "Systèmes embarqués"
    };

    document.getElementById("result").innerHTML = `
        <h3>🎯 Résultat du quiz</h3>
        <p>Voici ce qui te correspond le mieux :</p>
        <ul>
            ${results.map(r => `<li><strong>${correspondance[r]}</strong></li>`).join("")}
        </ul>

        <button class="btn-restart" onclick="restartQuiz()">Recommencer</button>
    `;
}

function restartQuiz() {

    currentQuestion = 0;

    // reset scores
    for (let key in scores) {
        scores[key] = 0;
    }

    const questions = document.querySelectorAll(".question");

    // cacher toutes
    questions.forEach(q => q.classList.remove("active"));

    // afficher la première
    questions[0].classList.add("active");

    // cacher résultat
    document.getElementById("result").style.display = "none";
}