// This function runs when the HTML document has finished loading.
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Load Header and Footer ---
    // This function fetches the content of an HTML file and places it into a target element.
    const loadHTML = (url, elementId) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error loading HTML:', error));
    };

    // Load the header into the div with id="header-placeholder"
    loadHTML('header.html', 'header-placeholder');
    // Load the footer into the div with id="footer-placeholder"
    loadHTML('footer.html', 'footer-placeholder');


    // --- 2. Header Scroll Animation ---
    // We need to wait a moment for the header to be loaded before we can add the scroll listener.
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
    }, 100); // 100ms delay is usually enough
});


//Carosell
  const carousel = document.querySelector('.carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        
        if (slides.length > 1) { // Only run if there's more than one slide
            // --- Setup for Infinite Loop ---
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);

            firstClone.setAttribute('aria-hidden', true);
            lastClone.setAttribute('aria-hidden', true);

            track.appendChild(firstClone);
            track.prepend(lastClone);

            const allSlides = Array.from(track.children);
            let slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 1; // Start on the first "real" slide
            let isAnimating = false;

            // Function to set the initial position without animation
            const setInitialPosition = () => {
                track.style.transition = 'none';
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            };
            
            setInitialPosition();

            // --- Movement Functions ---
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

            // --- The "Magic" Jump ---
            // This function checks if we're on a cloned slide and jumps to the real one.
            track.addEventListener('transitionend', () => {
                isAnimating = false; // Animation is complete
                
                // If we've moved to the cloned first slide (at the end)
                if (currentIndex === allSlides.length - 1) {
                    currentIndex = 1;
                    setInitialPosition();
                }
                // If we've moved to the cloned last slide (at the beginning)
                if (currentIndex === 0) {
                    currentIndex = allSlides.length - 2;
                    setInitialPosition();
                }
            });

            // --- Autoplay and Event Listeners ---
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

            // --- Responsive Handling ---
            window.addEventListener('resize', () => {
                slideWidth = slides[0].getBoundingClientRect().width;
                setInitialPosition();
            });
        }
    }

 /* ==========================================================================
   LIGHTBOX FUNCTIONALITY (WITH CLOSE BUTTON)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the modal HTML (Now includes the close button)
    const modal = document.createElement('div');
    modal.classList.add('lightbox-modal');
    modal.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="Zoomed View">
            <div class="lightbox-text">
                <h2 class="lightbox-title"></h2>
                <p class="lightbox-story"></p>
            </div>
        </div>`;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('.lightbox-image');
    const modalTitle = modal.querySelector('.lightbox-title');
    const modalStory = modal.querySelector('.lightbox-story');
    const modalTextContainer = modal.querySelector('.lightbox-text');
    const closeBtn = modal.querySelector('.close-btn');

    // 2. Open Modal
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.gallery img, .carousel-slide img')) {
            e.preventDefault();
            
            modalImg.src = e.target.src; 
            
            const title = e.target.getAttribute('data-title');
            const story = e.target.getAttribute('data-story');

            modalTitle.textContent = title || ""; 
            modalStory.textContent = story || "";

            if (!title && !story) {
                modalTextContainer.style.display = 'none';
            } else {
                modalTextContainer.style.display = 'block';
            }

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    });

    // 3. Close Function
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    // Close on "X" button click
    closeBtn.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        // If the user clicks the dark background (modal) directly
        if (e.target === modal) {
            closeModal();
        }
    });
});