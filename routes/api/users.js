const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegister = require('../../validators/register');
const Users = require('../../models/users');
/*
@router GET api/admin/test
@desc 	Test route
@access Public
*/
router.get('/',(req, res) => res.json({ message : 'It works'}) );

// Register new user route
router.post('/register',(req, res) => {

    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) return res.status(400).json({validation : errors});

    Users.findOne({ email : req.body.email })
        .then((user) => {
            // If user already exist.
            if (user) return res.status(400).json({ message : 'Email already exist'});
            // else create new object for User model
            const newUser = new Users({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password1
            });
            console.log(newUser);
            // Bcrypt to generate salt
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash; // Assigning hash into password field
                    newUser.save()
                        .then(user => res.json({ message : 'User created', user : user }))
                        .catch(err => res.status(400).json({ message : 'Error while creating user', error : err }));
                });
            });
        })
        .catch((err) => {
            res.status(400).json({ message : err })
        });
});

//  Login new user route
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Users.findOne({ email })
        .then(user => {
            // if no user found 
            if (!user) return res.status(400).json({ message : 'User not found'});
            // else check for credentials
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // if password matches send success
                    if (isMatch) {
                        const payload = { id: user.id , name : user.name };
                        jwt.sign(payload, keys.secretKey, { expiresIn : 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                message: 'Login success',
                                token: token
                            });
                        });
                        return;
                    }
                    // else not matching throw error message
                    res.status(400).json({ message : 'Incorrect username or password' });
                })
        });
});

module.exports = router;