// Declare string arrays for grade options
const boulderGrades = ["VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16"];
const sportGrades = ["4", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+",
 "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c"];
const tradGrades = ["Mod", "Diff", "VDiff", "HVD", "S", "HS", "HVS", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11"];
const techGrades = ["3", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a", "7b"];
const climbArray = [];

// Global toggle variables
let boulderToggle = false;
let sportToggle = false;
let tradToggle = false;

const form = `<form id="form" class="mx-2 was-validated">
<div class="row mt-2">
    <div class="form-group mb-2 col-md-auto">
        <label for="name" class="col-form-label">Name:</label>
        <input type="text" id="name" class="form-control-sm" required>
    </div>
    <div class="form-group mb-2 col-md-auto">
        <label for="date" class="col-form-label">Date:</label>
        <input type="date" name="date" id="date" class="form-control-sm">
    </div>
    <div class="form-group mb-2 col-md-auto">
    <label for="crag" class="col-form-label">Crag:</label>
    <input type="text" name="crag" id="crag" class="form-control-sm">
    </div>
</div>
<div class="row mb-2">
    <div class="form-group mb-2 col-md-auto">
        <label for="type" class="col-form-label">Type:</label>
        <select name="type" id="type" class="form-control-sm">
            <option label=" " selected></option>
            <option value="Boulder">Boulder</option>
            <option value="Sport">Sport</option>
            <option value="Trad"> UK Trad</option>
        </select>
    </div>
    <div class="gradeSelector form-group mb-2 col-md-auto">
        <label for="grade" class="col-form-label">Grade:</label>
        <select name="grade" id="grade" class="form-control-sm">
            <option label=" " selected>
        </select>
    </div>
</div>
<button type="submit" id="submit" class="btn btn-primary btn-sm">Submit</button>
</form>`

// Ready document for JQuery
$( document ).ready(function() {
    console.log( "Document ready!" );

    // Select html elements
    const newButton = $('#new');
    const formContainer = $('#formContainer');
    const displayContainer = $('#display');
    const filterBoulder = $('#filter-boulder');
    const filterSport = $('#filter-sport');
    const filterTrad = $('#filter-trad');

    // Display climbs in storage on load
    const climbData = JSON.parse(localStorage.getItem('climbs'));
    if (climbData) {
        for (let idx = 0; idx < climbData.length; idx++) {
            displayContainer.prepend(`
            <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                <div class="climbItem card-body">
                    <div class="card-head">
                        <h4 class="card-title">${climbData[idx][0]}</h4>
                        <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                    </div>
                    <ul class="list-group my-2">
                        <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                        <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                        <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                    </ul>
                    <button type="button" class="delete btn btn-primary btn-sm text-light">Delete</button>
                </div>
            </div>
            `);
        };
    }


    // EVENT LISTENERS

    // Open form for new climb
    newButton.click(() => {

        // Render initial form element
        formContainer.html(form);

        // Append form to the document body
        $('#form').appendTo($('#formContainer'));

        // Hide grade selector
        $('.gradeSelector').hide();

        // Change grade unit based on climb type
        $('#type').change(function () {
            //console.log('Value changed.');
            // Show grade selector
            $('.gradeSelector').show();
            let selection = $(this).val();
            switch (selection) {
                case 'Boulder':
                    let boulderGradesString = "";
                    // Loop through boulder grades array
                    for (let grade = 0; grade < boulderGrades.length; grade++) {
                        boulderGradesString += `<option value=${boulderGrades[grade]}>${boulderGrades[grade]}</option>`;
                    }
                    // Insert boulder grades string into html
                    $('#grade').html(boulderGradesString);
                    break;
                case 'Sport':
                    let sportGradesString = "";
                    // Loop through sport grades array
                    for (let grade = 0; grade < sportGrades.length; grade++) {
                        sportGradesString += `<option value=${sportGrades[grade]}>${sportGrades[grade]}</option>`;
                    }
                    // Insert sport grades string into html
                    $('#grade').html(sportGradesString);
                    break;
                case 'Trad':
                    let tradGradesString = "";
                    let techGradesString = "";

                    // Append new select option
                    $('.gradeSelector').append(`<label for="techGrade" class="col-form-label ms-3">Technical Grade:</label><select name="techGrade" id="techGrade" class="form-control-sm ms-1">
                    <option label=" " selected></select>`);

                    // Loop through trad grades array
                    for (let grade = 0; grade < tradGrades.length; grade++) {
                        tradGradesString += `<option value=${tradGrades[grade]}>${tradGrades[grade]}</option>`;
                    }

                    for (let grade = 0; grade < techGrades.length; grade++) {
                        techGradesString += `<option value=${techGrades[grade]}>${techGrades[grade]}</option>`;
                    }

                    // Insert trad grades string into html
                    $('#grade').html(tradGradesString);
                    $('#techGrade').html(techGradesString);
                    break;
            }
        });
    });

    $( document ).on('click', '#submit', function (event) {

        const climbName = $('#name').val();
        const climbCrag = $('#crag').val();
        let climbDate = $('#date').val();
        const climbType = $('#type').val();
        let climbGrade = $('#grade').val();
        const climbTechGrade = $('#techGrade').val();

        // Form validation
        if (climbName === '' || climbDate === '' || climbType === '') {
            console.log('Invalid input!');
            formContainer.prepend(`<div class="alert alert-danger alert-dismissible fade show mt-2 mx-2 max-width-50" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            Please add a name, date and type of climb.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`);
            return false
        }

        // If climbTechGrade exists, add the tech grade to the difficulty grade
        if (climbTechGrade) {
            climbGrade = climbGrade + ' ' + climbTechGrade;
        }

        climbDate = formatDate(climbDate);

        const climb = [
            climbName,
            climbCrag,
            climbDate,
            climbType,
            climbGrade
        ];

        console.log(climbDate);

        // Check if climbs data exists
        let currentData = JSON.parse(localStorage.getItem('climbs'));
        if (!currentData) {
            // Create new climbs database
            climbArray.push(climb);
            localStorage.setItem('climbs', JSON.stringify(climbArray));
        }
        else {
            // Push new climb object to current database
            console.log('Climbs database already exists!');
            currentData.push(climb);
            localStorage.setItem('climbs', JSON.stringify(currentData));
            console.log('Database updated!');
        }

        displayContainer.prepend(`
        <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
            <div class="climbItem card-body">
                <div class="card-head">
                    <h4 class="card-title">${climbName}</h4>
                    <h4 class="card-subtitle text-success">${climbGrade}</h4>
                </div>
                <ul class="list-group my-2">
                    <li class="list-group-item bg-secondary">${climbCrag}</li>
                    <li class="list-group-item bg-secondary">${climbDate}</li>
                    <li class="list-group-item bg-secondary">${climbType}</li>
                </ul>
                <button class="delete btn btn-primary btn-sm text-light">Delete</button>
            </div>
        </div>
        `);

        // Remove form html from formContainer
        formContainer.html(``);
    });

    // Delete button event listener
    $( document ).on('click', '.delete', function() {
        // Select parent climb item
        const parentClimb = $(this).parent().parent();

        // Get data from localStorage
        let currentData = JSON.parse(localStorage.getItem('climbs'));

        // Delete parentClimb from currentData
        const climbIndex = currentData.length - 1 - parentClimb.index();
        console.log(climbIndex);
        currentData.splice(climbIndex,1);

        // Re-push climb back to database
        localStorage.setItem('climbs', JSON.stringify(currentData));
        console.log('Database updated!');

        // Remove climb from dislay container
        parentClimb.remove();
    });

    filterBoulder.click(() => {
        console.log('Boulder filter clicked!');

        // Check toggle variable state
        if (boulderToggle === false) {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    if (climbData[idx].includes('Boulder')) {
                        displayContainer.prepend(`
                        <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                            <div class="climbItem card-body">
                                <div class="card-head">
                                    <h4 class="card-title">${climbData[idx][0]}</h4>
                                    <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                                 </div>
                                <ul class="list-group my-2">
                                    <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                                    <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                                    <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                                </ul>
                                <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                            </div>
                        </div>
                        `);
                    };
                };
            };

            sportToggle = false;
            tradToggle = false;
            boulderToggle = true;
            console.log(`Boulder toggle is: ${boulderToggle}`);
            filterBoulder.removeClass('shadow-none');
        }
        else {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    displayContainer.prepend(`
                    <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                    <div class="climbItem card-body">
                        <div class="card-head">
                            <h4 class="card-title">${climbData[idx][0]}</h4>
                            <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                         </div>
                        <ul class="list-group my-2">
                            <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                        </ul>
                        <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                    </div>
                </div>
                    `);
                };
            }

            boulderToggle = false;
            console.log(`Boulder toggle is: ${boulderToggle}`);
            filterBoulder.addClass('shadow-none');
        }
    });

    // Sport filter button event
    filterSport.click(() => {
        console.log('Sport filter clicked!');

        // Check toggle variable state
        if (sportToggle === false) {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    if (climbData[idx].includes('Sport')) {
                        displayContainer.prepend(`
                        <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                        <div class="climbItem card-body">
                            <div class="card-head">
                                <h4 class="card-title">${climbData[idx][0]}</h4>
                                <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                             </div>
                            <ul class="list-group my-2">
                                <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                                <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                                <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                            </ul>
                            <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                        </div>
                    </div>
                        `);
                    };
                };
            };

            // Change global togge variables
            boulderToggle = false;
            tradToggle = false;
            sportToggle = true;
            console.log(`Sport toggle is: ${sportToggle}`);
            // Remove shadow from on click
            filterSport.removeClass('shadow-none');
        }
        else {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    displayContainer.prepend(`
                    <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                    <div class="climbItem card-body">
                        <div class="card-head">
                            <h4 class="card-title">${climbData[idx][0]}</h4>
                            <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                         </div>
                        <ul class="list-group my-2">
                            <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                        </ul>
                        <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                    </div>
                </div>
                    `);
                };
            }

            sportToggle = false;
            console.log(`Sport toggle is: ${sportToggle}`);
            filterSport.addClass('shadow-none');
        }
    });


    // Trad filter button event
    filterTrad.click(() => {
        console.log('Trad filter clicked!');

        // Check toggle variable state
        if (tradToggle === false) {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    if (climbData[idx].includes('Trad')) {
                        displayContainer.prepend(`
                        <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                        <div class="climbItem card-body">
                            <div class="card-head">
                                <h4 class="card-title">${climbData[idx][0]}</h4>
                                <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                             </div>
                            <ul class="list-group my-2">
                                <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                                <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                                <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                            </ul>
                            <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                        </div>
                    </div>
                        `);
                    };
                };
            };

            // Change global togge variables
            boulderToggle = false;
            sportToggle = false;
            tradToggle = true;
            console.log(`Trad toggle is: ${tradToggle}`);
            // Remove shadow from on click
            filterTrad.removeClass('shadow-none');
        }
        else {

            // Get data from localStorage
            const climbData = JSON.parse(localStorage.getItem('climbs'));

            // Loop through climb items
            if (climbData) {
                displayContainer.empty();
                for (let idx = 0; idx < climbData.length; idx++) {
                    displayContainer.prepend(`
                    <div class="card mx-2 mb-2 bg-secondary" style="width: 16rem;">
                    <div class="climbItem card-body">
                        <div class="card-head">
                            <h4 class="card-title">${climbData[idx][0]}</h4>
                            <h4 class="card-subtitle text-success">${climbData[idx][4]}</h4>
                         </div>
                        <ul class="list-group my-2">
                            <li class="list-group-item bg-secondary">${climbData[idx][1]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][2]}</li>
                            <li class="list-group-item bg-secondary">${climbData[idx][3]}</li>
                        </ul>
                        <button type="button" class="delete btn btn-primary btn-sm">Delete</button>
                    </div>
                </div>
                    `);
                };
            }

            tradToggle = false;
            console.log(`Trad toggle is: ${tradToggle}`);
            filterTrad.addClass('shadow-none');
        }
    });

});

// Format Date function
const formatDate = (climbDate) => {
    const year = climbDate.slice(0,4);
    const month = climbDate.slice(5,7);
    const day = climbDate.slice(8,10);

    const dateString = `${day}/${month}/${year}`;
    return dateString;
}
