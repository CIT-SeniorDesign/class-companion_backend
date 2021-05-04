// loads environment variables from .env
if (process.env.NODE_ENV !=='production'){ // if the environment is development include env file
    require('dotenv').config(); // this will load all environment processes
}
/**
 * -----------------DEPENDENCIES-------------------
 */
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

/**
 * --------------GENERAL SETUP---------------------
 */
const app = express();

const users = [];

app.use(express.json()) // Allows file to read JSON 


/**
 * --------------DATABASE CONFIG-----------------
 */
let connection = mysql.createConnection({
    host: "localhost",
    user: "rs-217",
    password: "$udoPowers37",
    database:'node_app'
});


/**
 * ----------------GET ROUTES ------------------------
 */
app.get('/users', (req, res) => {
    res.send(users);
}); 

// app.get('/register', (req, res) =>{
//     res.sendFile('../views/register.html');
// })

// app.get('/login', (req, res, next)=>{
//     const form = '<h1>Login Here</h1><form method="post" action="login">\
//                     Username:<br><input type="username" name="username">\
//                     <br> Password:<br><input type="password" name="password">\
//                     <br><br><input type="submit" value="Submit"></form>'

//     res.send(form)
// })

/**
 * -----------------POST ROUTES------------------------
 */
app.post('/users', async (req, res) =>{
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)

    // Find user in array
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare (req.body.password, user.password)){
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
})

// app.post('/register', function(req, res, next) {
//     // const user = {name: req.body.name, password: req.body.password}
//     console.log(req.body.username, req.body.password)
    
//     res.redirect('/login');
// });



/**
 * ----------------SERVER-----------------------
 */
app.listen(3000, ()=> console.log('Server running on http://localhost:3000'));