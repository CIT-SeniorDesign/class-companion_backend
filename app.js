// loads environment variables from .env
if (process.env.NODE_ENV !=='production'){ // if the environment is development include env file
    require('dotenv').config(); // this will load all environment processes
}

// Dependencies
const express = require('express');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');

const app = express();

// // File imports
const initializePassport = require('./configure/passport-configure');
initializePassport(
    passport, // configures passport  
    email => users.find(user => user.email === email), // set user to user.email and make it set to email
    id => user.find(user => user.id === id)
);

// Test User Authentication
let users = [];

// This allows input to be accessed through requests and POSTS
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this does not change session variable if nothing is changed
    saveUninitalized: false // does not save empty value into the session
}))
app.use(passport.initialize()) // sets up initial basic configuration of passport
app.use(passport.session()) // itneracts with the app.use session above


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/home.html'));
}); 

// Register routes
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/register.html'));
}); 

app.post('/register', async (req, res) => {
    try {
        // This will hash users password and store into users array
        console.log(req.body);
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        // push user data into 
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
            })
        res.redirect('/login') // Redirect to login after registering
    } catch {
        res.redirect('/register') // If failed redirect to register
    }
    console.log(users);
})

// Login routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/', // redirect to successful login 
    failureRedirect: '/login', // redirect to failed login
    failureFlash: true // this allows error message to be outputed to user
}))

// calls port to listen to 
app.listen(3000, ()=> console.log('Server running on http://localhost:3000'));