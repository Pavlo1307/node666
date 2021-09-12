const Joi = require('joi');
const {
    constants: { EMAIL_REGEXP, PASSWORD_REGEXP },
    userRoles, variables: { CURRENT_YEAR }
} = require('../config');

const girlsValidator = Joi.object({
    name: Joi.string(),
    age: Joi.number().min(15).max(60)
});

const passwordSchema = Joi.string().regex(PASSWORD_REGEXP).required();

const createUserValidator = Joi.object({
    name: Joi.string().alphanum().min(2).max(30)
        .required()
        .trim(),
    password: passwordSchema,
    born_year: Joi.number().min(CURRENT_YEAR - 120).max(CURRENT_YEAR - 6),
    email: Joi.string().regex(EMAIL_REGEXP).required(),
    role: Joi.string().allow(...Object.values(userRoles)),

    car: Joi.boolean(),

    girls: Joi.array()
        .items(girlsValidator)
        .when('car', { is: true, then: Joi.required() })
});

const updateUser = Joi.object({
    name: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().regex(EMAIL_REGEXP)
});

module.exports = {
    createUserValidator,
    updateUser,
};
