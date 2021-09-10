const Joi = require('joi');
const { constants } = require('../config');

const passwordSchema = Joi.string().regex(constants.PASSWORD_REGEXP).trim().required();

const authValidator = Joi.object({
    email: Joi.string().regex(constants.EMAIL_REGEXP).trim().required(),
    password: passwordSchema
});

const passwordValidator = Joi.object({
    password: passwordSchema,
});

const changePasswordValidator = Joi.object({
    oldPassword: passwordSchema,
    password: passwordSchema
});

module.exports = {
    authValidator,
    passwordValidator,
    changePasswordValidator
};
