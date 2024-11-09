const {Envelope, envelopes} = require('./../models/envelopeModel');
const EnvelopeTable = require('./../models/envelopeTable');

class EnvelopeService {
    static getAllEnvelopes = async () => {
        return await EnvelopeTable.getAllEnvelopes();
    }

    /**
     * @param {string} category
     * @returns {Promise<Envelope>}
     */
    static getEnvelopeByCategory = async (category) => {
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
        const findResponse = await EnvelopeTable.getEnvelopeByCategory(category)
        if (!findResponse) {
            throw new Error('Can not find envelope with given category');
        }
        const deleteResponse = await EnvelopeTable.deleteEnvelopeById(findResponse['id']);
        if (!deleteResponse) {
            throw new Error('Can not delete envelope with given category');
        }
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
        const response = await EnvelopeTable.updateEnvelopeMoneyAmount(envelope);
        return response;
    }

    /**
     * 
     * @param {Envelope} envelope 
     * @param {Number} id
     * @returns {Promise<object>} updated row from database
     */
    static updateEnvelopeInDatabase = async (envelope, id) => {
        const updatedEnvelope = await EnvelopeTable.updateEnvelope(envelope, id);
        return updatedEnvelope;
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