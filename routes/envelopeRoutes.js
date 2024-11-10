const express = require('express');
const envelopeRouter = express.Router();
const morgan = require('morgan');
const EnvelopeController = require('../controllers/envelopeController');
const {validateEnvelopeData, validatePositiveNumber, joiSchemas} = require('./../utils/validationHelper');

envelopeRouter.use(express.json());
envelopeRouter.use(morgan('short'));

const sumValidator = (req, res, next) => {
    try {
        const { sum } = req.body;
        validatePositiveNumber(sum, 'sum');
        next();
    } catch (err) {
        res.status(400).json({
            error: err.message,
            data: req.body
        });
    }
}

const actionValidator = (req, res, next) => {
    const { action } = req.body;
    const {error} = joiSchemas.envelopeAction.validate(action);
    if (error) {
        return res.status(400).json({
            status: 'Error',
            error: error.details[0].message,
            data: {action}
        })
    }
    next();
}

const newEnvelopeValidator = (req, res, next) => {
    const { category, budget, moneyAmount } = req.body;

    const validationErrors = validateEnvelopeData({category, budget, moneyAmount});
    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            validationErrors: validationErrors,
            data: req.body
        });
    }
    next();
}

envelopeRouter.get('/', (req, res) => {
    const category = req.query.category;
    if (category) {
        EnvelopeController.getEnvelopeByCategory(req, res);
    } else {
        EnvelopeController.getAllEnvelopes(req, res);
    }
});
envelopeRouter.post('/', newEnvelopeValidator, EnvelopeController.createEnvelope);
envelopeRouter.delete('/', EnvelopeController.deleteEnvelopeByCategory);
envelopeRouter.put('/changeamount', sumValidator, actionValidator, EnvelopeController.changeMoneyInEnvelope);
envelopeRouter.put('/transferbetween', EnvelopeController.transferMoneyBetweenEnvelopes);

module.exports = envelopeRouter;