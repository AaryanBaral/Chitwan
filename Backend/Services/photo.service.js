import PhotoRepository from "../Repository/photo.repository.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";

const repo = new PhotoRepository();

function normalizeTags(input) {
  if (!input) return null;
  if (Array.isArray(input)) return input.filter(Boolean).map(String).join(",");
  return String(input);
}
function parseTags(str) {
  if (!str) return [];
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCardDto(p) {
  const x = p.toJSON ? p.toJSON() : p;
  return { id: x.id, image: x.image, publishedAt: x.publishedAt, createdAt: x.createdAt };
}

function toFullDto(p) {
  const x = p.toJSON ? p.toJSON() : p;
  return {
    id: x.id,
    description: x.description,
    image: x.image,
    tags: parseTags(x.tags),
    status: x.status,
    publishedAt: x.publishedAt,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class PhotoService {
  async create(payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "photos");
      data.image = paths[0] || null;
    }
    const created = await repo.create(data);
    return toFullDto(created);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toCardDto) };
  }

  async getById(id) {
    const p = await repo.findById(id);
    return toFullDto(p);
  }

  async update(id, payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "photos");
      data.image = paths[0] || null;
    }
    const updated = await repo.updateById(id, data);
    return toFullDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new PhotoService();
