const Joi = require('joi');
const { variables: { CURRENT_YEAR } } = require('../config');

const createCarValidator = Joi.object({
    model: Joi.string().alphanum().min(2).max(30)
        .required()
        .trim(),
    year: Joi.number().min(CURRENT_YEAR - 200).max(CURRENT_YEAR),
    price: Joi.number().min(0).max(1000000000)
});

const updateCarValidator = Joi.object({
    model: Joi.string().alphanum().min(2).max(30),
    year: Joi.number().min(CURRENT_YEAR - 200).max(CURRENT_YEAR),
});

module.exports = {
    createCarValidator,
    updateCarValidator
};
