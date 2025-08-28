import { Op } from "sequelize";
import Admin from "../Models/admin.model.js";

export default class AdminRepository {
  async create(data, options = {}) {
    return Admin.create(data, options);
  }

  async findById(id, options = {}) {
    return Admin.findByPk(id, {
      attributes: { exclude: ["passwordHash"] },
      ...options,
    });
  }

  async findByEmail(email, options = {}) {
    return Admin.findOne({
      where: { email: email.toLowerCase() },
      ...options,
    });
  }

  async list({ page = 1, pageSize = 20, q } = {}, options = {}) {
    const where = q
      ? {
          email: { [Op.like]: `%${q}%` },
        }
      : undefined;

    const offset = (page - 1) * pageSize;

    const { count: total, rows: items } = await Admin.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["passwordHash"] },
      ...options,
    });

    return { items, total, page, pageSize };
  }
  
  async findForAuthByEmail(email, options = {}) {
    return Admin.findOne({
      where: { email: email.toLowerCase() },
      attributes: ["id", "email", "isSuperAdmin", "passwordHash", "createdAt", "updatedAt"],
      ...options,
    });
  }

  async updateById(id, data, options = {}) {
    await Admin.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return Admin.destroy({ where: { id }, ...options });
  }
  async login(id, options = {}) {
    return Admin.update({ lastLoginAt: new Date() }, { where: { id }, ...options });
  }
}
