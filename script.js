document.addEventListener('DOMContentLoaded', () => {

/* =========================================
   1. Sticky Header Logic (Fixed Naming & Nesting)
   ========================================= */
let lastScrollTop = 0;
const mainHeader = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scrolling Down - Hide Header
        mainHeader.classList.add('header-hidden');
        console.log("Scrolling Down - Hiding");
    } else {
        // Scrolling Up - Show Header
        mainHeader.classList.remove('header-hidden');
        console.log("Scrolling Up - Showing");
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);
/* =========================================
       2. Hero Image Carousel & Controlled Zoom
       ========================================= */
    const mainImg = document.getElementById('hero-main-img');
    const imageWrapper = document.querySelector('.main-image-wrapper');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const thumbs = document.querySelectorAll('.thumbnail-track .thumb');
    
    let currentIndex = 0;

    function updateCarousel(index) {
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
    }

    // Explicitly load Thumb 1 as soon as the script runs
    updateCarousel(0);

    // --- Thumb & Button Click Listeners ---
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });

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

    // --- Controlled Mouse-Tracking Zoom Logic ---
    imageWrapper.addEventListener('mousemove', (e) => {
        // Get the exact dimensions and position of the image wrapper
        const rect = imageWrapper.getBoundingClientRect();
        
        // Calculate where the mouse is relative to the wrapper
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        // Convert those coordinates into percentages
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        // Move the center of the zoom to match the mouse cursor
        mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });

    // Reset the zoom focus to the center when the mouse leaves
    imageWrapper.addEventListener('mouseleave', () => {
        mainImg.style.transformOrigin = 'center center';
    });
    /* =========================================
       3. FAQ Accordion
       ========================================= */
    const faqBoxes = document.querySelectorAll('.faq-box');

    faqBoxes.forEach(box => {
        // Changed to .faq-trigger to match your current HTML
        const trigger = box.querySelector('.faq-trigger'); 
        
        if (trigger) {
            trigger.addEventListener('click', () => {
                // Close other open boxes first
                faqBoxes.forEach(item => {
                    if (item !== box) {
                        item.classList.remove('active');
                        item.querySelector('.faq-content').style.maxHeight = null;
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

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            
            // Find the target pane and activate it
            const targetId = btn.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* =========================================
       6. Modal Functionality
       ========================================= */
    const modal = document.getElementById('contact-modal');
    // Select ALL buttons that have the 'open-contact-modal' class
    const openBtns = document.querySelectorAll('.open-contact-modal'); 
    const closeBtn = document.getElementById('close-modal');

    if (modal) {
        const openModal = () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        };

        // Loop through all trigger buttons and attach the click event
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent jump if it's an anchor tag
                openModal();
            });
        });
        
        // Attach close functionality
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close when clicking outside the modal content box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    // --- Download Modal Logic ---
    const downloadModal = document.getElementById('download-modal');
    const downloadBtn = document.getElementById('download-sheet-btn'); 
    const closeDownloadBtn = document.getElementById('close-download-modal');

    if (downloadModal) {
        const openDownload = () => {
            downloadModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        };

        const closeDownload = () => {
            downloadModal.classList.remove('active');
            // Only restore scrolling if the OTHER modal isn't also open
            if (!document.getElementById('contact-modal').classList.contains('active')) {
                document.body.style.overflow = ''; 
            }
        };

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openDownload();
            });
        }

        if (closeDownloadBtn) {
            closeDownloadBtn.addEventListener('click', closeDownload);
        }

        // Close when clicking outside
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) closeDownload();
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
                closeDownload();
            }
        });
    }
});
/* =========================================
       7. Mobile Navigation Toggle
       ========================================= */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            
            // Toggle hamburger icon to an "X" (Optional but good UX)
            if (mobileNav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                document.body.style.overflow = 'hidden'; // Stop scrolling behind menu
            } else {
                mobileMenuToggle.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }