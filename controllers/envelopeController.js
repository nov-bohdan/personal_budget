const {Envelope, envelopes} = require('./../models/envelopeModel');
const EnvelopeService = require('./../services/envelopeService');
const {ValidationError, validateEnvelopeData, validatePositiveNumber} = require('./../utils/validationHelper');

class EnvelopeController {
    static getAllEnvelopes = (req, res) => {
        res.json(envelopes);
    }

    static getEnvelopeByCategory = (req, res) => {
        let envelopeCategory;
        try {
            if (req.query.category) {
                envelopeCategory = req.query.category.toString();
            } else {
                return res.status(400).json({
                    error: 'No category provided in the request',
                    data: req.body
                });
            }
            const envelope = EnvelopeService.getEnvelopeByCategory(envelopeCategory);
            res.status(200).json(envelope);
        } catch (err) {
            res.status(400).json({
                error: err.message,
                data: {envelopeCategory}
            });
        }
    }

    static createEnvelope = (req, res) => {
        const { category, budget, moneyAmount } = req.body;

        const validationErrors = validateEnvelopeData({category, budget, moneyAmount});
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                data: validationErrors
            });
        }

        const envelope = new Envelope({
            category,
            budget,
            moneyAmount
        });
        
        envelopes.push(envelope);
        res.status(201).json(envelope);
    }

    static changeMoneyInEnvelope = (req, res) => {
        const { category, sum, action } = req.body;
        let envelope;
        try {
            validatePositiveNumber(sum, 'sum');
            if (!(action === 'add' || action === 'extract')) {
                return res.status(400).json({
                    error: 'Invalid action',
                    data: {category, envelope, sum, action}
                });
            }
            envelope = EnvelopeService.getEnvelopeByCategory(category);
            envelope = EnvelopeService.changeMoneyInEnvelope(envelope, sum, action);
            res.status(200).json({status: 'Success'});
        } catch (err) {
            res.status(400).json({
                error: err.message,
                data: {category, envelope, sum, action}
            });
        }
    }

    static deleteEnvelopeByCategory = (req, res) => {
        let category;
        try {
            if (req.query.category) {
                category = req.query.category.toString();
            } else {
                return res.status(400).json({
                    error: 'No category provided in the request',
                    data: req.body
                });
            }
            EnvelopeService.deleteEnvelopeByCategory(category);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({
                error: err.message,
                data: {category}
            });   
        }
    }

    static transferMoneyBetweenEnvelopes = (req, res) => {
        const { categoryFrom, categoryTo } = req.body;
        let envelopeFrom, envelopeTo;
        try {
            envelopeFrom = EnvelopeService.getEnvelopeByCategory(categoryFrom);
            envelopeTo = EnvelopeService.getEnvelopeByCategory(categoryTo);
            const moneyToTransfer = envelopeFrom.moneyAmount;
            const newAmount = envelopeTo.moneyAmount + moneyToTransfer;
            envelopeTo.moneyAmount = newAmount;
            envelopeFrom.moneyAmount = 0;
            res.status(200).json({
                status: 'Success'
            });
        } catch (err) {
            res.status(400).json({
                error: err.message,
                data: req.body
            });  
        }
    }
}

module.exports = EnvelopeController;