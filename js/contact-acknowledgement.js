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

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoader = submitButton.querySelector('.button-loader');

        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
        submitButton.disabled = true;

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            console.log('Sending form data...');
            console.log('Form data:', formData);

            // Use relative URL - works on any domain
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
                // Show success message
                successMessage.style.display = 'block';
                successMessage.querySelector('span').textContent = result.message;

                // Reset form
                form.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);

            // Show error message
            errorMessage.style.display = 'block';
            errorMessage.querySelector('span').textContent =
                error.message || 'There was an error sending your message. Please try again.';

            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        } finally {
            // Restore button state
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
            submitButton.disabled = false;
        }
    });
});