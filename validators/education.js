const Validator = require('validator');
const isEmpty = require('./util');

const educationValidator = (data) => {
    let errors = {};
    data.university = data.university || '';
    data.degree = data.degree || '';
    data.specialized = data.specialized || '';
    data.from = data.from || '';
    data.to = data.to || '';
    data.current = data.current;

    if (Validator.isEmpty(data.university)) {
        errors.university = 'University field is required';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree is required';
    }

    if (Validator.isEmpty(data.specialized)) {
        errors.specialized = 'Specialized field is required';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date is required';
    }

    if (!data.current && Validator.isEmpty(data.to)) {
        errors.from = 'To date is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};

module.exports = educationValidator;
