class HistoriqueChat {
    constructor() {
        this.messages = [];
    }

    ajouterMessage(objetMessage) {
        this.messages.push(objetMessage);
    }

    recupererHistorique() {
        return this.messages;
    }
}

const historiqueChat = new HistoriqueChat();

function afficherMessage(texte, typeAuteur) {
    const boiteChat = document.getElementById("chat-body");
    const bulleMessage = document.createElement("div");

    bulleMessage.classList.add("chat-message");

    if (typeAuteur === "user") {
        bulleMessage.classList.add("message-user");
        bulleMessage.innerHTML = "<strong>Vous:</strong> " + texte;
    } else {
        bulleMessage.classList.add("message-bot");
        bulleMessage.innerHTML = "<strong>Bot:</strong> " + texte;
    }

    boiteChat.appendChild(bulleMessage);
    boiteChat.scrollTop = boiteChat.scrollHeight;
}

function traiterMessage(intentions, messageUtilisateur) {
    let messagePropre = messageUtilisateur.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let dateAujourdhui = new Date().toISOString().split('T')[0];

    if (messagePropre.includes("permanence") || messagePropre.includes("cours") || messagePropre.includes("soutien")) {
        
        let toutesLesPermanences = JSON.parse(localStorage.getItem("listePermanences"));
        
        if (toutesLesPermanences === null || toutesLesPermanences.length === 0) {
            return "Aucune permanence n'est prévue. Regarde sur la <a href='permanences.html'>Page Permanences</a>.";
        }
        
        let permanencesFutures = toutesLesPermanences.filter(permanence => permanence.date >= dateAujourdhui);

        let permanencesFiltrees = permanencesFutures;
        let matiereTrouvee = false;
        
        if (messagePropre.includes("web") || messagePropre.includes("html") || messagePropre.includes("css") || messagePropre.includes("php")) {
            permanencesFiltrees = permanencesFutures.filter(permanence => permanence.matiere.toLowerCase().includes("web"));
            matiereTrouvee = true;
        } else if (messagePropre.includes("base") || messagePropre.includes("donnee") || messagePropre.includes("bdd") || messagePropre.includes("sql")) {
            permanencesFiltrees = permanencesFutures.filter(permanence => permanence.matiere.toLowerCase().includes("base") || permanence.matiere.toLowerCase().includes("donnee") || permanence.matiere.toLowerCase().includes("bdd"));
            matiereTrouvee = true;
        } else if (messagePropre.includes("java")) {
            permanencesFiltrees = permanencesFutures.filter(permanence => permanence.matiere.toLowerCase().includes("java"));
            matiereTrouvee = true;
        }

        if (permanencesFiltrees.length === 0) {
            if (matiereTrouvee) {
                 return "Aucun cours de ce type n'est prévu prochainement. Tu peux vérifier le planning sur la <a href='permanences.html'>Page Permanences</a>.";
            } else {
                 return "Aucune permanence n'est prévue prochainement. Tu peux vérifier le planning sur la <a href='permanences.html'>Page Permanences</a>.";
            }
        }
        
        let reponseFinale = "Voici les permanences prévues : <br><br>";
        
        permanencesFiltrees.forEach(permanence => {
            reponseFinale += "- <strong>" + permanence.matiere + "</strong> avec " + permanence.prof + " le " + permanence.date + " à " + permanence.heure + "<br>";
        });

        reponseFinale += "<br><a href='permanences.html'>Voir le calendrier complet</a>";
        
        return reponseFinale;
    }

    if (messagePropre.includes("rdv") || messagePropre.includes("rendez-vous") || messagePropre.includes("libre") || messagePropre.includes("coordinateur") || messagePropre.includes("occupe")) {
        
        let tousLesRDV = JSON.parse(localStorage.getItem("mesRdvEfrei"));
        
        if (tousLesRDV === null || tousLesRDV.length === 0) {
            return "Le coordinateur n'a pas de rdv prévu. Tu peux vérifier ses disponibilités complètes sur la <a href='rdv.html'>Page de RDV</a>.";
        }

        let rdvFuturs = tousLesRDV.filter(rdvPhrase => rdvPhrase.substring(0, 10) >= dateAujourdhui);

        if (rdvFuturs.length === 0) {
            return "Le coordinateur n'a pas de rdv prévu. Tu peux vérifier ses disponibilités complètes sur la <a href='rdv.html'>Page de RDV</a>.";
        }
        
        let reponseRDV = "Le coordinateur n'est pas disponible pendant ces créneaux : <br><br>";
        
        rdvFuturs.forEach(rdvPhrase => {
            reponseRDV += "- " + rdvPhrase + "<br>"; 
        });

        reponseRDV += "<br>Aller consulter les créneaux libres sur la <a href='rdv.html'>Page de RDV</a>.";
        
        return reponseRDV;
    }

    let reponseParDefaut = "Désolé, je n'ai pas compris. Tu peux reformuler ?";
    
    intentions.forEach(intention => {
        intention.patterns.forEach(motCle => {
            let motClePropre = motCle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (messagePropre.includes(motClePropre)) {
                let indexAleatoire = Math.floor(Math.random() * intention.responses.length);
                reponseParDefaut = intention.responses[indexAleatoire];
            }
        });
    });

    return reponseParDefaut;
}

function envoyerMessage(intentions) {
    const champSaisie = document.getElementById("chat-input");
    const texteUtilisateur = champSaisie.value.trim();

    if (texteUtilisateur === "") {
        return; 
    }

    afficherMessage(texteUtilisateur, "user");
    historiqueChat.ajouterMessage({ text: texteUtilisateur, sender: "user" });

    const texteBot = traiterMessage(intentions, texteUtilisateur);
    
    afficherMessage(texteBot, "bot");
    historiqueChat.ajouterMessage({ text: texteBot, sender: "bot" });
    
    champSaisie.value = "";
}

function fetchJSON(urlFichier) {
    const champSaisie = document.getElementById("chat-input");
    
    if (champSaisie.value.trim() === "") {
        return;
    }

    fetch(urlFichier)
        .then(reponseBrute => reponseBrute.json())
        .then(donneesJSON => envoyerMessage(donneesJSON.intents))
        .catch(erreur => afficherMessage("Désolé, le fichier JSON est introuvable.", "bot"));
}

window.addEventListener("load", function() {
    const memoireNavigateur = sessionStorage.getItem("sauvegardeChat");
    
    if (memoireNavigateur) {
        const anciensMessages = JSON.parse(memoireNavigateur);
        
        anciensMessages.forEach(message => {
            afficherMessage(message.text, message.sender);
            historiqueChat.ajouterMessage(message);
        });
    }
});

window.addEventListener("beforeunload", function() {
    sessionStorage.setItem("sauvegardeChat", JSON.stringify(historiqueChat.recupererHistorique()));
});

document.addEventListener("DOMContentLoaded", function() {
    const champSaisie = document.getElementById("chat-input");
    
    if (champSaisie) {
        champSaisie.addEventListener("keypress", function(evenementTouche) {
            if (evenementTouche.key === "Enter") {
                document.getElementById("btn-envoyer-chat").click();
            }
        });
    }
});

function toggleChat() {
    let fenetreChat = document.getElementById("chatbox");
    
    if (fenetreChat.style.display === "flex") {
        fenetreChat.style.display = "none";
    } else {
        fenetreChat.style.display = "flex";
    }
}