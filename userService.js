var express       = require('express');
var bodyParser    = require('body-parser');
var MongoClient   = require('mongodb').MongoClient;
var ObjectId   = require('mongodb').ObjectId;

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let db;
const dbName = 'NetAbility';
const collection = 'users';

var port = process.env.PORT || 8082;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'User Service!' });   
});

router.post( '/user/insert', ( req, res ) => {
    console.log('From /user/insert:');

    let insertDoc = { 
        name: req.body.name, 
        userName: req.body.userName, 
        password: req.body.password,
        status: req.body.status || 'Active',
    };

    db.collection( collection ).insertOne( insertDoc, ( err ) => {
        if (err)
            throw err;
        res.json( { message: "User inserted" } );
    }) 
});

router.post( '/user/statusUpdate', ( req, res ) => {
    console.log('From /chisinauBuildings/statusUpdate:');

    console.log( req.body );
    if ( !req.body.status || !req.body._id )
        return res.json( { message: "Invalid user attributes" } );
    
    let userQuery = { _id : ObjectId(req.body._id) }

    db.collection( collection ).updateOne( userQuery, { status: req.body.status } , ( err ) => {
        if (err)
            throw err;
        
        res.json( { message: "Update user satatus" } );
    }) 


});

router.get('/user', (req, res) => {

    console.log('From /user:');
    
    if ( !req.body.userName || !req.body.password )
        return res.json( { message: "Invalid user attributes" } );
    
    
    // console.log( db );
    db.collection( collection ).findOne({ userName: req.body.userName, password: req.body.password } ,(err, docs) => {
        try {
            if( err )
                throw new Error(err);
            
            console.log('From /user:');
            res.json( docs );
        } catch (error) {
            console.log('Error on route /user: ', error);
        }
    });

});

router.get('/users', (req, res) => {

    console.log('From /users:');
    // console.log( db );
    db.collection( collection ).find().toArray(function(err, docs) {
        try {
            if( err )
                throw new Error(err);
            
            console.log('From /users:');
            res.json( docs );
        } catch (error) {
            console.log('Error on route /users: ', error);
        }
    });

});

app.use('/api', router);

// let mongoClient = new MongoClient(new Server('localhost', 27017));

// mongoClient.open((err, client) => {
//   db = client.db(dbName);

// });


MongoClient.connect( `mongodb://localhost:27017`, ( err, client) =>
{
    if(err)
        throw new Error( err );
    else
        db = client.db( dbName );
    
    app.listen(port);
    console.log( `DB is connected...HOST:127.0.0.1, PORT:27017` );
});