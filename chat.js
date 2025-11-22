document.addEventListener("DOMContentLoaded", () => {

    const BACKEND_URL = "https://edunex-backend-2.onrender.com/gemini";

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

    // -----------------------------
    // SEND MESSAGE → BACKEND
    // -----------------------------
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        userInput.value = "";
        addTyping();

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: text })
            });

            const data = await response.json();
            removeTyping();

            // Backend returns { answer: "text" }
            if (data.answer) {
                addMessage(data.answer, "ai");
            } else {
                addMessage("❌ Gemini did not return a valid message.", "ai");
            }

        } catch (error) {
            removeTyping();
            addMessage("⚠️ Error connecting to backend", "ai");
        }
    });

});
