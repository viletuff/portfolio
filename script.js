// This function runs when the HTML document has finished loading.
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Load Header and Footer ---
    const loadHTML = (url, elementId) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error loading HTML:', error));
    };

    loadHTML('header.html', 'header-placeholder');
    loadHTML('footer.html', 'footer-placeholder');

    // --- 2. Header Scroll Animation ---
    setTimeout(() => {
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 1) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }, 100);
});

// --- Carousel Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        
        if (slides.length > 1) {
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);

            firstClone.setAttribute('aria-hidden', true);
            lastClone.setAttribute('aria-hidden', true);

            track.appendChild(firstClone);
            track.prepend(lastClone);

            const allSlides = Array.from(track.children);
            let slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 1;
            let isAnimating = false;

            const setInitialPosition = () => {
                track.style.transition = 'none';
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            };
            
            // Wait for images to load to get correct width
            if(slides[0].querySelector('img').complete) {
                setInitialPosition();
            } else {
                slides[0].querySelector('img').onload = setInitialPosition;
            }

            const moveToNext = () => {
                if (isAnimating) return;
                isAnimating = true;
                currentIndex++;
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            };

            const moveToPrev = () => {
                if (isAnimating) return;
                isAnimating = true;
                currentIndex--;
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            };

            track.addEventListener('transitionend', () => {
                isAnimating = false;
                if (currentIndex === allSlides.length - 1) {
                    currentIndex = 1;
                    setInitialPosition();
                }
                if (currentIndex === 0) {
                    currentIndex = allSlides.length - 2;
                    setInitialPosition();
                }
            });

            let autoPlay = setInterval(moveToNext, 10000);

            const resetAutoPlay = () => {
                clearInterval(autoPlay);
                autoPlay = setInterval(moveToNext, 10000);
            };

            nextButton.addEventListener('click', () => {
                moveToNext();
                resetAutoPlay();
            });

            prevButton.addEventListener('click', () => {
                moveToPrev();
                resetAutoPlay();
            });

            window.addEventListener('resize', () => {
                slideWidth = slides[0].getBoundingClientRect().width;
                setInitialPosition();
            });
        }
    }
});

/* ==========================================================================
   LIGHTBOX FUNCTIONALITY (ADVANCED)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the modal HTML
    const modal = document.createElement('div');
    modal.classList.add('lightbox-modal');
    modal.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="lightbox-content">
            <div class="lightbox-image-container">
                <button class="lightbox-nav-btn lightbox-prev" style="display:none;">&#10094;</button>
                <img class="lightbox-image" src="" alt="Zoomed View">
                <button class="lightbox-nav-btn lightbox-next" style="display:none;">&#10095;</button>
            </div>
            <div class="lightbox-text">
                <span class="lightbox-counter"></span>
                <h2 class="lightbox-title"></h2>
                <p class="lightbox-story"></p>
            </div>
        </div>`;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.lightbox-image');
    const modalTitle = modal.querySelector('.lightbox-title');
    const modalStory = modal.querySelector('.lightbox-story');
    const modalCounter = modal.querySelector('.lightbox-counter');
    const modalTextContainer = modal.querySelector('.lightbox-text');
    const closeBtn = modal.querySelector('.close-btn');
    const prevBtn = modal.querySelector('.lightbox-prev');
    const nextBtn = modal.querySelector('.lightbox-next');

    let currentSet = [];
    let currentSetIndex = 0;

    // Helper to update the lightbox image when navigating a set
    const updateLightboxImage = () => {
        if (currentSet.length > 0) {
            modalImg.src = currentSet[currentSetIndex];
            
            // Show/Hide buttons based on set length
            const hasMultiple = currentSet.length > 1;
            prevBtn.style.display = hasMultiple ? 'flex' : 'none';
            nextBtn.style.display = hasMultiple ? 'flex' : 'none';

             // Update counter text
             if (hasMultiple) {
                modalCounter.textContent = `Image ${currentSetIndex + 1} of ${currentSet.length}`;
                modalCounter.style.display = 'block';
            } else {
                modalCounter.style.display = 'none';
            }
        }
    };

    // 2. Open Modal Logic
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.gallery img, .carousel-slide img')) {
            e.preventDefault();
            const triggerImg = e.target;
            
            // Get Metadata
            const title = triggerImg.getAttribute('data-title');
            const story = triggerImg.getAttribute('data-story');
            
            // 1. Check if this is a Multi-Image Set (Pipe Separated)
            const gallerySetAttr = triggerImg.getAttribute('data-gallery-set');
            
            if (gallerySetAttr) {
                // Split by '|' and trim whitespace
                currentSet = gallerySetAttr.split('|').map(url => url.trim()).filter(u => u.length > 0);
                currentSetIndex = 0; 
            } else {
                // 2. Single Image Logic
                // Check if there is a separate full-res version
                const fullRes = triggerImg.getAttribute('data-full-res');
                currentSet = [fullRes || triggerImg.src];
                currentSetIndex = 0;
            }

            // Update Text
            modalTitle.textContent = title || ""; 
            modalStory.textContent = story || "";
            // Show text box if there is text OR if there are multiple images (for the counter)
            modalTextContainer.style.display = (!title && !story && currentSet.length <= 1) ? 'none' : 'block';

            // Render Image
            updateLightboxImage();

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    });

    // Navigation Click Handlers
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing modal
        if (currentSet.length > 1) {
            currentSetIndex = (currentSetIndex - 1 + currentSet.length) % currentSet.length;
            updateLightboxImage();
        }
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing modal
        if (currentSet.length > 1) {
            currentSetIndex = (currentSetIndex + 1) % currentSet.length;
            updateLightboxImage();
        }
    });

    // 3. Close Function
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            currentSet = []; // Reset
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-content')) {
            closeModal();
        }
    });
});