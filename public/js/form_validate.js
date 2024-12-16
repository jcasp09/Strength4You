// Client-Side form validation

// Validation funcitons needed: 
function checkName(name, varName) {
    name = this.checkString(name, varName)
    if (/\d/.test(name))
        throw `Error: ${varName} cannot contain digits`
    if (name.length < 2 || name.length > 25)
        throw `Error: ${varName} needs to be at least 2 characters long and must not exceed 25 characters`

    return name
}

function checkUser(user) {
    user = this.checkString(user, "User ID")
    if (/\d/.test(user))
        throw `Error: User ID cannot contain digits`
    if (user.length < 5 || user.length > 10)
        throw `Error: User ID needs to be at least 5 characters long and must not exceed 25 characters`

    return user.toLowerCase();
}

function checkPassword(password) {
    password = this.checkString(password, "Password");
    if (/\s/.test(password))
        throw `Error: Password cannot contain spaces`

    if (password.length < 8)
        throw `Error: Password must be at least 8 characters long`

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
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
    email = this.checkString(email, "Email")
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
        throw `Invalid email supplied`
    return email
}

function checkDOB(dob) {
    if (!dob || isNaN(Date.parse(dob))) throw 'invalid date of birth'
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

    // Validate Date of Birth (optional?)
    // try {
    //     checkDOB($('#dob').val(), 'Email')
    // } catch (e) {
    //     validForm = false
    //     $('#dobError').text(e).show()
    // }

    // Validate City
    try {
        checkString($('#city').val(), 'City')
    } catch (e) {
        validForm = false
        $('#cityError').text(e).show()
    }

    // Validate State
    try {
        checkString($('#state').val(), 'State')
    } catch (e) {
        validForm = false
        $('#stateError').text(e).show()
    }


    // Input fields are valid, submit form
    if (validForm) {
        event.target.submit()
    }
})