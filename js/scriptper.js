function verifierLogin() {
    let utilisateur = document.getElementById("username").value.trim().toLowerCase();
    let motDePasse = document.getElementById("password").value.trim();

    if (utilisateur === "admin" && motDePasse === "admin") {
        window.location.href = "admin.html";
    } else {
        alert("Identifiant ou mot de passe incorrect !");
    }
}

function ajouterPermanence() {
    let matiere = document.getElementById("matiere").value;
    let prof = document.getElementById("prof").value;
    let promo = document.getElementById("promo-perm").value;
    let salle = document.getElementById("salle").value;
    let datePerm = document.getElementById("date-perm").value;
    let heure = document.getElementById("heure-perm").value;
    let duree = document.getElementById("duree-perm").value;

    if (matiere === "" || prof === "" || promo === "" || salle === "" || datePerm === "") {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    let listePermanences = JSON.parse(localStorage.getItem("listePermanences"));
    
    if (listePermanences === null) {
        listePermanences = [];
    }

    let nouvellePermanence = {
        matiere: matiere,
        prof: prof,
        promo: promo,
        salle: salle,
        date: datePerm,
        heure: heure,
        duree: parseInt(duree)
    };

    listePermanences.push(nouvellePermanence);
    localStorage.setItem("listePermanences", JSON.stringify(listePermanences));
    
    alert("Permanence ajoutée avec succès !");

    document.getElementById("matiere").value = "";
    document.getElementById("prof").value = "";
    document.getElementById("promo-perm").value = "";
    document.getElementById("salle").value = "";
    document.getElementById("date-perm").value = "";
}

let dateLundi = new Date();
let jourSemaine = dateLundi.getDay();
let decalage;

if (jourSemaine === 0) {
    decalage = -6;
} else {
    decalage = 1 - jourSemaine;
}

dateLundi.setDate(dateLundi.getDate() + decalage);

function changerSemaine(jours) {
    let jourActuel = dateLundi.getDate();
    dateLundi.setDate(jourActuel + jours);
    afficherPermanences();
}

function formaterDateFR(date) {
    let jour = date.getDate();
    let mois = date.getMonth() + 1;

    if (jour < 10) {
        jour = "0" + jour;
    }
    
    if (mois < 10) {
        mois = "0" + mois;
    }
    
    return jour + "/" + mois;
}

function formaterDateISO(date) {
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

function afficherPermanences() {
    let corpsTableau = document.getElementById("corps-calendrier");
    let enteteTableau = document.getElementById("entete-jours");
    let titreSemaine = document.getElementById("titre-semaine");
    
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
        let jourCalcule = new Date(dateLundi);
        let jourEnPlus = jourCalcule.getDate() + i;
        jourCalcule.setDate(jourEnPlus);
        
        let dateTexte = formaterDateISO(jourCalcule);
        datesDeLaSemaine.push(dateTexte);
        
        htmlEntete += "<th>" + nomsDesJours[i] + " " + formaterDateFR(jourCalcule) + "</th>";
    }
    
    enteteTableau.innerHTML = htmlEntete;
    titreSemaine.innerHTML = "Semaine du " + formaterDateFR(dateLundi);
    corpsTableau.innerHTML = "";
    
    let heuresListe = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

    for (let h = 0; h < heuresListe.length; h++) {
        let heureActuelle = heuresListe[h];
        let ligne = document.createElement("tr");
        ligne.innerHTML = "<td>" + heureActuelle + ":00</td>";
        
        for (let j = 0; j < 5; j++) {
            ligne.innerHTML += "<td id='col-" + j + "-" + heureActuelle + "'></td>";
        }
        corpsTableau.appendChild(ligne);
    }

    let listeDesPermanences = JSON.parse(localStorage.getItem("listePermanences"));
    if (listeDesPermanences === null) {
        listeDesPermanences = [];
    }

    let champFiltreMatiere = document.getElementById("filtre-matiere");
    let filtreMatiere = "";
    if (champFiltreMatiere !== null) {
        filtreMatiere = champFiltreMatiere.value.toLowerCase();
    }

    let champFiltrePromo = document.getElementById("filtre-promo");
    let filtrePromo = "";
    if (champFiltrePromo !== null) {
        filtrePromo = champFiltrePromo.value.toLowerCase();
    }

    for (let k = 0; k < listeDesPermanences.length; k++) {
        let permanenceActuelle = listeDesPermanences[k];
        let matiereMinuscule = permanenceActuelle.matiere.toLowerCase();
        let promoMinuscule = permanenceActuelle.promo.toLowerCase();

        if (matiereMinuscule.includes(filtreMatiere) && promoMinuscule.includes(filtrePromo)) {
            
            let positionJour = datesDeLaSemaine.indexOf(permanenceActuelle.date);
            
            if (positionJour !== -1) {
                let heureString = permanenceActuelle.heure.substring(0, 2);
                let heureNombre = parseInt(heureString);
                let idCaseDepart = "col-" + positionJour + "-" + heureString;
                let caseDepart = document.getElementById(idCaseDepart);
                
                if (caseDepart !== null) {
                    caseDepart.rowSpan = permanenceActuelle.duree;
                    
                    let contenuCarte = "<div class='carte-perm'>";
                    contenuCarte += "<strong>" + permanenceActuelle.matiere + "</strong><br>";
                    contenuCarte += "Prof: " + permanenceActuelle.prof + "<br>";
                    contenuCarte += "<em>" + permanenceActuelle.promo + " (" + permanenceActuelle.salle + ")</em>";
                    contenuCarte += "</div>";
                    
                    caseDepart.innerHTML = contenuCarte;

                    for (let increment = 1; increment < permanenceActuelle.duree; increment++) {
                        let heureACacher = heureNombre + increment;
                        let heureACacherTexte;

                        if (heureACacher < 10) {
                            heureACacherTexte = "0" + heureACacher;
                        } else {
                            heureACacherTexte = heureACacher.toString();
                        }
                        
                        let idCaseACacher = "col-" + positionJour + "-" + heureACacherTexte;
                        let caseACacher = document.getElementById(idCaseACacher);
                        
                        if (caseACacher !== null) {
                            caseACacher.style.display = "none";
                        }
                    }
                }
            }
        }
    }
}

window.onload = function() {
    let corpsTableau = document.getElementById("corps-calendrier");
    if (corpsTableau !== null) {
        afficherPermanences();
    }
};