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

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Geometri data service!' });   
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

router.post( '/chisinauBuildings/statusUpdate', ( req, res ) => {
    console.log('From /chisinauBuildings/statusUpdate:');

    console.log( req.body );
    if ( !req.body.connection || !req.body._id )
        return res.json( { message: "Invalid building attributes" } );
    
    let buildingQuery = { _id : ObjectId(req.body._id) }

    db.collection( 'chisinauBuildings' ).updateOne( buildingQuery, { 'attributes.connected': req.body.connection }, ( err ) => {
        if (err)
            throw err;
        
        res.json( { message: "Update building satatus" } );
    }) 


});

router.post( '/connectionPoint/insert', ( req, res ) => {
    console.log('From /connectionPoint/insert:');

    console.log( req.body );
    if ( !req.body.x || !req.body.y || req.body.type )
        return res.json( { message: "Invalid connection Point" } );
    
    let deffaultSR = { latestWkid : 3857, wkid : 102100 };

    let connectionPoint = { 
        spatialReference : req.body.spatialReference || deffaultSR , 
        x : req.body.x,
        y : req.body.y,
        connectionPointType : req.body.type,
    }

    db.collection( 'connections' ).insertOne( connectionPoint, ( err ) => {
        if (err)
            throw err;
        
        res.json( { message: "ConnectionPoint inserted" } );
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