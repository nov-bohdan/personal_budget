class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const validateEnvelopeData = ({category, budget, moneyAmount}) => {
    const errors = [];
    if (typeof category !== 'string' || category.trim() === '') {
        errors.push({ field: 'category', message: 'Category must be a non-empty string' });
    }
    if (typeof budget !== 'number' || isNaN(budget)) {
        errors.push({ field: 'budget', message: 'Budget must be a valid number' });
    } else if (budget < 0) {
        errors.push({ field: 'budget', message: 'Budget must be greater than or equal to 0' });
    }
    if (typeof moneyAmount !== 'number' || isNaN(moneyAmount)) {
        errors.push({ field: 'moneyAmount', message: 'Money amount must be a valid number' });
    } else if (moneyAmount < 0) {
        errors.push({ field: 'moneyAmount', message: 'Money amount must be greater than or equal to 0' });
    }
    return errors;
}

const validatePositiveNumber = (value, fieldName) => {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
        throw new ValidationError(`${fieldName} must be a positive number`);
    }
}

const validateEnvelope = (envelope) => {
    if(!(envelope instanceof Envelope)) {
        throw new ValidationError('Invalid envelope instance');
    }
}

module.exports = {
    ValidationError,
    validateEnvelopeData,
    validatePositiveNumber,
    validateEnvelope
}