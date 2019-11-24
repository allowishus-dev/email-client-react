const router = require('express').Router();
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const nodemailer = require('nodemailer');
const credentials = require('../config/email_credentials');

const saltRounds = 10;
const keyExpiration = 864000000;

// Email transporter
var transporter = nodemailer.createTransport({
    service: credentials.service,
    auth: {
        user: credentials.user,
        pass: credentials.password
    }
});

// Sign up
router.post('/users/signup', async (req, res) => {
    const { username, password, confirmpassword, email, firstname, lastname } = req.body;

    // Validation
    if (!(username && password && confirmpassword && email && firstname && lastname)) {
        res.status(400).json({ response: "Fields can not be empty" });
    }
    else if (password != confirmpassword) {
        res.status(400).json({ response: "Password and confirmation does not match" });
    }
    else if (!validator.validate(email)) {
        res.status(400).json({ response: "Invalid email address" });
    }
    else {
        const users = await User.query().select().where({username: req.body.username}).limit(1);
        const validUser = users[0];
        
        if (validUser) {
            res.status(400).json({ response: "User already exist" });
        }
        else {
            bcrypt.hash(password, saltRounds, async (error, hash)=> {
                if (error) {
                    res.status(500).json({ response: "Problem hashing the password" });
                }
                else {
                    const key = crypto.randomBytes(32).toString('hex');
                    delete req.body.confirmpassword
                    const newUser = { ...req.body, active: false, key: key, password: hash };
                    
                    const mailOptions = {
                        from: credentials.from,
                        to: email,
                        subject: 'You signed up for a user at reactnode',
                        html: '<h1>You signed up!</h1><p>Go to this <a href="http://localhost:9000/users/activate?username='+username+'&key='+key+'">link</a> to activate your user</p>'
                    };
                    
                    transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(503).json({"response": "Email service error"});
                        }
                        else {
                            // console.log('Email sent: ' + info.response);
                            const { username } = await User.query().insert(newUser);
                            res.status(200).json({ response: username + " was successfully created. An activation email was sent"});
                        }
                    });
                }       
            });
        }
    }
});

// Activate user
router.get('/users/activate', async (req, res) => {
    const users = await User.query().select().where({username: req.query.username}).limit(1);
    const validUser = users[0];

    if (validUser) {
        if (req.query.key == validUser.key) {

            if ((validUser.key_created_at.getTime() + keyExpiration) > Date.now()) {
                await User.query().select().where({username: req.query.username}).update({ active: true, key: '' });
                res.status(200).json({"response": "Activation successful"});
            }
            else {
                res.status(400).json({"response": "Activation request expired"});
            }
        }
        else {
            res.status(400).json({"response": "Activation failed"});
        }
    }
    else {
        res.status(400).json({"response": "User does not exist"});
    }
});

// Login
router.post('/users/login', async (req, res) => {
    const users = await User.query().select().where({username: req.body.username}).limit(1);
    const validUser = users[0];

    if (validUser) {
        if (validUser.active) {
            bcrypt.compare(req.body.password, validUser.password, (error, response)=> {
                if (error) {
                    res.status(500).json({response: "Problem checking the password" });
                }
                else {
                    if (response === true) {
                        res.status(200).json({response: "Logged in"});
                        console.log(validUser)
                    }
                    else {
                        res.status(401).json({response: "Login failed"});
                    }
                }
            });
        }
        else {
            res.status(401).json({"response": "You need to activate this account"});
        }     
    }
    else {
        res.status(400).json({"response": "User does not exist"});        
    }
});

// Change password
// TODO: Unsafe, needs permission check to call
router.post('/users/change_password', async (req, res) => {
    const { username, originalpassword, password, confirmpassword } = req.body
    const users = await User.query().select().where({username: username}).limit(1);
    const validUser = users[0];
    
    if (validUser) {
        if (validUser.active) {
            bcrypt.compare(req.body.password, validUser.password, (error, response)=> {
                if (error) {
                    res.status(500).json({response: "Problem checking the password" });
                }
                else {
                    if (response === true) {
                        if (password == confirmpassword) {
                            bcrypt.hash(password, saltRounds, async (error, hash)=> { 
                                if (!error) {
                                    await User.query().select().where({username: username}).update({ password: hash });
                                    res.status(200).json({ response: "Password successfully changed" });
                                }
                                else {
                                    res.status(500).json({ response: "Problem hashing the password" });
                                }
                            });
                        }
                        else {
                            res.status(400).json({ response: "New password and confirmation does not match" });
                        }
                    }
                    else {
                        res.status(400).json({ response: "Old password and new password does not match" });
                    }
                }
            });
        }
        else {
            res.status(401).json({"response": "You need to activate this account"});
        }
    }
    else {
        res.status(400).json({ response: "User does not exist" });
    }
});

// Forgot password request
router.post('/users/forgot_password', async (req, res) => {
    const users = await User.query().select().where({username: req.body.username}).limit(1);
    const validUser = users[0];
    
    if (validUser) {
        if (validUser.active) {
            const key = crypto.randomBytes(32).toString('hex');

            const mailOptions = {
                from: credentials.from,
                to: validUser.email,
                subject: 'You requested to change your password at reactnode',
                html: '<h1>Forgot password?</h1><p>Go to this <a href="http://localhost:9000/users/forgot_password?username='+validUser.username+'&key='+key+'">link</a> to activate your user</p>'
            };
            
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(503).json({"response": info});
                }
                else {
                    // console.log('Email sent: ' + info.response);
                    await User.query().select().where({username: req.body.username}).update({ key: key, key_created_at: new Date() });
                    res.status(200).json({"response": "Reset password confirmation email was sent"});
                }
            });
        }
        else {
            res.status(401).json({"response": "You need to activate this account"});
        }
    }
    else {
        res.status(400).json({ response: "User does not exist" });
    }
})

// Reset password
router.get('/users/forgot_password', async (req, res) => {
    const users = await User.query().select().where({username: req.query.username}).limit(1);
    const validUser = users[0];

    if (validUser) {
        if (validUser.active) {  
            if (req.query.key == validUser.key) {

                if ((validUser.key_created_at.getTime() + keyExpiration) > Date.now()) {
                    await User.query().select().where({username: req.query.username}).update({ key: '' });
                    res.status(200).json({"response": "Sending to change password"});
                }
                else {
                    res.status(400).json({"response": "Reset password request expired"});
                }
            }
            else {
                res.status(400).json({"response": "Reset password request failed"});
            }
        }
        else {
            res.status(401).json({"response": "You need to activate this account"});    
        }
    }
    else {
        res.status(400).json({"response": "User does not exist"});
    }
})

// Updates user
router.put('/users', async (req, res) => {
    res.send();
})

// Deleting user
router.get('/users', async (req, res) => {
    const users = await User.query().eager('emails')
    users.forEach(element=> {
        // console.log(element.emails)
        element.emails.forEach(element=> {
            console.log(element)

        });
    });
    // console.log(users)
    res.send(users);
})

module.exports = router;