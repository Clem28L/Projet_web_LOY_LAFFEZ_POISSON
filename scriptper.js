function verifierLogin() {
    var user = document.getElementById("username").value.trim().toLowerCase();
    var mdp = document.getElementById("password").value.trim();

    if (user === "admin" && mdp === "admin") {
        // Au lieu de changer le style, on redirige directement vers la page admin !
        window.location.href = "admin.html";
    } else {
        alert("Identifiant ou mot de passe incorrect !");
    }
}

function ajouterPermanence() {
    var matiere = document.getElementById("matiere").value;
    var prof = document.getElementById("prof").value;
    var promo = document.getElementById("promo-perm").value;
    var salle = document.getElementById("salle").value;
    var datePerm = document.getElementById("date-perm").value;
    var heure = document.getElementById("heure-perm").value;
    var duree = document.getElementById("duree-perm").value;

    if (!matiere || !prof || !promo || !salle || !datePerm) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    var liste = JSON.parse(localStorage.getItem("listePermanences")) || [];
    
    liste.push({
        matiere: matiere,
        prof: prof,
        promo: promo,
        salle: salle,
        date: datePerm,
        heure: heure,
        duree: parseInt(duree)
    });

    localStorage.setItem("listePermanences", JSON.stringify(liste));
    alert("Permanence ajoutée avec succès !");

    document.getElementById("matiere").value = "";
    document.getElementById("prof").value = "";
    document.getElementById("promo-perm").value = "";
    document.getElementById("salle").value = "";
    document.getElementById("date-perm").value = "";
}

var dateLundi = new Date();
var jourSemaine = dateLundi.getDay();
var decalage = jourSemaine === 0 ? -6 : 1 - jourSemaine;
dateLundi.setDate(dateLundi.getDate() + decalage);

function changerSemaine(jours) {
    dateLundi.setDate(dateLundi.getDate() + jours);
    afficherPermanences();
}

function formaterDateFR(date) {
    var j = date.getDate().toString().padStart(2, '0');
    var m = (date.getMonth() + 1).toString().padStart(2, '0');
    return j + "/" + m;
}

function formaterDateISO(date) {
    var a = date.getFullYear();
    var m = (date.getMonth() + 1).toString().padStart(2, '0');
    var j = date.getDate().toString().padStart(2, '0');
    return a + "-" + m + "-" + j;
}

function afficherPermanences() {
    var corps = document.getElementById("corps-calendrier");
    var entete = document.getElementById("entete-jours");
    var titreSemaine = document.getElementById("titre-semaine");
    if (!corps || !entete) return;

    var joursNom = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    var datesSemaineISO = [];
    
    var htmlEntete = "<th>Heure</th>";
    for(var i = 0; i < 5; i++) {
        var d = new Date(dateLundi);
        d.setDate(d.getDate() + i);
        datesSemaineISO.push(formaterDateISO(d));
        htmlEntete += "<th>" + joursNom[i] + " " + formaterDateFR(d) + "</th>";
    }
    entete.innerHTML = htmlEntete;
    titreSemaine.innerHTML = "Semaine du " + formaterDateFR(dateLundi);

    corps.innerHTML = "";
    var heures = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

    heures.forEach(function(h) {
        var ligne = document.createElement("tr");
        ligne.innerHTML = "<td>" + h + ":00</td>";
        for(var i = 0; i < 5; i++) {
            ligne.innerHTML += "<td id='col-" + i + "-" + h + "'></td>";
        }
        corps.appendChild(ligne);
    });

    var liste = JSON.parse(localStorage.getItem("listePermanences")) || [];
    var fMatiere = document.getElementById("filtre-matiere").value.toLowerCase();
    var fPromo = document.getElementById("filtre-promo").value.toLowerCase();

    liste.forEach(function(p) {
        if (p.matiere.toLowerCase().includes(fMatiere) && p.promo.toLowerCase().includes(fPromo)) {
            
            var indexJour = datesSemaineISO.indexOf(p.date);
            
            if (indexJour !== -1) {
                var heureDepart = parseInt(p.heure.split(':')[0]);
                var heureStr = heureDepart < 10 ? "0" + heureDepart : heureDepart.toString();
                
                // 1. On trouve la case de départ (ex: Lundi à 10h)
                var idCelluleDepart = "col-" + indexJour + "-" + heureStr;
                var celluleDepart = document.getElementById(idCelluleDepart);
                
                if (celluleDepart) {
                    // 2. MAGIE : On dit à la case de s'étaler sur plusieurs lignes (rowSpan)
                    celluleDepart.rowSpan = p.duree;
                    
                    // 3. On crée le bloc visuel UNE SEULE FOIS
                    celluleDepart.innerHTML = "<div class='carte-perm'>" + 
                        "<strong>" + p.matiere + "</strong><br>" +
                        "Prof: " + p.prof + "<br>" +
                        "<em>" + p.promo + " (" + p.salle + ")</em>" +
                        "</div>";

                    // 4. On cache les cases en dessous qui ont été "absorbées" pour ne pas casser le tableau
                    for(var i = 1; i < p.duree; i++) {
                        var heureCourante = heureDepart + i;
                        var heureSuivanteStr = heureCourante < 10 ? "0" + heureCourante : heureCourante.toString();
                        
                        var idCelluleSuivante = "col-" + indexJour + "-" + heureSuivanteStr;
                        var celluleSuivante = document.getElementById(idCelluleSuivante);
                        
                        if (celluleSuivante) {
                            celluleSuivante.style.display = "none";
                        }
                    }
                }
            }
        }
    });
}

window.onload = function() {
    if (document.getElementById("corps-calendrier")) {
        afficherPermanences();
    }
};