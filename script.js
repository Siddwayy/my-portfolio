document.addEventListener('DOMContentLoaded', function() {
    const phoneElement = document.getElementById('phone-number');

    if (phoneElement) {
        phoneElement.addEventListener('click', function(event) {
            // Prevent the link's default behavior (jumping to the top of the page)
            event.preventDefault();

            const phoneNumber = this.innerText;
            
            // Use the modern Clipboard API to copy the text
            navigator.clipboard.writeText(phoneNumber).then(() => {
                // Provide feedback to the user that the text was copied
                const originalText = this.innerText;
                this.innerText = 'Copied!';
                this.style.color = '#FFA500'; // Make feedback stand out

                // Change the text back after 2 seconds
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.color = ''; // Revert to original color
                }, 2000);

            }).catch(err => {
                console.error('Failed to copy phone number: ', err);
                // Fallback for older browsers or if something goes wrong
                alert('Could not copy number. Please copy it manually.');
            });
        });
    }
});