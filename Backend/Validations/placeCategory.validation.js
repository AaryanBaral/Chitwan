import Joi from "joi";

const statusEnum = ["active", "inactive"];
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createPlaceCategorySchema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(180).regex(slugRegex).optional(),
  description: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid(...statusEnum).default("active"),
});

export const updatePlaceCategorySchema = Joi.object({
  name: Joi.string().max(150),
  slug: Joi.string().max(180).regex(slugRegex),
  description: Joi.string().allow(null, ""),
  status: Joi.string().valid(...statusEnum),
}).min(1);

