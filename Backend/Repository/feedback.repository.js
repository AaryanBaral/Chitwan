import { Op } from "sequelize";
import Feedback from "../Models/feedback.model.js";

export default class FeedbackRepository {
  async create(data, options = {}) {
    return Feedback.create(data, options);
  }

  async findById(id, options = {}) {
    return Feedback.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await Feedback.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Feedback.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      rating,
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
      where[Op.or] = [
        { fullName: like },
        { email: like },
        { phone: like },
        { subject: like },
        { message: like },
      ];
    }
    if (status) where.status = status;
    if (rating) where.rating = rating;

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "full_name", "rating"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Feedback.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}

