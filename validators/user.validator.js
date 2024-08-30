const Joi = require("joi");

const addschema = Joi.object({
  username: Joi.string().min(2).lowercase().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

const updateSchema = Joi.object({
  username: Joi.string().min(2).lowercase().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

module.exports = {
  addschema,
  updateSchema,
};
