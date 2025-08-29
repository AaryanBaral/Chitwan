import PlaceCategoryRepository from "../Repository/placeCategory.repository.js";
import { toSlug, buildUniqueSlug } from "../Utils/slug.js";

const repo = new PlaceCategoryRepository();

function toPlaceCategoryDto(c) {
  if (!c) return null;
  const x = c.toJSON ? c.toJSON() : c;
  return {
    id: x.id,
    name: x.name,
    slug: x.slug,
    description: x.description,
    status: x.status,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class CategoryService {
  async create(payload) {
    const data = { ...payload };
    if (!data.slug) {
      const base = toSlug(data.name);
      data.slug = await buildUniqueSlug(base, async (slug) => {
        const { default: PlaceCategory } = await import("../Models/placeCategory.model.js");
        return !!(await PlaceCategory.findOne({ where: { slug } }));
      }, { maxLength: 180 });
    } else {
      const base = toSlug(data.slug);
      data.slug = await buildUniqueSlug(base, async (slug) => {
        const { default: PlaceCategory } = await import("../Models/placeCategory.model.js");
        return !!(await PlaceCategory.findOne({ where: { slug } }));
      }, { maxLength: 180 });
    }
    const created = await repo.create(data);
    return toPlaceCategoryDto(created);
  }

  async getById(id) {
    const c = await repo.findById(id);
    return toPlaceCategoryDto(c);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toPlaceCategoryDto) };
  }

  async update(id, payload) {
    const existing = await repo.findById(id);
    if (!existing) return null;
    const data = { ...payload };
    if (data.slug) {
      const base = toSlug(data.slug);
      data.slug = await buildUniqueSlug(base, async (slug, excludeId) => {
        const { default: PlaceCategory } = await import("../Models/placeCategory.model.js");
        const found = await PlaceCategory.findOne({ where: { slug } });
        return found && found.id !== excludeId;
      }, { maxLength: 180, excludeId: id });
    } else if (data.name) {
      const base = toSlug(data.name);
      data.slug = await buildUniqueSlug(base, async (slug, excludeId) => {
        const { default: PlaceCategory } = await import("../Models/placeCategory.model.js");
        const found = await PlaceCategory.findOne({ where: { slug } });
        return found && found.id !== excludeId;
      }, { maxLength: 180, excludeId: id });
    }
    const updated = await repo.updateById(id, data);
    return toPlaceCategoryDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new CategoryService();
