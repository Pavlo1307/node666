const { Schema, model } = require('mongoose');

const { databaseTablesEnum: { user, login } } = require('../config');

const LoginSchema = new Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: user
    }
}, { timestamps: true });

module.exports = model(login, LoginSchema);
