const {Envelope, envelopes} = require('./../models/envelopeModel');

class EnvelopeService {
    /**
     * @param {string} category
     * @returns {Envelope}
     */
    static getEnvelopeByCategory = (category) => {
        const foundEnvelope = envelopes.find(envelope => envelope.category === category);

        if (foundEnvelope) {
            return foundEnvelope;
        } else {
            throw new Error('Envelope with given category not found');
        }
    }

    static deleteEnvelopeByCategory = (category) => {
        const index = envelopes.findIndex(envelope => envelope.category === category);
        if (index === -1) {
            throw new Error('Can not find an envelope with given category');
        }
        envelopes.splice(index, 1);
    }

    /**
     * 
     * @param {Envelope} envelope 
     * @param {Number} sum 
     * @param {'add'|'extract'} action 
     * @returns {Envelope}
     */
    static changeMoneyInEnvelope = (envelope, sum, action) => {
        const currentAmount = envelope.moneyAmount;
        let newAmount;
        if (action === 'add') {
            newAmount = envelope.moneyAmount + sum;
            if (newAmount > envelope.budget) {
                throw new Error('New amount exceeds budget');
            }
        } else if (action === 'extract') {
            newAmount = currentAmount - sum;
            if (newAmount < 0) {
                throw new Error('newAmount must be equal or greater than 0');
            }
        } else {
            throw new Error(`Invalid action provided: ${action}`);
        }

        envelope.moneyAmount = newAmount;
        return envelope;
    }
}

module.exports = EnvelopeService;