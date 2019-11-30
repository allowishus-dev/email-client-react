const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require("email-validator");
const nodemailer = require('nodemailer');
const credentials = require('../config/email_credentials');
const session = require("express-session");

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
router.post('/api/users/signup', async (req, res) => {
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
    else if ((await User.query().select().where({email: req.body.email}).limit(1))[0]) {
        res.status(400).json({ response: "Email already in use" });
    }
    else if ((await User.query().select().where({username: req.body.username}).limit(1))[0]) {
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
                    subject: 'You signed up for a user at email-service',
                    html: '<h1>You signed up!</h1><p>Go to this <a href="http://localhost:3000/users/activate/'+username+'/'+key+'">link</a> to activate your user</p>'
                };
                
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.log(error);
                        res.status(503).json({response: "Email service error"});
                    }
                    else {
                        const { username } = await User.query().insert(newUser);
                        res.status(200).json({ response: username + " was successfully created. An activation email was sent"});
                    }
                });
            }       
        });
    }
});

// Activate user
router.post('/api/users/activate', async (req, res) => {
    const users = await User.query().select().where({username: req.body.username}).limit(1);
    const validUser = users[0];

    if (!validUser) {
        res.status(400).json({response: "User does not exist"});
    }
    else if (req.body.key != validUser.key) {
        res.status(400).json({response: "Activation failed"});
    }
    else if ((validUser.key_created_at.getTime() + keyExpiration) < Date.now()) {
        res.status(400).json({response: "Activation request expired"});
    }
    else {
        await User.query().select().where({username: req.body.username}).update({ active: true, key: '' });
        res.status(200).json({response: "Activation successful. You can log in now"});
    }
});

// Login
router.post('/api/users/login', async (req, res) => {
    if (!(req.body.username && req.body.password)) {
        res.status(400).json({ response: "You'll have to fill in data for it to work" })
    }
    else {
        const users = await User.query().select().where({username: req.body.username}).limit(1);
        const validUser = users[0];
        
        if (!validUser) {
            res.status(400).json({response: "User does not exist"});        
        }
        else if (!validUser.active) {
            res.status(401).json({response: "You need to activate this account"});            
        }
        else {
            bcrypt.compare(req.body.password, validUser.password, async (error, response)=> {
                if (error) {
                    res.status(500).json({response: "Problem checking the password" });
                }
                else {
                    if (response === true) {
                        req.session.user =  req.session.id ;
                        await Session.query().insert({ user_id: validUser.id, session_id: req.session.id });

                        res.status(200).json({response: validUser.username + " logged in"});
                    }
                    else {
                        res.status(401).json({response: "Login failed"});
                    }
                }
            });
        }
    }
});
router.post('/api/users/verify_user', async (req, res) => {
    const { username, key } = req.body;
    
    if (username && key) {
        const users = await User.query().select().where({username: username}).limit(1);
        const validUser = users[0];

        if (!validUser) {
            res.status(400).json({response: "User does not exist"});
        }
        else if (!validUser.active) {  
            res.status(401).json({response: "You need to activate this account"});    
        }
        else if (key != validUser.key) {
            res.status(400).json({response: "Reset password request failed"});
        }
        else if ((validUser.key_created_at.getTime() + keyExpiration) < Date.now()) {
            res.status(400).json({response: "Reset password request expired"});
        }
        else {
            const newKey = crypto.randomBytes(32).toString('hex');
            await User.query().select().where({id: validUser.id}).update({ key: newKey, key_created_at: new Date() });
            res.status(200).json({ id: validUser.id, key: newKey });
        }
    }
    else if (req.session.user) {
        const session = await Session.query().where({ session_id: req.session.user })
        const newKey = crypto.randomBytes(32).toString('hex');
        await User.query().select().where({id: session[0].user_id}).update({ key: newKey, key_created_at: new Date() });
        res.status(200).json({ id: session[0].user_id, key: newKey });
    }
    else {
        res.status(401).json({ response: "You are not allowed this change" });
    }
}); 

// Change password
router.post('/api/users/change_password', async (req, res) => {    
    const { user_id, key, newpassword, confirmpassword } = req.body

    if (!(newpassword && confirmpassword)) {
        res.status(400).json({ response: "You'll have to fill in data for it to work" });
    }
    else {
        const users = await User.query().select().where({ id: user_id, key: key }).limit(1);
        const validUser = users[0];

        if (!validUser) {
            res.status(401).json({ response: "You are not allowed this change" });
        }
        else if (!validUser.active) {
            res.status(401).json({response: "You need to activate this account"});       
        }
        else if (newpassword != confirmpassword) {
            res.status(400).json({ response: "New password and confirmation does not match" });
        }
        else {
            bcrypt.hash(newpassword, saltRounds, async (error, hash)=> { 
                if (!error) {
                    await User.query().select().where({id: user_id }).update({ password: hash, key: "" });
                    res.status(200).json({ response: "Password successfully changed" });
                }
                else {
                    res.status(500).json({ response: "Problem hashing the password" });
                }
            });
        }
    }
});

// Forgot password request
router.post('/api/users/forgot_password', async (req, res) => {
    if (!req.body.username) {
        res.status(400).json({ response: "You have to enter a username" });
    }
    else {
        const users = await User.query().select().where({username: req.body.username}).limit(1);
        const validUser = users[0];
        
        if (!validUser) {
            res.status(400).json({ response: "User does not exist" });
        }
        else if (!validUser.active) {
            res.status(401).json({response: "You need to activate this account"});
        }
        else {
            const key = crypto.randomBytes(32).toString('hex');
            
            const mailOptions = {
                from: credentials.from,
                to: validUser.email,
                subject: 'You requested to change your password at email-service',
                html: '<h1>Forgot password?</h1><p>Go to this <a href="http://localhost:3000/users/change_password/'+validUser.username+'/'+key+'">link</a> to change your password</p>'
            };
            
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(503).json({response: info});
                }
                else {
                    await User.query().select().where({username: req.body.username}).update({ key: key, key_created_at: new Date() });
                    res.status(200).json({response: "Reset password confirmation email was sent"});
                }
            });
        }
    }
});

module.exports = router;