import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  JWT_KEY: Joi.required(),
  MONGODB: Joi.required(),
});
