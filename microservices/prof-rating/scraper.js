// Base libraries
const env = require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
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
app.get('/getprofessor', async (req, res) => {
    const professorInfo = await scrapeProfessorInfo(req.query)
    return res.send(professorInfo)
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

async function scrapeProfessorInfo (profInfo) {
    // Atach base url to request
    const URL = process.env.BASE_URL
    const path = process.env.QUERY_PATH
    const query = profInfo.firstName + ' ' + profInfo.lastName
    const schoolID = process.env.SCHOOL_ID

    const profQuery = await axios.get(URL + path, {
        params: {
            query: query,
            sid: schoolID
        }
    })
        .then(function(response) {
            // Load page into cheerio parser
            const $ = cheerio.load(response.data)

            const listing = $('.TeacherCard__StyledTeacherCard-syjs0d-0', '#root')[0]
            const cleanProfRef = listing.attribs.href.split('/')[1]
            const profLink = process.env.BASE_URL + cleanProfRef

            const rating = $('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2', listing).text()
            const reviewCount = $('.CardNumRating__CardNumRatingCount-sc-17t4b9u-3', listing).text()

            // Returns first prof listing
            let listingObj = {
                'profLink': profLink,
                'rating': rating,
                'reviewCount': reviewCount
            }

            // Returns multiple professor listings
            // let listingsObj = {}

            // Search through RMP listings
            // $('.TeacherCard__StyledTeacherCard-syjs0d-0', '#root').each(function (i, listing) {
            //         const cleanProfRef = listing.attribs.href.split('/')[1]
            //         const profLink = process.env.BASE_URL + cleanProfRef
            //         const rating = $('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2', listing).text()
            //         const reviewCount = $('.CardNumRating__CardNumRatingCount-sc-17t4b9u-3', listing).text()

            //         // Return rating & reviewCount as object with key subject
            //         listingsObj[subjectInfo] = {
            //             'profLink': profLink,
            //             'rating': rating,
            //             'reviewCount': reviewCount
            //         }
            //     })

            // Check for empty listingsObj
            // listingsObj = (Object.keys(listingsObj).length !== 0) ? listingsObj : null

            listingObj = (Object.keys(listingObj).length !== 0) ? listingObj : null

            return listingObj
        })
        .catch(function(error) {
            return error
        })
    
    return profQuery
}

// Attach serverless framework middleware to express app
module.exports.handler = serverless(app)
