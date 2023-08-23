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
    
        // Build the display content
        const displayContent = `Specialization: ${selectedSpecialization ? selectedSpecialization.label : ''}<br>State: ${selectedState ? selectedState.label : ''}<br>Country: ${selectedCountry ? selectedCountry.label : ''}`;
    
        // Apply fade effect to display the content
        fadeOutAndIn(display, displayContent);
    
        // Fetch and update the Query Loop block content
        updateQueryLoopBlockContent(selectedFilters);
    
        console.log(selectedFilters);
    }
    
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
    
    function getParentFieldId(element) {
        const parentField = element.closest('[id^="field_"]');
        return parentField ? parentField.id : '';
    }
    
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

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update the Query Loop block's content
            wp.data.dispatch('core/block-editor').updateBlockAttributes(queryLoopBlockId, {
                content: data.content,
            });
        })
        .catch(error => {
            console.error('Error fetching updated content:', error);
        });
}


// Usage: Call the function with appropriate selectors
setupAjaxFormSubmission('.smm-gform__counselor_wrapper', '.counselor-selection-display');
