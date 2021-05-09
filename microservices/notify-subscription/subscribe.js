// Base libraries
const env = require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const express = require('express')
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

// Get professor info route
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
