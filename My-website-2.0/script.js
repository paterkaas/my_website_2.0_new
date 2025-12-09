document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SITE BUILDER (Injecteert Header, Footer & Chatbot)
       ========================================================================== */
    
    // --- A. Defineer de HTML ---

    const navbarHTML = `
    <nav class="navbar">
        <div class="container">
            <a href="index.html" class="logo">TravelComp<span>AI</span>nion</a>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="index.html#destinations">Destinations</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>
    `;

    const footerHTML = `
    <footer>
        <div class="container footer-content">
            <div class="footer-brand">
                <h3>TravelCompAInion</h3>
                <p>Your local AI friend in Brabant.</p>
            </div>
            <div class="footer-links">
                <a href="privacy.html">Privacy Policy</a>
                <a href="contact.html">Contact</a>
            </div>
        </div>
    </footer>
    `;

    const chatHTML = `
    <div class="chat-widget" id="chat-widget">
        <div class="chat-header">
            <span>Brabant Insider AI</span>
            <button id="close-chat" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <div class="chat-body" id="chat-body">
            <div class="message bot">
                Hi! I'm your Travel Companion. Ask me anything about Brabant! 🧀
            </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Type your question..." id="user-input">
            <button id="send-btn">Send</button>
        </div>
    </div>
    <button class="chat-toggle" id="chat-toggle">💬</button>
    `;

    // --- B. Injecteer de HTML in de pagina ---
    
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder) navPlaceholder.innerHTML = navbarHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
    
    // Voeg chat altijd toe aan het einde van de body
    document.body.insertAdjacentHTML('beforeend', chatHTML);


    /* ==========================================================================
       2. INTERACTIES & NAVIGATIE
       ========================================================================== */

    // --- Mobiel Menu (Hamburger) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Sluit menu als je op een link klikt
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Scroll Reveal (Animaties) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 }); // Activeer als 10% in beeld is

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));


    /* ==========================================================================
       3. CHATBOT LOGICA
       ========================================================================== */

    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const startChatBtn = document.getElementById('start-chat-btn');
    const detailChatBtn = document.getElementById('detail-chat-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    // Functie: Open/Sluit Chat
    function toggleChat() {
        chatWidget.classList.toggle('active');
        // Focus op input als chat opent
        if (chatWidget.classList.contains('active') && userInput) {
            userInput.focus();
        }
    }

    // Event Listeners voor openen/sluiten
    if(chatToggle) chatToggle.addEventListener('click', toggleChat);
    if(closeChat) closeChat.addEventListener('click', toggleChat);
    
    // Knoppen op de pagina die de chat openen
    if(startChatBtn) {
        startChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!chatWidget.classList.contains('active')) toggleChat();
        });
    }
    if(detailChatBtn) {
        detailChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!chatWidget.classList.contains('active')) toggleChat();
        });
    }

    // Functie: Bericht toevoegen aan scherm
    function addMessage(text, sender, id = null) {
        if (!chatBody) return;
        
        const div = document.createElement('div');
        div.classList.add('message', sender);
        if(id) div.id = id;
        
    // --- NIEUWE CODE: MAAK ER EEN KNOP VAN ---
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const htmlContent = text.replace(urlRegex, function(url) {
            // We vervangen de lange link door een mooie knop
            return `<br><a href="${url}" target="_blank" class="chat-button">View offer ↗</a><br>`;
        });
        div.innerHTML = htmlContent;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll naar beneden
    }

    // Functie: Bericht versturen naar API
    async function handleUserMessage() {
        if (!userInput) return;
        const text = userInput.value.trim();
        if (text === "") return;

        // 1. Toon bericht van gebruiker
        addMessage(text, 'user');
        userInput.value = '';

        // 2. Toon "Thinking..." status
        const loadingId = 'loading-' + Date.now();
        addMessage("Thinking...", 'bot', loadingId);

        try {
            // 3. Stuur naar Vercel API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Verwijder "Thinking..."
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            // 4. Toon antwoord
            if (data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("I'm having trouble connecting right now. Please try again later.", 'bot');
            }

        } catch (error) {
            console.error('Chat error:', error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            addMessage("Oops, something went wrong. Please check your internet connection.", 'bot');
        }
    }

    // Verstuur bij Klik of Enter
    if(sendBtn) sendBtn.addEventListener('click', handleUserMessage);
    if(userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

});