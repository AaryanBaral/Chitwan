import Joi from "joi";

const genderEnum = ["male", "female", "other"];
const statusEnum = ["active", "suspended", "retired"];

export const createGuideSchema = Joi.object({
  fullName: Joi.string().max(150).required(),
  gender: Joi.string().valid(...genderEnum).optional(),
  dob: Joi.date().iso().optional(),
  citizenshipNo: Joi.string().max(50).required(),
  licenseNo: Joi.string().max(50).required(),
  phone: Joi.string().max(20).required(),
  email: Joi.string().email().max(191).allow(null, "").optional(),
  address: Joi.string().max(255).required(),
  languages: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().max(50)).max(20),
      Joi.string().max(1000)
    )
    .optional(),
  specialization: Joi.string().max(100).allow(null, "").optional(),
  experienceYears: Joi.number().integer().min(0).allow(null).optional(),
  status: Joi.string().valid(...statusEnum).default("active"),
});

export const updateGuideSchema = Joi.object({
  fullName: Joi.string().max(150),
  gender: Joi.string().valid(...genderEnum),
  dob: Joi.date().iso(),
  citizenshipNo: Joi.string().max(50),
  licenseNo: Joi.string().max(50),
  phone: Joi.string().max(20),
  email: Joi.string().email().max(191).allow(null, ""),
  address: Joi.string().max(255),
  languages: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(20),
    Joi.string().max(1000)
  ),
  specialization: Joi.string().max(100).allow(null, ""),
  experienceYears: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid(...statusEnum),
}).min(1);
