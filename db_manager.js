const InstitutionList = require("./institution_list.js");
const Vacancy = require("./vacancy.js");

var MongoClient = require('mongodb').MongoClient;
require('dotenv-safe').config();
var url = process.env.MONGO_URI;
console.log(url)

function insertInstitutionList(il) {
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

async function getInstitutionList(id) {
  let db, client, collection;
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = client.db();
    collection = db.collection("institution_list");
    var inst = await collection.findOne({ _id : id });
    if (inst == null)
        throw "Nao foi possivel encontrar institutionList";
    var voidIl = new InstitutionList();
    Object.assign(voidIl, inst);
    return voidIl;
  } finally {
    client.close();
  }
}

function saveInstitutionList(il) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("institution_list")
    collection.updateOne({ _id : il._id }, { $set:  il }, function(err, res) {
      if (err)
        throw err;
      client.close();
    });
  });
}

function insertVacancy(vacancy) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("vacancy")
    collection.insertOne(vacancy, function(err, res) {
      if (err) throw err;
      client.close();
    });
  });
}

async function getVacancy(id) {
  let db, client, collection;
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = client.db();
    collection = db.collection("vacancy");
    var vacancy = await collection.findOne({ _id : id });
    if (vacancy == null)
        throw "Nao foi possivel encontrar vacancy";
    var voidVac = new Vacancy();
    Object.assign(voidVac, vacancy);
    return voidVac;
  } finally {
    client.close();
  }
}

function saveVacancy(vacancy) {
  var client = MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    var db = client.db();
    var collection = db.collection("vacancy")
    collection.updateOne({ _id : vacancy._id }, { $set: vacancy }, function(err, res) {
      if (err)
        throw err;
      client.close();
    });
  });
}


module.exports.insertInstitutionList = insertInstitutionList;
module.exports.getInstitutionList = getInstitutionList;
module.exports.saveInstitutionList = saveInstitutionList;

module.exports.insertVacancy = insertVacancy;
module.exports.getVacancy = getVacancy;
module.exports.saveVacancy = saveVacancy;
