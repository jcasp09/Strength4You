// Client-Side form validation


// Validation funcitons needed: 
function checkName(name, varName) {
    name = checkString(name, varName)
    if (/\d/.test(name))
        throw `Error: ${varName} cannot contain digits`
    if (name.length < 2 || name.length > 25)
        throw `Error: ${varName} needs to be at least 2 characters long and must not exceed 25 characters`

    return name
}

function checkUser(user) {
    user = checkString(user, "User ID")
    if (user.length < 5 || user.length > 25)
        throw `Error: User ID needs to be at least 5 characters long and must not exceed 25 characters`

    return user.toLowerCase(); // Ex: phil and PhIL should count as the same userId
}

function checkPassword(password) {
    password = checkString(password, "Password");
    if (/\s/.test(password))
        throw `Error: Password cannot contain spaces`

    if (password.length < 8)
        throw `Error: Password must be at least 8 characters long`

    if (!/[^a-zA-Z0-9]/.test(password))
        throw `Error: Password must contain at least one special character`

    if (!/\d/.test(password))
        throw `Error: Password must contain at least one digit`

    if (!/[A-Z]/.test(password))
        throw `Error: Password must contain at least one uppercase alphabetical character`

    return password
}

function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
        throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
}

function checkEmail(email) {
    email = checkString(email, "Email")
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
        throw `Invalid email supplied`
    return email
}

function checkDOB(dob) {
    let date = new Date(dob)
    let today = new Date()
    if (isNaN(date.getTime()))
        throw `Invalid dob supplied`
    if (date.getFullYear() > today.getFullYear() ||
        date.getFullYear() === today.getFullYear() && date.getMonth() > today.getMonth() ||
        date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() > today.getDate())
        throw `Cannot set a dob in the future`
}

function checkDay(day) {
    if (!day) return "Closed"
    day = checkString(day, "Day");
    if (!/^(0[1-9]|1[0-2])(am|pm)-0[1-9]|1[0-2](am|pm)$/.test(day) && day !== "Closed")
        throw `Day's Hours is in invalid format`
    if (day === "Closed")
        return day
    let start = parseInt(day.substring(0, 2)), period1 = day.substring(2, 2), end = parseInt(day.substring(5, 2)), period2 = day.substring(7, 2)
    if (period1 == period2 && end <= start && day !== "12am-12am")
        throw `Day's Hours are invalid`
    return day;
}

function checkState(state) {
    state = checkString(state, "State")
    const validStates = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ];
    if (!validStates.includes(state))
        throw `Invalid State supplied`

    return state;
}



// Event Handler: submission of User Signup form
$('#userSignUpForm').submit(async (event) => {
    event.preventDefault()
    $('.error').hide()

    let validForm = true

    // Validate First Name
    try {
        checkName($('#firstName').val(), 'First Name')
    } catch (e) {
        validForm = false
        $('#firstNameError').text(e).show()
    }

    // Validate Last Name
    try {
        checkName($('#lastName').val(), 'Last Name')
    } catch (e) {
        validForm = false
        $('#lastNameError').text(e).show()
    }

    // Validate User ID
    try {
        checkUser($('#userId').val())
    } catch (e) {
        validForm = false
        $('#userIdError').text(e).show()
    }

    // Validate Password and Confirm Password
    try {
        checkPassword($('#password').val());
        if ($('#password').val() !== $('#confirmPassword').val()) {
            throw new Error("Passwords do not match.");
        }
    } catch (e) {
        validForm = false;
        $('#passwordError').text(e).show();
        $('#confirmPasswordError').text(e).show();
    }

    // Validate Email (optional?)
    try {
        checkEmail($('#email').val())
    } catch (e) {
        validForm = false
        $('#emailError').text(e).show()
    }

    //Validate Date of Birth (optional?)
    try {
        checkDOB($('#dob').val())
    } catch (e) {
        validForm = false
        $('#dobError').text(e).show()
    }

    // Validate City
    try {
        checkString($('#city').val(), 'City')
    } catch (e) {
        validForm = false
        $('#cityError').text(e).show()
    }

    // Validate State
    try {
        checkState($('#state').val())
    } catch (e) {
        validForm = false
        $('#stateError').text(e).show()
    }


    // Input fields are valid, submit form
    if (validForm) {
        event.target.submit()
    }
})


// Event Handler: submission of Gym Signup form
$('#gymSignUpForm').submit(async (event) => {
    event.preventDefault()
    $('.error').hide()

    let validForm = true

    // Validate Gym Name
    try {
        checkString($('#name').val(), 'Gym Name')
    } catch (e) {
        validForm = false
        $('#nameError').text(e).show()
    }

    // Validate User ID
    try {
        checkUser($('#userId').val(), 'User ID')
    } catch (e) {
        validForm = false
        $('#userIdError').text(e).show()
    }

    // Validate Password and Confirm Password
    try {
        checkPassword($('#password').val(), 'Password');
        if ($('#password').val() !== $('#confirmPassword').val()) {
            throw new Error("Passwords do not match.");
        }
    } catch (e) {
        validForm = false;
        $('#passwordError').text(e).show();
        $('#confirmPasswordError').text(e).show();
    }

    // Validate Email (optional?)
    try {
        checkEmail($('#email').val(), 'Email')
    } catch (e) {
        validForm = false
        $('#emailError').text(e).show()
    }

    // Validate Address
    try {
        checkString($('#address').val(), 'Address')
    } catch (e) {
        validForm = false
        $('#addressError').text(e).show()
    }


    // Validate Monday Hours
    try {
        checkDay($('#monday').val(), 'Monday')
    } catch (e) {
        validForm = false
        $('#monError').text(e).show()
    }
    // Validate Monday Hours
    try {
        checkDay($('#tuesday').val(), 'Tuesday')
    } catch (e) {
        validForm = false
        $('#tueError').text(e).show()
    }
    // Validate Wednesday Hours
    try {
        checkDay($('#wednesday').val(), 'Wednesday')
    } catch (e) {
        validForm = false
        $('#wedError').text(e).show()
    }
    // Validate Thursday Hours
    try {
        checkDay($('#thursday').val(), 'Thursday')
    } catch (e) {
        validForm = false
        $('#thuError').text(e).show()
    }
    // Validate Friday Hours
    try {
        checkDay($('#friday').val(), 'Friday')
    } catch (e) {
        validForm = false
        $('#friError').text(e).show()
    }
    // Validate Saturday Hours
    try {
        checkDay($('#saturday').val(), 'Saturday')
    } catch (e) {
        validForm = false
        $('#satError').text(e).show()
    }
    // Validate Sunday Hours
    try {
        checkDay($('#sunday').val(), 'Sunday')
    } catch (e) {
        validForm = false
        $('#sunError').text(e).show()
    }


    // Input fields are valid, submit form
    if (validForm) {
        event.target.submit()
    }
})


// Event Handler: submission of User Signin form
$('#signInUser').submit((event) => {
    event.preventDefault()
 
    let validForm = true
 
    // Clear previous errors on submission
    $('.error').hide()
 
    // Validate User ID
    try {
       checkUser($('#userId').val(), 'User ID')
    } catch (error) {
       validForm = false
       $('#userIdError').text(error).show()
    }
 
    // Validate Password
    try {
       checkPassword($('#password').val(), 'Password')
    } catch (error) {
       validForm = false
       $('#passwordError').text(error).show()
    }
 
    // Input fields are valid, submit form
    if (validForm) {
       event.target.submit()
    }
 })


 // Event Handler: submission of Gym Signin form
$('#signInUser').submit((event) => {
    event.preventDefault()
 
    let validForm = true
 
    // Clear previous errors on submission
    $('.error').hide()
 
    // Validate User ID
    try {
       checkUser($('#userId').val(), 'User ID')
    } catch (error) {
       validForm = false
       $('#userIdError').text(error).show()
    }
 
    // Validate Password
    try {
       checkPassword($('#password').val(), 'Password')
    } catch (error) {
       validForm = false
       $('#passwordError').text(error).show()
    }
 
    // Input fields are valid, submit form
    if (validForm) {
       event.target.submit()
    }
 })

 // Client-side validation and hiding the sign-up/sign-in for authenticated users (people already logged in)
$(document).ready(function () {
    // Check for the injected isAuthenticated variable
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        console.log('User is authenticated. Hiding sign-up and sign-in options.');

        // Hide sign-up and sign-in links to avoid redundancy 
        $('#signUpUserLink, #signInUserLink, #signUpGymLink, #signInGymLink').hide();

        // Modify the message showing the user is already signed in
        $('#createAccountMessage').text('You are already signed in!');

        // This adds a button to return to the search page
        $('.container').append(`
            <div style="margin-top: 20px;">
                <a href="/home/search" id="searchMenuButton" style="font-size: 1.2em; color: #007BFF; text-decoration: none;">
                    Go to Search Menu
                </a>
            </div>
        `);
    }
});

$('#updateUser').submit((event) => {
    event.preventDefault();
    $('.error').hide()

    let validForm = true;

    if ($('#firstName').val())
        try {
            checkName($('#firstName').val(), "First Name")
        } catch (e) {
            validForm = false;
            $('#firsNameError').text(e).show()
        }

    if ($('#lastName').val())
        try {
            checkName($('#lastName').val(), "Last Name")
        } catch (e) {
            validForm = false;
            $('#lastNameError').text(e).show()
        }
    
    if ($('#userId').val())
        try {
            checkUser($('#userId').val())
        } catch (e) {
            validForm = false;
            $('#userIdError').text(e).show()
        }
    
    if ($('#userId').val())
        try {
            checkUser($('#userId').val())
        } catch (e) {
            validForm = false;
            $('#userIdError').text(e).show()
        }
    
    if ($('#oldPassword').val())
        try {
            if (!$('#password').val())
                throw `Supply a new password`
            else
                checkPassword($('#password').val())
            if ($('#oldPassword').val() === $('#password').val())
                throw `New password cannot be the same as the old password!`
        } catch (e) {
            validForm = false;
            $('#userIdError').text(e).show()
        }
    
    if ($('#email').val())
        try {
            checkEmail($('#email').val())
        } catch (e) {
            validForm = false;
            $('#emailError').text(e).show()
        }
    if ($('#dob').val())
        try {
            checkDOB($('#dob').val())
        } catch (e) {
            validForm = false;
            $('#dob').text(e).show()
        }
    if ($('#city').val())
        try {
            checkString($('#city').val(), "City")
        } catch (e) {
            validForm = false;
            $('#cityError').text(e).show()
        }
    
    if ($('#state').val())
        try {
            checkState($('#state').val())
        } catch (e) {
            validForm = false;
            $('#stateError').text(e).show()
        }
    
    if (validForm)
        event.target.submit();
})

$('.edit-btn').on('click', function (event) {
    event.preventDefault();
    
    let targetId = $(this).data('target');
    let targetInput = $(`#${targetId}`);

    if (targetInput.prop('disabled')) {
        if (targetId === "dob")
            targetInput.attr("type", "date")
        targetInput.prop('disabled', false).focus();
        $(this).text('Reset');
    } else {
        if (targetId === "dob")
            targetInput.attr("type", "text")
        targetInput.prop('disabled', true);
        targetInput.val('')
        $(this).text('Edit');
    }
});


// Event Handler: Gym Search Form, validate fields and search
$('#gymSearchForm').submit(function (event) {
    event.preventDefault();

    // Hide errors
    $('#gymNameError').hide()
    $('#gymAddressError').hide()
    let name = $('#nameSearchTerm').val().trim()
    let address = $('#addressSearchTerm').val().trim()



    $('#searchResults').empty().hide(); // Clear old results

    let validForm = true

    // Validate Gym Name
    try {
         if (name) checkString(name, 'Gym Name')
    } catch (e) {
        validForm = false
        if (name) {
            $('#gymNameError').text(e).show()
        }
        $('#nameSearchTerm').val('').focus();
    }

    let searchObj = {};
    if (name) searchObj.name = name;
    if (address) searchObj.address = address; // Address is optional but valid

    if (name) searchObj.name = name
    if (address) searchObj.address = address // address search is always valid



    // Prepare Ajax request
    let requestConfig = {
        method: 'POST',
        url: '/api/search', // Your API endpoint for searching gyms
        contentType: 'application/json',
        data: JSON.stringify(searchObj),
    };

    // Send Ajax request
    $.ajax(requestConfig)
        .then(function (responseMessage) {
            if (responseMessage.length === 0) {
                $('#searchResults')
                    .append('<p>No gyms found matching your search.</p>')
                    .show();
                return;
            }

            // Dynamically display search results with clickable links
            responseMessage.forEach((gym) => {
                $('#searchResults').append(
                    `<li>
                        <h3>
                            <a href="#" class="gym-link" data-id="${gym._id}" style="color: #007BFF; text-decoration: none;">
                                ${gym.name}
                            </a>
                        </h3>
                        <p><strong>Address:</strong> ${gym.address}</p>
                        <p><strong>Hours:</strong> ${formatHours(gym.hours)}</p>
                    </li>`
                );
            });

            $('#searchResults').show();
        })
        .catch(function (error) {
            console.error(error);
            $('#searchResults').append('<p>Error fetching search results.</p>').show();
        });
});

// Helper function to format hours nicely
function formatHours(hours) {
    let formatted = '';
    for (let day in hours) {
        formatted += `${day}: ${hours[day]}<br>`;
    }
    return formatted;
}

// Event delegation to handle dynamic links
$(document).on('click', '.gym-link', function (event) {
    event.preventDefault(); // Prevent default link behavior
    const gymId = $(this).data('id'); // Retrieve the gym ID from the data attribute

    // Redirect to the gym info page dynamically
    window.location.href = `/profile/gym/${gymId}`;
});
