// Counter Animation Function
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Intersection Observer for scroll trigger
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');

            // Get all stat numbers
            const statNumbers = entry.target.querySelectorAll('.stat-number-brown');

            // Animate each counter
            statNumbers.forEach((stat) => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target, 2000); // 2 seconds duration
            });

            // Unobserve after animation starts
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% of section is visible
});

// Start observing the stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section-brown');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});