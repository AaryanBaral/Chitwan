import { Op } from "sequelize";
import Photo from "../Models/photo.model.js";

export default class PhotoRepository {
  async create(data, options = {}) {
    return Photo.create(data, options);
  }
  async findById(id, options = {}) {
    return Photo.findByPk(id, { ...options });
  }
  async updateById(id, data, options = {}) {
    await Photo.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }
  async deleteById(id, options = {}) {
    return Photo.destroy({ where: { id }, ...options });
  }
  async list({ page = 1, pageSize = 20, q, status, tags, sortBy, sortOrder } = {}, options = {}) {
    const where = {};
    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [{ description: like }, { tags: like }];
    }
    if (status) where.status = status;
    if (tags) {
      const arr = Array.isArray(tags) ? tags : String(tags).split(",").map(s => s.trim()).filter(Boolean);
      if (arr.length) {
        where[Op.and] = where[Op.and] || [];
        for (const t of arr) where[Op.and].push({ tags: { [Op.like]: `%${t}%` } });
      }
    }
    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "published_at"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
    const { count: total, rows: items } = await Photo.findAndCountAll({ where, offset, limit: pageSize, order: [[orderBy, orderDir]], ...options });
    return { items, total, page, pageSize };
  }
}
