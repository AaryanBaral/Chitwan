import Joi from "joi";

const statusEnum = ["draft", "published", "archived"];

export const createVideoSchema = Joi.object({
  description: Joi.string().allow(null, "").optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ).optional(),
  status: Joi.string().valid(...statusEnum).default("draft"),
  publishedAt: Joi.date().iso().allow(null).optional(),
});

export const updateVideoSchema = Joi.object({
  description: Joi.string().allow(null, ""),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ),
  status: Joi.string().valid(...statusEnum),
  publishedAt: Joi.date().iso().allow(null),
}).min(1);
