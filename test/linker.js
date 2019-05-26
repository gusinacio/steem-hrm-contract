const InstitutionList = require("./institution_list.js");
const Vacancy = require("./vacancy.js");
const db = require("./database_manager.js");

db.getInstitutionList("5ce5d93d2fc47b1815620544", function(inst) {
  if (inst == null) {
      console.log("Nao existe institution com esse id!")
      return;
  }
  var il2 = new InstitutionList();
  Object.assign(il2, inst);
  console.log(il2);
});



var institutionList = new InstitutionList('Gustavo', 'MinhaUniqueId');
var vacancy = new Vacancy('Gustavo', institutionList, 1, 3, 0, 0, [1, 1, 1, 1]);
var timestamp = time = new Date().getTime();;
try {
  institutionList.requestInstitutionRegister('Ray');
  institutionList.requestInstitutionRegister('Inst1');
  institutionList.requestInstitutionRegister('Inst2');
  institutionList.requestInstitutionRegister('Inst3');
  institutionList.requestInstitutionRegister('Inst4');
  institutionList.voteInstitution('Gustavo', 'Ray', true);
  institutionList.voteInstitution('Gustavo', 'Inst1', true);
  institutionList.voteInstitution('Gustavo', 'Inst2', true);
  institutionList.voteInstitution('Gustavo', 'Inst3', true);
  institutionList.voteInstitution('Gustavo', 'Inst4', true);
  institutionList.registerReviewer('Gustavo', 'Rev1');
  institutionList.registerReviewer('Ray', 'Rev2');
  institutionList.registerReviewer('Inst1', 'Rev3');
  try{
    db.newInstitutionList(institutionList);
  } catch (e) {
    console.log("Nao foi possivel salvar pq ja existe um institutionList com esse id")
  }

  vacancy.registerApplicant('Applicant1', 1);
  vacancy.registerApplicant('Applicant2', 1);
  vacancy.registerApplicant('Applicant3', 1);
  vacancy.closeApplicationPhase(institutionList, timestamp);

  vacancy.sendHash('Applicant1', 'Hash', 1);
  vacancy.sendHash('Applicant2', 'Hash', 1);
  vacancy.sendHash('Applicant3', 'Hash', 1);

  vacancy.sendReview('Rev1', 'Applicant1', 100, 1);
  vacancy.sendReview('Rev1', 'Applicant2', 100, 1);
  vacancy.sendReview('Rev1', 'Applicant3', 100, 1);

  vacancy.sendReview('Rev2', 'Applicant1', 100, 1);
  vacancy.sendReview('Rev2', 'Applicant2', 100, 1);
  vacancy.sendReview('Rev2', 'Applicant3', 100, 1);

  vacancy.sendReview('Rev3', 'Applicant1', 100, 1);
  vacancy.sendReview('Rev3', 'Applicant2', 100, 1);
  vacancy.sendReview('Rev3', 'Applicant3', 100, 1);

  vacancy.nextReviewPhase('Gustavo');

  vacancy.sendHash('Applicant1', 'Hash', 2);
  vacancy.sendHash('Applicant2', 'Hash', 2);
  vacancy.sendHash('Applicant3', 'Hash', 2);

  vacancy.sendReview('Rev1', 'Applicant1', 100, 2);
  vacancy.sendReview('Rev1', 'Applicant2', 100, 2);
  vacancy.sendReview('Rev1', 'Applicant3', 100, 2);

  vacancy.sendReview('Rev2', 'Applicant1', 100, 2);
  vacancy.sendReview('Rev2', 'Applicant2', 100, 2);
  vacancy.sendReview('Rev2', 'Applicant3', 100, 2);

  vacancy.sendReview('Rev3', 'Applicant1', 100, 2);
  vacancy.sendReview('Rev3', 'Applicant2', 100, 2);
  vacancy.sendReview('Rev3', 'Applicant3', 100, 2);

  vacancy.nextReviewPhase('Gustavo');

  vacancy.sendHash('Applicant1', 'Hash', 3);
  vacancy.sendHash('Applicant2', 'Hash', 3);
  vacancy.sendHash('Applicant3', 'Hash', 3);

  vacancy.sendReview('Rev1', 'Applicant1', 100, 3);
  vacancy.sendReview('Rev1', 'Applicant2', 100, 3);
  vacancy.sendReview('Rev1', 'Applicant3', 100, 3);

  vacancy.sendReview('Rev2', 'Applicant1', 100, 3);
  vacancy.sendReview('Rev2', 'Applicant2', 100, 3);
  vacancy.sendReview('Rev2', 'Applicant3', 100, 3);

  vacancy.sendReview('Rev3', 'Applicant1', 100, 3);
  vacancy.sendReview('Rev3', 'Applicant2', 100, 3);
  vacancy.sendReview('Rev3', 'Applicant3', 100, 3);

  vacancy.nextReviewPhase('Gustavo');

  vacancy.sendHash('Applicant1', 'Hash', 4);
  vacancy.sendHash('Applicant2', 'Hash', 4);
  vacancy.sendHash('Applicant3', 'Hash', 4);

  vacancy.sendReview('Rev1', 'Applicant1', 100, 4);
  vacancy.sendReview('Rev1', 'Applicant2', 100, 4);
  vacancy.sendReview('Rev1', 'Applicant3', 100, 4);

  vacancy.sendReview('Rev2', 'Applicant1', 100, 4);
  vacancy.sendReview('Rev2', 'Applicant2', 100, 4);
  vacancy.sendReview('Rev2', 'Applicant3', 100, 4);

  vacancy.sendReview('Rev3', 'Applicant1', 100, 4);
  vacancy.sendReview('Rev3', 'Applicant2', 100, 4);
  vacancy.sendReview('Rev3', 'Applicant3', 100, 4);

  vacancy.nextReviewPhase('Gustavo');

  vacancy.closeReviewPhase();

  console.log(vacancy.getResult('Applicant1'));
  console.log(vacancy.getResult('Applicant2'));
  console.log(vacancy.getResult('Applicant3'));

} catch(e) {
  console.log(e)
}
