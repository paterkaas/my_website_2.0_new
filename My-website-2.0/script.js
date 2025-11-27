document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECT ELEMENTS
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const startChatBtn = document.getElementById('start-chat-btn'); // Big hero button
    const detailChatBtn = document.getElementById('detail-chat-btn'); // Button on detail pages
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');

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

    if(detailChatBtn) {
        detailChatBtn.addEventListener('click', () => {
            if (!chatWidget.classList.contains('active')) {
                toggleChat();
            }
        });
    }

    // 3. FUNCTION: Add Message to Chat
    function addMessage(text, sender, id = null) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        if(id) div.id = id; // Add ID for loading message
        
        // Convert URLs to clickable links
        // This simple regex finds URLs starting with http/https
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const htmlContent = text.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank" style="color: white; text-decoration: underline;">${url}</a>`;
        });
        
        div.innerHTML = htmlContent; // Use innerHTML to render links
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 4. FUNCTION: Handle User Input (CONNECTED TO BACKEND)
    async function handleUserMessage() {
        const text = userInput.value.trim();
        if (text === "") return;

        // Show user message
        addMessage(text, 'user');
        userInput.value = '';

        // Show "Thinking..." state
        const loadingId = 'loading-' + Date.now();
        addMessage("Thinking...", 'bot', loadingId);

        try {
            // SEND TO VERCEL BACKEND
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Remove "Thinking..." message
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            if (data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("I'm having trouble connecting to my brain right now. Please try again later.", 'bot');
            }

        } catch (error) {
            console.error('Chat error:', error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            addMessage("Oops, something went wrong. Please check your connection.", 'bot');
        }
    }

    // Send on Click or Enter
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
});