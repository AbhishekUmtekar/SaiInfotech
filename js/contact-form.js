document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            // Get form values
            const name = document.querySelector('input[name="name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const phone = document.querySelector('input[name="phone"]').value;
            const company = document.querySelector('input[name="company"]').value;
            const message = document.querySelector('textarea[name="message"]').value;

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
            const submitButton = document.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Send the email using EmailJS
            emailjs.send('service_8875', 'template_ksjdmq9', templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Your message has been sent successfully!');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.log('FAILED...', error);
                    alert('Failed to send message: ' + error.text);
                })
                .finally(function () {
                    // Restore button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    } else {
        console.error('Contact form not found on page');
    }
});