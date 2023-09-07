document.addEventListener('DOMContentLoaded', function () {
  const counselorQueryBlock = document.querySelector('.sm--counselor-query-block');
  
    // Exit the script if the element doesn't exist
    if (!counselorQueryBlock) {
    return;
    }

    const selectedFilters = [];

    function setupAjaxFormSubmission(formSelector, displaySelector) {
        const form = document.querySelector(formSelector);
        const display = document.querySelector(displaySelector);

        // Attach event listeners to each form field
        const specializationRadios = form.querySelectorAll('input[name="input_6"]');
        
        // input_{form_id}_{field_id}
        const stateField = form.querySelector('#input_3_8');
        const countryField = form.querySelector('#input_3_9');
        const countyFieldTennessee = form.querySelector('#input_3_10');
        const countyFieldTexas = form.querySelector('#input_3_11');
        const countyFieldNorthCarolina = form.querySelector('#input_3_12');
        const countyFieldCalifornia = form.querySelector('#input_3_13');
        const countyFieldGeorgia = form.querySelector('#input_3_14');

        // Add event listeners to radio buttons within the specialization group
        specializationRadios.forEach(radio => {
            radio.addEventListener('click', () => {
                clearFields(stateField, countryField);
                captureAndDisplaySelections();
            });
        });

        stateField.addEventListener('change', captureAndDisplaySelections);
        countryField.addEventListener('change', captureAndDisplaySelections);
        countyFieldTennessee.addEventListener('change', captureAndDisplaySelections);
        countyFieldCalifornia.addEventListener('change', captureAndDisplaySelections);
        countyFieldTexas.addEventListener('change', captureAndDisplaySelections);
        countyFieldGeorgia.addEventListener('change', captureAndDisplaySelections);
        countyFieldNorthCarolina.addEventListener('change', captureAndDisplaySelections);

        // Interaction handler (capture selections, update results)
        function captureAndDisplaySelections() {
            // Capture the selected options from the form fields
            const selectedSpecialization = getSelectedRadio(specializationRadios);
            const selectedState = getSelectedOption(stateField);
            const selectedCountry = getSelectedOption(countryField);
            const selectedCountyTennessee = getSelectedOption(countyFieldTennessee);
            const selectedCountyCalifornia = getSelectedOption(countyFieldCalifornia);
            const selectedCountyTexas = getSelectedOption(countyFieldTexas);
            const selectedCountyGeorgia = getSelectedOption(countyFieldGeorgia);
            const selectedCountyNorthCarolina = getSelectedOption(countyFieldNorthCarolina);
        
            // Update the array
            selectedFilters.length = 0; // Clear the array
            if (selectedSpecialization) selectedFilters.push(selectedSpecialization);
            if (selectedState) selectedFilters.push(selectedState);
            if (selectedCountry) selectedFilters.push(selectedCountry);
            if (selectedCountyTennessee) selectedFilters.push(selectedCountyTennessee);
            if (selectedCountyCalifornia) selectedFilters.push(selectedCountyCalifornia);
            if (selectedCountyTexas) selectedFilters.push(selectedCountyTexas);
            if (selectedCountyGeorgia) selectedFilters.push(selectedCountyGeorgia);
            if (selectedCountyNorthCarolina) selectedFilters.push(selectedCountyNorthCarolina);
        
            console.log(selectedFilters);

            // Fetch the updated content
            updateQueryLoopBlockContent(selectedFilters);
        }
        
        // Dropdown Selection handling
        function getSelectedOption(selectField) {
            const selectedOption = selectField.querySelector(`option[value="${selectField.value}"]`);
            const selectedLabel = selectedOption ? selectedOption.textContent : '';
        
        
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
    }

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

                    // Get the resultsSelector element
                    const resultsSelector = document.querySelector('.sm--counselor-query-block');

                    // Block Wrapper Classes (not items)
                    const blockLayoutClasses = 'columns-3 wp-block-post-template has-base-font-size is-layout-grid wp-container-24 wp-block-post-template-is-layout-grid';

                    if (resultsSelector) {
                        // Update the target element with the generated content
                        resultsSelector.innerHTML = `
                            <ul class="${blockLayoutClasses}">${markup}</ul>
                        `;
                    } else {
                        // Display an error message if resultsSelector doesn't exist
                        console.error("Results cannot be displayed without the resultsSelector existing on the page");
                    }
                } else {
                    console.log('XHR ERROR:', xhr.status, xhr.statusText);
                }
            }
        };
        
        xhr.send();
    }

    function generateMarkupFromJSON(data) {
        // Process the JSON data and generate HTML markup
        let markup = '';
        console.log('BIKI DATA: ', data);
    
        if (data.length === 0) {
            // Display an error message if no counselors are found
            markup = '<p class="error-message">No counselors found for the selected criteria. Consider broadening your search or changing your filters.</p>';
        } else {
            // Loop through the data and generate markup
            data.forEach(item => {
                const title = item.title.rendered;
                const acfData = item.acf;
                const acfTermEndpoint = item._links[`wp:term`][0].href;
    
                const combinedData = { title, ...acfData };
    
                // Generate markup for ACF fields
                const acfMarkup = generateACFMarkup(combinedData);
                const blockQueryClasses = 'wp-block-query is-layout-flow wp-block-query-is-layout-flow';
    
                if (acfMarkup !== '') {
                    // Render the entire counselor item if there's non-empty ACF markup
                    markup += `<div class="${blockQueryClasses} counselor-loop__counselor-block">${acfMarkup}</div>`;
                }
            });
        }
    
        return markup;
    }
    

    function generateACFMarkup(combinedData) {
        const counselorSlateUrl = combinedData.counselor_slate_url ? '' : '/contact-us/';

        // Defines the field data + markup, but not the order in which they are presented (see fieldOrder)
        const fieldRenderers = {
            'counselor_image_url': fieldValue => `<div class="counselor-loop__image"><figure class="wp-block-post-featured-image"><img src="${fieldValue}" class="attachment-post-thumbnail size-post-thumbnail not-transparent wp-post-image" alt="Counselor Image" /></figure></div>`,
            'title': fieldValue => `<div class="counselor-loop__name"><h3>${fieldValue}</h3></div>`,
            // 'counselor_slate_url': fieldValue => '',
            'counselor_slate_url': fieldValue => `${fieldValue}`,
            'counselor_title': (fieldValue, combinedData) => {
                return `<div class="counselor-loop__title"><a href="${counselorSlateUrl}" target="_blank">${fieldValue}</a></div>`;
            },
            
            // These work but exceed scope of current design
            // 'counselor_county': fieldValue => `<div class="counselor-loop__county"><strong>counselor_county:</strong> ${fieldValue}</div>`,
            // 'counselor_schools': fieldValue => `<div class="counselor-loop__schools"><strong>counselor_schools:</strong> ${fieldValue}</div>`,
            
            // Commenting these out until taxonomy has been injected into the json object (like image); exceeds scope of current design
            // 'counselor_country': fieldValue => generateTaxonomyMarkup('counselor-states', fieldValue), 
            // 'counselor_states': fieldValue => generateTaxonomyMarkup('counselor-states', fieldValue),
            // 'counselor_specialization': fieldValue => generateTaxonomyMarkup('counselor-specialization', fieldValue),
        };

        // Define the desired order of fields as they display on the page
        const fieldOrder = [
            'counselor_image_url',
            'title',
            'counselor_title'
        ];

        const acfMarkup = fieldOrder.map(fieldName => {
            const fieldValue = combinedData[fieldName];
            const fieldRenderer = fieldRenderers[fieldName];

            if (fieldValue !== null && fieldRenderer) {
                return fieldRenderer(fieldValue);
            }

            return ''; // Return empty string for empty fields
        }).join('');

        const blockPostClasses = 'wp-block-post post-1893 page type-page status-publish hentry';
        const blockPostInnerClasses = 'wp-block-group has-white-background-color has-background has-global-padding is-layout-constrained wp-container-16 wp-block-group-is-layout-constrained has-text-align-center';
        return `
            <li class="${blockPostClasses}">
            <div class="${blockPostInnerClasses}">
            ${acfMarkup}
            </div>
            </li>
        `;
    }

    // async function generateImageMarkup(imageID) {
    //     return `<div class="counselor-loop__image">Image</div>`;
    //     // const imageURL = await getImageURLByID(imageID);
    //     // return `<div class="acf-field"><strong>counselor_image:</strong> <img src="${imageURL}" alt="Image" /></div>`;
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


        // Call the AJAX function with the constructed API URL
        updateQueryLoopBlockContentWithAjax(apiUrl);
    }

    // Usage: Call the function with appropriate selectors
    setupAjaxFormSubmission('.smm-gform__counselor_wrapper', '.sm--counselor-query-block');
});