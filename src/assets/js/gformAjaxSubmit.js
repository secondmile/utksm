console.log('BIKI: script loaded');

function setupAjaxFormSubmission(formSelector, customQuerySelector, successMessage) {
    const forms = document.querySelectorAll(formSelector);

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            console.log('BIKI: Form submit event triggered'); // Debug log
            event.preventDefault(); // Prevent the default form submission

            // Perform the AJAX submission
            console.log('BIKI: Initiating AJAX submission'); // Debug log
            const formData = new FormData(form);
            const xhr = new XMLHttpRequest();
            xhr.open(form.method, form.action, true);

            xhr.onload = function() {
                console.log('BIKI: AJAX request completed'); // Debug log
                if (xhr.status >= 200 && xhr.status < 400) {
                    // Apply fade-out effect to form
                    form.style.transition = 'opacity 0.5s';
                    form.style.opacity = 0;
                    setTimeout(() => {
                        form.style.display = 'none';
                        // Create and display the success message
                        const successDiv = document.createElement('div');
                        successDiv.innerHTML = successMessage;
                        successDiv.style.opacity = 0;
                        successDiv.style.transition = 'opacity 0.5s';
                        form.parentNode.insertBefore(successDiv, form.nextSibling);
                        setTimeout(() => {
                            successDiv.style.opacity = 1;
                            // Trigger the custom query block if present
                            const customQuery = document.querySelector(customQuerySelector);
                            if (customQuery) {
                                // Execute your custom query block logic here
                                console.log(`BIKI: Custom query block found: ${customQuery}`); // Debug log
                                executeCustomQueryBlock(customQuery);
                            }
                        }, 100);
                    }, 500);
                } else {
                    console.error('BIKI: Request error:', xhr.statusText);
                    // Provide user feedback for error
                    alert('An error occurred. Please try again later.');
                }
            };
            

            xhr.onerror = function() {
                console.error('BIKI: Request error:', xhr.statusText);
                // Provide user feedback for error
                alert('An error occurred. Please try again later.');
            };

            xhr.send(formData);
        });
    });
}

function executeCustomQueryBlock(customQueryBlock) {
    // Fetch the shortcode output from the API endpoint
    fetch('/wp-json/custom-query/v1/counselor-search')
        .then(response => response.json())
        .then(data => {
            const shortcodeOutput = data.output;
            // Insert the shortcode output into the customQueryBlock
            customQueryBlock.innerHTML = shortcodeOutput;
        })
        .catch(error => {
            console.error('Error fetching shortcode output:', error);
        });
}

// Usage: Call the function with appropriate selectors and success message
setupAjaxFormSubmission('.smm-gform__counselor', '.counselor-query-results', '<p>Form submitted successfully!</p>');
// Add more calls for other forms as needed
setupAjaxFormSubmission('.another-form-class', '.another-custom-query-block-selector', '<p>Form submitted successfully!</p>');
