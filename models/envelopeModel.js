const envelopes = [];

class Envelope {
    constructor({category, budget, moneyAmount}) {
        this._category = category;
        this._budget = budget;
        this._moneyAmount = moneyAmount;
    }

    get category() {
        return this._category;
    }

    get budget() {
        return this._budget;
    }

    get moneyAmount() {
        return this._moneyAmount;
    }

    set moneyAmount(newAmount) {
        if (newAmount < 0) {
            throw new Error('newAmount can\'t be less than 0');
        }
        if (newAmount instanceof Number) {
            throw new Error('newAmount must be integer');
        }
        this._moneyAmount = newAmount;
        return true;
    }
}

module.exports = {Envelope, envelopes};