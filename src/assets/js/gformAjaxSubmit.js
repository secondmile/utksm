// console.log('BIKI: Counselor script loaded');


function testAcfJs() {
    if (typeof acf !== 'undefined') {
        console.log('ACF JavaScript API is available.');
        // Now you can use acf functions here
    } else {
        console.log('ACF JavaScript API is not available.');
    }
}

// Call the testAcfJs function
testAcfJs();



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

                // Block Wrapper Classes (not items)
                const blockLayoutClasses = 'columns-3 wp-block-post-template has-base-font-size is-layout-grid wp-container-29 wp-block-post-template-is-layout-grid';
                
                // Update the target element with the generated content
                document.querySelector('.sm--counselor-query-block').innerHTML = `
                    <ul class="${blockLayoutClasses}">${markup}</ul>
                `;
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
        const title = item.title.rendered;
        const acfData = item.acf;
        const acfTermEndpoint = item._links[`wp:term`][0].href;
        console.log('BIKI: Term Endpoint | ', acfTermEndpoint);


        const combinedData = { title, ...acfData };
        console.log(combinedData);

        // Generate markup for ACF fields
        const acfMarkup = generateACFMarkup(combinedData);
        const blockQueryClasses = 'wp-block-query is-layout-flow wp-block-query-is-layout-flow';

        if (acfMarkup !== '') {
            // Render the entire counselor item if there's non-empty ACF markup
            markup += `<div class="${blockQueryClasses} counselor-loop__counselor-block">${acfMarkup}</div>`;
        }
    });

    // console.log(markup);
    return markup;
}

function generateACFMarkup(combinedData) {
    const fieldRenderers = {
        'counselor_image_url': fieldValue => `<div class="counselor-loop__image"><img src="${fieldValue}" alt="Counselor Image" /></div>`,
        'title': fieldValue => `<div class="counselor-loop__name"><h3>${fieldValue}</h3></div>`,
        'counselor_title': fieldValue => `<div class="counselor-loop__title"><strong>counselor_title:</strong> ${fieldValue}</div>`,
        'counselor_slate_url': fieldValue => `<div class="counselor-loop__url"><strong>counselor_slate_url:</strong> <a href="${fieldValue}" target="_blank">${fieldValue}</a></div>`,
        // 'counselor_country': fieldValue => generateTaxonomyMarkup('counselor-states', fieldValue), 
        // 'counselor_states': fieldValue => generateTaxonomyMarkup('counselor-states', fieldValue),
        'counselor_county': fieldValue => `<div class="counselor-loop__county"><strong>counselor_county:</strong> ${fieldValue}</div>`,
        'counselor_schools': fieldValue => `<div class="counselor-loop__schools"><strong>counselor_schools:</strong> ${fieldValue}</div>`,
        // 'counselor_specialization': fieldValue => generateTaxonomyMarkup('counselor-specialization', fieldValue),
    };

    const acfMarkup = Object.keys(combinedData).map(fieldName => {
        const fieldValue = combinedData[fieldName];
        const fieldRenderer = fieldRenderers[fieldName];

        if (fieldValue !== null && fieldRenderer) {
            return fieldRenderer(fieldValue);
        }

        return ''; // Return empty string for empty fields
    }).join('');

    const blockPostClasses = 'wp-block-post post-1473 page type-page status-publish has-post-thumbnail hentry';
    const blockPostInnerClasses = 'wp-block-group has-white-background-color has-background has-global-padding is-layout-constrained wp-container-22 wp-block-group-is-layout-constrained';
    return `
        <li class="${blockPostClasses}">
        <div class="${blockPostInnerClasses}">
        ${acfMarkup}
        </div>
        </li>
    `;
}


// function generateTaxonomyMarkup() {
//     console.log('test');
// }


async function generateImageMarkup(imageID) {
    return `<div class="counselor-loop__image">Image</div>`;
    // const imageURL = await getImageURLByID(imageID);
    // return `<div class="acf-field"><strong>counselor_image:</strong> <img src="${imageURL}" alt="Image" /></div>`;
}

// // Function to get taxonomy name by ID
// async function getTaxonomyNameByID(taxonomyEndpoint, id) {
//     const response = await fetch(`/wp-json/wp/v2/${taxonomyEndpoint}/${id}`);
//     const taxonomyData = await response.json();
//     // console.log('BIKI tax name: ', taxonomyData.name); // √
//     return taxonomyData.name;
// }

// async function generateTaxonomyMarkup(taxonomyEndpoint, fieldValue) {
//     console.log('Tax Field Value: ', fieldValue);
//     console.log('Tax Endpoint: ', taxonomyEndpoint);

//     const taxonomyIDs = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
//     const taxonomyNames = []; // Initialize an empty array

//     const taxonomyPromises = taxonomyIDs.map(id => {
//         return getTaxonomyNameByID(taxonomyEndpoint, id).then(taxonomyName => {
//             console.log('Taxonomy Name:', taxonomyName);
//             taxonomyNames.push(taxonomyName); // Add taxonomyName to the array
//         });
//     });

//     await Promise.all(taxonomyPromises);

//     // Generate markup for each taxonomy name
//     const taxonomyMarkup = taxonomyNames.map(name => {
//         return `<span class="taxonomy-name">${name}</span>`;
//     }).join(', '); // Join the markup with commas

//     console.log('Taxonomy Markup: ', taxonomyMarkup);
//     return `<div class="counselor-loop__taxonomy-group"><strong>BIKI ${taxonomyEndpoint}:</strong> ${taxonomyMarkup}</div>`;
// }



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
