import TrainingRepository from "../Repository/training.repository.js";
import { toSlug, buildUniqueSlug } from "../Utils/slug.js";

const repo = new TrainingRepository();

function toTrainingDto(t) {
  if (!t) return null;
  const x = t.toJSON ? t.toJSON() : t;
  return {
    id: x.id,
    title: x.title,
    slug: x.slug,
    summary: x.summary,
    description: x.description,
    mode: x.mode,
    location: x.location,
    department: x.department,
    category: x.category,
    startAt: x.startAt,
    endAt: x.endAt,
    applicationOpenAt: x.applicationOpenAt,
    applicationCloseAt: x.applicationCloseAt,
    maxCapacity: x.maxCapacity,
    status: x.status,
    eligibility: x.eligibility,
    notes: x.notes,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class TrainingService {
  async create(payload) {
    const data = { ...payload };
    // slug auto-gen
    if (!data.slug) {
      const base = toSlug(data.title);
      data.slug = await buildUniqueSlug(base, async (slug) => !!(await repo.findBySlug(slug)), { maxLength: 220 });
    } else {
      const base = toSlug(data.slug);
      data.slug = await buildUniqueSlug(base, async (slug) => !!(await repo.findBySlug(slug)), { maxLength: 220 });
    }
    const created = await repo.create(data);
    return toTrainingDto(created);
  }

  async getById(idOrSlug) {
    let t = await repo.findById(idOrSlug);
    if (!t) t = await repo.findBySlug(idOrSlug);
    return toTrainingDto(t);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toTrainingDto) };
  }

  async update(id, payload) {
    const data = { ...payload };
    if (data.slug) {
      const base = toSlug(data.slug);
      data.slug = await buildUniqueSlug(
        base,
        async (slug, excludeId) => {
          const existing = await repo.findBySlug(slug);
          return existing && existing.id !== excludeId;
        },
        { maxLength: 220, excludeId: id }
      );
    } else if (data.title) {
      const base = toSlug(data.title);
      data.slug = await buildUniqueSlug(
        base,
        async (slug, excludeId) => {
          const existing = await repo.findBySlug(slug);
          return existing && existing.id !== excludeId;
        },
        { maxLength: 220, excludeId: id }
      );
    }
    const updated = await repo.updateById(id, data);
    return toTrainingDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new TrainingService();

