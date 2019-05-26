const Phase = {
    APPLICANT: 0,
    REVIEWER: 1,
    RESULT: 2
}
const ReviewPhase = {
    NONE: 0,
    WRITTEN_EXAM: 1,
    TITLES_AND_PUB: 2,
    PRATICAL_EXAM: 3,
    ORAL_PRESENTATION: 4,
    FINISH: 5
}

function Grade() {
  this.grades = {};
  this.hash = "";
  this.sum = 0;
  this.result = 0;
}

function Applicant() {
  this.disqualified = false;
  this.reviewGrade = [];
  this.finalGrade = 0;
}

function Vacancy(id, sender, institutionListID, price, reviewerAmount, regDeadline, reviewDeadline, weights) {
  this._id = id;
  this.institutionListID = institutionListID; // TODO checkar se existe institutionList
  this.institution = sender;
  this.price = price;
  now = Math.floor(new Date().getTime() / 1000);
  this.registrationTime = now + regDeadline;
  this.reviewTime = this.registrationTime + reviewDeadline;
  this.reviewerAmount = reviewerAmount;
  this.weights = weights;
  this.applicants = {};
  this.reviewers = [];
  this.state = Phase.APPLICANT;
  this.reviewPhase = ReviewPhase.NONE;

  // TODO on Exception: give money back
  this.registerApplicant = function(sender, price) {
    if (price != this.price)
      throw "You have to pay the exact value.";
    if(sender in this.applicants)
      throw "Applicant already registered.";
    if(this.state != Phase.APPLICANT)
      throw "Invalid phase.";
    this.applicants[sender] = new Applicant();
  };

  // TODO give money back
  this.unregisterApplicant = function(sender) {
    if(this.state != Phase.APPLICANT)
      throw "Invalid phase.";
    if (!(sender in this.applicants))
      throw "Applicant need to be registered.";
    delete this.applicants[sender];
  };

  this.closeApplicationPhase = function(institutionList, timestamp = 0) {
    now = Math.floor(new Date().getTime() / 1000);
    if (now < this.registrationTime)
      throw "The registration period ins't over yet.";
    this.state = Phase.REVIEWER
    this.reviewPhase = ReviewPhase.WRITTEN_EXAM;
    this.reviewers = institutionList.findReviewers(this.reviewerAmount, timestamp);
  };

  this.sendReview = function(sender, applicant, _grade, reviewPhase) {
    if(this.state != Phase.REVIEWER)
      throw "Invalid phase.";
    if (!(applicant in this.applicants))
      throw "Applicant need to be registered.";
    if (_grade < 0 || _grade > 100)
      throw "Grade not in range allowed. Use 0 - 100.";
    if (reviewPhase != this.reviewPhase)
      throw "ReviewPhase insn't equal to actual ReviewPhase";
    if (this.reviewPhase == ReviewPhase.FINISH)
      throw "There isn't any more review phase";
    if (this.applicants[applicant].disqualified)
      throw "The applicant is disqualified.";
    if (this.applicants[applicant].reviewGrade.length != reviewPhase)
      throw "The applicant didn't send the hash yet.";
    grade = this.applicants[applicant].reviewGrade[this.reviewPhase - 1];
    if (sender in grade.grades) {
      last = grade.grades[sender];
      if (last > 0)
        grade.sum -= last;
    }
    grade.sum += _grade;
    grade.grades[sender] = _grade;
  };

  this.sendHash = function(sender, hash, reviewPhase) {
    if(this.state != Phase.REVIEWER)
      throw "Invalid phase.";
    if (!(sender in this.applicants))
      throw "Applicant need to be registered.";
    if (reviewPhase != this.reviewPhase)
      throw "ReviewPhase insn't equal to actual ReviewPhase";
    if (this.reviewPhase == ReviewPhase.FINISH)
      throw "There isn't any more review phase";
    if (this.applicants[sender].disqualified)
      throw "You were disqualified.";
    if (this.applicants[sender].reviewGrade.length != this.reviewPhase)
      this.applicants[sender].reviewGrade.push(new Grade());
    this.applicants[sender].reviewGrade[this.reviewPhase - 1].hash = hash;
  };

  this.nextReviewPhase = function(sender) {
    if(this.state != Phase.REVIEWER)
      throw "Invalid phase.";
    if (sender != this.institution)
      throw "You have to be the admin of this application.";
    if (this.reviewPhase == ReviewPhase.FINISH)
      throw "There isn't any more review phase";
    for (appl in this.applicants) {
      applicant = this.applicants[appl];
      if (applicant.disqualified)
        continue;
      grade = applicant.reviewGrade[this.reviewPhase - 1];
      rev = 1;
      if (Object.keys(grade.grades).length > 0)
        rev = Object.keys(grade.grades).length;
      avarage = grade.sum / rev;
      grade.result = avarage;
      if (avarage == 0 || (this.reviewPhase == ReviewPhase.WRITTEN_EXAM && avarage < 70))
        applicant.disqualified = true;
      for (reviewer in this.reviewers) {
        if(!(reviewer in grade.grades) || Math.abs(grade.grades[reviewer] - avarage) > 30) {
          // PUNISH THEM
        } else {
          // REWARD THEM
        }
      }
    }
    this.reviewPhase += 1; // Proxima phase
  };

  this.closeReviewPhase = function() {
    if(this.state != Phase.REVIEWER)
      throw "Invalid phase.";
    now = Math.floor(new Date().getTime() / 1000);
    if (now < this.reviewTime)
      throw "The review period ins't over yet.";
    if (this.reviewPhase != ReviewPhase.FINISH)
      throw "There are some review phases yet.";
    this.state = Phase.RESULT;
    for (appl in this.applicants) {
      applicant = this.applicants[appl];
      if (applicant.disqualified)
        continue;
      sumWeight = 0;
      for (k = 0; k < applicant.reviewGrade.length; k++) {
        grade = applicant.reviewGrade[k];
        weight = 1;
        if(k < this.weights.length)
            weight = this.weights[k];
        applicant.finalGrade += weight * grade.result;
        sumWeight += weight;
      }
      applicant.finalGrade /= sumWeight;
    }
  };

  this.getResult = function(applicant) {
    if(this.state != Phase.RESULT)
      throw "Invalid phase.";
    if (!(applicant in this.applicants))
      throw "Applicant need to be registered.";
    return this.applicants[applicant].finalGrade;
  };

  this.getHash = function(applicant, reviewPhase) {
    if (!(applicant in this.applicants))
      throw "Applicant need to be registered.";
      appl = this.applicants[applicant];
    if (reviewPhase >= appl.reviewGrade.length)
      throw "Applicant doesn't have Hash in this review phase.";
    return appl.reviewGrade[reviewPhase].hash;
  };

}

module.exports = Vacancy;
