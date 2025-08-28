import { Op } from "sequelize";
import Notice from "../Models/notice.model.js";

export default class NoticeRepository {
  async create(data, options = {}) {
    return Notice.create(data, options);
  }

  async findById(id, options = {}) {
    return Notice.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await Notice.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Notice.destroy({ where: { id }, ...options });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      q,
      status,
      isPopup,
      activeNow,
      createdFrom,
      createdTo,
      displayFrom,
      displayTo,
      tags,
      sortBy,
      sortOrder,
    } = {},
    options = {}
  ) {
    const where = {};

    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [
        { title: like },
        { summary: like },
        { body: like },
        { tags: like },
      ];
    }
    if (status) where.status = status;
    if (isPopup != null) where.isPopup = String(isPopup) === "true";

    if (activeNow === true || String(activeNow) === "true") {
      const now = new Date();
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({ [Op.or]: [{ displayFrom: null }, { displayFrom: { [Op.lte]: now } }] });
      where[Op.and].push({ [Op.or]: [{ displayTo: null }, { displayTo: { [Op.gte]: now } }] });
    }

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt[Op.gte] = new Date(createdFrom);
      if (createdTo) where.createdAt[Op.lte] = new Date(createdTo);
    }

    if (displayFrom || displayTo) {
      where[Op.and] = where[Op.and] || [];
      if (displayFrom) {
        where[Op.and].push({ [Op.or]: [{ displayFrom: null }, { displayFrom: { [Op.gte]: new Date(displayFrom) } }] });
      }
      if (displayTo) {
        where[Op.and].push({ [Op.or]: [{ displayTo: null }, { displayTo: { [Op.lte]: new Date(displayTo) } }] });
      }
    }

    if (tags) {
      const arr = Array.isArray(tags)
        ? tags
        : String(tags).split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) {
        where[Op.and] = where[Op.and] || [];
        for (const t of arr) where[Op.and].push({ tags: { [Op.like]: `%${t}%` } });
      }
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "display_from", "priority", "title"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await Notice.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });
    return { items, total, page, pageSize };
  }
}

