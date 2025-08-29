import TrainingRegistrationRepository from "../Repository/trainingRegistration.repository.js";
import TrainingRepository from "../Repository/training.repository.js";

const repo = new TrainingRegistrationRepository();
const trainingRepo = new TrainingRepository();

function toRegistrationDto(r) {
  if (!r) return null;
  const x = r.toJSON ? r.toJSON() : r;
  return {
    id: x.id,
    trainingId: x.trainingId,
    registrantName: x.registrantName,
    registrantEmail: x.registrantEmail,
    registrantPhone: x.registrantPhone,
    citizenshipNo: x.citizenshipNo,
    organization: x.organization,
    address: x.address,
    registrationStatus: x.registrationStatus,
    submittedAt: x.submittedAt,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class TrainingRegistrationService {
  async create(payload) {
    // Ensure training exists
    const training = await trainingRepo.findById(payload.trainingId);
    if (!training) {
      const err = new Error("Invalid trainingId");
      err.status = 400;
      throw err;
    }
    const created = await repo.create({ ...payload });
    return toRegistrationDto(created);
  }

  async getById(id) {
    const r = await repo.findById(id);
    return toRegistrationDto(r);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toRegistrationDto) };
  }

  async update(id, payload) {
    const existing = await repo.findById(id);
    if (!existing) return null;
    const updated = await repo.updateById(id, payload);
    return toRegistrationDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }

  async getMine({ registrantEmail, citizenshipNo }) {
    if (!registrantEmail && !citizenshipNo) {
      const err = new Error("Provide registrantEmail or citizenshipNo");
      err.status = 400;
      throw err;
    }
    const regs = await repo.listByIdentity({ registrantEmail, citizenshipNo });
    const items = regs.map(toRegistrationDto);
    // fetch trainings
    const ids = Array.from(new Set(items.map((x) => x.trainingId)));
    let trainings = [];
    if (ids.length) {
      const { default: Training } = await import("../Models/training.model.js");
      const { Op } = await import("sequelize");
      trainings = await Training.findAll({ where: { id: { [Op.in]: ids } } });
    }
    const tMap = new Map(trainings.map((t) => [t.id, t]));
    const now = new Date();
    const enriched = items.map((r) => {
      const t = tMap.get(r.trainingId);
      let training = null;
      let timeStatus = null;
      if (t) {
        const x = t.toJSON ? t.toJSON() : t;
        training = {
          id: x.id,
          title: x.title,
          slug: x.slug,
          summary: x.summary,
          mode: x.mode,
          location: x.location,
          startAt: x.startAt,
          endAt: x.endAt,
          status: x.status,
        };
        if (x.startAt && x.endAt) {
          const s = new Date(x.startAt);
          const e = new Date(x.endAt);
          timeStatus = now < s ? "upcoming" : now > e ? "past" : "ongoing";
        }
      }
      return { ...r, training, timeStatus };
    });
    return { items: enriched, total: enriched.length };
  }
}

export default new TrainingRegistrationService();
