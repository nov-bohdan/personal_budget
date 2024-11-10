const {Envelope} = require('./../models/envelopeModel');
const EnvelopeService = require('./../services/envelopeService');

class EnvelopeController {
    static getAllEnvelopes = async (req, res) => {
        res.json(await EnvelopeService.getAllEnvelopes());
    }

    static getEnvelopeByCategory = async (req, res) => {
        const envelopeCategory = req.query.category?.toString();
        try {
            const envelope = await EnvelopeService.getEnvelopeByCategory(envelopeCategory);
            res.status(200).json(envelope);
        } catch (err) {
            console.log(err.stack);
            res.status(404).json({
                status: 'Error',
                error: err.message,
                data: {envelopeCategory}
            });
        }
    }

    static createEnvelope = async (req, res) => {
        const { category, budget, moneyAmount } = req.body;
        const envelope = new Envelope({
            category,
            budget,
            moneyAmount
        });
        
        const response = await EnvelopeService.saveNewEnvelope(envelope);
        res.status(201).json(response);
    }

    static changeMoneyInEnvelope = async (req, res) => {
        const { category, sum, action } = req.body;
        let envelope;
        try {
            envelope = await EnvelopeService.getEnvelopeByCategory(category);
            envelope = await EnvelopeService.changeMoneyInEnvelope(envelope, sum, action);
            res.status(200).json({status: 'Success'});
        } catch (err) {
            console.log(err.stack);
            res.status(400).json({
                status: 'Error',
                error: err.message,
                data: {category, envelope, sum, action}
            });
        }
    }

    static deleteEnvelopeByCategory = async (req, res) => {
        try {
            const category = req.query.category?.toString();
            if (!category) {
                return res.status(400).json({
                    error: 'No category provided in the request',
                    data: req.body
                });
            }
            await EnvelopeService.deleteEnvelopeByCategory(category);
            res.status(200).json({
                status: 'Success'
            });
        } catch (err) {
            res.status(400).json({
                status: 'Error',
                error: err.message,
                data: {category}
            });   
        }
    }

    static transferMoneyBetweenEnvelopes = async (req, res) => {
        const { categoryFrom, categoryTo } = req.body;
        let envelopeFrom, envelopeTo;
        try {
            envelopeFrom = await EnvelopeService.getEnvelopeByCategory(categoryFrom);
            envelopeTo = await EnvelopeService.getEnvelopeByCategory(categoryTo);

            const moneyToTransfer = envelopeFrom.moneyAmount;

            envelopeTo = await EnvelopeService.changeMoneyInEnvelope(envelopeTo, moneyToTransfer, 'add');
            envelopeFrom = await EnvelopeService.changeMoneyInEnvelope(envelopeFrom, moneyToTransfer, 'extract');
            res.status(200).json({
                status: 'Success',
                envelopeFrom,
                envelopeTo
            });
        } catch (err) {
            res.status(400).json({
                status: 'Error',
                error: err.message,
                data: req.body
            });  
        }
    }
}

module.exports = EnvelopeController;