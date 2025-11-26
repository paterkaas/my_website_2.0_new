document.addEventListener('DOMContentLoaded', () => {
    
    // Chat Widget Logic
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');
    const startChatBtn = document.getElementById('start-chat-btn');

    function toggleChat() {
        if (chatWidget.style.display === 'flex') {
            chatWidget.style.display = 'none';
        } else {
            chatWidget.style.display = 'flex';
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    if(startChatBtn) startChatBtn.addEventListener('click', toggleChat);

    // Simple Mock AI Response
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const text = userInput.value;
        if (text.trim() === '') return;

        // Add User Message
        addMessage(text, 'user');
        userInput.value = '';

        // Simulate AI Thinking (Delay)
        setTimeout(() => {
            const responses = [
                "That's a great question! Based on 500+ reviews, guests love the atmosphere there.",
                "I've checked the data: Terspegelt is indeed very busy in summer, but the lake is quiet.",
                "Good point. Most UK visitors recommend booking the ferry well in advance.",
                "Camping de Paal is fantastic for kids under 10, but might be less fun for teenagers."
            ];
            // Random response for demo purposes
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
            
            // Auto scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});