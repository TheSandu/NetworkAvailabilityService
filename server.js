var express       = require('express');
var bodyParser    = require('body-parser');
var MongoClient   = require('mongodb').MongoClient;
var Server        = require('mongodb').Server;

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

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post( '/report/insert', ( req, res ) => {
    console.log('From /report/insert:');

    let insertDoc = { name: req.body.name, phone: req.body.phone, lenght: req.body.lenght, text: req.body.text, price: req.body.price};

    db.collection( 'reports' ).insertOne( insertDoc, ( err ) => {
        if (err)
            throw err;
        
        res.json( { message: "Report inserted" } );
    }) 
});

router.post( '/log/insert', ( req, res ) => {
    console.log('From /log/insert:');

    console.log( req.body );

    db.collection( 'logs' ).insertOne( { vertices: req.body.vertices,date :req.body.date }, ( err ) => {
        if (err)
            throw err;
        
        res.json( { message: "Log inserted" } );
    }) 
});

router.get('/connections', (req, res) => {

    console.log('From /connections:');
    // console.log( db );
    db.collection('connections').find().toArray(function(err, docs) {
        try {
            if( err )
                throw new Error(err);
            
            console.log('From /connections:');
            res.json( docs );
        } catch (error) {
            console.log('Error on route /connections: ', error);
        }
    });

});

router.get('/buildings', (req, res) => {

    console.log('From /connections:');
    // console.log( db );
    db.collection('chisinauBuildings').find().toArray(function(err, docs) {
        try {
            if( err )
                throw new Error(err);
            
            console.log('From /connections:');
            res.json( docs );
        } catch (error) {
            console.log('Error on route /connections: ', error);
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