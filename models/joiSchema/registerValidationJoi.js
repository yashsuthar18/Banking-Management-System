const Joi = require("joi")

registerValidation = Joi.object({
    name: Joi.string().max(30).required(),
    account: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email: Joi.string().max(30).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().required(),
})

module.exports = registerValidation