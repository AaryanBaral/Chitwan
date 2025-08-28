import { Op } from "sequelize";
import Blog from "../Models/blog.model.js";

export default class BlogRepository {
  async create(data, options = {}) {
    return Blog.create(data, options);
  }

  async findById(id, options = {}) {
    return Blog.findByPk(id, { ...options });
  }

  async findBySlug(slug, options = {}) {
    return Blog.findOne({ where: { slug }, ...options });
  }

  async updateById(id, data, options = {}) {
    await Blog.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Blog.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      sortBy,
      sortOrder,
    } = {},
    options = {}
  ) {
    const where = {};
    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [{ title: like }, { summary: like }, { tags: like }];
    }
    if (status) where.status = status;

    const offset = (page - 1) * pageSize;

    const validSortBy = new Set(["created_at", "published_at", "title"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Blog.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}

