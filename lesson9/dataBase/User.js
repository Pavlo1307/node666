const { Schema, model } = require('mongoose');

const { userRoles: { USER, ADMIN }, databaseTablesEnum: { user } } = require('../config');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 18
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: USER,
        enum: [
            USER,
            ADMIN
        ]
    },

    isActivate: {
        type: Boolean,
        required: true,
        default: false,
    },

    avatar: {
       type: String
    },

}, { timestamps: true });

module.exports = model(user, userSchema);
