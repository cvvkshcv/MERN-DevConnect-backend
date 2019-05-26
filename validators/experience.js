const Validator = require('validator');
const isEmpty = require('./util');

const experienceValidator = (data) => {
    let errors = {};
    data.title = data.title || '';
    data.company = data.company || '';
    data.location = data.location || '';
    data.from = data.from || '';
    data.to = data.to || '';
    data.current = data.current;

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title is required';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company name is required';
    }

    if (Validator.isEmpty(data.location)) {
        errors.location = 'Location is required';
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

module.exports = experienceValidator;
