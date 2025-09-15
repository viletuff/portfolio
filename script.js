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