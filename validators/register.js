const validator = require('validator');
const isEmpty = require('./util');

const validateRegister = (data) => {
    let errors = {};

    data.name = data.name || '';
    data.email = data.email || '';
    data.password1 = data.password1 || '';
    data.password2 = data.password2 || '';

    if (validator.isEmpty((data.name))) {
        errors.name = 'Name is empty';
    }

    if (!validator.isLength(data.name, { min: 2,  max : 15 })) {
        errors.name = 'Name should atlease 2-15 character';
    }

    if (!validator.isEmail((data.email))) {
        errors.email = 'Not a valid email';
    }

    if (validator.isEmpty((data.email))) {
        errors.email = 'Email is empty';
    }

    if(!validator.isLength(data.password1, { min : 6 })) {
        errors.password1 = 'Password must be more than 6 characters';
    }

    if (validator.isEmpty((data.password2))) {
        errors.password2 = 're-enter password is empty';
    }

    if(!validator.equals(data.password1, data.password2)) {
        errors.password2 = 'Password does not match';
    }

    return {errors, isValid: isEmpty(errors) };
}
module.exports = validateRegister;