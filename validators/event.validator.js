const Joi = require("joi");

const eventschema = Joi.object({
  eventName: Joi.string().min(2).lowercase().required(),
  category: Joi.string().lowercase().required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().min(3).required(),
});
const eventupdateschema = Joi.object({
  eventName: Joi.string().min(2).lowercase().required(),
  category: Joi.string().lowercase().required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().min(3).required(),
});

module.exports = {
  eventschema,
  eventupdateschema,
};
