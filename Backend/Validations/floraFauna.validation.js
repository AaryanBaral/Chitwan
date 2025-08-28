import Joi from "joi";

const typeEnum = ["flora", "fauna"];
const statusEnum = ["active", "inactive"];

export const createFloraFaunaSchema = Joi.object({
  type: Joi.string().valid(...typeEnum).required(),
  commonName: Joi.string().max(150).required(),
  scientificName: Joi.string().max(200).allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),
  habitat: Joi.string().max(200).allow(null, "").optional(),
  location: Joi.string().max(200).allow(null, "").optional(),
  conservationStatus: Joi.string().max(100).allow(null, "").optional(),
  status: Joi.string().valid(...statusEnum).default("active"),
});

export const updateFloraFaunaSchema = Joi.object({
  type: Joi.string().valid(...typeEnum),
  commonName: Joi.string().max(150),
  scientificName: Joi.string().max(200).allow(null, ""),
  description: Joi.string().allow(null, ""),
  habitat: Joi.string().max(200).allow(null, ""),
  location: Joi.string().max(200).allow(null, ""),
  conservationStatus: Joi.string().max(100).allow(null, ""),
  status: Joi.string().valid(...statusEnum),
  imagesToRemove: Joi.array().items(Joi.string()),
});

