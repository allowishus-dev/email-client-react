const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 10 requests per windowMs
});
   
//  apply to all requests
app.use("/users/signup", authLimiter);
app.use("/users/activate", authLimiter);
app.use("/users/login", authLimiter);
app.use("/users/change_password", authLimiter);
app.use("/users/forgot_password", authLimiter);
app.use("/emails/login", emailLimiter);
app.use("/email/send", emailLimiter);

const session = require("express-session");

app.use(session({
    secret: 'this is a much better secret than the one in the documentation',
    resave: false,
    saveUninitialized: true,
}));

// Router import
const sessionRouter = require('./routes/sessionRoute');
const usersRouter = require('./routes/usersRoute');
const emailsRouter = require('./routes/emailsRoute')
app.use(sessionRouter);
app.use(usersRouter);
app.use(emailsRouter)

// Knex/Objection connection
const Knex = require('knex');
const knexConfig = require('./knexfile')
const Model = require('objection').Model;
const knex = Knex(knexConfig.development);
Model.knex(knex);

// Start Express server
app.listen(9000, (error) => {
    if (error) {
        console.log(error)
    }
    console.log('Express listening on port 9000!');
});