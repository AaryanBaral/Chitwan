import Joi from "joi";

const statusEnum = ["pending", "confirmed", "waitlisted", "cancelled"];

export const createTrainingRegistrationSchema = Joi.object({
  trainingId: Joi.string().guid({ version: ["uuidv4", "uuidv1"] }).required(),
  registrantName: Joi.string().max(150).required(),
  registrantEmail: Joi.string().email().max(191).allow(null, "").optional(),
  registrantPhone: Joi.string().max(20).allow(null, "").optional(),
  citizenshipNo: Joi.string().max(50).allow(null, "").optional(),
  organization: Joi.string().max(150).allow(null, "").optional(),
  address: Joi.string().max(255).allow(null, "").optional(),
  // status is managed by admins; default is pending
});

export const updateTrainingRegistrationSchema = Joi.object({
  registrantName: Joi.string().max(150),
  registrantEmail: Joi.string().email().max(191).allow(null, ""),
  registrantPhone: Joi.string().max(20).allow(null, ""),
  citizenshipNo: Joi.string().max(50).allow(null, ""),
  organization: Joi.string().max(150).allow(null, ""),
  address: Joi.string().max(255).allow(null, ""),
  registrationStatus: Joi.string().valid(...statusEnum),
}).min(1);

