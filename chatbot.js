// AI Chatbot functionality
function initChatbot() {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (!chatbotFab || !chatbotContainer) return;

    // Toggle chatbot visibility
    chatbotFab.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
        chatbotFab.style.display = 'none';
    });

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
        chatbotFab.style.display = 'flex';
    });

    // Send message functionality
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        try {
            // Generate AI response
            const response = await generateChatbotResponse(message);
            addMessage(response, 'bot');
        } catch (error) {
            addMessage('Sorry, I\'m having trouble responding right now. Please try again later.', 'bot');
        } finally {
            chatbotSend.disabled = false;
        }
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<div class="icon-user"></div>' : '<div class="icon-printer"></div>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function generateChatbotResponse(userMessage) {
        const systemPrompt = `You are a helpful customer service assistant for PrintHub Pro, a professional printing service company. You help customers with:

- Printing services (B/W, color, xerox)
- Binding services (hard, soft, spiral)
- Lamination services
- Printer sales and maintenance
- Stationery supplies
- Technical support for printers

Provide helpful, friendly, and professional responses. Keep answers concise but informative. If asked about pricing, mention that customers can use the pricing calculator or contact for detailed quotes.`;

        const userPrompt = `Customer question: ${userMessage}`;

        try {
            const response = await invokeAIAgent(systemPrompt, userPrompt);
            return response;
        } catch (error) {
            console.error('Chatbot AI error:', error);
            return 'I apologize, but I\'m having trouble processing your request right now. Please contact us directly at +1 (555) 123-4567 or email info@printhubpro.com for immediate assistance.';
        }
    }
}