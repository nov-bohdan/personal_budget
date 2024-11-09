const express = require('express');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4001;

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});