// Client-Side form validation


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
        $('#email').text(e).show()
    }

    // Validate Date of Birth (optional?)
    try {
        checkDOB($('#email').val(), 'Email')
    } catch (e) {
        validForm = false
        $('#email').text(e).show()
    }

    // Validate City
    try {
        checkString($('#city').val(), 'City')
    } catch (e) {
        validForm = false
        $('#city').text(e).show()
    }

    // Validate State
    try {
        checkString($('#state').val(), 'State')
    } catch (e) {
        validForm = false
        $('#state').text(e).show()
    }


    // Input fields are valid, submit form
    if (validForm) {
        event.target.submit()
    }
})