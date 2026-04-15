window.onload = function() {
    afficherCalendrier();
};

function validerRDV() {
    var nom = document.getElementById("nom").value;
    var prenom = document.getElementById("prenom").value;
    var promo = document.getElementById("promo").value;
    var dateRdv = document.getElementById("date-rdv").value;
    var heureRdv = document.getElementById("heure-rdv").value;

    if (nom === "" || prenom === "" || promo === "" || dateRdv === "" || heureRdv === "") {
        alert("Veuillez remplir tous les champs obligatoires !");
        return;
    }

    var rdvEnregistres = JSON.parse(localStorage.getItem("mesRdvEfrei")) || [];
    var creneau = dateRdv + " à " + heureRdv;

    if (rdvEnregistres.includes(creneau)) {
        alert("Désolé, le coordinateur est déjà pris à ce créneau. Veuillez choisir une autre heure ou un autre jour.");
        return;
    }

    var res = confirm("Voulez-vous confirmer votre rendez-vous le " + creneau + " ?");
    
    if (res == true) {
        rdvEnregistres.push(creneau);
        localStorage.setItem("mesRdvEfrei", JSON.stringify(rdvEnregistres));
        
        alert("Votre rendez-vous a bien été enregistré !");
        afficherCalendrier();
    }
}

function afficherCalendrier() {
    var affichage = document.getElementById("affichage-calendrier");
    var rdvEnregistres = JSON.parse(localStorage.getItem("mesRdvEfrei")) || [];

    if (rdvEnregistres.length === 0) {
        affichage.innerHTML = "<p>Tous les créneaux sont libres !</p>";
    } else {
        var html = "<p style='color: red; font-weight: bold;'>Créneaux indisponibles :</p><ul>";
        
        for (var i = 0; i < rdvEnregistres.length; i++) {
            html += "<li>" + rdvEnregistres[i] + " - <strong>Occupé</strong></li>";
        }
        
        html += "</ul>";
        affichage.innerHTML = html;
    }
}