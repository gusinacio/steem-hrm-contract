function Institution(votesNeeded) {
  this.pending = true;
  this.votesNeeded = votesNeeded;
  this.votes = 0;
  this.member = false;
  this.voting = {};
}

function InstitutionList(id, sender) {
  this._id = id;
  this.registeredInstitutions = 1;
  this.institutions = {};
  this.reviewers = {};
  if(sender != null) {
    this.institutions[sender] = new Institution(0);
    this.institutions[sender].member = true;
    this.institutions[sender].pending = false;
  }
  this.requestInstitutionRegister = function(sender) {
    if (this.isMember(sender))
      throw "Only non-members can call this.";
    if (sender in this.institutions && this.institutions[sender].pending)
      throw "Only non-pending can call this.";
    this.institutions[sender] = new Institution(Math.trunc((this.registeredInstitutions / 2) + 1));
  };

  this.voteInstitution = function(sender, inst, vote) {
    if (!this.isMember(sender))
      throw "Only members can call this.";
    if (!(inst in this.institutions) || !this.institutions[inst].pending)
      throw "Instituton need to be pending.";
    var target = this.institutions[inst];
    target.voting[sender] = true;
    if (vote) {
      target.votes++;
      if (target.votes >= target.votesNeeded) {
        target.member = true;
        target.pending = false;
        this.registeredInstitutions++;
        return true;
      }
    }
    return false;
  };

  this.registerReviewer = function(sender, reviewer) {
    if (!this.isMember(sender))
      throw "Only members can call this.";
    this.reviewers[sender] = reviewer;
  };

  this.unregisterReviewer = function(sender) {
    if (!this.isMember(sender))
      throw "Only members can call this.";
    delete this.reviewers[sender];
  };

  this.findReviewers = function(number, timestamp) {
    reviewerList = Object.values(this.reviewers)
    if (number > reviewerList.length)
      throw "Not enoght reviewers";
    list = [];
    time = new Date(timestamp).getTime();
    for (i = 0; i < number; i++) {
      rand = Math.floor(reviewerList.length * random(time + i)) % reviewerList.length;
      reviewer = reviewerList[rand++%reviewerList.length];
      list.push(reviewer);
      reviewerList.remove(reviewer)
    }
    return list;
  };

  this.isMember = function(member) {
    return member in this.institutions && this.institutions[member].member;
  };

}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function random(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

module.exports = InstitutionList;
