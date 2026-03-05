/* ========================================
   3D ROTATING IMAGE GALLERY - JAVASCRIPT
   Silangan NHS LRMS School Website
   ======================================== */

(function() {
    'use strict';

    // Gallery Configuration
    const config = {
        rotationSpeed: 4000,      // Auto-rotation speed (ms) - SLOW and SMOOTH
        pauseOnHover: false,      // Don't pause on hover - keep rotating
        transitionDuration: 1000, // CSS transition duration (ms)
        enableKeyboard: true,     // Enable keyboard navigation
        enableTouch: true         // Enable touch/swipe navigation
    };

    // DOM Elements
    let galleryWrapper = null;
    let carousel = null;
    let images = [];
    let prevBtn = null;
    let nextBtn = null;
    let paginationContainer = null;

    // State Variables
    let currentIndex = 0;
    let rotationAngle = 0;
    let autoRotateTimer = null;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let angleStep = 60; // Default, will be calculated based on images

    /**
     * Initialize the Gallery
     */
    function initGallery() {
        console.log('Initializing gallery...');
        
        // Get DOM elements
        galleryWrapper = document.querySelector('.gallery-wrapper');
        carousel = galleryWrapper?.querySelector('.carousel');
        images = carousel ? Array.from(carousel.querySelectorAll('.carousel-image')) : [];
        prevBtn = galleryWrapper?.querySelector('.carousel-btn-prev');
        nextBtn = galleryWrapper?.querySelector('.carousel-btn-next');
        paginationContainer = galleryWrapper?.querySelector('.carousel-pagination');

        if (!galleryWrapper || !carousel || images.length === 0) {
            console.error('Gallery elements not found');
            console.log('galleryWrapper:', galleryWrapper);
            console.log('carousel:', carousel);
            console.log('images length:', images.length);
            return;
        }

        console.log('Gallery found with', images.length, 'images');

        // Calculate angle step based on number of images
        angleStep = 360 / images.length;
        console.log('Angle step:', angleStep);
        
        // Position images in 3D space
        positionImages();

        // Create pagination dots
        createPaginationDots();

        // Set initial positions
        updateGallery();

        // Start auto-rotation immediately
        startAutoRotation();

        // Bind event listeners
        bindEventListeners();

        // Mark gallery as initialized
        galleryWrapper.classList.add('gallery-initialized');
        
        console.log('Gallery initialized successfully');
    }

    /**
     * Position Images in 3D Space
     */
    function positionImages() {
        images.forEach((image, index) => {
            const angle = index * angleStep;
            // Position each image in a circle
            image.style.transform = `rotateY(${angle}deg) translateZ(var(--radius))`;
        });
    }

    /**
     * Create Pagination Dots
     */
    function createPaginationDots() {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';
        
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            dot.setAttribute('aria-label', `Go to image ${index + 1}`);
            dot.dataset.index = index;
            dot.type = 'button';
            
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dot clicked:', index);
                goToSlide(index);
            });
            
            paginationContainer.appendChild(dot);
        });

        updatePaginationDots();
    }

    /**
     * Update Pagination Dots
     */
    function updatePaginationDots() {
        const dots = paginationContainer?.querySelectorAll('.pagination-dot') || [];
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    /**
     * Update Gallery - Apply carousel rotation and highlight center image
     */
    function updateGallery() {
        // Update carousel rotation
        carousel.style.transform = `rotateY(${rotationAngle}deg)`;

        // Calculate which image should be in center
        const normalizedRotation = ((rotationAngle % 360) + 360) % 360;
        const centerIndex = Math.round(normalizedRotation / angleStep) % images.length;
        
        // Update all images
        images.forEach((image, index) => {
            // Calculate the position relative to current rotation
            const imageAngle = (index * angleStep + rotationAngle) % 360;
            const normalizedImageAngle = (imageAngle + 360) % 360;
            
            // Check if this is the center image (within 15 degrees tolerance)
            const isCenter = normalizedImageAngle <= 15 || normalizedImageAngle >= 345;
            
            if (isCenter) {
                image.classList.add('center');
                image.style.opacity = '1';
            } else {
                image.classList.remove('center');
                image.style.opacity = '0.7';
            }
        });

        // Update pagination dots
        updatePaginationDots();
    }

    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        if (isAnimating) return;
        if (index === currentIndex) return;

        // Calculate target rotation
        const targetAngle = -(index * angleStep);
        
        // Adjust rotation angle to avoid large jumps
        const currentRotationMod = rotationAngle % 360;
        let angleDiff = targetAngle - currentRotationMod;
        
        // Find shortest rotation direction
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        // Update rotation angle
        rotationAngle += angleDiff;
        currentIndex = index;

        console.log('Going to slide:', index, 'Rotation angle:', rotationAngle);

        // Update gallery
        isAnimating = true;
        updateGallery();

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, config.transitionDuration);

        // Restart auto-rotation to maintain continuous rotation
        restartAutoRotation();
    }

    /**
     * Rotate to next slide
     */
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % images.length;
        console.log('Next slide:', nextIndex);
        goToSlide(nextIndex);
    }

    /**
     * Rotate to previous slide
     */
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        console.log('Prev slide:', prevIndex);
        goToSlide(prevIndex);
    }

    /**
     * Start Auto-Rotation
     */
    function startAutoRotation() {
        console.log('Starting auto-rotation');
        
        // Clear any existing timer
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }

        // Start new timer using setInterval for reliable continuous rotation
        autoRotateTimer = setInterval(() => {
            console.log('Auto-rotating...');
            nextSlide();
        }, config.rotationSpeed);
    }

    /**
     * Stop Auto-Rotation
     */
    function stopAutoRotation() {
        console.log('Stopping auto-rotation');
        
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }
    }

    /**
     * Restart Auto-Rotation
     */
    function restartAutoRotation() {
        console.log('Restarting auto-rotation');
        stopAutoRotation();
        startAutoRotation();
    }

    /**
     * Bind Event Listeners
     */
    function bindEventListeners() {
        console.log('Binding event listeners...');

        // Previous/Next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Prev button clicked');
                prevSlide();
            });
            console.log('Prev button listener added');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                nextSlide();
            });
            console.log('Next button listener added');
        }

        // Image click - go to clicked image
        images.forEach((image, index) => {
            image.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Image clicked:', index);
                goToSlide(index);
            });
        });
        console.log('Image click listeners added');

        // Keyboard navigation
        if (config.enableKeyboard) {
            galleryWrapper.addEventListener('keydown', (e) => {
                console.log('Key pressed:', e.key);
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        prevSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        goToSlide(images.length - 1);
                        break;
                }
            });
            console.log('Keyboard listeners added');
        }

        // Touch/Swipe support
        if (config.enableTouch && 'ontouchstart' in window) {
            galleryWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                console.log('Touch start:', touchStartX);
            }, { passive: true });

            galleryWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                console.log('Touch end:', touchEndX);
                handleSwipe();
            }, { passive: true });
            console.log('Touch listeners added');
        }

        // Prevent drag on images
        images.forEach(image => {
            image.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });
    }

    /**
     * Handle Touch Swipe
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        console.log('Swipe diff:', diff);

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go to next
                console.log('Swipe left detected');
                nextSlide();
            } else {
                // Swipe right - go to previous
                console.log('Swipe right detected');
                prevSlide();
            }
        }
    }

    /**
     * Cleanup function
     */
    function cleanup() {
        console.log('Cleaning up...');
        stopAutoRotation();
    }

    // Initialize gallery when DOM is ready
    if (document.readyState === 'loading') {
        console.log('DOM loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        console.log('DOM already loaded, initializing immediately');
        initGallery();
    }

    // Also initialize on window load to ensure all assets are loaded
    window.addEventListener('load', () => {
        console.log('Window loaded, ensuring gallery is initialized');
        setTimeout(() => {
            if (!galleryWrapper || !galleryWrapper.classList.contains('gallery-initialized')) {
                console.log('Gallery not initialized, initializing now');
                initGallery();
            }
        }, 100);
    });

    // Expose cleanup function (for potential module usage)
    window.galleryCleanup = cleanup;
    
    // Expose initGallery for manual initialization
    window.initGallery = initGallery;

    console.log('Gallery script loaded');

})();