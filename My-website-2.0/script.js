document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECT ELEMENTS
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const startChatBtn = document.getElementById('start-chat-btn'); // Big hero button
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');

    // --- KNOWLEDGE BASE (Your Data in English) ---
    // Feel free to add more keywords here!
    const knowledgeBase = {
        "hello": "Hi! Nice to have you here. How can I help you with your trip to Brabant?",
        "terspegelt": "Recreation Park TerSpegelt is a 5-star park with an amazing Star Beach! Perfect for teenagers and kids.",
        "efteling": "The Efteling is magical! The Efteling Hotel is located right next to the entrance. Do you want booking info?",
        "price": "Prices vary by season, but expect around €100 - €150 per night for a hotel in this region.",
        "food": "Brabant is famous for 'worstenbroodjes' (sausage rolls) and 'Bossche Bollen'. Have you tried them yet?",
        "bike": "Brabant has an excellent cycling network. You can rent bikes at almost any park.",
        "default": "I'm not sure about that yet. Try asking about 'Terspegelt', 'Efteling', 'Food' or 'Price'."
    };

    // 2. FUNCTION: Open/Close Chat
    function toggleChat() {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            userInput.focus();
        }
    }

    // Event Listeners for toggle
    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    if(startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            if (!chatWidget.classList.contains('active')) {
                toggleChat();
            }
        });
    }

    // 3. FUNCTION: Add Message to Chat
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 4. FUNCTION: Handle User Input
    function handleUserMessage() {
        const text = userInput.value.trim().toLowerCase();
        if (text === "") return;

        // Show user message
        addMessage(userInput.value, 'user');
        userInput.value = '';

        // Generate bot response
        setTimeout(() => {
            let answer = knowledgeBase["default"];

            // Check if user text contains a keyword
            for (let key in knowledgeBase) {
                if (text.includes(key)) {
                    answer = knowledgeBase[key];
                    break;
                }
            }
            addMessage(answer, 'bot');
        }, 600);
    }

    // Send on Click or Enter
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
});