import { Op, Sequelize } from "sequelize";
import Training from "../Models/training.model.js";

export default class TrainingRepository {
  async create(data, options = {}) {
    return Training.create(data, options);
  }

  async findById(id, options = {}) {
    return Training.findByPk(id, { ...options });
  }

  async findBySlug(slug, options = {}) {
    return Training.findOne({ where: { slug }, ...options });
  }

  async updateById(id, data, options = {}) {
    await Training.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Training.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      mode,
      department,
      category,
      startFrom,
      startTo,
      appOpen,
      appClose,
      activeForApplication, // boolean, within application window now
      sortBy,
      sortOrder,
    } = {},
    options = {}
  ) {
    const where = {};

    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [{ title: like }, { summary: like }, { description: like }];
    }
    if (status) where.status = status;
    if (mode) where.mode = mode;
    if (department) where.department = { [Op.like]: `%${department}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };

    if (startFrom || startTo) {
      where.startAt = {};
      if (startFrom) where.startAt[Op.gte] = new Date(startFrom);
      if (startTo) where.startAt[Op.lte] = new Date(startTo);
    }

    if (appOpen || appClose) {
      where.applicationOpenAt = where.applicationOpenAt || {};
      where.applicationCloseAt = where.applicationCloseAt || {};
      if (appOpen) where.applicationOpenAt[Op.gte] = new Date(appOpen);
      if (appClose) where.applicationCloseAt[Op.lte] = new Date(appClose);
    }

    if (activeForApplication) {
      const now = new Date();
      where[Op.and] = [
        { [Op.or]: [{ applicationOpenAt: null }, { applicationOpenAt: { [Op.lte]: now } }] },
        { [Op.or]: [{ applicationCloseAt: null }, { applicationCloseAt: { [Op.gte]: now } }] },
      ];
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "start_at", "title"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Training.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}

