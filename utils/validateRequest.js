const Joi = require("joi")
module.exports = {
    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    registerSchema: Joi.object().keys({
        first_name: Joi.string(),
        last_name: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        user_name: Joi.string().required(),
    })
}