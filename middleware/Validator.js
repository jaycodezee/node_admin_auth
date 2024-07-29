// const Joi = require('joi');

// const validate =(req,res,next) =>{
//     const { username, email, password } = req.body;
//     const info ={ 
//         username,
//         email,
//         password 
//     }
//     const schema = Joi.object({
//         username: Joi.string().alphanum().min(3).max(30).required(),
//         email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
//         password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(3).max(20)
//     })

//     const {error} =schema.validate(info); 
//     if(error){
//         return res.status(501).json({error : error.details[0].message})
//     }
//     next();
// }

// module.exports ={ validate}



const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); 
    if (error) {
      const formattedErrors = error.details.map(err => {
        const message = err.message.replace(`"${err.context.label}"`, '').trim();
        return {
          field: err.context.label,
          message
        };
      });

      return res.status(400).json({error:formattedErrors});
    }
    next();
  };
};



module.exports = validateRequest;