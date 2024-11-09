const express = require('express');
const apiRouter = express.Router();
const envelopeRouter = require('./envelopeRoutes');

apiRouter.use('/envelopes', envelopeRouter);

module.exports = apiRouter;