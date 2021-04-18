// Configures passport configuration 
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Function to authenticate users email and password
function initialize(passport, getUserByEmail){
    const authenticateUser = async (email, password, done) =>{
        const user = getUserByEmail(email) // Get user by email
        if (user == null){ // If email is null then return 
            return done(null, false, { message: 'No user is found with that email'})
            console.log('No user found');
        }

        try{
            if (await bcrypt.compare(password, user.password)) { // compare password with inputted password
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'}) // return if password does not match and give user feedback
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser)) 
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((user, done) => { })
}

// This allows the initialize function to be called on other files
module.exports = initialize