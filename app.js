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

/**
 * --------------GENERAL SETUP---------------------
 */
const app = express();

app.use(express.json()) // Allows file to read JSON 


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
app.get('/users', (req, res) => {
    console.log(users);
}); 

/**
 * -----------------POST ROUTES------------------------
 */
app.post('/register', async (req, res) =>{
    try {
        // Generate salt
        const salt = await bcrypt.genSalt()
        // Generate hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // New user schema
        const createUser = { 
            email: req.body.email, 
            password: hashedPassword,
            };
        //  Adding info to database
        db.query('INSERT INTO users SET ?', createUser, function (error, results, fields){
            if (error) {
                res.status(500).send('Error occured with mysql')
            } else {
                res.status(201).send('Created Successfully')
            }
        });
    } catch {
        res.status(500).send()
    }
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
                // implement JWT here
                res.status(500).send('Connected successfully!');
            }
        })

    }catch(error){
        console.log(error);
    }
})

/**
 * --------------- FUNCTIONS -------------------
 */
function generateAccessToken(username){
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {expriesIn: '1800s'});
};

function verifyToken(req, res, next){
    // auth header
    const bearerHeader = req.headers['authorization'];

};


/**
 * ----------------SERVER-----------------------
 */
app.listen(3000, ()=> console.log('Server running on http://localhost:3000'));