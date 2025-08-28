import { Op } from "sequelize";
import Guide from "../Models/guide.model.js";

export default class GuideRepository {
  async create(data, options = {}) {
    return Guide.create(data, options);
  }

  async findById(id, options = {}) {
    return Guide.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await Guide.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Guide.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      gender,
      experienceMin,
      experienceMax,
      languages,
      specialization,
      dobFrom,
      dobTo,
      createdFrom,
      createdTo,
      sortBy,
      sortOrder,
    } = {},
    options = {}
  ) {
    const where = {};

    if (q) {
      const like = { [Op.like]: `%${q}%` };
      Object.assign(where, {
        [Op.or]: [
          { fullName: like },
          { email: like },
          { phone: like },
          { licenseNo: like },
          { citizenshipNo: like },
          { specialization: like },
          { address: like },
        ],
      });
    }

    if (status) where.status = status;
    if (gender) where.gender = gender;

    if (experienceMin != null || experienceMax != null) {
      where.experienceYears = {};
      if (experienceMin != null) where.experienceYears[Op.gte] = Number(experienceMin);
      if (experienceMax != null) where.experienceYears[Op.lte] = Number(experienceMax);
    }

    if (specialization) {
      where.specialization = { [Op.like]: `%${specialization}%` };
    }

    if (languages && languages.length) {
      // languages stored as comma-separated string; naive LIKE match for each requested language
      const arr = Array.isArray(languages) ? languages : String(languages).split(",").map(s => s.trim()).filter(Boolean);
      where[Op.and] = where[Op.and] || [];
      for (const lang of arr) {
        where[Op.and].push({ languages: { [Op.like]: `%${lang}%` } });
      }
    }

    if (dobFrom || dobTo) {
      where.dob = {};
      if (dobFrom) where.dob[Op.gte] = dobFrom;
      if (dobTo) where.dob[Op.lte] = dobTo;
    }

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    const offset = (page - 1) * pageSize;

    const validSortBy = new Set(["created_at", "updated_at", "full_name", "experience_years"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Guide.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}

