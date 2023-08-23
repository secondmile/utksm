console.log('BIKI: script loaded');

function setupAjaxFormSubmission(formSelector, customQuerySelector, successMessage) {
    const forms = document.querySelectorAll(formSelector);

    forms.forEach(form => {
        form.addEventListener('submit', async function(event) {
            console.log('BIKI: Form submit event triggered');
            event.preventDefault();

            const formData = new FormData(form);

            // Capture the selected options from the form fields
            const specialization = formData.get('input_6');  // Replace with the actual field ID
            const state = formData.get('input_8');           // Replace with the actual field ID
            const country = formData.get('input_9');         // Replace with the actual field ID

            // Construct the data to send to the API
            const requestData = new FormData();
            requestData.append('specialization', specialization);
            requestData.append('state', state);
            requestData.append('country', country);

            try {
                // Make an AJAX request to your server with the form data
                const response = await fetch('/wp-json/counselor-api/v1/data', {
                    method: 'POST',
                    body: requestData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Received data from server:', data);

                    const customQuery = document.querySelector(customQuerySelector);
                    if (customQuery) {
                        console.log(`BIKI: Custom query block found: ${customQuery}`);
                        executeCustomQueryBlock(customQuery, data);
                    }
                } else {
                    console.error('Error submitting form:', response.statusText);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        });
    });
}

function executeCustomQueryBlock(customQueryBlock, formData) {
    // Extract data from formData and build the api_url
    const specialization = formData.specialization;
    const state = formData.state;
    const country = formData.country;
    
    const api_url = `/wp-json/wp/v2/counselor?counselor_specialization=${specialization}&counselor_states=${state}&counselor-countries=${country}`;
    
    // Fetch the counselor data with the updated URL
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response Data:', data);
            
            // Build the HTML output using the counselor data
            let outputHtml = '';
            data.forEach(counselor => {
                outputHtml += `<h2>${counselor.title.rendered}</h2>`;
                outputHtml += `<p>Countries: ${counselor['counselor-countries']}</p>`;
                outputHtml += `<p>Specialization: ${counselor['counselor-specialization']}</p>`;
                outputHtml += `<p>States: ${counselor['counselor-states']}</p>`;
                // Add more fields as needed
            });

            customQueryBlock.innerHTML = outputHtml;
        })
        .catch(error => {
            console.error('Error fetching counselor data:', error);
        });
}

// Usage: Call the function with appropriate selectors and success message
setupAjaxFormSubmission('.smm-gform__counselor', '.counselor-query-results', '<p>Successful button press!</p>');
