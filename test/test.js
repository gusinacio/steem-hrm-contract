const InstitutionList = require("./institution_list.js");
const Vacancy = require("./vacancy.js");
const db = require("./db_manager.js");

async function createVacancy() {
  var institutionList = await db.getInstitutionList("MinhaUniqueId");
  var vacancy = new Vacancy('UniqueIdDoVacancy', 'Gustavo', institutionList._id, 1, 3, 0, 0, [1, 1, 1, 1]);

  var timestamp = time = new Date().getTime();;
  try {
    db.insertVacancy(vacancy);
    console.log("Vacancy criado com sucesso")
  } catch(e) {
    console.log(e);
  }
}

async function finishApplicationPhase() {
  var vacancy = await db.getVacancy('UniqueIdDoVacancy');
  var timestamp = time = new Date().getTime();
  try {
    var institutionList = await db.getInstitutionList(vacancy.institutionListID);
    vacancy.registerApplicant('Applicant1', 1);
    vacancy.registerApplicant('Applicant2', 1);
    vacancy.registerApplicant('Applicant3', 1);

    vacancy.closeApplicationPhase(institutionList, timestamp);
    db.saveVacancy(vacancy);
  } catch(e) {
    console.log(e)
  }
}

async function runReviewPhase(phase) {
  var vacancy = await db.getVacancy('UniqueIdDoVacancy');
  try {
    vacancy.sendHash('Applicant1', 'Hash', phase);
    vacancy.sendHash('Applicant2', 'Hash', phase);
    vacancy.sendHash('Applicant3', 'Hash', phase);

    vacancy.sendReview('Rev1', 'Applicant1', 100, phase);
    vacancy.sendReview('Rev1', 'Applicant2', 100, phase);
    vacancy.sendReview('Rev1', 'Applicant3', 100, phase);

    vacancy.sendReview('Rev2', 'Applicant1', 100, phase);
    vacancy.sendReview('Rev2', 'Applicant2', 100, phase);
    vacancy.sendReview('Rev2', 'Applicant3', 100, phase);

    vacancy.sendReview('Rev3', 'Applicant1', 100, phase);
    vacancy.sendReview('Rev3', 'Applicant2', 100, phase);
    vacancy.sendReview('Rev3', 'Applicant3', 100, phase);

    vacancy.nextReviewPhase('Gustavo');
    db.saveVacancy(vacancy);
    console.log("ReviewPhase " + phase + " completada");
  } catch(e) {
    console.log(e)
  }
}

async function finishReviewPhase() {
  var vacancy = await db.getVacancy('UniqueIdDoVacancy');
  try {
    vacancy.closeReviewPhase();
    db.saveVacancy(vacancy);
    console.log("CloseReviewPhase executada com sucesso!");
  } catch(e) {
    console.log(e)
  }
}

async function displayResults() {
  var vacancy = await db.getVacancy('UniqueIdDoVacancy');
  try {
    console.log(vacancy.getResult('Applicant1'));
    console.log(vacancy.getResult('Applicant2'));
    console.log(vacancy.getResult('Applicant3'));
  } catch(e) {
    console.log(e)
  }
}

displayResults();
