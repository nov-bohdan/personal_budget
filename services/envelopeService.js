const {Envelope} = require('./../models/envelopeModel');
const EnvelopeTable = require('./../models/envelopeTable');
const {joiSchemas} = require('./../utils/validationHelper');

class EnvelopeService {
    static getAllEnvelopes = async () => {
        return await EnvelopeTable.getAllEnvelopes();
    }

    /**
     * @param {string} category
     * @returns {Promise<Envelope>}
     */
    static getEnvelopeByCategory = async (category) => {
        const {error} = joiSchemas.category.validate(category);
        if (error) throw error;

        const foundEnvelope = await EnvelopeTable.getEnvelopeByCategory(category);
        if (foundEnvelope) {
            return foundEnvelope;
        } else {
            throw new Error('Envelope with given category not found');
        }
    }

    /**
     * 
     * @param {string} category 
     * @returns {Promise<boolean>}
     */
    static deleteEnvelopeByCategory = async (category) => {
        const {error} = joiSchemas.category.validate(category);
        if (error) throw error;

        const findResponse = await EnvelopeTable.getEnvelopeByCategory(category)
        if (!findResponse) {
            throw new Error('Can not find envelope with given category');
        }
        const deleteResponse = await EnvelopeTable.deleteEnvelopeById(findResponse.id);
        if (!deleteResponse) {
            throw new Error('Can not delete envelope with given category');
        }
        return true
    }

    /**
     * 
     * @param {Envelope} envelope 
     * @param {Number} sum 
     * @param {'add'|'extract'} action 
     * @returns {Promise<Envelope>}
     */
    static changeMoneyInEnvelope = async (envelope, sum, action) => {
        const currentAmount = envelope.moneyAmount;
        let newAmount;

        const {error} = joiSchemas.envelopeAction.validate(action);
        if (error) throw error;

        if (action === 'add') {
            newAmount = envelope.moneyAmount + sum;
            if (newAmount > envelope.budget) {
                throw new Error('New amount exceeds budget');
            }
        } else if (action === 'extract') {
            newAmount = currentAmount - sum;
            if (newAmount < 0) {
                throw new Error('Insufficient funds: cannot have a negative balance');
            }
        }

        envelope.moneyAmount = newAmount;
        return await EnvelopeTable.updateEnvelopeMoneyAmount(envelope);
    }

    /**
     * 
     * @param {Envelope} envelope 
     */
    static saveNewEnvelope = async (envelope) => {
        return await EnvelopeTable.saveNewEnvelope(envelope);
    }
}

module.exports = EnvelopeService;