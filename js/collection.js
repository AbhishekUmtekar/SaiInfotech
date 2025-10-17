document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.angel-services-carousel');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const items = document.querySelectorAll('.angel-service-item');

    if (!carousel || !items.length) return;

    let currentIndex = 0;
    let slidesToShow = 3;

    // Touch/Swipe variables
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let startTime = 0;
    let hasMoved = false; // Track if user actually moved

    // Update slideToShow based on screen size
    function updateSlidesToShow() {
        if (window.innerWidth <= 768) {
            slidesToShow = 1;
        } else if (window.innerWidth <= 992) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
    }

    function updateCarousel() {
        const itemWidth = items[0].offsetWidth + 25; // width + gap
        carousel.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

        // Update button states
        updateButtonStates();
    }

    // Update button states based on current position
    function updateButtonStates() {
        // Disable prev button when at the beginning
        if (currentIndex <= 0) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }

        // Disable next button when at the end
        if (currentIndex >= items.length - slidesToShow) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    }

    function nextSlide() {
        if (currentIndex < items.length - slidesToShow) {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Touch/Swipe functionality
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        // Don't prevent default on links and buttons
        if (event.target.closest('a') || event.target.closest('button')) {
            return;
        }

        isDragging = true;
        startPos = getPositionX(event);
        startTime = Date.now();
        hasMoved = false;
        animationID = requestAnimationFrame(animation);
        carousel.style.transition = 'none';
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startPos;

            // Only start moving if moved more than 5px (prevents accidental drags)
            if (Math.abs(diff) > 5) {
                hasMoved = true;
                currentTranslate = prevTranslate + diff;

                // Prevent default only when actually moving
                if (event.cancelable) {
                    event.preventDefault();
                }

                carousel.classList.add('dragging');
            }
        }
    }

    function touchEnd(event) {
        if (!isDragging) return;

        isDragging = false;
        cancelAnimationFrame(animationID);
        carousel.classList.remove('dragging');

        const movedBy = currentTranslate - prevTranslate;
        const timeTaken = Date.now() - startTime;

        // Only change slide if user actually dragged (moved more than 5px)
        if (hasMoved && Math.abs(movedBy) > 50) {
            // Swipe threshold - if moved more than 50px
            if (movedBy < -50 && currentIndex < items.length - slidesToShow) {
                nextSlide();
            }

            if (movedBy > 50 && currentIndex > 0) {
                prevSlide();
            }
        }

        setPositionByIndex();
        carousel.style.transition = 'transform 0.5s ease';

        // Reset
        hasMoved = false;
    }

    function animation() {
        if (isDragging) {
            setSliderPosition();
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        const itemWidth = items[0].offsetWidth + 25;
        currentTranslate = -currentIndex * itemWidth;
        prevTranslate = currentTranslate;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Event listeners for buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Touch event listeners (for mobile)
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchmove', touchMove, { passive: false });
    carousel.addEventListener('touchend', touchEnd, { passive: true });

    // Mouse event listeners (for desktop - optional, for testing)
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            touchEnd();
        }
    });

    // Prevent context menu on long press only when dragging
    carousel.addEventListener('contextmenu', (e) => {
        if (hasMoved) {
            e.preventDefault();
            return false;
        }
    });

    // Click event handler to prevent click if dragged
    items.forEach(item => {
        const links = item.querySelectorAll('a');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                // Prevent click if user was dragging
                if (hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            // Prevent default drag behavior
            link.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Prevent image dragging
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        }
    });

    // Initialize responsive behavior
    window.addEventListener('resize', function () {
        updateSlidesToShow();
        // Reset position if needed
        if (currentIndex > items.length - slidesToShow) {
            currentIndex = items.length - slidesToShow;
        }
        // Update prevTranslate for swipe
        const itemWidth = items[0].offsetWidth + 25;
        prevTranslate = -currentIndex * itemWidth;
        currentTranslate = prevTranslate;
        updateCarousel();
    });

    // Initial setup
    updateSlidesToShow();
    updateCarousel();

    // Set initial translate values
    const itemWidth = items[0].offsetWidth + 25;
    prevTranslate = -currentIndex * itemWidth;
    currentTranslate = prevTranslate;
});