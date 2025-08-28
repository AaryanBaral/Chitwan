import Joi from "joi";

const statusEnum = ["draft", "published", "archived"];

const baseCreate = {
  title: Joi.string().max(200).required(),
  summary: Joi.string().max(500).allow(null, "").optional(),
  body: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid(...statusEnum).default("draft"),
  isPopup: Joi.boolean().default(false),
  displayFrom: Joi.date().iso().allow(null).optional(),
  displayTo: Joi.date().iso().allow(null).optional(),
  priority: Joi.number().integer().min(0).allow(null).optional(),
  linkUrl: Joi.string().uri().max(500).allow(null, "").optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ).optional(),
};

export const createNoticeSchema = Joi.object(baseCreate).custom((value, helpers) => {
  if (value.displayFrom && value.displayTo) {
    const from = new Date(value.displayFrom);
    const to = new Date(value.displayTo);
    if (from > to) {
      return helpers.error("any.invalid", { message: "displayFrom must be before or equal to displayTo" });
    }
  }
  return value;
});

const baseUpdate = {
  title: Joi.string().max(200),
  summary: Joi.string().max(500).allow(null, ""),
  body: Joi.string().allow(null, ""),
  status: Joi.string().valid(...statusEnum),
  isPopup: Joi.boolean(),
  displayFrom: Joi.date().iso().allow(null),
  displayTo: Joi.date().iso().allow(null),
  priority: Joi.number().integer().min(0).allow(null),
  linkUrl: Joi.string().uri().max(500).allow(null, ""),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(50),
    Joi.string().max(300)
  ),
};

export const updateNoticeSchema = Joi.object(baseUpdate)
  .min(1)
  .custom((value, helpers) => {
    if (value.displayFrom && value.displayTo) {
      const from = new Date(value.displayFrom);
      const to = new Date(value.displayTo);
      if (from > to) {
        return helpers.error("any.invalid", { message: "displayFrom must be before or equal to displayTo" });
      }
    }
    return value;
  });
