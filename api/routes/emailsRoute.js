const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Email = require('../models/Email');
const validator = require("email-validator");
const nodemailer = require('nodemailer');
const credentials = require('../config/email_credentials');

// Email transporter
var transporter = nodemailer.createTransport({
    service: credentials.service,
    auth: {
        user: credentials.user,
        pass: credentials.password
    }
});

router.get('/api/emails/', async (req, res) => {
    const session = await Session.query().where({ session_id: req.session.user })
    const emails = await Email.query().where({ user_id: session[0].user_id }).orderBy('sent_at', 'desc').limit(10);

    res.send(emails);
});

router.post('/api/email/send', async (req, res)=> {
    // Get recieving email data from req
    const { to_address, content } = req.body;

    // Getting user id from session
    const user_id = (await Session.query().where({ session_id: req.session.user }))[0].user_id;

    // Validate data
    if (!(to_address && content)) {
        res.status(400).json({ response: "You'll have to fill in data for it to work"})
    }
    else if (!validator.validate(to_address)) {
        res.status(400).json({ response: "Invalid email address" });
    }
    else {
        // Prepare email
        const mailOptions = {
            from: credentials.from,
            to: to_address,
            subject: 'You got mail!',
            html: content
        };
        
        // // Send email via nodemailer
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                res.status(503).json({response: "Email service error"});
            }
            else {
                // Store email data in database
                await Email.query().insert({"user_id": user_id, "to_address": to_address, "content": content});
                res.status(200).json({ response: "Email was successfully sent to " + to_address});
            }
        });
    }
});

module.exports = router;