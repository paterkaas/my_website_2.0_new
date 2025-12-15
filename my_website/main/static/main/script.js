/* ==========================================================================
   0. GOOGLE ANALYTICS (Automatic Injection)
   ========================================================================== */
(function() {
    const gaMeasurementId = 'G-ECRD9C1T9X'; // Your ID

    // 1. Load the Google Script file
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);

    // 2. Start measurement
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaMeasurementId);
})();

document.addEventListener('DOMContentLoaded', () => {
 
    /* ==========================================================================
       1. SITE BUILDER (Injects Header, Footer & Chatbot)
       ========================================================================== */
    
    // --- A. Define the HTML ---
    
    const navbarHTML = `
    <nav class="navbar">
        <div class="container">
            <a href="/" class="logo">TravelComp<span>AI</span>nion</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/#destinations">Destinations</a></li>
                <li><a href="{% url 'contact' %}">Contact</a></li>
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
                <a href="/privacy/">Privacy Policy</a>
                <a href="/contact/">Contact</a>
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

    // --- B. Inject the HTML into the page ---
    
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder) navPlaceholder.innerHTML = navbarHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
    
    // Prevent double injection if the script loads twice accidentally
    if (!document.getElementById('chat-widget')) {
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }


    /* ==========================================================================
       2. INTERACTIONS & NAVIGATION
       ========================================================================== */

    // --- Mobile Menu (Hamburger) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Scroll Reveal (Animations) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));


    /* ==========================================================================
       3. CHATBOT LOGIC (WITH ERROR CHECK)
       ========================================================================== */

    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const startChatBtn = document.getElementById('start-chat-btn');
    const detailChatBtn = document.getElementById('detail-chat-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    function toggleChat() {
        if (!chatWidget) return;
        chatWidget.classList.toggle('active');
        if (chatWidget.classList.contains('active') && userInput) {
            userInput.focus();
        }
    }

    if(chatToggle) chatToggle.addEventListener('click', toggleChat);
    if(closeChat) closeChat.addEventListener('click', toggleChat);
    
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

    function addMessage(text, sender, id = null) {
        if (!chatBody) return;
        
        const div = document.createElement('div');
        div.classList.add('message', sender);
        if(id) div.id = id;
        
        // Convert links to buttons
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const htmlContent = text.replace(urlRegex, function(url) {
            return `<br><a href="${url}" target="_blank" class="chat-button">Claim Your Deal ↗</a><br>`;
        });
        
        div.innerHTML = htmlContent;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function handleUserMessage() {
        if (!userInput) return;
        const text = userInput.value.trim();
        if (text === "") return;

        // 1. Show user message
        addMessage(text, 'user');
        userInput.value = '';

        // 2. Show 'Thinking...' status
        const loadingId = 'loading-' + Date.now();
        addMessage("Thinking...", 'bot', loadingId);

        try {
            // Send to Django backend (/api/chat)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            // 3. Read the response
            const data = await response.json();
            
            // Remove 'Thinking...'
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            // 4. CHECK FOR ANSWER OR ERROR
            if (data.reply) {
                // Success: Show AI response
                addMessage(data.reply, 'bot');
            } else if (data.error) {
                // Error in Backend: Show actual error
                console.error("Backend Error:", data.error);
                addMessage("⚠️ System Error: " + data.error, 'bot');
            } else {
                // No data: Vague error
                addMessage("I'm having trouble connecting (No valid data received).", 'bot');
            }

        } catch (error) {
            console.error('Network/Script error:', error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            addMessage("⚠️ Network Error. Check console for details.", 'bot');
        }
    }

    if(sendBtn) sendBtn.addEventListener('click', handleUserMessage);
    if(userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });


    /* ==========================================================================
       4. COOKIE BANNER LOGIC
       ========================================================================== */
    
    // Check if the user has already accepted
    if (!localStorage.getItem('cookieConsent')) {
        
        const cookieHTML = `
        <div class="cookie-banner" id="cookie-banner">
            <div class="cookie-content">
                <h4>🍪 Cookies & Privacy</h4>
                <p>We use cookies and affiliate links to keep this website free. By continuing, you agree to our policies.</p>
            </div>
            <button class="cookie-btn" id="accept-cookies">Okay, continue!</button>
        </div>
        `;

        // Add to the page
        document.body.insertAdjacentHTML('beforeend', cookieHTML);

        // Make the button work
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true'); // Remember choice
            document.getElementById('cookie-banner').remove(); // Remove banner
        });
    }

});