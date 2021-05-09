// Base libraries
const env = require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const express = require('express')
const AWS = require('aws-sdk')
const serverless = require('serverless-http')

// Initalize express w/ dependencies
const app = express()

// Include global CORS policy & attach CORS middleware
const corsOptions = {
    origin: '*',
    allowedHeaders: ['Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept']
}
app.use(cors(corsOptions))

// Validate sender request
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// Create SES
const ses = new AWS.SES({
    region: 'us-east-1' 
})


app.post('/test', (req, res) => {
    const params = {
        Destination: {
            ToAddresses: ['brianlinggadjaja98@gmail.com'],
        },
        Message: {
        Body: {
            Text: { Data: "Test" },
        },
        Subject: { Data: "Test Email" },
        },
        Source: "notifybrianlinggadjaja@gmail.com",
    }

    ses.sendEmail(params, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(200)
        }
    })
})

app.post('/verifyemail', (req, res) => {
console.log(req.body.email)
    const params = {
        EmailAddress: req.body.email, /* required */
    }
    
    ses.verifyEmailAddress(params, function(err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(200)
        }
    })
})


/*
    1. Verify email
    2. Update
    3. Subscribe
*/
// Subscribe
app.post('/subscribe', async (req, res) => {
    console.log({
        'req': req,
        'res': res
    })

    return true
})

// Error handling middleware
app.use(function(err, res) {
    res.status(err.status || 500)
    res.end()
})

// Check if running on dev environment before attaching port
if (process.env.NODE_ENV === 'instance') {
    app.listen(process.env.PORT, () => {
        console.log('Example app listening on port ' + process.env.PORT + '!')
    })
}

// Attach serverless framework middleware to express app
module.exports.handler = serverless(app)

/*
const dummyData = {
    message: 'Hello World!'
}

fetch('https://ivp7n93c99.execute-api.us-east-1.amazonaws.com/test', {
    method: 'POST',
    body: JSON.stringify(dummyData)
})
.then(response => console.log(response))

*/
