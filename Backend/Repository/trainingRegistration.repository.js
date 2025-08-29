import { Op } from "sequelize";
import TrainingRegistration from "../Models/trainingRegistration.model.js";

export default class TrainingRegistrationRepository {
  async create(data, options = {}) {
    return TrainingRegistration.create(data, options);
  }

  async findById(id, options = {}) {
    return TrainingRegistration.findByPk(id, { ...options });
  }

  async updateById(id, data, options = {}) {
    await TrainingRegistration.update(data, { where: { id }, ...options });
    return this.findById(id, options);
  }

  async deleteById(id, options = {}) {
    return TrainingRegistration.destroy({ where: { id }, ...options });
  }

  async countByTraining(trainingId, { statuses } = {}) {
    const where = { trainingId };
    if (statuses?.length) where.registrationStatus = { [Op.in]: statuses };
    return TrainingRegistration.count({ where });
  }

  async list(
    {
      page = 1,
      pageSize = 20,
      trainingId,
      q,
      registrationStatus,
      email,
      phone,
      submittedFrom,
      submittedTo,
      sortBy,
      sortOrder,
    } = {},
    options = {}
  ) {
    const where = {};
    if (trainingId) where.trainingId = trainingId;
    if (q) {
      const like = { [Op.like]: `%${q}%` };
      where[Op.or] = [
        { registrantName: like },
        { registrantEmail: like },
        { registrantPhone: like },
        { organization: like },
        { address: like },
      ];
    }
    if (registrationStatus) where.registrationStatus = registrationStatus;
    if (email) where.registrantEmail = email;
    if (phone) where.registrantPhone = phone;
    if (submittedFrom || submittedTo) {
      where.submittedAt = {};
      if (submittedFrom) where.submittedAt[Op.gte] = new Date(submittedFrom);
      if (submittedTo) where.submittedAt[Op.lte] = new Date(submittedTo);
    }

    const offset = (page - 1) * pageSize;
    const validSortBy = new Set(["created_at", "updated_at", "submitted_at", "registrant_name"]);
    const orderBy = validSortBy.has(sortBy ?? "") ? sortBy : "created_at";
    const orderDir = String(sortOrder || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    const { count: total, rows: items } = await TrainingRegistration.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[orderBy, orderDir]],
      ...options,
    });
    return { items, total, page, pageSize };
  }

  async listByIdentity({ registrantEmail, citizenshipNo }) {
    const where = {};
    if (registrantEmail) where.registrantEmail = registrantEmail;
    if (citizenshipNo) where.citizenshipNo = citizenshipNo;
    return TrainingRegistration.findAll({
      where,
      order: [["submitted_at", "DESC"]],
    });
  }
}
