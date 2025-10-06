// public/contact.js - Updated for Node.js backend
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector('.submit-button');
    const buttonText = document.querySelector('.button-text');
    const buttonLoader = document.querySelector('.button-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Hide any existing messages
            hideMessages();

            // Show loading state
            showLoading(true);

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Send to Node.js server
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                showLoading(false);

                if (result.success) {
                    showSuccessMessage(result.message);
                    contactForm.reset();
                } else {
                    showErrorMessage(result.message || 'There was an error sending your message. Please try again.');
                }

            } catch (error) {
                console.error('Error:', error);
                showLoading(false);
                showErrorMessage('There was an error sending your message. Please try again.');
            }
        });
    }

    function showLoading(isLoading) {
        if (isLoading) {
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'flex';
            submitButton.disabled = true;
        } else {
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
            submitButton.disabled = false;
        }
    }

    function showSuccessMessage(message) {
        successMessage.querySelector('span').textContent = message;
        successMessage.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage(successMessage);
        }, 5000);
    }

    function showErrorMessage(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage(errorMessage);
        }, 5000);
    }

    function hideMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }

    function hideMessage(messageElement) {
        messageElement.classList.add('message-fade-out');
        setTimeout(() => {
            messageElement.style.display = 'none';
            messageElement.classList.remove('message-fade-out');
        }, 500);
    }
});