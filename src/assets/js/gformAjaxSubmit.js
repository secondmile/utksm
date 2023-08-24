// console.log('BIKI: script loaded');

const selectedFilters = [];

function setupAjaxFormSubmission(formSelector, displaySelector) {
    const form = document.querySelector(formSelector);
    const display = document.querySelector(displaySelector);

    // Attach event listeners to each form field
    const specializationRadios = form.querySelectorAll('input[name="input_6"]');
    const stateField = form.querySelector('#input_3_8');
    const countryField = form.querySelector('#input_3_9');

    // Add event listeners to radio buttons within the specialization group
    specializationRadios.forEach(radio => {
        radio.addEventListener('click', () => {
            clearFields(stateField, countryField);
            captureAndDisplaySelections();
        });
    });

    stateField.addEventListener('change', captureAndDisplaySelections);
    countryField.addEventListener('change', captureAndDisplaySelections);

    // Interaction handler (capture selections, update results)
    function captureAndDisplaySelections() {
        // Capture the selected options from the form fields
        const selectedSpecialization = getSelectedRadio(specializationRadios);
        const selectedState = getSelectedOption(stateField);
        const selectedCountry = getSelectedOption(countryField);
    
        // Update the array with selected items
        selectedFilters.length = 0; // Clear the array
        if (selectedSpecialization) selectedFilters.push(selectedSpecialization);
        if (selectedState) selectedFilters.push(selectedState);
        if (selectedCountry) selectedFilters.push(selectedCountry);
    
        // Build the display content (DEBUG/TESTING, delete later)
        // const displayContent = `Specialization: ${selectedSpecialization ? selectedSpecialization.label : ''}<br>State: ${selectedState ? selectedState.label : ''}<br>Country: ${selectedCountry ? selectedCountry.label : ''}`;
    
        // Fetch the updated content for Query Loop block
        updateQueryLoopBlockContent(selectedFilters);

        // Apply fade effect to display the content
        // fadeOutAndIn(display, updatedQueryLoopContent);
    
        // Fetch and update the Query Loop block content
        // updateQueryLoopBlockContent(selectedFilters);
    
        // console.log(selectedFilters);
    }
    
    // Dropdown Selection handling
    function getSelectedOption(selectField) {
        const selectedOption = selectField.querySelector(`option[value="${selectField.value}"]`);
        const selectedLabel = selectedOption ? selectedOption.textContent : '';
    
        // console.log('Selected Label:', selectedLabel);
    
        if (selectedLabel && !selectedLabel.toLowerCase().startsWith('— select a')) {
            const parentFieldId = getParentFieldId(selectField);
            const extractedKey = getExtractedKeyFromClass(parentFieldId);
    
            return {
                label: extractedKey,
                value: selectField.value,
            };
        }
    
        return null;
    }
    
    // Radio selection handling
    function getSelectedRadio(radioButtons) {
        const selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
    
        if (selectedRadio) {
            const parentFieldId = getParentFieldId(selectedRadio);
            const extractedKey = getExtractedKeyFromClass(parentFieldId);
    
            return {
                label: extractedKey,
                value: selectedRadio.value,
            };
        }
    
        return null;
    }
    
    // Select parent ID containing keys
    function getParentFieldId(element) {
        const parentField = element.closest('[id^="field_"]');
        return parentField ? parentField.id : '';
    }
    
    // Extract the key from that parent class for key:value matching for our endpoint params
    function getExtractedKeyFromClass(parentFieldId) {
        const parentField = document.getElementById(parentFieldId);
        const labelClass = Array.from(parentField.classList).find(className =>
            className.startsWith('sm-data__')
        );
    
        if (labelClass) {
            const extractedKey = labelClass.replace('sm-data__', '').toLowerCase().split(' ').join('-');
            // console.log('Extracted Label from Class:', extractedKey);
            return extractedKey;
        }
    
        return '';
    }

    // Clears form field data so they don't stack up
    function clearFields(...fields) {
        fields.forEach(field => {
            field.value = '';
        });
    }

    function fadeOutAndIn(element, content) {
        element.style.opacity = 0;
        setTimeout(() => {
            element.innerHTML = content;
            element.style.opacity = 1;
        }, 300);
    }
}

// Function to update Query Loop block content using AJAX
function updateQueryLoopBlockContentWithAjax(apiURL) {
    // Make an AJAX request to the server
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiURL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Process JSON data and generate HTML markup
                const jsonData = JSON.parse(xhr.responseText);
                const markup = generateMarkupFromJSON(jsonData);
                
                // Update the target element with the generated content
                document.querySelector('.sm--counselor-query-block').innerHTML = markup;

                // Re-render the looop!
            } else {
                console.log('BIKI XHR ERROR:', xhr.status, xhr.statusText);
            }
        }
    };
    
    xhr.send();
}

function generateMarkupFromJSON(data) {
    // Process the JSON data and generate HTML markup
    let markup = '';

    // Loop through the data and generate markup
    data.forEach(item => {
        const acfData = item.acf;

        // Generate markup for non-empty ACF fields
        const acfMarkup = Object.keys(acfData).map(fieldName => {
            const fieldValue = acfData[fieldName];

            if (fieldValue) {
                return `<div class="acf-field">
                    <strong>${fieldName}:</strong> ${fieldValue}
                </div>`;
            }

            return ''; // Return empty string for empty fields
        }).join('');

        if (acfMarkup.trim() !== '') {
            // Render the entire counselor item if there's non-empty ACF markup
            markup += `<div class="counselor-item">
                <pre>${acfMarkup}</pre>
            </div>`;
        }
    });

    return markup;
}


// Function to update Query Loop block content
function updateQueryLoopBlockContent(filters) {
    const queryLoopBlockId = 3;

    // Construct the API URL with selected filters
    let apiUrl = `/wp-json/wp/v2/counselor`;

    filters.forEach((filter, index) => {
        const { label, value } = filter;
        const labelToSlug = label.toLowerCase().replace(/\s+/g, '-'); // Transform label to slug format
        
        // Append appropriate separator based on index
        if (index === 0) {
            apiUrl += `?${labelToSlug}=${value}`;
        } else {
            apiUrl += `&${labelToSlug}=${value}`;
        }
    });

    console.log('API URL:', apiUrl);

    // Call the AJAX function with the constructed API URL
    updateQueryLoopBlockContentWithAjax(apiUrl);
}

// Usage: Call the function with appropriate selectors
setupAjaxFormSubmission('.smm-gform__counselor_wrapper', '.sm--counselor-query-block');
