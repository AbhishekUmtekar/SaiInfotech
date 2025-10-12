document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get form values
        const formData = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            phone: form.querySelector('input[name="phone"]').value,
            company: form.querySelector('input[name="company"]').value,
            message: form.querySelector('textarea[name="message"]').value
        };

        // Get button elements
        const submitButton = form.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');

        // Show loading state
        submitButton.classList.add('loading');
        buttonText.textContent = 'SENDING...';
        buttonLoader.style.display = 'inline-block';
        submitButton.disabled = true;

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            console.log('Sending form data...');

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok && result.success) {
                // Show success state
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                buttonText.textContent = '✓ SENT SUCCESSFULLY';
                buttonLoader.style.display = 'none';

                // Show success message
                successMessage.style.display = 'block';
                successMessage.querySelector('span').textContent = result.message;

                // Reset form
                form.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    buttonText.textContent = 'SEND MESSAGE';
                    submitButton.disabled = false;
                }, 3000);

                // Hide success message after 8 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 8000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);

            // Show error state
            submitButton.classList.remove('loading');
            submitButton.classList.add('error');
            buttonText.textContent = '✗ FAILED';
            buttonLoader.style.display = 'none';

            // Show error message
            errorMessage.style.display = 'block';
            errorMessage.querySelector('span').textContent =
                error.message || 'There was an error sending your message. Please try again.';

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.classList.remove('error');
                buttonText.textContent = 'SEND MESSAGE';
                submitButton.disabled = false;
            }, 3000);

            // Hide error message after 8 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 8000);
        }
    });
});