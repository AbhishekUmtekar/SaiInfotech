document.addEventListener('DOMContentLoaded', function () {
    // Get the form element
    const form = document.getElementById('contact-form');

    // Add submit event listener
    form.addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get form values
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const company = form.querySelector('input[name="company"]').value;
        const message = form.querySelector('textarea[name="message"]').value;

        // Prepare template parameters
        const templateParams = {
            name: name,
            email: email,
            phone: phone,
            company: company,
            message: message,
            time: new Date().toLocaleString()
        };

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Send the email using EmailJS
        emailjs.send('service_8875', 'template_ksjdmq9', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // Show success message
                document.getElementById('success-message').style.display = 'block';

                // Reset the form
                form.reset();

                // Hide the success message after some time
                setTimeout(function () {
                    document.getElementById('success-message').style.display = 'none';
                }, 5000); // Hide after 5 seconds
            })
            .catch(function (error) {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            })
            .finally(function () {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });
});