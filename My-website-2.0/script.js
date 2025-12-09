document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECT ELEMENTS
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const startChatBtn = document.getElementById('start-chat-btn'); 
    const detailChatBtn = document.getElementById('detail-chat-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');

    // NIEUW: Navigatie Elementen
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // 2. FUNCTION: Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // Klapt menu uit
            hamburger.classList.toggle('active'); // Voor animatie kruisje
        });
    }

    // Sluit menu als je op een link klikt
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // 3. FUNCTION: Open/Close Chat
    function toggleChat() {
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active')) {
            userInput.focus();
        }
    }

    if(chatToggle) chatToggle.addEventListener('click', toggleChat);
    if(closeChat) closeChat.addEventListener('click', toggleChat);

    if(startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            if (!chatWidget.classList.contains('active')) toggleChat();
        });
    }

    if(detailChatBtn) {
        detailChatBtn.addEventListener('click', () => {
            if (!chatWidget.classList.contains('active')) toggleChat();
        });
    }

    // 4. FUNCTION: Add Message to Chat
    function addMessage(text, sender, id = null) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        if(id) div.id = id; 
        
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const htmlContent = text.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank" style="color: inherit; text-decoration: underline;">${url}</a>`;
        });
        
        div.innerHTML = htmlContent;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 5. FUNCTION: Handle User Input
    async function handleUserMessage() {
        const text = userInput.value.trim();
        if (text === "") return;

        addMessage(text, 'user');
        userInput.value = '';

        const loadingId = 'loading-' + Date.now();
        addMessage("Thinking...", 'bot', loadingId);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            if (data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("I'm having trouble connecting right now.", 'bot');
            }

        } catch (error) {
            console.error('Chat error:', error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            addMessage("Oops, something went wrong.", 'bot');
        }
    }

    if(sendBtn) sendBtn.addEventListener('click', handleUserMessage);
    if(userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
});