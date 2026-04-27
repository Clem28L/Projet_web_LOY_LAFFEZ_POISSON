class ChatHistory {
    constructor() {
        this.messages = [];
    }
    addMessage(messageObj) {
        this.messages.push(messageObj);
    }
    getHistory() {
        return this.messages;
    }
}

let historyMessages = new ChatHistory();

function fetchJSON(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error('Empty JSON or malformed JSON');
            }
            console.log(data);
            sendMessage(data.intents);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function processMessage(intents, message) {
    let response = "Je suis désolé, je ne suis pas sûr de comprendre.";
    
    intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        });
    });
    
    return response;
}

function showMessage(message, type) {
    let chatBody = document.getElementById("chat-body");
    let msgDiv = document.createElement("div");
    
    msgDiv.classList.add("chat-message");
    
    if (type === 'user') {
        msgDiv.classList.add("message-user");
    } else {
        msgDiv.classList.add("message-bot");
    }
    
    msgDiv.innerHTML = message;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage(intents) {
    let input = document.getElementById("chat-input");
    let message = input.value;
    
    if (message !== "") {
        showMessage(message, 'user');
        
        let objetMessageUser = { sender: 'user', message: message };
        historyMessages.addMessage(objetMessageUser);

        let botResponse = processMessage(intents, message);
        
        showMessage(botResponse, 'bot');
        
        let objetMessageBot = { sender: 'bot', message: botResponse };
        historyMessages.addMessage(objetMessageBot);

        input.value = "";
    }
}

function saveMessages() {
    sessionStorage.setItem('chatHistory', JSON.stringify(historyMessages.getHistory()));
}

function loadMessages() {
    let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
    
    if (chatHistory) {
        chatHistory.forEach(message => {
            showMessage(message.message, message.sender);
            historyMessages.addMessage(message);
        });
    }
}

window.addEventListener("DOMContentLoaded", function() {
    loadMessages();
    let chatInput = document.getElementById("chat-input");
    
    if (chatInput) {
        chatInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                let boutonEnvoyer = document.getElementById("btn-envoyer-chat");
                if (boutonEnvoyer) {
                    boutonEnvoyer.click();
                }
            }
        });
    }
});

window.addEventListener("beforeunload", function() {
    saveMessages();
});

function toggleChat() {
    let chatbox = document.getElementById("chatbox");
    
    if (chatbox.style.display === "flex") {
        chatbox.style.display = "none";
    } else {
        chatbox.style.display = "flex";
    }
}