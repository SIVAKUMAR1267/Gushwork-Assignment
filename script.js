document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Sticky Header Logic
       ========================================= */
    let lastScrollTop = 0;
    const mainHeader = document.getElementById('main-header');

    if (mainHeader) {
        window.addEventListener('scroll', () => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > 100) {
                // Scrolling Down - Hide Header
                mainHeader.classList.add('header-hidden');
            } else {
                // Scrolling Up - Show Header
                mainHeader.classList.remove('header-hidden');
            }
            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, false);
    }

    /* =========================================
       2. Hero Image Carousel & Controlled Zoom
       ========================================= */
    const mainImg = document.getElementById('hero-main-img');
    const imageWrapper = document.querySelector('.main-image-wrapper');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const thumbs = document.querySelectorAll('.thumbnail-track .thumb');
    
    // Only run if the carousel elements exist on the page
    if (mainImg && imageWrapper && thumbs.length > 0) {
        let currentIndex = 0;

        const updateCarousel = (index) => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[index].classList.add('active');
            
            const thumbImgSrc = thumbs[index].querySelector('img').src;
            // Adjust the URL to grab the high-res version
            const highResSrc = thumbImgSrc.replace('&w=150', '&w=800'); 
            
            mainImg.style.opacity = 0.5; 
            setTimeout(() => {
                mainImg.src = highResSrc;
                mainImg.style.opacity = 1;
            }, 150);
        };

        // Initialize Carousel
        updateCarousel(0);

        // Thumb Click Listeners
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel(currentIndex);
            });
        });

        // Navigation Arrows
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : thumbs.length - 1;
                updateCarousel(currentIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < thumbs.length - 1) ? currentIndex + 1 : 0;
                updateCarousel(currentIndex);
            });
        }

        // Controlled Mouse-Tracking Zoom Logic
        imageWrapper.addEventListener('mousemove', (e) => {
            const rect = imageWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });

        imageWrapper.addEventListener('mouseleave', () => {
            mainImg.style.transformOrigin = 'center center';
        });
    }

    /* =========================================
       3. FAQ Accordion
       ========================================= */
    const faqBoxes = document.querySelectorAll('.faq-box');

    faqBoxes.forEach(box => {
        const trigger = box.querySelector('.faq-trigger'); 
        
        if (trigger) {
            trigger.addEventListener('click', () => {
                // Close other open boxes
                faqBoxes.forEach(item => {
                    if (item !== box) {
                        item.classList.remove('active');
                        const itemContent = item.querySelector('.faq-content');
                        if (itemContent) itemContent.style.maxHeight = null;
                        item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current box
                box.classList.toggle('active');
                const content = box.querySelector('.faq-content');
                
                if (box.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    trigger.setAttribute('aria-expanded', 'true');
                } else {
                    content.style.maxHeight = null;
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    /* =========================================
       4. Applications Horizontal Slider
       ========================================= */
    const slider = document.querySelector('.horizontal-slider');
    const sliderPrev = document.querySelector('.slider-controls .prev');
    const sliderNext = document.querySelector('.slider-controls .next');

    if (slider && sliderPrev && sliderNext) {
        const scrollAmount = 374; // Width of card (350) + gap (24)

        sliderPrev.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        sliderNext.addEventListener('click', () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* =========================================
       5. Manufacturing Process Tabs
       ========================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Add active class to clicked
                btn.classList.add('active');
                
                // Activate target pane
                const targetId = btn.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    /* =========================================
       6. Global Modal Functionality
       ========================================= */
    
    // A reusable function to handle any modal on the site
    const setupModal = (modalId, openBtnSelector, closeBtnId) => {
        const modal = document.getElementById(modalId);
        const openBtns = document.querySelectorAll(openBtnSelector);
        const closeBtn = document.getElementById(closeBtnId);

        if (!modal) return;

        const openModal = () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            // Only restore scrolling if no other modals are currently open
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.style.overflow = ''; 
            }
        };

        // Attach click events to all buttons that should open this modal
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
        
        // Attach close events
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Close when clicking outside the modal content box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    };

    // Initialize both Modals using the helper function
    setupModal('contact-modal', '.open-contact-modal', 'close-modal');
    setupModal('download-modal', '#download-sheet-btn', 'close-download-modal');

    /* =========================================
       7. Mobile Navigation Toggle
       ========================================= */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    // SVG Icons for clean toggling
    const iconMenu = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    const iconClose = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = iconClose;
                document.body.style.overflow = 'hidden'; // Stop scrolling behind menu
            } else {
                mobileMenuToggle.innerHTML = iconMenu;
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

});