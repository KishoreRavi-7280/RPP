// Ragu Printers  - AI Chatbot
// Professional chatbot for customer inquiries and support

(function() {
    'use strict';

    // Chatbot Configuration
    const chatbotConfig = {
        responses: {
            greetings: [
                "Hello! I'm the Ragu Printers Assistant. How can I help you with your printing needs today?",
                "Hi there! Welcome to Ragu Printers. What can I assist you with?",
                "Good day! I'm here to help with any questions about our printing services. How may I assist you?"
            ],
            
            services: {
                'printer sales': {
                    response: "We offer a wide range of printers including inkjet, laser, multifunction, and commercial-grade printers from leading brands like HP, Canon, Epson, and Brother. Would you like information about a specific type of printer?",
                    followUp: ["What's your budget range?", "What will you primarily use the printer for?", "Do you need color or black & white printing?"]
                },
                'printer repair': {
                    response: "Our certified technicians can repair all major printer brands. We offer free diagnostics and provide 90-day warranties on all repairs. Common issues we fix include paper jams, print quality problems, and connectivity issues.",
                    followUp: ["What brand is your printer?", "What specific issue are you experiencing?", "Would you like to schedule a diagnostic?"]
                },
                'printing services': {
                    response: "We provide professional printing services including color and black & white documents, business cards, brochures, flyers, posters, and large format printing. What type of printing do you need?",
                    followUp: ["How many copies do you need?", "What size documents?", "Do you need it today?"]
                },
                'xerox': {
                    response: "Our high-speed xerox services include single and double-sided copying, reduction and enlargement, collating, and sorting. We handle both small and large volume copying jobs.",
                    followUp: ["How many copies do you need?", "What size documents?", "Do you need collating or sorting?"]
                },
                'binding': {
                    response: "We offer multiple binding options including spiral binding, comb binding, perfect binding, saddle stitching, and wire-o binding. Perfect for reports, presentations, and professional documents.",
                    followUp: ["What type of documents are you binding?", "How many pages?", "What binding style do you prefer?"]
                },
                'lamination': {
                    response: "Our lamination services protect your documents with various thickness options (3mil, 5mil, 10mil) in both hot and cold lamination. We handle documents, ID cards, certificates, and more.",
                    followUp: ["What size documents need lamination?", "Do you prefer matte or glossy finish?", "How many items need laminating?"]
                }
            },
            
            pricing: {
                'printing cost': "Our printing costs start from $0.10 for black & white and $0.25 for color per page. We offer bulk discounts for orders over 100 copies. Would you like a detailed quote?",
                'repair cost': "Printer repair costs vary by issue. We offer free diagnostics, and basic repairs start from $25. Major repairs range from $50-300. All repairs include a 90-day warranty.",
                'binding cost': "Binding services start from $2.50 for comb binding up to $12 for perfect binding, depending on page count. Would you like a quote for your specific project?",
                'lamination cost': "Lamination starts from $0.50 for business cards up to $5 for A3 size documents. Pricing depends on size and thickness. What size do you need?"
            },
            
            location: {
                'address': "We're located at 123 Print Street, City, State 12345. We have free parking available and are easily accessible by public transportation.",
                'hours': "Our business hours are Monday-Friday 9:00 AM - 6:00 PM, Saturday 9:00 AM - 4:00 PM, and we're closed on Sundays. We also offer emergency repair services.",
                'contact': "You can reach us at 6383146661 or email us at rppprinterserode@gmail.com. We respond to emails within 24 hours."
            },
            
            emergency: "For urgent printer repairs outside business hours, you can call our emergency line at 6383146661. Additional charges may apply for emergency services.",
            
            fallback: [
                "I'd be happy to help you with that! For specific questions about our services, pricing, or to schedule an appointment, please call us at 6383146661 or visit our contact page.",
                "That's a great question! Our team would be better equipped to help you with detailed information. Please contact us at (234) 6383146661 or stop by our shop.",
                "I want to make sure I give you the most accurate information. Please call us at 6383146661 or email rppprinterserode@gmail.com for detailed assistance."
            ]
        },
        
        keywords: {
            greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            services: ['service', 'services', 'what do you do', 'what do you offer', 'help with'],
            printerSales: ['printer', 'printers', 'buy printer', 'purchase printer', 'printer for sale', 'new printer'],
            printerRepair: ['repair', 'fix', 'broken', 'not working', 'problem', 'issue', 'maintenance'],
            printing: ['print', 'printing', 'copy', 'copies', 'document', 'documents', 'business cards'],
            xerox: ['xerox', 'photocopy', 'photocopying', 'duplicate', 'copies'],
            binding: ['bind', 'binding', 'spiral', 'comb', 'perfect binding', 'report binding'],
            lamination: ['laminate', 'lamination', 'protect', 'waterproof', 'preserve'],
            pricing: ['cost', 'price', 'pricing', 'how much', 'expensive', 'cheap', 'quote'],
            location: ['where', 'location', 'address', 'directions', 'find you'],
            hours: ['hours', 'open', 'closed', 'time', 'when'],
            contact: ['contact', 'phone', 'email', 'call', 'reach'],
            emergency: ['emergency', 'urgent', 'asap', 'immediate', 'rush'],
            thanks: ['thank', 'thanks', 'appreciate', 'grateful']
        }
    };

    // DOM Elements
    const elements = {
        chatbotContainer: document.getElementById('chatbot-container'),
        chatbotToggle: document.getElementById('chatbot-toggle'),
        chatbotWidget: document.getElementById('chatbot-widget'),
        chatbotClose: document.getElementById('chatbot-close'),
        chatbotMessages: document.getElementById('chatbot-messages'),
        chatbotInput: document.getElementById('chatbot-input-field'),
        chatbotSend: document.getElementById('chatbot-send')
    };

    // Chatbot State
    let chatbotState = {
        isOpen: false,
        currentContext: null,
        messageHistory: [],
        isTyping: false
    };

    // Initialize Chatbot
    function initChatbot() {
        if (!elements.chatbotContainer) return;

        setupChatbotEvents();
        addInitialMessage();
    }

    // Setup Event Listeners
    function setupChatbotEvents() {
        // Toggle chatbot
        elements.chatbotToggle?.addEventListener('click', toggleChatbot);
        
        // Close chatbot
        elements.chatbotClose?.addEventListener('click', closeChatbot);
        
        // Send message
        elements.chatbotSend?.addEventListener('click', sendMessage);
        
        // Enter key to send message
        elements.chatbotInput?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Auto-resize input
        elements.chatbotInput?.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Toggle Chatbot
    function toggleChatbot() {
        if (chatbotState.isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }

    // Open Chatbot
    function openChatbot() {
        if (elements.chatbotWidget) {
            elements.chatbotWidget.classList.add('show');
            chatbotState.isOpen = true;
            elements.chatbotInput?.focus();
        }
    }

    // Close Chatbot
    function closeChatbot() {
        if (elements.chatbotWidget) {
            elements.chatbotWidget.classList.remove('show');
            chatbotState.isOpen = false;
        }
    }

    // Add Initial Message
    function addInitialMessage() {
        const welcomeMessage = "Hello! I'm the Ragu Printers Assistant. I can help you with information about our printing services, pricing, location, and hours. How can I assist you today?";
        addMessage(welcomeMessage, 'bot');
    }

    // Send Message
    function sendMessage() {
        const message = elements.chatbotInput?.value.trim();
        if (!message || chatbotState.isTyping) return;

        // Add user message
        addMessage(message, 'user');
        elements.chatbotInput.value = '';

        // Process message and respond
        setTimeout(() => {
            const response = processMessage(message);
            addMessage(response, 'bot');
        }, 500);
    }

    // Add Message to Chat
    function addMessage(text, sender) {
        if (!elements.chatbotMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('p');
        messageContent.textContent = text;
        messageElement.appendChild(messageContent);

        elements.chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
        
        // Store in history
        chatbotState.messageHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date()
        });
    }

    // Process Message
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for greetings
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.greetings)) {
            return getRandomResponse(chatbotConfig.responses.greetings);
        }

        // Check for thanks
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.thanks)) {
            return "You're welcome! Is there anything else I can help you with regarding our printing services?";
        }

        // Check for services
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.services)) {
            return "We offer a complete range of printing services including:\n\n• Printer Sales & Repair\n• Printing Services (Color & B/W)\n• Xerox/Photocopying\n• Binding Services\n• Lamination\n\nWhich service would you like to know more about?";
        }

        // Check for specific services
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.printerSales)) {
            return chatbotConfig.responses.services['printer sales'].response;
        }

        if (containsKeywords(lowerMessage, chatbotConfig.keywords.printerRepair)) {
            return chatbotConfig.responses.services['printer repair'].response;
        }

        if (containsKeywords(lowerMessage, chatbotConfig.keywords.printing)) {
            return chatbotConfig.responses.services['printing services'].response;
        }

        if (containsKeywords(lowerMessage, chatbotConfig.keywords.xerox)) {
            return chatbotConfig.responses.services['xerox'].response;
        }

        if (containsKeywords(lowerMessage, chatbotConfig.keywords.binding)) {
            return chatbotConfig.responses.services['binding'].response;
        }

        if (containsKeywords(lowerMessage, chatbotConfig.keywords.lamination)) {
            return chatbotConfig.responses.services['lamination'].response;
        }

        // Check for pricing
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.pricing)) {
            if (lowerMessage.includes('print')) {
                return chatbotConfig.responses.pricing['printing cost'];
            } else if (lowerMessage.includes('repair')) {
                return chatbotConfig.responses.pricing['repair cost'];
            } else if (lowerMessage.includes('bind')) {
                return chatbotConfig.responses.pricing['binding cost'];
            } else if (lowerMessage.includes('laminat')) {
                return chatbotConfig.responses.pricing['lamination cost'];
            } else {
                return "Our pricing varies by service. Printing starts from $0.10 per page, repairs from $25, binding from $2.50, and lamination from $0.50. What specific service would you like pricing for?";
            }
        }

        // Check for location
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.location)) {
            return chatbotConfig.responses.location.address;
        }

        // Check for hours
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.hours)) {
            return chatbotConfig.responses.location.hours;
        }

        // Check for contact
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.contact)) {
            return chatbotConfig.responses.location.contact;
        }

        // Check for emergency
        if (containsKeywords(lowerMessage, chatbotConfig.keywords.emergency)) {
            return chatbotConfig.responses.emergency;
        }

        // Fallback response
        return getRandomResponse(chatbotConfig.responses.fallback);
    }

    // Check if message contains keywords
    function containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // Get random response from array
    function getRandomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    // Add typing indicator
    function addTypingIndicator() {
        if (!elements.chatbotMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.innerHTML = '<p>Ragu Printers Assistant is typing...</p>';
        
        elements.chatbotMessages.appendChild(typingElement);
        elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight;
        
        chatbotState.isTyping = true;
        
        return typingElement;
    }

    // Remove typing indicator
    function removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
        chatbotState.isTyping = false;
    }

    // Advanced message processing with context
    function processMessageWithContext(message) {
        const lowerMessage = message.toLowerCase();
        
        // Handle follow-up questions based on context
        if (chatbotState.currentContext) {
            switch (chatbotState.currentContext) {
                case 'printer-sales':
                    if (lowerMessage.includes('budget') || lowerMessage.includes('price')) {
                        return "Our printers range from $150 for basic inkjet printers to $3000+ for commercial-grade models. What's your budget range?";
                    }
                    break;
                    
                case 'printer-repair':
                    if (lowerMessage.includes('hp') || lowerMessage.includes('canon') || lowerMessage.includes('epson')) {
                        return "Great! We service all major brands including HP, Canon, and Epson. You can bring your printer to our shop or we can provide on-site service for business clients. Would you like to schedule a diagnostic?";
                    }
                    break;
            }
        }
        
        return processMessage(message);
    }

    // Get business-specific responses
    function getBusinessResponse(query) {
        const businessInfo = {
            'warranty': "We provide a 90-day warranty on all printer repairs and a 1-year warranty on new printer sales. Extended warranties are also available.",
            'brands': "We work with all major printer brands including HP, Canon, Epson, Brother, Xerox, Lexmark, and many others.",
            'delivery': "We offer free delivery within 10 miles for printer purchases over $500. Installation service is also available.",
            'bulk': "We offer significant discounts for bulk orders. Orders over 100 copies get 20% off, and orders over 500 copies get 30% off.",
            'rush': "Rush services are available for urgent printing needs. Same-day service is available for most printing jobs, and emergency repairs can be scheduled.",
            'payment': "We accept cash, all major credit cards, debit cards, and PayPal. We also offer business accounts with net-30 terms.",
            'appointments': "While walk-ins are welcome, we recommend scheduling appointments for printer repairs to ensure faster service. You can call us at 6383146661 to schedule."
        };
        
        const lowerQuery = query.toLowerCase();
        
        for (const [key, value] of Object.entries(businessInfo)) {
            if (lowerQuery.includes(key)) {
                return value;
            }
        }
        
        return null;
    }

    // Handle complex queries
    function handleComplexQuery(message) {
        const lowerMessage = message.toLowerCase();
        
        // Multi-service queries
        if (lowerMessage.includes('print') && lowerMessage.includes('bind')) {
            return "We can definitely help with both printing and binding! We offer complete document services - we can print your documents and then bind them with spiral, comb, or perfect binding. What type of documents do you need printed and bound?";
        }
        
        if (lowerMessage.includes('repair') && lowerMessage.includes('buy')) {
            return "Sometimes it's more cost-effective to buy a new printer than repair an old one. We offer free diagnostics to help you make the best decision. If repair costs exceed 60% of a new printer's price, we'll recommend a replacement.";
        }
        
        // Comparison queries
        if (lowerMessage.includes('vs') || lowerMessage.includes('compare') || lowerMessage.includes('difference')) {
            return "I'd be happy to help you compare our services or products! For detailed comparisons and recommendations, please call us at 6383146661 or visit our shop. Our experts can provide personalized advice based on your specific needs.";
        }
        
        return null;
    }

    // Auto-suggestions based on conversation
    function getAutoSuggestions(context) {
        const suggestions = {
            'greeting': [
                "What services do you offer?",
                "What are your prices?",
                "Where are you located?",
                "What are your hours?"
            ],
            'services': [
                "Printer repair services",
                "Printing prices",
                "Binding options",
                "Lamination services"
            ],
            'pricing': [
                "Do you offer discounts?",
                "What payment methods do you accept?",
                "Can I get a quote?",
                "Rush service pricing"
            ]
        };
        
        return suggestions[context] || [];
    }

    // Initialize chatbot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    // Expose chatbot functions globally
    window.RaguPrintersChatbot = {
        init: initChatbot,
        toggle: toggleChatbot,
        open: openChatbot,
        close: closeChatbot,
        sendMessage: sendMessage,
        addMessage: addMessage
    };

})();
