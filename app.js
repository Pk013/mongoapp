const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'myproject';
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    console.log("Successfully cconnected");

    const db = client.db(dbName);

    insertDocuments(db, function() {
        indexCollection(db, function() {
            client.close();
        });
    });
});

const insertDocuments = function(db, callback) {
    const collection = db.collection('documents');
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("3 domcuments have been added");
        callback(result);
    });
}

const finder = function(db, callback) {
    const collection = db.collection('documents');

    collection.find({ 'a': 3 }).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("these records have been found");
        console.log(docs)
        callback(docs);
    });
}

const updater = function(db, callback) {
    const collection = db.collection('documents');
    collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("updated the document with the fields equal to 2");
        callback(result);
    });
}

const removal= function(db, callback) {
    const collection = db.collection('documents');
    collection.deleteOne({ a: 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the fields equal to 3");
        callback(result);
    });
}

const indexstuff= function(db, callback) {
    db.collection('documents').createIndex({ "a": 1 },
        null,
        function(err, results) {
            console.log(results);
            callback();
        }
    );
};
  