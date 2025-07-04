/**
 * PrintHub Pro Website JavaScript
 * Handles all interactive functionality including navigation, forms, animations, and modals
 */

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const calculatorModal = document.getElementById('calculator-modal');
const modalClose = document.getElementById('modal-close');
const galleryGrid = document.getElementById('gallery-grid');

// Navigation functionality
function initNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// AI Chatbot functionality
function initChatbot() {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

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

// Service tabs functionality
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// Contact form handling with database integration
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const inquiryData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                message: formData.get('message'),
                status: 'new',
                priority: formData.get('priority') || 'medium'
            };
            
            // Save to database
            await trickleCreateObject('customer_inquiry', inquiryData);
            
            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Order form handling with database integration and email notifications
function initOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) return;
    
    // Real-time total calculation
    const printTypeSelect = document.getElementById('print-type');
    const paperSizeSelect = document.getElementById('paper-size');
    const quantityInput = document.getElementById('quantity');
    const urgentCheckbox = document.getElementById('urgent-order');
    const totalSpan = document.getElementById('order-total');
    
    function calculateTotal() {
        const printType = printTypeSelect.value;
        const paperSize = paperSizeSelect.value;
        const quantity = parseInt(quantityInput.value) || 0;
        const isUrgent = urgentCheckbox.checked;
        
        let basePrice = 0;
        if (printType === 'black_white') basePrice = 0.10;
        else if (printType === 'color') basePrice = 0.25;
        else if (printType === 'xerox') basePrice = 0.08;
        else if (printType === 'binding') basePrice = 5.00;
        else if (printType === 'lamination') basePrice = 2.00;
        
        let sizeMultiplier = 1;
        if (paperSize === 'A3') sizeMultiplier = 1.5;
        
        let total = basePrice * quantity * sizeMultiplier;
        if (isUrgent) total += 5.00;
        
        totalSpan.textContent = total.toFixed(2);
    }
    
    [printTypeSelect, paperSizeSelect, quantityInput, urgentCheckbox].forEach(element => {
        element.addEventListener('change', calculateTotal);
        element.addEventListener('input', calculateTotal);
    });
    
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(orderForm);
            const fileInput = document.getElementById('file-upload');
            const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : '';
            
            const orderData = {
                customer_name: formData.get('customer_name'),
                customer_email: formData.get('customer_email'),
                customer_phone: formData.get('customer_phone'),
                print_type: formData.get('print_type'),
                paper_size: formData.get('paper_size'),
                quantity: parseInt(formData.get('quantity')),
                special_instructions: formData.get('special_instructions') || '',
                file_name: fileName,
                total_cost: parseFloat(totalSpan.textContent),
                status: 'pending',
                urgent: formData.get('urgent') === 'on'
            };
            
            const order = await trickleCreateObject('print_order', orderData);
            
            // Send order confirmation email
            await sendOrderConfirmationEmail(orderData, order.objectId);
            
            showToast('Order placed successfully! Check your email for confirmation.', 'success');
            orderForm.reset();
            calculateTotal();
            
        } catch (error) {
            console.error('Order form error:', error);
            showToast('Failed to place order. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Appointment form handling with database integration and email notifications
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointment-form');
    if (!appointmentForm) return;
    
    // Show/hide address field based on location type
    const locationTypeSelect = document.getElementById('location-type');
    const addressGroup = document.getElementById('address-group');
    
    locationTypeSelect.addEventListener('change', () => {
        if (locationTypeSelect.value === 'on_site') {
            addressGroup.style.display = 'block';
            document.getElementById('service-address').required = true;
        } else {
            addressGroup.style.display = 'none';
            document.getElementById('service-address').required = false;
        }
    });
    
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<span class="loading"></span> Booking...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(appointmentForm);
            
            const appointmentData = {
                customer_name: formData.get('customer_name'),
                customer_email: formData.get('customer_email'),
                customer_phone: formData.get('customer_phone'),
                service_type: formData.get('service_type'),
                printer_model: formData.get('printer_model'),
                issue_description: formData.get('issue_description'),
                preferred_date: formData.get('preferred_date'),
                preferred_time: formData.get('preferred_time'),
                location_type: formData.get('location_type'),
                address: formData.get('address') || '',
                status: 'pending',
                urgency: formData.get('urgency')
            };
            
            const appointment = await trickleCreateObject('service_appointment', appointmentData);
            
            // Send appointment confirmation email
            await sendAppointmentConfirmationEmail(appointmentData, appointment.objectId);
            
            showToast('Appointment booked successfully! Check your email for confirmation.', 'success');
            appointmentForm.reset();
            addressGroup.style.display = 'none';
            
        } catch (error) {
            console.error('Appointment form error:', error);
            showToast('Failed to book appointment. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Email notification functions using AI agent
async function sendOrderConfirmationEmail(orderData, orderId) {
    try {
        const systemPrompt = `You are an email notification system for PrintHub Pro printing services. Generate a professional order confirmation email in plain text format.

Include:
- Order confirmation with order ID
- Customer details
- Order summary with pricing
- Expected completion time
- Contact information
- Professional closing

Keep it concise and professional.`;

        const userPrompt = `Generate order confirmation email for:
Customer: ${orderData.customer_name}
Email: ${orderData.customer_email}
Order ID: ${orderId}
Print Type: ${orderData.print_type}
Paper Size: ${orderData.paper_size}
Quantity: ${orderData.quantity}
Total Cost: $${orderData.total_cost}
Urgent: ${orderData.urgent ? 'Yes' : 'No'}
Special Instructions: ${orderData.special_instructions || 'None'}`;

        const emailContent = await invokeAIAgent(systemPrompt, userPrompt);
        console.log('Order confirmation email generated:', emailContent);
        
        // In a real application, you would send this email via email service
        return emailContent;
    } catch (error) {
        console.error('Failed to generate order confirmation email:', error);
    }
}

async function sendAppointmentConfirmationEmail(appointmentData, appointmentId) {
    try {
        const systemPrompt = `You are an email notification system for PrintHub Pro printing services. Generate a professional appointment confirmation email in plain text format.

Include:
- Appointment confirmation with appointment ID
- Customer details
- Service details
- Date and time information
- Location details
- Contact information for changes
- Professional closing

Keep it concise and professional.`;

        const userPrompt = `Generate appointment confirmation email for:
Customer: ${appointmentData.customer_name}
Email: ${appointmentData.customer_email}
Appointment ID: ${appointmentId}
Service Type: ${appointmentData.service_type}
Printer Model: ${appointmentData.printer_model}
Preferred Date: ${appointmentData.preferred_date}
Preferred Time: ${appointmentData.preferred_time}
Location: ${appointmentData.location_type}
Address: ${appointmentData.address || 'N/A'}
Urgency: ${appointmentData.urgency}
Issue: ${appointmentData.issue_description}`;

        const emailContent = await invokeAIAgent(systemPrompt, userPrompt);
        console.log('Appointment confirmation email generated:', emailContent);
        
        // In a real application, you would send this email via email service
        return emailContent;
    } catch (error) {
        console.error('Failed to generate appointment confirmation email:', error);
    }
}

// Customer portal functionality
function initCustomerPortal() {
    const portalForm = document.getElementById('portal-form');
    const portalResults = document.getElementById('portal-results');
    const portalTabBtns = document.querySelectorAll('.portal-tab-btn');
    const portalTabContents = document.querySelectorAll('.portal-tab-content');
    
    if (!portalForm) return;
    
    // Portal tab switching
    portalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-portal-tab');
            
            portalTabBtns.forEach(b => b.classList.remove('active'));
            portalTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
    
    portalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = portalForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const email = document.getElementById('portal-email').value;
        
        submitBtn.innerHTML = '<span class="loading"></span> Loading...';
        submitBtn.disabled = true;

        try {
            // Fetch customer data
            const [orders, appointments, inquiries] = await Promise.all([
                fetchCustomerOrders(email),
                fetchCustomerAppointments(email),
                fetchCustomerInquiries(email)
            ]);
            
            // Display results
            displayCustomerData(orders, appointments, inquiries);
            portalResults.style.display = 'block';
            
        } catch (error) {
            console.error('Portal error:', error);
            showToast('Failed to load customer data. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

async function fetchCustomerOrders(email) {
    try {
        const response = await trickleListObjects('print_order', 50, true);
        return response.items.filter(item => 
            item.objectData.customer_email === email
        );
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}

async function fetchCustomerAppointments(email) {
    try {
        const response = await trickleListObjects('service_appointment', 50, true);
        return response.items.filter(item => 
            item.objectData.customer_email === email
        );
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return [];
    }
}

async function fetchCustomerInquiries(email) {
    try {
        const response = await trickleListObjects('customer_inquiry', 50, true);
        return response.items.filter(item => 
            item.objectData.email === email
        );
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        return [];
    }
}

function displayCustomerData(orders, appointments, inquiries) {
    // Display orders
    const ordersList = document.getElementById('orders-list');
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-center text-gray-500">No orders found.</p>';
    } else {
        ordersList.innerHTML = orders.map(order => `
            <div class="record-item">
                <div class="record-header">
                    <h4>Order #${order.objectId.slice(-8)}</h4>
                    <span class="status-badge status-${order.objectData.status}">${order.objectData.status}</span>
                </div>
                <div class="record-details">
                    <p><strong>Type:</strong> ${order.objectData.print_type} | <strong>Quantity:</strong> ${order.objectData.quantity}</p>
                    <p><strong>Total:</strong> $${order.objectData.total_cost} | <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    ${order.objectData.special_instructions ? `<p><strong>Instructions:</strong> ${order.objectData.special_instructions}</p>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    // Display appointments
    const appointmentsList = document.getElementById('appointments-list');
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="text-center text-gray-500">No appointments found.</p>';
    } else {
        appointmentsList.innerHTML = appointments.map(apt => `
            <div class="record-item">
                <div class="record-header">
                    <h4>Appointment #${apt.objectId.slice(-8)}</h4>
                    <span class="status-badge status-${apt.objectData.status}">${apt.objectData.status}</span>
                </div>
                <div class="record-details">
                    <p><strong>Service:</strong> ${apt.objectData.service_type} | <strong>Printer:</strong> ${apt.objectData.printer_model}</p>
                    <p><strong>Date:</strong> ${apt.objectData.preferred_date} | <strong>Time:</strong> ${apt.objectData.preferred_time}</p>
                    <p><strong>Location:</strong> ${apt.objectData.location_type}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Display inquiries
    const inquiriesList = document.getElementById('inquiries-list');
    if (inquiries.length === 0) {
        inquiriesList.innerHTML = '<p class="text-center text-gray-500">No inquiries found.</p>';
    } else {
        inquiriesList.innerHTML = inquiries.map(inquiry => `
            <div class="record-item">
                <div class="record-header">
                    <h4>Inquiry #${inquiry.objectId.slice(-8)}</h4>
                    <span class="status-badge status-${inquiry.objectData.status}">${inquiry.objectData.status}</span>
                </div>
                <div class="record-details">
                    <p><strong>Priority:</strong> ${inquiry.objectData.priority} | <strong>Date:</strong> ${new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    <p><strong>Message:</strong> ${inquiry.objectData.message}</p>
                </div>
            </div>
        `).join('');
    }
}

// Toast notification system
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMessage.textContent = message;
    
    // Update icon and color based on type
    if (type === 'success') {
        toastIcon.className = 'icon-check-circle toast-icon';
        toast.style.background = '#10b981';
    } else if (type === 'error') {
        toastIcon.className = 'icon-x-circle toast-icon';
        toast.style.background = '#ef4444';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Enhanced Print calculator functionality
function initPrintCalculator() {
    const calcService = document.getElementById('calc-service');
    const calcPages = document.getElementById('calc-pages');
    const calcType = document.getElementById('calc-type');
    const calcPaper = document.getElementById('calc-paper');
    const calcSize = document.getElementById('calc-size');
    const calcRush = document.getElementById('calc-rush');
    const calcBinding = document.getElementById('calc-binding');
    const calcResult = document.getElementById('calc-result');
    const baseCost = document.getElementById('base-cost');
    const rushCostLine = document.getElementById('rush-cost-line');
    const bindingOptions = document.getElementById('binding-options');

    function updateCalculation() {
        const service = calcService.value;
        const pages = parseInt(calcPages.value) || 1;
        const pricePerPage = parseFloat(calcType.value);
        const paperMultiplier = parseFloat(calcPaper.value);
        const sizeMultiplier = parseFloat(calcSize.value);
        const isRush = calcRush.checked;
        
        let baseTotal = 0;
        
        if (service === 'binding') {
            baseTotal = parseFloat(calcBinding.value);
        } else if (service === 'lamination') {
            baseTotal = pages * 2.00 * sizeMultiplier;
        } else {
            baseTotal = pages * pricePerPage * paperMultiplier * sizeMultiplier;
        }
        
        let total = baseTotal;
        if (isRush) {
            total += 5.00;
            rushCostLine.style.display = 'flex';
        } else {
            rushCostLine.style.display = 'none';
        }
        
        baseCost.textContent = baseTotal.toFixed(2);
        calcResult.textContent = total.toFixed(2);
    }

    // Show/hide binding options
    calcService.addEventListener('change', () => {
        if (calcService.value === 'binding') {
            bindingOptions.style.display = 'block';
        } else {
            bindingOptions.style.display = 'none';
        }
        updateCalculation();
    });

    // Add event listeners for calculator inputs
    [calcPages, calcType, calcPaper, calcSize, calcRush, calcBinding].forEach(input => {
        input.addEventListener('input', updateCalculation);
        input.addEventListener('change', updateCalculation);
    });

    // Close modal functionality
    modalClose.addEventListener('click', () => {
        calculatorModal.classList.remove('active');
    });

    // Close modal when clicking outside
    calculatorModal.addEventListener('click', (e) => {
        if (e.target === calculatorModal) {
            calculatorModal.classList.remove('active');
        }
    });

    // Initial calculation
    updateCalculation();
}

// Global function to open pricing calculator
function openPricingCalculator() {
    calculatorModal.classList.add('active');
}

// Gallery initialization
function initGallery() {
    const galleryItems = [
        { title: 'Modern Print Shop', description: 'Our state-of-the-art printing facility' },
        { title: 'Professional Printers', description: 'High-quality commercial printers' },
        { title: 'Binding Services', description: 'Professional document binding' },
        { title: 'Color Printing', description: 'Vibrant color printing services' },
        { title: 'Office Supplies', description: 'Complete stationery collection' },
        { title: 'Customer Service', description: 'Dedicated customer support' }
    ];

    galleryItems.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.innerHTML = `
            <div class="gallery-placeholder">
                <div class="icon-image" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 10px;"></div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    // Add fade-in animation to service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add slide animations to product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('slide-in-left');
        } else {
            card.classList.add('slide-in-right');
        }
    });

    // Add fade-in to about content
    document.querySelector('.about-content').classList.add('fade-in');
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initChatbot();
    initServiceTabs();
    initContactForm();
    initOrderForm();
    initAppointmentForm();
    initCustomerPortal();
    initPrintCalculator();
    initGallery();
    initScrollAnimations();
    initSmoothScrolling();
    addAnimationClasses();
    
    // Set minimum date for appointment booking
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0);
        dateInput.min = today;
    }
    
    console.log('PrintHub Pro website initialized successfully!');
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
