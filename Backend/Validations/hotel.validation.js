import Joi from "joi";

const statusEnum = ["active", "inactive"];

export const createHotelSchema = Joi.object({
  name: Joi.string().max(150).required(),
  description: Joi.string().allow(null, "").optional(),
  address: Joi.string().max(255).allow(null, "").optional(),
  city: Joi.string().max(100).allow(null, "").optional(),
  state: Joi.string().max(100).allow(null, "").optional(),
  country: Joi.string().max(100).allow(null, "").optional(),
  zip: Joi.string().max(20).allow(null, "").optional(),
  contactName: Joi.string().max(100).allow(null, "").optional(),
  contactEmail: Joi.string().email().max(191).allow(null, "").optional(),
  contactPhone: Joi.string().max(20).allow(null, "").optional(),
  status: Joi.string().valid(...statusEnum).default("active"),
});

export const updateHotelSchema = Joi.object({
  name: Joi.string().max(150),
  description: Joi.string().allow(null, ""),
  address: Joi.string().max(255).allow(null, ""),
  city: Joi.string().max(100).allow(null, ""),
  state: Joi.string().max(100).allow(null, ""),
  country: Joi.string().max(100).allow(null, ""),
  zip: Joi.string().max(20).allow(null, ""),
  contactName: Joi.string().max(100).allow(null, ""),
  contactEmail: Joi.string().email().max(191).allow(null, ""),
  contactPhone: Joi.string().max(20).allow(null, ""),
  status: Joi.string().valid(...statusEnum),
  imagesToRemove: Joi.array().items(Joi.string()),
});
