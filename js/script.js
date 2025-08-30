// RPP Printers - Main JavaScript File
// Handles all interactive functionality and animations

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        navbar: document.getElementById('navbar'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        backToTop: document.getElementById('back-to-top'),
        loadingScreen: document.getElementById('loading-screen'),
        heroTitle: document.getElementById('typing-text'),
        contactForm: document.getElementById('contactForm'),
        formSuccess: document.getElementById('form-success'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        modalElement: document.getElementById('gallery-modal'),
        modalClose: document.querySelector('.modal-close'),
        statNumbers: document.querySelectorAll('.stat-number')
    };

    // Configuration
    const config = {
        typingSpeed: 100,
        typingDelay: 1000,
        scrollThreshold: 100,
        animationDelay: 100,
        loadingDuration: 2000
    };

    // Initialize application
    function init() {
        setupEventListeners();
        handleLoadingScreen();
        setupScrollAnimations();
        setupTypingAnimation();
        setupCounterAnimations();
        setupGalleryFilter();
        setupFormValidation();
        setupSmoothScrolling();
        setupNavbarScrollEffect();
        
        // Initialize animations after DOM is ready
        setTimeout(() => {
            initializeAnimations();
        }, 100);
    }

    // Event Listeners
    function setupEventListeners() {
        // Navigation toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleNavigation);
        }

        // Back to top button
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', scrollToTop);
        }

        // Window scroll events
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('load', handleWindowLoad);
        window.addEventListener('resize', handleResize);

        // Gallery modal events
        if (elements.modalElement) {
            elements.modalClose?.addEventListener('click', closeModal);
            elements.modalElement.addEventListener('click', function(e) {
                if (e.target === elements.modalElement) {
                    closeModal();
                }
            });
        }

        // Filter buttons
        elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });

        // // Form submission
        // if (elements.contactForm) {
        //     elements.contactForm.addEventListener('submit', handleFormSubmit);
        // }


        //           // Product buttons
        // document.querySelectorAll('.product-btn').forEach(btn => {
        //     btn.addEventListener('click', function() {
        //         // Get product name from the card
        //         const productCard = this.closest('.product-card');
        //         const productName = productCard.querySelector('.product-name').textContent;
        //         const productBrand = productCard.querySelector('.product-brand').textContent;
                
        //         // Redirect to contact page with product info
        //         window.location.href = `contact.html?product=${encodeURIComponent(productBrand + ' ' + productName)}`;
        //     });
        // });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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

    // Loading Screen
    function handleLoadingScreen() {
        if (elements.loadingScreen) {
            setTimeout(() => {
                elements.loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, config.loadingDuration);
        }
    }

    // Navigation Toggle
    function toggleNavigation() {
        if (elements.navMenu && elements.navToggle) {
            elements.navMenu.classList.toggle('active');
            elements.navToggle.classList.toggle('active');
        }
    }

    // Scroll Handling
    function handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Navbar scroll effect
        if (elements.navbar) {
            if (scrollY > config.scrollThreshold) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (elements.backToTop) {
            if (scrollY > config.scrollThreshold) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        }

        // Trigger scroll animations
        triggerScrollAnimations();
    }

    // Scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Window load handler
    function handleWindowLoad() {
        document.body.classList.add('loaded');
        initializeAnimations();
    }

    // Window resize handler
    function handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            elements.navMenu?.classList.remove('active');
            elements.navToggle?.classList.remove('active');
        }
    }

    // Typing Animation
    function setupTypingAnimation() {
        if (!elements.heroTitle) return;

        const texts = [
            'Quality Printing Solutions',
            'Professional Printer Services',
            'Your Printing Partner',
            'Excellence in Every Print'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function typeText() {
            const fullText = texts[textIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            elements.heroTitle.textContent = currentText;
            
            let typeSpeed = config.typingSpeed;
            if (isDeleting) {
                typeSpeed /= 2;
            }
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = config.typingDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeText, typeSpeed);
        }

        typeText();
    }

    // Scroll Animations
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for older browsers
            animatedElements.forEach(el => {
                el.classList.add('active');
            });
        }
    }

    // Trigger scroll animations manually
    function triggerScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate:not(.active), .scroll-animate-left:not(.active), .scroll-animate-right:not(.active), .scroll-animate-scale:not(.active)');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Counter Animations
    function setupCounterAnimations() {
        if (!elements.statNumbers.length) return;

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);
                
                element.textContent = current;
                element.classList.add('counting');
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.classList.remove('counting');
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        elements.statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    // Gallery Filter
    function setupGalleryFilter() {
        function filterGallery(category) {
            elements.galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = category === 'all' || itemCategory === category;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('show');
                    }, 10);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }

        // Initialize gallery
        elements.galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
            }, index * 100);
        });
    }

    // Filter button click handler
    function handleFilterClick(e) {
        const button = e.target;
        const category = button.getAttribute('data-filter');
        
        // Update active button
        elements.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Filter gallery items
        elements.galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('show');
                }, 10);
            } else {
                item.classList.remove('show');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Modal functionality
    window.openModal = function(itemId) {
        if (!elements.modalElement) return;
        
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        // Set modal content based on itemId
        const modalContent = getModalContent(itemId);
        if (modalTitle) modalTitle.textContent = modalContent.title;
        if (modalDescription) modalDescription.textContent = modalContent.description;
        
        elements.modalElement.style.display = 'block';
        elements.modalElement.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        if (elements.modalElement) {
            elements.modalElement.classList.remove('show');
            setTimeout(() => {
                elements.modalElement.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    function getModalContent(itemId) {
        const content = {
            'facility-1': {
                title: 'Modern Shop Front',
                description: 'Our professional storefront with clear signage and welcoming atmosphere, designed to make customers feel comfortable and confident in our services.'
            },
            'facility-2': {
                title: 'Customer Service Area',
                description: 'Comfortable consultation space where our team works closely with customers to understand their printing needs and provide expert advice.'
            },
            'facility-3': {
                title: 'Repair Workshop',
                description: 'State-of-the-art repair facility equipped with the latest tools and diagnostic equipment for professional printer maintenance and repair.'
            },
            'equipment-1': {
                title: 'Commercial Printers',
                description: 'High-speed commercial printing equipment capable of handling large volume jobs with consistent quality and efficiency.'
            },
            'equipment-2': {
                title: 'Xerox Equipment',
                description: 'Professional-grade photocopying machines providing crystal-clear copies for all your duplication needs.'
            },
            'equipment-3': {
                title: 'Binding Machines',
                description: 'Specialized binding equipment for spiral, comb, and perfect binding services to give your documents a professional finish.'
            },
            'printing-1': {
                title: 'Business Documents',
                description: 'Professional printing services for business documents, reports, presentations, and corporate materials with exceptional quality.'
            },
            'printing-2': {
                title: 'Color Printing',
                description: 'Vibrant color printing services for marketing materials, brochures, flyers, and promotional content that makes an impact.'
            },
            'printing-3': {
                title: 'Large Format Printing',
                description: 'Large format printing capabilities for posters, banners, signage, and display materials in various sizes and materials.'
            },
            'binding-1': {
                title: 'Spiral Binding',
                description: 'Professional spiral binding services for reports, manuals, and presentations that lay flat and are easy to read.'
            },
            'binding-2': {
                title: 'Perfect Binding',
                description: 'High-quality perfect binding for books, catalogs, and professional publications with a clean, finished appearance.'
            },
            'binding-3': {
                title: 'Comb Binding',
                description: 'Durable comb binding services for training materials, manuals, and documents that need to withstand frequent use.'
            },
            'lamination-1': {
                title: 'Document Lamination',
                description: 'Professional lamination services to protect and preserve your important documents with crystal-clear, durable coating.'
            },
            'lamination-2': {
                title: 'ID Card Lamination',
                description: 'Specialized lamination for ID cards, badges, and credentials providing protection and professional appearance.'
            },
            'lamination-3': {
                title: 'Certificate Lamination',
                description: 'Premium lamination services for certificates, awards, and important documents to ensure long-lasting preservation.'
            }
        };
        
        return content[itemId] || { title: 'Gallery Item', description: 'Professional printing services and quality work.' };
    }

    // Form Validation
    function setupFormValidation() {
        if (!elements.contactForm) return;

        const formFields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            message: document.getElementById('message')
        };

        const errorElements = {
            name: document.getElementById('name-error'),
            email: document.getElementById('email-error'),
            phone: document.getElementById('phone-error'),
            message: document.getElementById('message-error')
        };

        function validateField(field, value) {
            switch (field) {
                case 'name':
                    if (!value.trim()) {
                        return 'Name is required';
                    }
                    if (value.trim().length < 2) {
                        return 'Name must be at least 2 characters';
                    }
                    break;
                
                case 'email':
                    if (!value.trim()) {
                        return 'Email is required';
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        return 'Please enter a valid email address';
                    }
                    break;
                
                case 'phone':
                    if (value.trim() && value.trim().length < 10) {
                        return 'Please enter a valid phone number';
                    }
                    break;
                
                case 'message':
                    if (!value.trim()) {
                        return 'Message is required';
                    }
                    if (value.trim().length < 10) {
                        return 'Message must be at least 10 characters';
                    }
                    break;
            }
            return '';
        }

        function showError(field, message) {
            const errorElement = errorElements[field];
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                formFields[field]?.classList.add('error');
            }
        }

        function hideError(field) {
            const errorElement = errorElements[field];
            if (errorElement) {
                errorElement.style.display = 'none';
                formFields[field]?.classList.remove('error');
            }
        }

        // Real-time validation
        Object.keys(formFields).forEach(field => {
            const input = formFields[field];
            if (input) {
                input.addEventListener('blur', function() {
                    const error = validateField(field, this.value);
                    if (error) {
                        showError(field, error);
                    } else {
                        hideError(field);
                    }
                });

                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        const error = validateField(field, this.value);
                        if (!error) {
                            hideError(field);
                        }
                    }
                });
            }
        });
    }

    // Form Submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(elements.contactForm);
        const data = {};
        
        // Collect form data
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Validate all fields
        let isValid = true;
        const fields = ['name', 'email', 'message'];
        
        fields.forEach(field => {
            const value = data[field] || '';
            const error = validateField(field, value);
            if (error) {
                showError(field, error);
                isValid = false;
            } else {
                hideError(field);
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Simulate form submission
        const submitButton = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', data);
            
            // Show success message
            elements.contactForm.style.display = 'none';
            if (elements.formSuccess) {
                elements.formSuccess.classList.add('show');
            }
            
            // Reset form after delay
            setTimeout(() => {
                elements.contactForm.reset();
                elements.contactForm.style.display = 'block';
                if (elements.formSuccess) {
                    elements.formSuccess.classList.remove('show');
                }
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 5000);
        }, 2000);
    }

    // Validation helper functions
    function validateField(field, value) {
        switch (field) {
            case 'name':
                if (!value.trim()) {
                    return 'Name is required';
                }
                if (value.trim().length < 2) {
                    return 'Name must be at least 2 characters';
                }
                break;
            
            case 'email':
                if (!value.trim()) {
                    return 'Email is required';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            
            case 'phone':
                if (value.trim() && value.trim().length < 10) {
                    return 'Please enter a valid phone number';
                }
                break;
            
            case 'message':
                if (!value.trim()) {
                    return 'Message is required';
                }
                if (value.trim().length < 10) {
                    return 'Message must be at least 10 characters';
                }
                break;
        }
        return '';
    }

    function showError(field, message) {
        const errorElement = document.getElementById(field + '-error');
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.classList.add('animate-shake');
            
            setTimeout(() => {
                errorElement.classList.remove('animate-shake');
            }, 500);
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    function hideError(field) {
        const errorElement = document.getElementById(field + '-error');
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    // Smooth Scrolling
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (elements.navMenu?.classList.contains('active')) {
                        toggleNavigation();
                    }
                }
            });
        });
    }

    // Navbar Scroll Effect
    function setupNavbarScrollEffect() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (elements.navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    elements.navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    elements.navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            }
        });
    }

    // Initialize Animations
    function initializeAnimations() {
        // Add scroll animations to elements
        const elementsToAnimate = [
            { selector: '.service-card', class: 'scroll-animate', delay: 100 },
            { selector: '.feature-item', class: 'scroll-animate-scale', delay: 150 },
            { selector: '.testimonial-card', class: 'scroll-animate-left', delay: 200 },
            { selector: '.team-card', class: 'scroll-animate-right', delay: 100 },
            { selector: '.value-card', class: 'scroll-animate', delay: 100 },
            { selector: '.process-step', class: 'scroll-animate-scale', delay: 150 }
        ];
        
        elementsToAnimate.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach((element, index) => {
                element.classList.add(item.class);
                element.style.animationDelay = `${index * item.delay}ms`;
            });
        });
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance optimizations
    const optimizedHandleScroll = throttle(handleScroll, 16); // ~60fps
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', optimizedHandleScroll);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global functions
    window.RPPPrinters = {
        init: init,
        openModal: window.openModal,
        closeModal: closeModal,
        toggleNavigation: toggleNavigation,
        scrollToTop: scrollToTop
    };

})();
