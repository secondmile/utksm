document.addEventListener('DOMContentLoaded', function () {

    // This selector must be present on the page for anything more to fire
    const resultsSelector = document.querySelector('.sm--counselor-query-block');
  
    // Exit the script if the element doesn't exist
    if (!resultsSelector) {
        return;
    }

    const apiUrl = '/wp-json/wp/v2/counselor?per_page=50';
    let localCounselorData = [];
    const selectedFilters = [];
    let filteredData = [];
    
    function updateData() {
        fetch(apiUrl)
            .then(response => {
                if(!response.ok) {
                    throw new Error('Counselor Filter Data: Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                localCounselorData = data;
                // console.log(`🐝🗝️ | API URL: ${apiUrl}`);
                // console.log(`🐝🗝️ | Stored Data: ${localCounselorData.length} Results`);
                // console.log(localCounselorData);

                updateFilters();
            })
            .catch(error => {
                console.error('Error updating Counselor Data object:', error);
            })
    }

    // BIKI: activate this after main production concludes
    // Periodically update data (twice a day)
    // setInterval(updateData, 12 * 60 * 60 * 1000); // 12 hours
    updateData();

    function updateFilteredData() {
        // Clear the existing filteredData array
        filteredData.length = 0;
        
        // Iterate through localCounselorData and filter based on selectedFilters
        for (const counselor of localCounselorData) {
            // filteredData.push(counselor);
            let matchesAllFilters = true;
    
            for (const filter of selectedFilters) {
                console.log('Biki filter in loop');
                const gFormLabel = filter.label;
                const gFormValue = parseInt(filter.value.trim(), 10);
                console.log(typeof(gFormValue));
    
                // Check if the counselor has the filter category
                if (!counselor[gFormLabel]) {
                    console.log(`Counselor does not have category ${gFormLabel}`);
                    matchesAllFilters = false;
                    break; // No need to continue checking other filters for this counselor
                }
    
                // Check if the value matches
                if (Array.isArray(counselor[gFormLabel])) {
                    // If it's an array, check if gFormValue exists within the array
                    if (!counselor[gFormLabel].includes(gFormValue)) {
                        console.log(`Counselor ${gFormLabel} does not contain value ${gFormValue}`);
                        matchesAllFilters = false;
                        break; // No need to continue checking other filters for this counselor
                    }
                } else if (counselor[gFormLabel] !== gFormValue) {
                    console.log(`Counselor ${counselor[gFormLabel]} does not match value ${gFormValue} for category ${gFormLabel}`);
                    matchesAllFilters = false;
                    break; // No need to continue checking other filters for this counselor
                }
            }
    
            // If the counselor matches all selected filters, add it to filteredData
            if (matchesAllFilters) {
                filteredData.push(counselor);
                console.log("🐺✨"); // Wolf emoji with sparkles
            }
        }
    
        console.log(`🐝🗝️ | Filtered Data:`);
        console.log(filteredData);
    }   

    function updateFilters() {
        const gravityFormID = 3;
        const formSelector = document.querySelector('.smm-gform__counselor_wrapper');

        // Gravity Form Input IDs
        const gravityFormInputs = {
            'specializations': 16,
            'states': 8,
            'countries': 9,
            'counties-in-tennessee': 10,
            'counties-in-texax': 11,
            'counties-in-north-carolina': 12,
            'counties-in-california': 13,
            'counties-in-georgia': 14,
            'schools-in-tennessee': 18,
        }

        const fieldSelectors = {};

        // Create Selectors from input IDs
        for (const key in gravityFormInputs) {
            if (gravityFormInputs.hasOwnProperty(key)) {
                const value = gravityFormInputs[key];
                
                // input_{form_id}_{field_id}
                const selector = `#input_${gravityFormID}_${value}`;

                fieldSelectors[key] = selector;

                // Event Listeners attached to each of the inputs
                const selectField = formSelector.querySelector(selector);
                if(selectField) {
                    selectField.addEventListener('change', () => {
                        updateSelectedFilters();
                    });
                }
            }
        }

        // We have to match up gForm selections and ACF data by ID's
        // Select parent ID containing gForm keys
        function getParentFieldId(element) {
            const parentField = element.closest('[id^="field_"]');
            return parentField ? parentField.id : '';
        }
        
        // Extract the key from that parent class for key:value matching for our data params
        function getExtractedKeyFromClass(parentFieldId) {
            const parentField = document.getElementById(parentFieldId);
            const labelClass = Array.from(parentField.classList).find(className =>
                className.startsWith('sm-data__')
            );
        
            if (labelClass) {
                // if gForm classes are missing, this will break (ex 'sm-data__counselor-specialization')
                const extractedKey = labelClass.replace('sm-data__', '').toLowerCase().split(' ').join('-');
                return extractedKey;
            }
        
            return '';
        }

        function updateSelectedFilters() {
            selectedFilters.length = 0; // Clear the array
        
            for (const key in fieldSelectors) {
                if (fieldSelectors.hasOwnProperty(key)) {
                    const selectField = formSelector.querySelector(fieldSelectors[key]);
        
                    if (selectField) {
                        const selectedOption = selectField.querySelector(`option[value="${selectField.value}"]`);
                        const selectedLabel = selectedOption ? selectedOption.textContent : '';
        
                        // Check if selectedLabel is not empty and doesn't start with '— select a'
                        if (selectedLabel && !selectedLabel.toLowerCase().startsWith('— select a')) {
                            const parentFieldId = getParentFieldId(selectField);
                            const extractedKey = getExtractedKeyFromClass(parentFieldId);
        
                            // Push the extracted data to the selectedFilters array
                            selectedFilters.push({
                                label: extractedKey,
                                value: selectField.value,
                            });
                        }
                    }
                }
            }
            console.log(`🐝🗝️ | Selected Filters:`);
            console.log(selectedFilters);
            
            updateFilteredData();
        }
        
    
        // Initial update of selected filters
        updateSelectedFilters();
    }



    // function updatePageResults() {
    //     // Get the resultsSelector element
    //     const resultsSelector = document.querySelector('.sm--counselor-query-block');

    //     // Block Wrapper Classes (not items)
    //     const blockLayoutClasses = 'columns-3 wp-block-post-template has-base-font-size is-layout-grid wp-container-24 wp-block-post-template-is-layout-grid';

    //     if (resultsSelector) {

    //         // Update the target element with the generated content
    //         resultsSelector.innerHTML = `
    //             <ul class="${blockLayoutClasses}">${markup}</ul>
    //         `;

    //         // After a short delay, remove the 'fade' class to fade in the new content
    //         setTimeout(() => {
    //             resultsSelector.classList.remove('fade');
    //         }, 200);
    //     }
    // }
    
    
    // THIS IS OLD (below)
    


    // const selectedFilters = [];

    function setupAjaxFormSubmission(formSelector, displaySelector) {
        const form = document.querySelector(formSelector);
        const display = document.querySelector(displaySelector);

        // Clears form field data so they don't stack up
        function clearFields(...fields) {
            fields.forEach(field => {
                field.value = '';
            });
        }

        // input_{form_id}_{field_id}
        const specializationField = form.querySelector('#input_3_16');
        const stateField = form.querySelector('#input_3_8');
        const countryField = form.querySelector('#input_3_9');
        const countyFieldTennessee = form.querySelector('#input_3_10');
        const countyFieldTexas = form.querySelector('#input_3_11');
        const countyFieldNorthCarolina = form.querySelector('#input_3_12');
        const countyFieldCalifornia = form.querySelector('#input_3_13');
        const countyFieldGeorgia = form.querySelector('#input_3_14');
        const schoolFieldTennessee = form.querySelector('#input_3_18');

        // Top-level selections clear child selections when changed
        specializationField.addEventListener('change', () => {
            clearFields(
                stateField,
                countryField,
                countyFieldTennessee,
                countyFieldCalifornia,
                countyFieldTexas,
                countyFieldGeorgia,
                countyFieldNorthCarolina,
                schoolFieldTennessee
            );

            captureAndDisplaySelections();
        });

        stateField.addEventListener('change', () => {
            clearFields(
                countryField,
                countyFieldTennessee,
                countyFieldCalifornia,
                countyFieldTexas,
                countyFieldGeorgia,
                countyFieldNorthCarolina,
                schoolFieldTennessee
            );

            captureAndDisplaySelections();
        });
        
        countryField.addEventListener('change', () => {
            clearFields(
                stateField,
                countyFieldTennessee,
                countyFieldCalifornia,
                countyFieldTexas,
                countyFieldGeorgia,
                countyFieldNorthCarolina,
                schoolFieldTennessee
            );

            captureAndDisplaySelections();
        });
        
        countyFieldCalifornia.addEventListener('change', captureAndDisplaySelections);
        countyFieldTexas.addEventListener('change', captureAndDisplaySelections);
        countyFieldGeorgia.addEventListener('change', captureAndDisplaySelections);
        countyFieldNorthCarolina.addEventListener('change', captureAndDisplaySelections);
        
        // Create an "or" condition for these State-specific filters
        countyFieldTennessee.addEventListener('change', () => {
            clearFields(schoolFieldTennessee);
            captureAndDisplaySelections();
        });
        schoolFieldTennessee.addEventListener('change', () => {
            clearFields(countyFieldTennessee);
            captureAndDisplaySelections();
        });
        
        // Interaction handler (capture selections, update results)
        function captureAndDisplaySelections() {
            // Capture the selected options from the form fields
            // const selectedSpecialization = getSelectedRadio(specializationRadios);
            const selectedSpecialization = getSelectedOption(specializationField);
            const selectedState = getSelectedOption(stateField);
            const selectedCountry = getSelectedOption(countryField);
            const selectedCountyTennessee = getSelectedOption(countyFieldTennessee);
            const selectedCountyCalifornia = getSelectedOption(countyFieldCalifornia);
            const selectedCountyTexas = getSelectedOption(countyFieldTexas);
            const selectedCountyGeorgia = getSelectedOption(countyFieldGeorgia);
            const selectedCountyNorthCarolina = getSelectedOption(countyFieldNorthCarolina);
            const selectedSchoolTennessee = getSelectedOption(schoolFieldTennessee);
        
            // Update the array
            selectedFilters.length = 0; // Clear the filter array
            if (selectedSpecialization) selectedFilters.push(selectedSpecialization);
            if (selectedState) selectedFilters.push(selectedState);
            if (selectedCountry) selectedFilters.push(selectedCountry);
            if (selectedCountyTennessee) selectedFilters.push(selectedCountyTennessee);
            if (selectedCountyCalifornia) selectedFilters.push(selectedCountyCalifornia);
            if (selectedCountyTexas) selectedFilters.push(selectedCountyTexas);
            if (selectedCountyGeorgia) selectedFilters.push(selectedCountyGeorgia);
            if (selectedCountyNorthCarolina) selectedFilters.push(selectedCountyNorthCarolina);
            if (selectedSchoolTennessee) selectedFilters.push(selectedSchoolTennessee);
        
            // console.log('Biki Filters: ', selectedFilters);

            document.querySelector('.sm--counselor-query-block').classList.add('fade');
            
            setTimeout( () => {
                // Fetch the updated content
                updateQueryLoopBlockContent(selectedFilters);
            }, 200);
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
        
        // Radio selection handling (keeping in case we use radios for anything later)
        // function getSelectedRadio(radioButtons) {
        //     const selectedRadio = Array.from(radioButtons).find(radio => radio.checked);
        
        //     if (selectedRadio) {
        //         const parentFieldId = getParentFieldId(selectedRadio);
        //         const extractedKey = getExtractedKeyFromClass(parentFieldId);
        
        //         return {
        //             label: extractedKey,
        //             value: selectedRadio.value,
        //         };
        //     }
        
        //     return null;
        // }
        
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

                    // Log the result count to the console
                    // console.log(`${jsonData.length} results found. ${apiURL}`);

                    // Get the resultsSelector element
                    const resultsSelector = document.querySelector('.sm--counselor-query-block');

                    // Block Wrapper Classes (not items)
                    const blockLayoutClasses = 'columns-3 wp-block-post-template has-base-font-size is-layout-grid wp-container-24 wp-block-post-template-is-layout-grid';

                    if (resultsSelector) {

                        // Update the target element with the generated content
                        resultsSelector.innerHTML = `
                            <ul class="${blockLayoutClasses}">${markup}</ul>
                        `;

                        // After a short delay, remove the 'fade' class to fade in the new content
                        setTimeout(() => {
                            resultsSelector.classList.remove('fade');
                        }, 200);
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
        // console.log('BIKI DATA: ', data);
    
        if (data.length === 0) {
            // Display an error message if no counselors are found
            markup = '<p class="error-message">No counselors found for the selected criteria. Consider broadening your search or changing your filters.</p>';
        } else {
            // Loop through the data and generate markup
            data.forEach(item => {
                const title = item.title.rendered;
                const acfData = item.acf;
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
        const counselorSlateUrl = combinedData.counselor_slate_url ? combinedData.counselor_slate_url : '/contact-us/';

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

    // Function to update Query Loop block content
    function updateQueryLoopBlockContent(filters) {
        const queryLoopBlockId = 3; // Gravity Form ID

        // Construct the API URL with selected filters
        // Wordpress limits api results to 10; updated to 50
        let apiUrl = `/wp-json/wp/v2/counselor?per_page=50`;

        filters.forEach((filter, index) => {
            const { label, value } = filter;
            const labelToSlug = label.toLowerCase().replace(/\s+/g, '-'); // Transform label to slug format
            
            if (value !== undefined && value !== '') {
                // Append appropriate separator based on index
                if (index === 0) {
                    apiUrl += `&${labelToSlug}=${value}`;
                } else {
                    apiUrl += `&${labelToSlug}=${value}`;
                }
            }
        });

        // Call the AJAX function with the constructed API URL
        updateQueryLoopBlockContentWithAjax(apiUrl);
    }

    // Usage: Call the function with appropriate selectors
    setupAjaxFormSubmission('.smm-gform__counselor_wrapper', '.sm--counselor-query-block');
});