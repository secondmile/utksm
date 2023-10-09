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
    
    // API call to pull the data (currently on load; optimally less than that)
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
                console.log('Counselor Filter: API Data Call')

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
                const gFormLabel = filter.label;
                const gFormValue = parseInt(filter.value.trim(), 10);
    
                // Check if the counselor has the filter category
                if (!counselor[gFormLabel]) {
                    // console.log(`Counselor does not have category ${gFormLabel}`);
                    matchesAllFilters = false;
                    break; // No need to continue checking other filters for this counselor
                }
    
                // Check if the value matches
                if (Array.isArray(counselor[gFormLabel])) {
                    // If it's an array, check if gFormValue exists within the array
                    if (!counselor[gFormLabel].includes(gFormValue)) {
                        // console.log(`Counselor ${gFormLabel} does not contain value ${gFormValue}`);
                        matchesAllFilters = false;
                        break; // No need to continue checking other filters for this counselor
                    }
                } else if (counselor[gFormLabel] !== gFormValue) {
                    // console.log(`Counselor ${counselor[gFormLabel]} does not match value ${gFormValue} for category ${gFormLabel}`);
                    matchesAllFilters = false;
                    break; // No need to continue checking other filters for this counselor
                }
            }
    
            // If the counselor matches all selected filters, add it to filteredData
            if (matchesAllFilters) {
                filteredData.push(counselor);
                // console.log("🐺✨");
            }
        }

        // Generate markup for the filtered data
        const markup = generateMarkupFromData(filteredData);

        // Display the markup where you want on your page
        const resultsContainer = document.querySelector('.sm--counselor-query-block');
        
        setTimeout(() => {
            resultsContainer.innerHTML = markup;
        }, 400);
    
        // console.log(`🐝🗝️ | Filtered Data:`);
        // console.log(filteredData);
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
            'counties-in-texas': 11,
            'counties-in-north-carolina': 12,
            'counties-in-california': 13,
            'counties-in-georgia': 14,
            'schools-knox': 18,
            'schools-blount': 19,
            'schools-hamilton': 20,
            'schools-middle-tennessee': 21,
            'schools-middle-tennessee': 22,
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
            // Fade results out
            resultsSelector.classList.add('fade');
            
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
            // console.log(`🐝🗝️ | Selected Filters:`);
            // console.log(selectedFilters);
            
            updateFilteredData();
        }
    
        // GRAVITY FORMS -- Input Handling
        // Handle the form elements to toggle "or" options and clear child selections
        // Clears fields as needed upon interaction
        function clearFields(...fields) {
            fields.forEach(field => {
                if (field && field.value !== undefined) {
                    field.value = '';
                }
            });
        }

        const specializationField = formSelector.querySelector(fieldSelectors.specializations);
        const statesField = formSelector.querySelector(fieldSelectors.states);
        const countriesField = formSelector.querySelector(fieldSelectors.countries);
        const countiesInTennesseeField = formSelector.querySelector(fieldSelectors['counties-in-tennessee']);
        const countiesInTexasField = formSelector.querySelector(fieldSelectors['counties-in-texax']);
        const countiesInNorthCarolinaField = formSelector.querySelector(fieldSelectors['counties-in-north-carolina']);
        const countiesInCaliforniaField = formSelector.querySelector(fieldSelectors['counties-in-california']);
        const countiesInGeorgiaField = formSelector.querySelector(fieldSelectors['counties-in-georgia']);
        const schoolsInKnoxField = formSelector.querySelector(fieldSelectors['schools-knox']);
        const schoolsInBlountField = formSelector.querySelector(fieldSelectors['schools-blount']);
        const schoolsInHamiltonField = formSelector.querySelector(fieldSelectors['schools-hamilton']);
        const schoolsInShelbyField = formSelector.querySelector(fieldSelectors['schools-shelby']);
        const schoolsInMiddleTennesseeField = formSelector.querySelector(fieldSelectors['schools-middle-tennessee']);

        // Top-level selections clear child selections when changed
        specializationField.addEventListener('change', () => {
            clearFields(
                statesField,
                countriesField,
                countiesInTennesseeField,
                countiesInCaliforniaField,
                countiesInTexasField,
                countiesInGeorgiaField,
                countiesInNorthCarolinaField,
                schoolsInKnoxField,
                schoolsInBlountField,
                schoolsInHamiltonField,
                schoolsInShelbyField,
                schoolsInMiddleTennesseeField,
            );

            updateSelectedFilters();
        });

        statesField.addEventListener('change', () => {
            clearFields(
                countriesField,
                countiesInTennesseeField,
                countiesInCaliforniaField,
                countiesInTexasField,
                countiesInGeorgiaField,
                countiesInNorthCarolinaField,
                schoolsInKnoxField,
                schoolsInBlountField,
                schoolsInHamiltonField,
                schoolsInShelbyField,
                schoolsInMiddleTennesseeField,
            );

            updateSelectedFilters();
        });
        
        countriesField.addEventListener('change', () => {
            clearFields(
                statesField,
                countiesInTennesseeField,
                countiesInCaliforniaField,
                countiesInTexasField,
                countiesInGeorgiaField,
                countiesInNorthCarolinaField,
                schoolsInKnoxField,
                schoolsInBlountField,
                schoolsInHamiltonField,
                schoolsInShelbyField,
                schoolsInMiddleTennesseeField,
            );

            updateSelectedFilters();
        });

        countiesInTennesseeField.addEventListener('change', () => {
            clearFields(
                schoolsInKnoxField,
                schoolsInBlountField,
                schoolsInHamiltonField,
                schoolsInShelbyField,
                schoolsInMiddleTennesseeField,
            );

            updateSelectedFilters();
        });

        // // Create an "or" condition for these State-specific filters
        // countiesInTennesseeField.addEventListener('change', () => {
        //     clearFields(schoolsInKnoxField);
        //     updateSelectedFilters();
        // });
        // schoolsInKnoxField.addEventListener('change', () => {
        //     clearFields(countiesInTennesseeField);
        //     updateSelectedFilters();
        // });
    }

    function generateMarkupFromData(data) {
        // Process the filtered data and generate HTML markup
        let markup = '';
    
        if (data.length === 0) {
            setTimeout(() => {
                resultsSelector.classList.remove('fade');
            }, 500);
            // Display an error message if no counselors are found
            markup = '<p class="error-message">No counselors found for the selected criteria. Consider broadening your search or changing your filters.</p>';
            //     // Remove the 'fade' class after a short delay
        } else {
            // Get the resultsSelector element
            const resultsSelector = document.querySelector('.sm--counselor-query-block');
    
            // Block Wrapper Classes (not items)
            const blockLayoutClasses = 'counselor-loop__ul columns-3 wp-block-post-template has-base-font-size is-layout-grid wp-container-24 wp-block-post-template-is-layout-grid';
    
            if (resultsSelector) {
                // Loop through the data and generate markup
                data.forEach(item => {
                    const title = item.title.rendered;
                    let acfData = item.acf;

                    acfData.title = title;

                    const acfMarkup = generateACFMarkup(acfData);
                    const blockQueryClasses = 'wp-block-query is-layout-flow wp-block-query-is-layout-flow';
    
                    if (acfMarkup !== '') {
                        // Render the entire counselor item if there's non-empty ACF markup
                        markup += `<div class="${blockQueryClasses} counselor-loop__counselor-block">${acfMarkup}</div>`;
                    }
                });
                                
                setTimeout(() => {
                    // Remove the 'fade' class after a short delay
                    resultsSelector.classList.remove('fade');
                    
                    // Update the target element with the generated content
                    resultsSelector.innerHTML = `
                        <ul class="${blockLayoutClasses}">${markup}</ul>
                    `;
                }, 500);

            } else {
                // Display an error message if resultsSelector doesn't exist
                console.error("Results cannot be displayed without the resultsSelector existing on the page");
            }
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
            'counselor_title': (fieldValue) => {
                return `<div class="counselor-loop__title"><a href="${counselorSlateUrl}" target="_blank">${fieldValue}</a></div>`;
            },
            
            // These work but exceed scope of current design
            // 'counselor_county': fieldValue => `<div class="counselor-loop__county"><strong>counselor_county:</strong> ${fieldValue}</div>`,
            // 'counselor_schools': fieldValue => `<div class="counselor-loop__schools"><strong>counselor_schools:</strong> ${fieldValue}</div>`,
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
});
