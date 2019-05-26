const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile');
const validateProfile = require('../../validators/profile');
const isEmpty = require('../../validators/util');
const jwtAuth  = require('../../config/jwtAuth');
const experienceValidator = require('../../validators/experience');
const educationValidator = require('../../validators/education');
/*
@router GET api/products/test
@desc 	Test route
@access Public
*/
router.get('/', jwtAuth, (req, res) => {
    const userid = req.decoded.id;
    Profile.findOne({ user : userid })
        .then((profile) => {
            if (profile) {
                res.json({ message : profile});
                return;
            }
            res.status(404).json({ message : 'No profile found'});
        })
        .catch((err) => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err });
        });
});

router.post('/', jwtAuth, (req, res) => {
    // Validation
    const { errors , isValid } = validateProfile(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.decoded.id;
    profileFields.handle = req.body.handle;
    profileFields.company = req.body.company;
    profileFields.website = req.body.website;
    profileFields.location = req.body.location;
    profileFields.status = req.body.status;
    profileFields.skills = (req.body.skills) ? req.body.skills.split(',') : undefined;
    profileFields.bio = req.body.bio;
    profileFields.githubusername = req.body.githubusername;
    profileFields.social = {};
    if (!isEmpty(req.body.social)) {
        profileFields.social.youtube = req.body.social.youtube;
        profileFields.social.twitter = req.body.social.twitter;
        profileFields.social.facebook = req.body.social.facebook;
        profileFields.social.linkedin = req.body.social.linkedin;
        profileFields.social.instagram = req.body.social.instagram;
    }

    Profile.findOne({ user : req.decoded.id })
        .then(profile => {
            if (profile) {
                // update
                delete profileFields.handle;
                Profile.findOneAndUpdate({ user : req.decoded.id }, { $set : profileFields }, { new : true })
                    .then((_profile) => {
                        res.json({ profile : _profile , message : 'Profile updated successfully'});
                    })
                    .catch((err) => {
                        console.log((__filename.split('\\').pop()) , __line, __function);
                        res.status(400).json({ message : err.message });
                    });
                return;
            } else {
                // else create profile
                Profile.findOne({ handle : profileFields.handle })
                    .populate('user', ['name', 'email'])
                    .then((profile) => {
                        if (profile) {
                            res.status(400).json({ message : 'Handle already exist.' });
                        }
                        // Save profile
                        new Profile(profileFields).save(profile)
                            .then((_profile) => {
                                res.json({ profile : _profile , message : 'Profile created successfully'});
                            })
                            .catch((err) => {
                                res.status(400).json({ message : err });
                            });
                    });
            }
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err.message });
        });
});


// GET profile using handler
router.get('/handle/:handle', (req, res) => {
    Profile.findOne({ handle : req.params.handle })
        .populate('user', ['name', 'email'])
        .then(profile => {
            if (!profile) {
                res.status(404).json({ message : 'There is no user for this handle' });
            }
            res.json({ profile });
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err.message });
        });
});

// POST experience - Add experience to profile

router.post('/experience', jwtAuth, (req, res) => {
    
    const {errors, isValid } = experienceValidator(req.body);
    if (!isValid) res.json({errors});
    
    Profile.findOne({ user : req.decoded. id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            profile.experience.unshift(newExp);
            profile.save()
                .then(profile => res.json({ message : 'Experience added successfully' , profile }))
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , __line, __function);
                    res.status(400).json({ message : err.message });
                });
        })
        .catch(() => {
            res.status(404).json({ message : 'No profile found'});
        });
});

// POST education - adding education
router.post('/education', jwtAuth, (req, res) => {
    
    const { errors, isValid } = educationValidator(req.body);
    if (!isValid) res.json({errors});

    Profile.findOne({ user : req.decoded. id})
        .then(profile => {
            const newEducation = {
                university: req.body.university,
                degree: req.body.degree,
                specialized: req.body.specialized,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            profile.education.unshift(newEducation);
            profile.save()
                .then(profile => res.json({ message : 'Education added successfully' , profile }))
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , __line, __function);
                    res.status(400).json({ message : err.message });
                });
        })
        .catch(() => {
            res.status(404).json({ message : 'No profile found' });
        });
});

//  DELETE experience - Delete experience
router.delete('/experience/:exp_id', jwtAuth, (req, res) => {
    Profile.findOne({ user : req.decoded. id})
        .then(profile => {
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
            // Splice out of array
            profile.experience.splice(removeIndex, 1);
            profile.save()
                .then(profile => res.json({ message : 'Experience deleted successfully' , profile }))
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , __line, __function);
                    res.status(400).json({ message : err.message });
                });
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err.message, err });
        });
});

//  DELETE education - Delete education
router.delete('/education/:edu_id', jwtAuth, (req, res) => {
    Profile.findOne({ user : req.decoded. id})
        .then(profile => {
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
            // Splice out of array
            profile.education.splice(removeIndex, 1);
            profile.save()
                .then(profile => res.json({ message : 'Education deleted successfully' , profile }))
                .catch(err => {
                    console.log((__filename.split('\\').pop()) , __line, __function);
                    res.status(400).json({ message : err.message });
                });
        })
        .catch(err => {
            console.log((__filename.split('\\').pop()) , __line, __function);
            res.status(400).json({ message : err.message, err });
        });
});

module.exports = router;