/* ==========================================
   Siya'S HAIR & SKIN CLINIC - SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // 2. DARK/LIGHT THEME SWITCHER
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    // 3. STICKY HEADER ON SCROLL
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. MOBILE MENU INTERACTIVITY
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpen = navMenu.classList.contains('active');
        mobileMenuBtn.innerHTML = isOpen 
            ? `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` 
            : `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });
    });

    // 5. SERVICES TABS INTERACTIVITY
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceGrids = document.querySelectorAll('.services-grid');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle service grids
            serviceGrids.forEach(grid => {
                if (grid.id === `${targetTab}-services`) {
                    grid.classList.add('active');
                } else {
                    grid.classList.remove('active');
                }
            });
        });
    });

    // 6. TESTIMONIALS SLIDER CAROUSEL
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayInterval;

    // Create Dots dynamically
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        if (currentSlide < 0) currentSlide = slideCount - 1;
        if (currentSlide >= slideCount) currentSlide = 0;
        
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto Play Testimonial
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // Pause auto play on hover
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 7. DYNAMIC BOOKING FORM DROPDOWN POPULATION
    const bookingForm = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('booking-service');
    const treatmentSelect = document.getElementById('booking-treatment');

    // Treatments dictionary mapping category to list of treatment options
    const treatmentsData = {
        hair: [
            { value: 'prp', label: 'PRP Hair Therapy' },
            { value: 'dandruff', label: 'Advanced Dandruff Treatment' },
            { value: 'hair-transplant', label: 'Hair Transplant Consultation' },
            { value: 'hair-growth', label: 'Laser Hair Regrowth Therapy' },
            { value: 'scalp-detox', label: 'Scalp Cleansing & Detoxification' }
        ],
        skin: [
            { value: 'acne', label: 'Clinical Acne/Pimple Therapy' },
            { value: 'peel', label: 'Anti-pigmentation Chemical Peel' },
            { value: 'hydrafacial', label: 'Premium Gold Hydrafacial' },
            { value: 'anti-aging', label: 'Collagen Anti-Aging Treatment' },
            { value: 'laser-skin', label: 'Skin Whitening & Glow Therapy' }
        ]
    };

    function populateTreatments(category) {
        // Clear current choices
        treatmentSelect.innerHTML = '<option value="" disabled selected>Select specific treatment...</option>';
        
        if (!category || !treatmentsData[category]) {
            treatmentSelect.disabled = true;
            return;
        }

        treatmentsData[category].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.value;
            opt.textContent = item.label;
            treatmentSelect.appendChild(opt);
        });

        treatmentSelect.disabled = false;
    }

    serviceSelect.addEventListener('change', (e) => {
        populateTreatments(e.target.value);
    });

    // Disable treatment select initially until category is chosen
    treatmentSelect.disabled = true;

    // Set minimum date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // 8. INTERACTIVE BOOKING VALIDATION & MODAL SUCCESS
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Details inside the modal
    const receiptName = document.getElementById('receipt-name');
    const receiptService = document.getElementById('receipt-service');
    const receiptDate = document.getElementById('receipt-date');
    const receiptTime = document.getElementById('receipt-time');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Inputs
            const nameInput = document.getElementById('booking-name');
            const phoneInput = document.getElementById('booking-phone');
            const emailInput = document.getElementById('booking-email');
            const dateInput = document.getElementById('booking-date');
            const timeInput = document.getElementById('booking-time');
            
            // Simple validation
            let isValid = true;

            // Name validation (min 3 characters)
            if (nameInput.value.trim().length < 3) {
                showInputError(nameInput, 'Please enter your full name (minimum 3 characters).');
                isValid = false;
            } else {
                clearInputError(nameInput);
            }

            // Phone validation (10 digits)
            const phoneRegex = /^[6-9]\d{9}$/; // Indian numbers typical validator
            if (!phoneRegex.test(phoneInput.value.trim())) {
                showInputError(phoneInput, 'Please enter a valid 10-digit mobile number.');
                isValid = false;
            } else {
                clearInputError(phoneInput);
            }

            // Category select validation
            if (!serviceSelect.value) {
                showInputError(serviceSelect, 'Please select a service category.');
                isValid = false;
            } else {
                clearInputError(serviceSelect);
            }

            // Treatment select validation
            if (!treatmentSelect.value) {
                showInputError(treatmentSelect, 'Please select a specific treatment.');
                isValid = false;
            } else {
                clearInputError(treatmentSelect);
            }

            // Date validation
            if (!dateInput.value) {
                showInputError(dateInput, 'Please pick an appointment date.');
                isValid = false;
            } else {
                clearInputError(dateInput);
            }

            // Time validation
            if (!timeInput.value) {
                showInputError(timeInput, 'Please choose a convenient time.');
                isValid = false;
            } else {
                clearInputError(timeInput);
            }

            if (isValid) {
                // Get display values
                const clientName = nameInput.value;
                const treatmentLabel = treatmentSelect.options[treatmentSelect.selectedIndex].text;
                const bookingDate = dateInput.value;
                const bookingTime = timeInput.value;

                // Fill details in success modal
                receiptName.textContent = clientName;
                receiptService.textContent = treatmentLabel;
                receiptDate.textContent = formatDate(bookingDate);
                receiptTime.textContent = formatTime(bookingTime);

                // Show success modal
                successModal.style.display = 'flex';
                
                // Reset form
                bookingForm.reset();
                treatmentSelect.disabled = true;
            }
        });
    }

    // Helper functions for validation UI
    function showInputError(inputEl, message) {
        inputEl.style.borderColor = '#e74c3c';
        // Check if error message element already exists
        let errorEl = inputEl.parentNode.querySelector('.error-msg');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-msg';
            errorEl.style.color = '#e74c3c';
            errorEl.style.fontSize = '0.75rem';
            errorEl.style.marginTop = '0.2rem';
            inputEl.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function clearInputError(inputEl) {
        inputEl.style.borderColor = '';
        const errorEl = inputEl.parentNode.querySelector('.error-msg');
        if (errorEl) {
            errorEl.remove();
        }
    }

    function formatDate(dateStr) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    function formatTime(timeStr) {
        const [hour, minute] = timeStr.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    }

    // Close success modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }

    // Close modal if clicking outside the card
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // 9. SCROLL REVEAL (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // 10. BEFORE & AFTER INTERACTIVE SLIDER
    const beforeAfterSlider = document.querySelector('.before-after-slider');
    if (beforeAfterSlider) {
        const sliderBar = beforeAfterSlider.querySelector('.slider-bar');
        const foregroundImg = beforeAfterSlider.querySelector('.foreground-img');
        const sliderButton = beforeAfterSlider.querySelector('.slider-button');

        // Dynamically resize images to match the container's width
        function resizeImages() {
            const containerWidth = beforeAfterSlider.offsetWidth;
            const images = beforeAfterSlider.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = `${containerWidth}px`;
            });
        }

        sliderBar.addEventListener('input', (e) => {
            const val = e.target.value;
            foregroundImg.style.width = `${val}%`;
            sliderButton.style.left = `${val}%`;
        });

        // Initialize and listen for resize events
        resizeImages();
        window.addEventListener('resize', resizeImages);
    }

    // 11. TREATMENT RECOMMENDATION QUIZ
    const quizOptionsContainer = document.getElementById('quiz-options');
    const quizQuestionContainer = document.getElementById('quiz-question-container');
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizResultEl = document.getElementById('quiz-result');
    const recommendedTitle = document.getElementById('recommended-treatment-title');
    const recommendedDesc = document.getElementById('recommended-treatment-desc');
    const quizRestartBtn = document.getElementById('quiz-restart-btn');

    let quizStep = 1;
    let quizAnswers = {};

    const quizQuestions = {
        1: {
            text: "Question 1 of 3: What is your primary concern?",
            options: [
                { text: "Severe Hair Fall / Thinning", val: "hair-loss" },
                { text: "Acne Breakouts / Acne Marks", val: "acne" },
                { text: "Dull Skin / Tan / Pigmentation", val: "dull-skin" }
            ]
        },
        2: {
            text: "Question 2 of 3: How long have you faced this concern?",
            options: [
                { text: "Less than 6 months", val: "recent" },
                { text: "More than 6 months", val: "chronic" }
            ]
        },
        3: {
            text: "Question 3 of 3: What is your skin or scalp type?",
            options: [
                { text: "Oily / Grease-prone", val: "oily" },
                { text: "Dry / Flaky", val: "dry" },
                { text: "Normal / Sensitive", val: "normal" }
            ]
        }
    };

    function startQuiz() {
        quizStep = 1;
        quizAnswers = {};
        if (quizResultEl) quizResultEl.style.display = 'none';
        if (quizQuestionContainer) quizQuestionContainer.style.display = 'block';
        showQuizQuestion();
    }

    function showQuizQuestion() {
        const currentQ = quizQuestions[quizStep];
        if (!quizQuestionEl || !quizOptionsContainer) return;
        
        quizQuestionEl.textContent = currentQ.text;
        quizOptionsContainer.innerHTML = '';

        currentQ.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => handleQuizSelect(opt.val));
            quizOptionsContainer.appendChild(btn);
        });
    }

    function handleQuizSelect(val) {
        quizAnswers[quizStep] = val;
        
        if (quizStep < 3) {
            quizStep++;
            showQuizQuestion();
        } else {
            showQuizResult();
        }
    }

    function showQuizResult() {
        if (quizQuestionContainer) quizQuestionContainer.style.display = 'none';
        if (quizResultEl) quizResultEl.style.display = 'block';

        // Recommendation Logic
        const concern = quizAnswers[1];
        if (!recommendedTitle || !recommendedDesc) return;
        
        if (concern === 'hair-loss') {
            recommendedTitle.textContent = "Platelet-Rich Plasma (PRP) Hair Therapy";
            recommendedDesc.textContent = "Based on your scalp profile, we recommend clinical PRP. It uses your own plasma factor to naturally stimulate dormant hair roots and enhance scalp density. Combined with LLLT Laser therapy, it yields 95% visible regrowth.";
        } else if (concern === 'acne') {
            recommendedTitle.textContent = "Clinical Acne Clear & Light Therapy";
            recommendedDesc.textContent = "For your acne concerns, we recommend our specialized clinical exfoliation and anti-bacterial light therapy. This clears pores deeply, controls sebaceous glands, and prevents scarring.";
        } else {
            recommendedTitle.textContent = "Premium Gold Hydrafacial & Dermal Peels";
            recommendedDesc.textContent = "To combat skin dullness, we recommend a combination of a multi-step Hydrafacial and customized dermal pigmentation peels. This lifts tanning and reveals bright, hydrated, and evenly toned skin.";
        }
    }

    if (quizRestartBtn) {
        quizRestartBtn.addEventListener('click', startQuiz);
    }

    // Initialize Quiz
    if (quizOptionsContainer) {
        startQuiz();
    }

    // 12. FAQ ACCORDION PANEL TOGGLE
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentNode;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });

            // Open clicked item if it was closed
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
