const apiRouter = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const EnvelopeController = require('./../controllers/envelopeController');

apiRouter.use(bodyParser.json());
apiRouter.use(morgan('short'));

apiRouter.get('/envelopes', (req, res) => {
    const category = req.query.category;
    if (category) {
        EnvelopeController.getEnvelopeByCategory(req, res);
    } else {
        EnvelopeController.getAllEnvelopes(req, res);
    }
});
apiRouter.post('/envelopes', EnvelopeController.createEnvelope);
apiRouter.put('/envelopes/changeamount', EnvelopeController.changeMoneyInEnvelope);
apiRouter.delete('/envelopes', EnvelopeController.deleteEnvelopeByCategory);
apiRouter.post('/envelopes/transferbetween', EnvelopeController.transferMoneyBetweenEnvelopes);

module.exports = apiRouter;