const InstitutionList = require("./institution_list.js");
const Vacancy = require("./vacancy.js");
const db = require("./db_manager.js");
const steem_sender = require("./steem_sender.js");


async function onInstitutionListCmdReceive(sender, customJson, blockNum, transactionNum) {
  if (customJson.command == "confirmation" || customJson.command == undefined)
    return;
  console.log("new customjson:")
  console.log(customJson);
  var response = {};
  response.command = 'confirmation';
  response.transaction = blockNum + ':' + transactionNum;
  response.status = 'UNKNWON';
  try {
    if (customJson.command == "create") {
      var institutionList = new InstitutionList(blockNum + ':' + transactionNum, sender);
      db.insertInstitutionList(institutionList);
    } else {
      if (customJson.id == undefined)
        return;
      var institutionList = await db.getInstitutionList(customJson.id);
      switch (customJson.command) {
        case 'requestInstitutionRegister':
          institutionList.requestInstitutionRegister(sender);
          break;
        case 'voteInstitution':
          if (customJson.target == undefined)
            throw "Target invalid";
          if (customJson.vote != true || customJson.vote != false)
            throw "Vote invalid";
          institutionList.voteInstitution(sender, customJson.target, customJson.vote);
          break;
        case 'registerReviewer':
          if (customJson.target == undefined)
            throw "Target invalid";
          institutionList.registerReviewer(sender, customJson.target);
          break;
        case 'unregisterReviewer':
          institutionList.unregisterReviewer(sender);
          break;
        default:
          throw "Invalid command";
          break;
      }
      db.saveInstitutionList(institutionList);
    }
    response.status = 'OK';
  } catch (e) {
    response.status = 'ERROR';
    response.message = e;
    console.log(e);
  }
  steem_sender.log('institutionList', response);
}

async function onVacancyCmdReceive(sender, customJson, blockNum, transactionNum, timestamp) {
  if (customJson.command == "confirmation" || customJson.command == undefined)
    return;
  console.log("new customjson:")
  console.log(customJson);
  var response = {};
  response.command = 'confirmation';
  response.transaction = blockNum + ':' + transactionNum;
  response.status = 'UNKNWON';
  try {
    if (customJson.command == "create") {
      if (customJson.institutionListID == undefined)
        throw "institutionListID cant be null";
      if (customJson.price == undefined)
        throw "price cant be null";
      if (customJson.price < 0)
        throw "price need to be positive";
      if (customJson.reviewerAmount == undefined)
        throw "reviewerAmount cant be null";
      if (customJson.reviewerAmount < 0)
        throw "reviewerAmount need to be positive";
      if (customJson.reviewDeadline == undefined)
        throw "reviewDeadline cant be null";
      if (customJson.regDeadline == undefined)
        throw "regDeadline cant be null";
      if (customJson.weights == undefined)
        throw "weights cant be null";
      if (!Array.isArray(customJson.weights))
        throw "weights need to be array";
      var institutionList = await db.getInstitutionList(customJson.institutionListID);
      var vacancy = new Vacancy(blockNum + ':' + transactionNum,
                                                    sender,
                                                    institutionList._id,
                                                    customJson.price,
                                                    customJson.reviewerAmount,
                                                    customJson.regDeadline,
                                                    customJson.reviewDeadline,
                                                    customJson.weights);
      db.insertVacancy(vacancy);
    } else {
      if (customJson.id == undefined)
        return;
      var vacancy = await db.getVacancy(customJson.id);
      switch (customJson.command) {
        case 'unregisterApplicant':
          vacancy.unregisterApplicant(sender);
          steem_sender.transfer(sender, vacancy.price.toFixed(3) + " SBD", "Successfully unregistered!");
          db.saveVacancy(vacancy);
          return;
        case 'closeApplicationPhase':
          var institutionList = await db.getInstitutionList(vacancy.institutionListID);
          vacancy.closeApplicationPhase(institutionList, timestamp);
          break;
        case 'sendReview':
          vacancy.sendReview(sender, customJson.target, customJson.grade, customJson.phase);
          break;
        case 'sendHash':
          if (customJson.hash == undefined)
            throw "Hash invalid";
          vacancy.sendHash(sender, customJson.hash, customJson.phase);
          break;
        case 'nextReviewPhase':
          vacancy.nextReviewPhase(sender);
          break;
        case 'closeReviewPhase':
          vacancy.closeReviewPhase();
          break;
        default:
          throw "Invalid command";
          break;
      }
      db.saveVacancy(vacancy);
    }
    response.status = 'OK';
  } catch (e) {
    response.status = 'ERROR';
    response.message = e;
    console.log(e);
  }
  steem_sender.log('vacancy', response);
}

async function onVacancyTransaction(sender, amount, memo) {
  if(!memo)
    return;
  try {
    var vacancy = await db.getVacancy(memo);
    vacancy.registerApplicant(sender, parseFloat(amount.split(" ")[0]));
    db.saveVacancy(vacancy);
    steem_sender.transfer(sender, "0.001 SBD", "Register Successful");
  } catch (e) {
    steem_sender.transfer(sender, amount, e);
    console.log(e);
  }
}

module.exports.onInstitutionListCmdReceive = onInstitutionListCmdReceive;
module.exports.onVacancyCmdReceive = onVacancyCmdReceive;
module.exports.onVacancyTransaction = onVacancyTransaction;
