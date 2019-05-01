var MongoClient   = require('mongodb').MongoClient;

MongoClient.connect( `mongodb://localhost:27017`, ( err, client) =>
{
    if( !err ){
        db = client.db( 'NetAbility' );

    db.collection('connections').updateMany({}, {
        $set: { connectionPointType: 'terrestrial'},
    });

    } else {
        throw new Error( err );
    }
    console.log( `DB is connected...HOST:127.0.0.1, PORT:27017` );
});