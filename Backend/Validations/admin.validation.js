// Validation/admin.validation.js
import Joi from "joi";

export const createAdminSchema = Joi.object({
  email: Joi.string().email().max(191).required(),
  password: Joi.string().min(8).max(128).required(),
  isSuperAdmin: Joi.boolean().default(false),
});

export const updateAdminSchema = Joi.object({
  email: Joi.string().email().max(191),
  password: Joi.string().min(8).max(128), 
  isSuperAdmin: Joi.boolean(),
}).min(1); 

export const loginSchema = Joi.object({
  email: Joi.string().email().max(191).required(),
  password: Joi.string().min(8).max(128).required(),
});
