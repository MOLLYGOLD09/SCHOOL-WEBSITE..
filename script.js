/* ========================================
   SILANGAN NHS LRMS - JavaScript
   Complete Interactive Functionality
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the first visit in the current session (safe for file:// previews)
    let hasSeenLoadingScreen = false;
    try {
        hasSeenLoadingScreen = sessionStorage.getItem('loadingScreenShown');
    } catch (e) {
        // Some mobile preview apps block sessionStorage on file://, so we skip the loading screen safely.
        hasSeenLoadingScreen = 'true';
    }
    // Show the loading screen ONLY on the homepage (index.html) to avoid flashing on other pages
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const enableLoadingScreen = currentPage === 'index.html';
    if (!enableLoadingScreen) {
        hasSeenLoadingScreen = 'true';
    }


    // Only show loading screen if it hasn't been shown in this session
    if (!hasSeenLoadingScreen) {
        // Mark that loading screen has been shown in this session
        try { sessionStorage.setItem('loadingScreenShown', 'true'); } catch (e) {}

        // Create loading screen dynamically with educational theme
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="bg-decoration">
                <div class="bg-circle bg-circle-1"></div>
                <div class="bg-circle bg-circle-2"></div>
                <div class="bg-circle bg-circle-3"></div>
            </div>
            <div class="floating-icons">
                <span class="icon icon-1">📚</span>
                <span class="icon icon-2">🎓</span>
                <span class="icon icon-3">✏️</span>
                <span class="icon icon-4">💡</span>
                <span class="icon icon-4">💡</span>
            </div>
            <div class="book-container">
                <div class="book">
                    <div class="book-cover-left"></div>
                    <div class="book-spine"></div>
                    <div class="book-cover-right"></div>
                    <div class="book-pages"></div>
                </div>
            </div>
            <div class="loading-logo">
                <img src="SN.jpg" alt="School Logo">
            </div>
            <h2 class="loading-text">Welcome to SNHS</h2>
            <p class="loading-subtext">Preparing your learning space… Please wait.</p>
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <div class="loading-progress">
                <div class="loading-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(loadingScreen);

        // Hide loading screen after page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('fade-out');
                document.body.classList.add('loaded');

                // Remove loading screen from DOM after fade out
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 2500);
        });
    }
});



// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Mobile Menu Toggle (FIXED: no X animation)
    // ========================================

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {

        // Toggle menu open/close
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // prevents the "click outside" handler from firing
            navLinks.classList.toggle('active');
        });

        // Prevent clicks inside nav from closing the menu
        navLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking on a link (but NOT on dropdown toggles)
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                if (link.classList.contains('dropdown-toggle')) return;
                navLinks.classList.remove('active');
            });
        });
    }

    // ========================================
    // Dropdown Menu Toggle
    // ========================================

    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isActive = dropdown.classList.toggle('active');
                toggle.setAttribute('aria-expanded', isActive);

                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                        const otherToggle = d.querySelector('.dropdown-toggle');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }

        // Handle dropdown menu item clicks
        const dropdownLinks = dropdown.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                // On mobile, close the menu after clicking a submenu item
                if (window.innerWidth <= 768) {
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks) navLinks.classList.remove('active');
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ========================================
    // Active Navigation Link
    // ========================================

    const currentPage = window.location.pathname.split('/').pop();
    const navLinksElements = document.querySelectorAll('.nav-links a');

    navLinksElements.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ========================================
    // Smooth Scrolling for Navigation Links
    // ========================================

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // Accordion Functionality
    // ========================================

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            accordionHeaders.forEach(h => {
                if (h !== header) {
                    h.classList.remove('active');
                    const content = h.nextElementSibling;
                    if (content && content.classList.contains('accordion-content')) {
                        content.classList.remove('active');
                    }
                }
            });

            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content && content.classList.contains('accordion-content')) {
                content.classList.toggle('active');
            }
        });
    });

    // ========================================
    // Scroll Animation for Cards
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ========================================
    // Header Background on Scroll
    // ========================================

    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // ========================================
    // Page Load Animation
    // ========================================

    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(function() {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ========================================
    // Back to Top Button
    // ========================================

    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: green;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========================================
    // Loading Animation for Images
    // ========================================

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.addEventListener('error', function() {
            this.style.opacity = '1';
        });
    });

    // ========================================
    // Programs / Events: Add Facebook Arrow Button
    // (Same design intention as the "Latest Updates" arrow)
    // ========================================

    try {
        const path = (window.location.pathname || '').toLowerCase();
        const currentFile = (path.split('/').pop() || '').toLowerCase();
        // Support hosting setups that use "pretty" URLs via redirects (e.g. /programs-events)
        // where the file still resolves to programs-events.html.
        if (currentFile === 'programs-events.html' || path.includes('programs-events')) {
            // Change this once to your Facebook page/post link
            // Default fallback link (used only if an event card does NOT have a data-fb="..." link).
            // For different Facebook links per event, edit programs-events.html and set data-fb on each .pe-card.
            const defaultFacebookLink = 'https://www.facebook.com/';

            const peCards = document.querySelectorAll('.pe-card');
            peCards.forEach(card => {
                // Optional: set a custom link per card by adding data-fb="https://..." to .pe-card
                const fbLink = card.getAttribute('data-fb') || defaultFacebookLink;

                // Avoid duplicates
                if (card.querySelector('.pe-fb-arrow')) return;

                const a = document.createElement('a');
                a.className = 'pe-fb-arrow';
                a.href = fbLink;
                a.target = '_blank';
                a.rel = 'noopener';
                a.setAttribute('aria-label', 'Open Facebook link');
                a.innerHTML = '&#8594;';
                card.appendChild(a);
            });
        }
    } catch (e) {
        // Silent fail (prevents errors if something unexpected happens)
    }

    console.log('Silangan NHS LRMS Website - JavaScript Loaded Successfully');
});
