import Joi from "joi";

const statusEnum = ["active", "inactive"];

export const createPlaceSchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().allow(null, "").optional(),
  category: Joi.string().max(100).allow(null, "").optional(),
  address: Joi.string().max(255).allow(null, "").optional(),
  city: Joi.string().max(100).allow(null, "").optional(),
  state: Joi.string().max(100).allow(null, "").optional(),
  country: Joi.string().max(100).allow(null, "").optional(),
  latitude: Joi.number().min(-90).max(90).allow(null).optional(),
  longitude: Joi.number().min(-180).max(180).allow(null).optional(),
  openingHours: Joi.string().max(255).allow(null, "").optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ).optional(),
  status: Joi.string().valid(...statusEnum).default("active"),
});

export const updatePlaceSchema = Joi.object({
  name: Joi.string().max(200),
  description: Joi.string().allow(null, ""),
  category: Joi.string().max(100).allow(null, ""),
  address: Joi.string().max(255).allow(null, ""),
  city: Joi.string().max(100).allow(null, ""),
  state: Joi.string().max(100).allow(null, ""),
  country: Joi.string().max(100).allow(null, ""),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  openingHours: Joi.string().max(255).allow(null, ""),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ),
  status: Joi.string().valid(...statusEnum),
  imagesToRemove: Joi.array().items(Joi.string()),
}).min(1);

