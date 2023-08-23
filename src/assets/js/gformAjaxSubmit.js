console.log('BIKI: script loaded');

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
        const specialization = getSelectedRadioLabel(specializationRadios);
        const state = stateField.value;
        const country = countryField.value;

        // Build the display content
        const displayContent = `Specialization: ${specialization}<br>State: ${state}<br>Country: ${country}`;

        // Apply fade effect to display the content
        fadeOutAndIn(display, displayContent);
    }

    function getSelectedRadioLabel(radioButtons) {
        const selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
        return selectedRadio ? selectedRadio.parentElement.querySelector('label').textContent : '';
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

// Usage: Call the function with appropriate selectors
setupAjaxFormSubmission('.smm-gform__counselor_wrapper', '.counselor-selection-display'); // Assuming the form has a class of "gform"
