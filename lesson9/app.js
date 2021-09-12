const express = require('express');
const mongoose = require('mongoose');
const expressFileUpload = require('express-fileupload');
const { statusErr: { NOT_FOUND }, messageError: { notFound } } = require('./errors');
require('dotenv').config();

const { variables: { PORT, dataBasePost } } = require('./config');

const app = express();

mongoose.connect(dataBasePost, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload());

const { userRouter, carRouter, loginRouter } = require('./routes');

app.get('/', ((req, res) => {
    res.status(NOT_FOUND).end(notFound);
}));

app.use('/login', loginRouter);
app.use('/users', userRouter);
app.use('/cars', carRouter);
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

app.listen(PORT, () => {
    console.log('App listen', PORT);
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
