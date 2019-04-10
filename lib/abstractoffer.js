module.exports = class AbstractOffer {
  constructor(libbarter){
    this._libbarter = libbarter;
  }

  _setOfferStatus(offerObject) {
    if (offerObject.from_status === "proposed") {
      this.status = offerObject.to_status;

      if (offerObject.to_status === "declined") {
        this.declineReason = offerObject.to_reason ? offerObject.to_reason : "no reason selected";
      }
    }
    else if (offerObject.from_status === "failed" || offerObject.to_status === "failed") {
      this.status = "failed";
      this.failed = true;

      if (offerObject.from_reason) this.failureReasons.from = offerObject.from_reason;
      if (offerObject.to_reason) this.failureReasons.to = offerObject.to_reason;
    }
    else if (offerObject.from_status === "completed") {
      if (offerObject.to_status === "completed") this.status = "completed";
      else this.status = "accepted";
    }
    else if (offerObject.to_status == "completed") {
      if (offerObject.from_status === "completed") this.status = "completed";
      else this.status = "accepted";
    }
    else {
      this.status = offerObject.to_status;
    }
  }
}
