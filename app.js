// loads environment variables from .env
require('dotenv').config();
/**
 * -----------------DEPENDENCIES-------------------
 */
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

/**
 * --------------GENERAL SETUP---------------------
 */
const app = express();

app.use(express.json()) // Allows file to read JSON 
// app.use(cookieParser); // Allows to set up cookies into browser


/**
 * --------------DATABASE CONFIG-----------------
 */
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


/**
 * ----------------GET ROUTES ------------------------
 */
app.get('/', (req, res)=>{
    res.send('Welcome to the homepage');
});

app.get('/register', (req,res) => {
    res.sendFile('/home/ronny/Documents/GIT_local/class-companion_backend/views/register.html')
});

app.get('/login', (req,res)=>{
    res.sendFile('/home/ronny/Documents/GIT_local/class-companion_backend/views/login.html')
})

/**
 * -----------------POST ROUTES------------------------
 */
app.post('/register', (req, res) =>{
    const regEmail = req.body.email;
    const regPass = req.body.password;

    console.log(regEmail, regPass)
    
    // try {

    //     // Generate salt
    //     const salt = await bcrypt.genSalt()
    //     // Generate hashed password
    //     const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //     // New user schema
    //     const createUser = { 
    //         email: req.body.email, 
    //         password: hashedPassword,
    //         };
    //     //  Adding info to database
    //     db.query('INSERT INTO users SET ?', createUser, function (error, results, fields){
    //         if (error) {
    //             res.status(500).send('Error occured with mysql')
    //         } else {
    //             res.status(201).send('Created Successfully')
    //         }
        
    //     res.redirect('/login');
    //     });
    // } catch {
    //     res.status(500).send()
    // }
})

app.post('/login', async (req, res) => {
    try{
        const inputEmail = req.body.email;
        const inputPassword = req.body.password;

        // If there is no email; return an error
        if(!inputEmail || !inputPassword){
            return res.status(400).send('Please provide email and password')
        }
        // Fetch email and password
        db.query('SELECT * FROM users WHERE email = ?', [inputEmail], async (error, results) => {
            // if email or password is incorrect; deny access
            if (!results || !(await bcrypt.compare(inputPassword, results[0].password) )){
                res.status(401).send('Email or password is incorrect')
            } else {
                // if found in database allow access
                res.status(500).send('Connected successfully!');
                // Generate JWT token
                const token = jwt.sign({inputEmail}, process.env.ACCESS_TOKEN_SECRET);

                console.log('The access token is: ' + token);

                const cookieOptions = {
                    expires: new Date(
                        // Expires in 1 day (must convert into miliseconds)
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    // this only allows cookies to be stored if in http
                    // httpOnly: true
                }
                // Names cookie as jwt and pass through token with cookie options
                res.cookie('jwt', token, cookieOptions)
                res.status(200).redirect('/')

            }
        })

    }catch(error){
        console.log(error);
    }
})

/**
 * --------------- FUNCTIONS -------------------
 */

function verifyToken(req, res, next){
    // auth header
    const bearerHeader = req.headers['authorization'];

};


/**
 * ----------------SERVER-----------------------
 */
app.listen(3000, ()=> console.log('Server running on http://localhost:3000'));