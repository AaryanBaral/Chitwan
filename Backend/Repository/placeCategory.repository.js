import { Op } from "sequelize";
import PlaceCategory from "../Models/placeCategory.model.js";

export default class PlaceCategoryRepository {
  async create(data, options = {}) {
    return PlaceCategory.create(data, options);
  }

  async findById(id, options = {}) {
    return PlaceCategory.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await PlaceCategory.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return PlaceCategory.destroy({ where: { id }, ...options });
  }

  async list(
    { page = 1, pageSize = 20, q, status, sortBy, sortOrder } = {},
    options = {}
  ) {
    const where = {};
    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [{ name: like }, { slug: like }, { description: like }];
    }
    if (status) where.status = status;

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "name", "slug"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await PlaceCategory.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}
