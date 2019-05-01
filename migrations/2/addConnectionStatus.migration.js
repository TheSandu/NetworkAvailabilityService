let Buildings = require('../../../NetworkAvailabilityApp/src/app/esri-map/layers/Chisinau_buildings.json');
var MongoClient   = require('mongodb').MongoClient;

let featureSet = Buildings.map(( feature )=>{
    feature.geometry.type = 'polygon';
    feature.attributes.connected = 'No';
    return feature;
});


MongoClient.connect( `mongodb://localhost:27017`, ( err, client) =>
{
    if( !err ){
        db = client.db( 'NetAbility' );

    db.collection('chisinauBuildings').insertMany(featureSet,() => {
        console.log('inserted' );
    });

    } else {
        throw new Error( err );
    }
    console.log( `DB is connected...HOST:127.0.0.1, PORT:27017` );
});