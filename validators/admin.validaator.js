const Joi = require('joi')

  const signupschema = Joi.object({
    username: Joi.string().min(2).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
});

const ChangepasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    oldpassword: Joi.string().min(3).required(),
    newPassword: Joi.string().min(5).required(),
    confirmPassword: Joi.string().min(5).required().valid(Joi.ref('newPassword')),
}).with('newPassword', 'confirmPassword');

module.exports = {
    signupschema,
    loginSchema,
    ChangepasswordSchema
 };