import Joi from "joi";

const modeEnum = ["in_person", "online", "hybrid"];
const statusEnum = ["draft", "published", "closed", "cancelled"];
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createTrainingSchema = Joi.object({
  title: Joi.string().max(200).required(),
  slug: Joi.string().max(220).regex(slugRegex).optional(),
  summary: Joi.string().max(500).allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),

  mode: Joi.string().valid(...modeEnum).default("in_person"),
  location: Joi.string().max(255).allow(null, "").optional(),
  department: Joi.string().max(150).allow(null, "").optional(),
  category: Joi.string().max(100).allow(null, "").optional(),

  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
  applicationOpenAt: Joi.date().iso().allow(null).optional(),
  applicationCloseAt: Joi.date().iso().allow(null).optional(),

  maxCapacity: Joi.number().integer().min(0).allow(null).optional(),
  status: Joi.string().valid(...statusEnum).default("draft"),

  eligibility: Joi.string().max(255).allow(null, "").optional(),
  notes: Joi.string().allow(null, "").optional(),
}).custom((value, helpers) => {
  if (value.startAt && value.endAt) {
    const s = new Date(value.startAt);
    const e = new Date(value.endAt);
    if (!(e > s)) {
      return helpers.error("any.invalid", { message: "endAt must be after startAt" });
    }
  }
  if (value.applicationOpenAt && value.applicationCloseAt) {
    const o = new Date(value.applicationOpenAt);
    const c = new Date(value.applicationCloseAt);
    if (o && c && o > c) {
      return helpers.error("any.invalid", { message: "applicationOpenAt must be before or equal to applicationCloseAt" });
    }
  }
  return value;
});

export const updateTrainingSchema = Joi.object({
  title: Joi.string().max(200),
  slug: Joi.string().max(220).regex(slugRegex),
  summary: Joi.string().max(500).allow(null, ""),
  description: Joi.string().allow(null, ""),

  mode: Joi.string().valid(...modeEnum),
  location: Joi.string().max(255).allow(null, ""),
  department: Joi.string().max(150).allow(null, ""),
  category: Joi.string().max(100).allow(null, ""),

  startAt: Joi.date().iso(),
  endAt: Joi.date().iso(),
  applicationOpenAt: Joi.date().iso().allow(null),
  applicationCloseAt: Joi.date().iso().allow(null),

  maxCapacity: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid(...statusEnum),

  eligibility: Joi.string().max(255).allow(null, ""),
  notes: Joi.string().allow(null, ""),
})
  .min(1)
  .custom((value, helpers) => {
    if (value.startAt && value.endAt) {
      const s = new Date(value.startAt);
      const e = new Date(value.endAt);
      if (!(e > s)) {
        return helpers.error("any.invalid", { message: "endAt must be after startAt" });
      }
    }
    if (value.applicationOpenAt && value.applicationCloseAt) {
      const o = new Date(value.applicationOpenAt);
      const c = new Date(value.applicationCloseAt);
      if (o && c && o > c) {
        return helpers.error("any.invalid", { message: "applicationOpenAt must be before or equal to applicationCloseAt" });
      }
    }
    return value;
  });

