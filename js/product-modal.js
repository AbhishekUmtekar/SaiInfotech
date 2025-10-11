function openModal(element) {
    let productTitle;

    if (element.classList && element.classList.contains('lumi-product-title')) {
        productTitle = element;
    } else {
        productTitle = element.closest('.lumi-card-overlay').querySelector('.lumi-product-title');
    }

    if (!productTitle) return;

    const productCategory = productTitle.getAttribute('data-product-category');
    const productTitleText = productTitle.getAttribute('data-product-title');
    const productDescription = productTitle.getAttribute('data-product-description');
    const productSpecs = JSON.parse(productTitle.getAttribute('data-product-specs'));

    // Get card image that's ALREADY displaying
    const cardImg = productTitle.closest('.lumi-expanding-card').querySelector('img');

    document.getElementById('modalTitle').textContent = productTitleText;
    document.getElementById('modalCategory').textContent = productCategory;
    document.getElementById('modalDescription').textContent = productDescription;

    // Copy the exact image element
    const modalImageContainer = document.getElementById('modalImage').parentElement;
    const oldImg = document.getElementById('modalImage');
    const newImg = cardImg.cloneNode(true);
    newImg.id = 'modalImage';
    newImg.className = 'lumi-modal-image';
    modalImageContainer.replaceChild(newImg, oldImg);

    const tableBody = document.getElementById('specificationsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    for (let i = 0; i < productSpecs.length; i += 2) {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = productSpecs[i].label;
        cell2.textContent = productSpecs[i].value;

        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        if (productSpecs[i + 1]) {
            cell3.textContent = productSpecs[i + 1].label;
            cell4.textContent = productSpecs[i + 1].value;
        } else {
            cell3.textContent = '';
            cell4.textContent = '';
        }
    }

    document.getElementById('productModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('productModal').classList.add('active');
    }, 10);
}

// Function to close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    setTimeout(() => {
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }, 300);
}

// Function to handle "Show More" button clicks
function handleShowMore(button) {
    // Prevent event bubbling to avoid triggering card click
    event.stopPropagation();

    // Open modal
    openModal(button);
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {

    // Make product cards clickable
    const cards = document.querySelectorAll('.lumi-expanding-card');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't open modal if "Show More" button was clicked
            if (e.target.classList.contains('lumi-show-more-btn')) {
                return;
            }

            // Open modal
            const productTitle = this.querySelector('.lumi-product-title');
            if (productTitle) {
                openModal(productTitle);
            }
        });
    });

    // Make product titles clickable
    const productTitles = document.querySelectorAll('.lumi-product-title');
    productTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function (e) {
            e.stopPropagation();
            openModal(this);
        });
    });

    // Handle "Show More" buttons
    const showMoreButtons = document.querySelectorAll('.lumi-show-more-btn');
    showMoreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            handleShowMore(this);
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.getElementById('productModal').classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContainer = document.querySelector('.lumi-modal-container');
    if (modalContainer) {
        modalContainer.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

});

// Contact Form Handling (if you have a contact form)
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                message: formData.get('message'),
                recaptchaResponse: grecaptcha.getResponse()
            };

            // Validate required fields
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate reCAPTCHA
            if (!data.recaptchaResponse) {
                alert('Please complete the reCAPTCHA verification.');
                return;
            }

            try {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Send email
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                    grecaptcha.reset();
                } else {
                    alert('Sorry, there was an error sending your message. Please try again.');
                }

                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;

            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again.');

                // Reset button state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            }
        });
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        img.addEventListener('error', function () {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
    });
});

// Utility function to debounce events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(function () {
    // Adjust modal positioning if needed
    const modal = document.getElementById('productModal');
    if (modal && modal.classList.contains('active')) {
        // Reposition modal if necessary
        const modalContainer = modal.querySelector('.lumi-modal-container');
        if (modalContainer) {
            modalContainer.style.maxHeight = '90vh';
        }
    }
}, 250));

// Initialize any tooltips or popovers (if using Bootstrap)
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap tooltips if present
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});