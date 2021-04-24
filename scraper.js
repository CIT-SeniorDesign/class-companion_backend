// Base libraries
const env = require('dotenv').config()
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

// Initalize express
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


app.get('/getprofessor', async (req, res) => {
    const professorInfo = await scrapeProfessorInfo(req.query)
    return res.send(professorInfo)
})

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
})

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
            let listingsObj = {}
            
            // Search through RMP listings
            $('.TeacherCard__StyledTeacherCard-syjs0d-0', '#root').each(function (i, listing) {
                    const subjectInfo = $('.CardSchool__Department-sc-19lmz2k-0', listing).text()
                    const rating = $('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2', listing).text()
                    const reviewCount = $('.CardNumRating__CardNumRatingCount-sc-17t4b9u-3', listing).text()

                    // Return rating & reviewCount as object with key subject
                    listingsObj[subjectInfo] = {
                        'rating': rating,
                        'reviewCount': reviewCount
                    }
                })

            return listingsObj
        })
        .catch(function(error) {
            return error
        })
    
    return profQuery
}
