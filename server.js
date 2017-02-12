// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Bear     = require('./models/bear');
var router = express.Router(); 
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressJWT({ secret: 'nodesecret'}).unless({path: ['/api','/api/bears']}))

var port = process.env.PORT || 8080;        // set our port

mongoose.connect('mongodb://sa:Tiger@jello.modulusmongo.net:27017/a6doXuri'); 

// ROUTES FOR OUR API
// =============================================================================
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	var myToken = jwt.sign({username: "test"}, 'nodesecret')
    res.json({ message: myToken });   
});

router.route('/bears')
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bear')
	 // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
    	console.log(req.path)
        console.log('Test')
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
        console.log(bear.name)
        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    })


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);