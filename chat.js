document.addEventListener("DOMContentLoaded", () => {

    const GEMINI_API_KEY = "AIzaSyDIJyYtqwajZAcxywUQWZGrIFEK3PLFsW4";

    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");

    // Add user / AI messages
    function addMessage(text, sender) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTyping() {
        let div = document.createElement("div");
        div.id = "typing";
        div.classList.add("ai-message");
        div.textContent = "Typing...";
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const div = document.getElementById("typing");
        if (div) div.remove();
    }



    // -----------------------------------------
    // 🎤 VOICE INPUT (UNCHANGED — WORKS PERFECT)
    // -----------------------------------------

    const voiceBtn = document.getElementById("voiceBtn");

    let SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.continuous = false;

        voiceBtn.addEventListener("click", () => {
            console.log("Mic clicked → listening...");
            userInput.placeholder = "Listening...";
            recognition.start();
        });

        recognition.onresult = (event) => {
            let text = event.results[0][0].transcript;
            console.log("Heard:", text);

            userInput.value = text;

            // Auto-send
            chatForm.dispatchEvent(new Event("submit"));
        };

        recognition.onerror = (event) => {
            console.log("Mic error:", event.error);
            userInput.placeholder = "Mic error, try again";
        };

        recognition.onend = () => {
            userInput.placeholder = "Type your message...";
        };

    } else {
        console.log("❌ Browser does not support Speech Recognition");
        voiceBtn.addEventListener("click", () => {
            alert("Your browser does not support voice input.");
        });
    }



    // ---------------------------------------------------
    // 🔥 GEMINI AI — DIRECT INTEGRATION (NO BACKEND)
    // ---------------------------------------------------


    // -----------------------------
    // SEND MESSAGE → GEMINI
    // -----------------------------
    chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    addTyping();

    try {
        const response = await fetch("http://127.0.0.1:5000/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: text })
        });

        const data = await response.json();
        removeTyping();

        addMessage(data.answer, "ai");

    } catch (error) {
        removeTyping();
        addMessage("⚠️ Error connecting to backend", "ai");
    }
});


});
