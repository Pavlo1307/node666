const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const expressFileUpload = require('express-fileupload');
const expressRateLimit = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');
const { userRouter, carRouter, loginRouter } = require('./routes');

require('dotenv').config();
const { statusErr: { NOT_FOUND }, messageError: { notFound }, ErrorHandler } = require('./errors');
const cronJobs = require('./cron');
const swaggerJson = require('./docs/swagger.json');
const { variables: { PORT, dataBasePost, ALLOWED_ORIGINS } } = require('./config');

const app = express();

mongoose.connect(dataBasePost, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(helmet());

app.use(cors({ origin: _configureCors }));

app.use(expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload());

if (process.env.NODE_ENV === 'dev') {
    // eslint-disable-next-line import/no-extraneous-dependencies,no-shadow
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.get('/', ((req, res) => {
    res.status(NOT_FOUND).end(notFound);
}));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.use('/login', loginRouter);
app.use('/users', userRouter);
app.use('/cars', carRouter);
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

app.listen(PORT, () => {
    console.log('App listen', PORT);
    cronJobs();
    require('./utils/defaulData.util');
});

function _notFoundError(err, req, res, next) {
    next({
        status: err.status || NOT_FOUND,
        message: err.message || notFound
    });
}

// eslint-disable-next-line no-unused-vars
function _mainErrorHandler(err, req, res, next) {
    res
        .status(err.status || 500)
        .json({
            message: err.message
        });
}

function _configureCors(origin, callback) {
    const whitelist = ALLOWED_ORIGINS.split(';');

    if (!origin && process.env.NODE_ENV === 'dev') {
        return callback(null, true);
    }

    if (!whitelist.includes(origin)) {
        return callback(new ErrorHandler(403, 'CORS not allowed'), false);
    }

    return callback(null, true);
}
