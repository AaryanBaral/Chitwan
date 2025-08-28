import BlogRepository from "../Repository/blog.repository.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";

const repo = new BlogRepository();

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

function toCardDto(blog) {
  if (!blog) return null;
  const b = blog.toJSON ? blog.toJSON() : blog;
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    summary: b.summary,
    image: b.image || null,
    publishedAt: b.publishedAt,
    createdAt: b.createdAt,
  };
}

function toFullDto(blog) {
  if (!blog) return null;
  const b = blog.toJSON ? blog.toJSON() : blog;
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    summary: b.summary,
    content: b.content,
    image: b.image || null,
    tags: parseTags(b.tags),
    status: b.status,
    publishedAt: b.publishedAt,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

export class BlogService {
  async create(payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "blogs");
      data.image = paths[0] || null;
    }
    const created = await repo.create(data);
    return toFullDto(created);
  }

  async getById(idOrSlug) {
    let b = await repo.findById(idOrSlug);
    if (!b) b = await repo.findBySlug(idOrSlug);
    return toFullDto(b);
  }

  async list(params) {
    const result = await repo.list(params);
    return { ...result, items: result.items.map(toCardDto) };
  }

  async update(id, payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "blogs");
      data.image = paths[0] || null;
    }
    const updated = await repo.updateById(id, data);
    return toFullDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new BlogService();
