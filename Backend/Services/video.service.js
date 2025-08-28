import VideoRepository from "../Repository/video.repository.js";
import { saveVideosLocally } from "../Utils/fileStorage.js";

const repo = new VideoRepository();

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

function toCardDto(v) {
  const x = v.toJSON ? v.toJSON() : v;
  return { id: x.id, video: x.video, publishedAt: x.publishedAt, createdAt: x.createdAt };
}

function toFullDto(v) {
  const x = v.toJSON ? v.toJSON() : v;
  return {
    id: x.id,
    description: x.description,
    video: x.video,
    tags: parseTags(x.tags),
    status: x.status,
    publishedAt: x.publishedAt,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class VideoService {
  async create(payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveVideosLocally([file], "videos");
      data.video = paths[0] || null;
    }
    const created = await repo.create(data);
    return toFullDto(created);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toCardDto) };
  }

  async getById(id) {
    const v = await repo.findById(id);
    return toFullDto(v);
  }

  async update(id, payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveVideosLocally([file], "videos");
      data.video = paths[0] || null;
    }
    const updated = await repo.updateById(id, data);
    return toFullDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new VideoService();
