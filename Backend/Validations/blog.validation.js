import Joi from "joi";

const statusEnum = ["draft", "published", "archived"];

export const createBlogSchema = Joi.object({
  title: Joi.string().max(200).required(),
  slug: Joi.string().max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  summary: Joi.string().max(500).allow(null, "").optional(),
  content: Joi.string().allow(null, "").optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ).optional(),
  status: Joi.string().valid(...statusEnum).default("draft"),
  publishedAt: Joi.date().iso().allow(null).optional(),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().max(200),
  slug: Joi.string().max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: Joi.string().max(500).allow(null, ""),
  content: Joi.string().allow(null, ""),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ),
  status: Joi.string().valid(...statusEnum),
  publishedAt: Joi.date().iso().allow(null),
}).min(1);
