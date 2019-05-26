var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/blockchaindb";


function newInstitutionList(il) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    collection.insertOne(il, function(err, res) {
      if (err) throw err;
      client.close();
    });
  });
}

function getInstitutionList(id, callback) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    collection.findOne({ _id : id }, function(err, item) {
        client.close();
        callback(item);
    });
  });
}

function saveInstitution(id, inst) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    var query = {};
    var name = "institutions." + inst;
    query[name] = inst;
    collection.updateOne({ _id : id }, { $set: query }, function(err, res) {
      if (err)
        throw err;
      client.close();
    });
  });
}

function saveRegisteredInstitutions(id, il) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    collection.updateOne({_id: id}, { $set: {registeredInstitutions: il.registeredInstitutions }}, function(err, res) {
      if (err)
        throw err;
      client.close();
    });
  });
}

function saveReviewers(il) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    collection.updateOne({_id: il._id}, { $set: {reviewers: il.reviewers }}, function(err, res) {
      if (err)
        throw err;
      client.close();
    });
  });
}

module.exports.newInstitutionList = newInstitutionList;
module.exports.saveInstitution = saveInstitution;
module.exports.saveRegisteredInstitutions = saveRegisteredInstitutions;
module.exports.saveReviewers = saveRegisteredInstitutions;
module.exports.getInstitutionList = getInstitutionList;
