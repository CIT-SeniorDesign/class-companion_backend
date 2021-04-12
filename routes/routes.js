const { response } = require("express");

// Routing Configurations
module.exports = function(app){
    
    app.get('/', function (req, res) {
        res.status(200).json({ message: 'Connected' });
        res.send('Welcome to the homepage');
    });  

    app.get('/test', function (req,res){
        res.sendFile(path.join(__dirname + '/views/test.html'));
    });

    
}
