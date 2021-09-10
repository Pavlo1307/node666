const { Schema, model } = require('mongoose');

const { databaseTablesEnum: { actionToken, user } } = require('../config');

const ActionTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: user
    }
}, { timestamps: true });

module.exports = model(actionToken, ActionTokenSchema);
