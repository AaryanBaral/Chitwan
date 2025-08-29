import Joi from "joi";

const statusEnum = ["new", "reviewed", "resolved", "archived"];

export const createFeedbackSchema = Joi.object({
  fullName: Joi.string().max(150).required(),
  email: Joi.string().email().max(191).allow(null, "").optional(),
  phone: Joi.string().max(20).allow(null, "").optional(),
  subject: Joi.string().max(200).allow(null, "").optional(),
  message: Joi.string().max(5000).required(),
  rating: Joi.number().integer().min(1).max(5).allow(null).optional(),
});

export const updateFeedbackSchema = Joi.object({
  fullName: Joi.string().max(150),
  email: Joi.string().email().max(191).allow(null, ""),
  phone: Joi.string().max(20).allow(null, ""),
  subject: Joi.string().max(200).allow(null, ""),
  message: Joi.string().max(5000),
  rating: Joi.number().integer().min(1).max(5).allow(null),
  status: Joi.string().valid(...statusEnum),
}).min(1);

