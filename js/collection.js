document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.angel-services-carousel');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const items = document.querySelectorAll('.angel-service-item');

    let currentIndex = 0;
    let slidesToShow = 3;

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

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Initialize responsive behavior
    window.addEventListener('resize', function () {
        updateSlidesToShow();
        // Reset position if needed
        if (currentIndex > items.length - slidesToShow) {
            currentIndex = items.length - slidesToShow;
        }
        updateCarousel();
    });

    // Initial setup
    updateSlidesToShow();
    updateCarousel();
});