const envelopes = [];

class Envelope {
    constructor({category, budget, moneyAmount, id=null}) {
        this._category = category;
        this._budget = budget;
        this._moneyAmount = moneyAmount;
        this._id = id;
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

    get id() {
        return this._id;
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

    /**
     * 
     * @param {object} object row from database
     * @returns {Envelope}
     */
    static fromDatabaseFormat(object) {
        return new Envelope({
            category: object['category'],
            budget: parseFloat(object['budget']),
            moneyAmount: parseFloat(object['money_amount']),
            id: object['id']
        });
    }
}

module.exports = {Envelope, envelopes};