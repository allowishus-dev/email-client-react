const router = require('express').Router();
const User = require('../models/User');
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

// router.get('/api/emails/', async (req, res) => {
//     const emails = (await User.query().where('username', req.body.username).eager('emails'))[0].emails;
//     // const email = user[0]

//     res.send(emails);
// });
router.get('/api/emails/', async (req, res) => {
    const emails = await Email.query();
    // const email = user[0]

    res.send(emails);
});

router.post('/api/email/send', async (req, res)=> {
    // Get recieving email data from req
    const { user_id, to_address, content } = req.body;

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
                res.status(503).json({"response": "Email service error"});
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