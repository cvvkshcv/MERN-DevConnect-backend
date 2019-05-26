const Validator = require('validator');
const isEmpty = require('./util');

const postValidator = (data) => {
    let errors = {};

    data.title = data.title || '';
    data.text = data.text || '';

    if (!Validator.isLength(data.text, { max : 160 })) {
        errors.text = 'Post should not exceed 160 characters';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text is required';
    }

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Title is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
}

module.exports = postValidator;