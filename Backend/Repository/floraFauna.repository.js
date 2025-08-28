import { Op } from "sequelize";
import FloraFauna from "../Models/floraFauna.model.js";
import FloraFaunaImage from "../Models/floraFaunaImage.model.js";

export default class FloraFaunaRepository {
  async create(data, options = {}) {
    return FloraFauna.create(data, options);
  }

  async findById(id, options = {}) {
    return FloraFauna.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await FloraFauna.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return FloraFauna.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      type,
      status,
      habitat,
      location,
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
        { commonName: like },
        { scientificName: like },
        { description: like },
        { habitat: like },
        { location: like },
      ];
    }
    if (type) where.type = type;
    if (status) where.status = status;
    if (habitat) where.habitat = { [Op.like]: `%${habitat}%` };
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "common_name"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await FloraFauna.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });

    return { items, total, page, pageSize };
  }

  async listImagesByParentIds(ids = [], options = {}) {
    if (!ids.length) return [];
    return FloraFaunaImage.findAll({
      where: { floraFaunaId: { [Op.in]: ids } },
      order: [["sort_order", "ASC"], ["created_at", "ASC"]],
      ...options,
    });
  }

  async addImages(parentId, paths = [], options = {}) {
    if (!paths.length) return [];
    const rows = paths.map((p, i) => ({ floraFaunaId: parentId, path: p, sortOrder: i }));
    return FloraFaunaImage.bulkCreate(rows, { ...options });
  }

  async removeImagesByPaths(parentId, paths = [], options = {}) {
    if (!paths.length) return 0;
    return FloraFaunaImage.destroy({ where: { floraFaunaId: parentId, path: { [Op.in]: paths } }, ...options });
  }
}
