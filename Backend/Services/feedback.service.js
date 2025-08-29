import FeedbackRepository from "../Repository/feedback.repository.js";

const repo = new FeedbackRepository();

function toFeedbackDto(fb) {
  if (!fb) return null;
  const f = fb.toJSON ? fb.toJSON() : fb;
  return {
    id: f.id,
    fullName: f.fullName,
    email: f.email,
    phone: f.phone,
    subject: f.subject,
    message: f.message,
    rating: f.rating,
    status: f.status,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

export class FeedbackService {
  async create(payload) {
    const created = await repo.create(payload);
    return toFeedbackDto(created);
  }

  async getById(id) {
    const f = await repo.findById(id);
    return toFeedbackDto(f);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toFeedbackDto) };
  }

  async update(id, payload) {
    const existing = await repo.findById(id);
    if (!existing) return null;
    const updated = await repo.updateById(id, payload);
    return toFeedbackDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new FeedbackService();

