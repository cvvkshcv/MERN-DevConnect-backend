const validator = require('validator');
const isEmpty = require('./util');

const validateProfile = (data) => {
    let errors = {};

    data.handle = data.handle || '';
    data.status = data.status || '';
    data.skills = data.skills || '';
    data.website = data.website || '';
    data.youtube = data.youtube || '';
    data.twitter = data.twitter || '';
    data.facebook = data.facebook || '';
    data.linkedin = data.linkedin || '';
    data.instagram = data.instagram || '';

    if(!validator.isLength(data.handle, { min: 2, max : 40})) {
        errors.handle = 'Profile handle need to be atleast 2 characters';
    }

    if(validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    if(isEmpty(data.skills)) {
        errors.status = 'Skills field is required';
    }

    if (!validator.isEmpty(data.website)) {
        if (!validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    if (!validator.isEmpty(data.twitter)) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }

    if (!validator.isEmpty(data.facebook)) {
        if (!validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }

    if (!validator.isEmpty(data.youtube)) {
        if (!validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }

    if (!validator.isEmpty(data.linkedin)) {
        if (!validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL';
        }
    }

    if (!validator.isEmpty(data.instagram)) {
        if (!validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
};

module.exports = validateProfile;
