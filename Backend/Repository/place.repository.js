import { Op } from "sequelize";
import Place from "../Models/place.model.js";

export default class PlaceRepository {
  async create(data, options = {}) {
    return Place.create(data, options);
  }

  async findById(id, options = {}) {
    return Place.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await Place.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Place.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      category,
      city,
      state,
      country,
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
        { name: like },
        { description: like },
        { address: like },
        { city: like },
        { state: like },
        { country: like },
        { category: like },
      ];
    }
    if (status) where.status = status;
    if (category) where.category = { [Op.like]: `%${category}%` };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (state) where.state = { [Op.like]: `%${state}%` };
    if (country) where.country = { [Op.like]: `%${country}%` };

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "name"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Place.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }
}

