import BlogRepository from "../Repository/blog.repository.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";
import { toSlug, buildUniqueSlug } from "../Utils/slug.js";

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
    // slug: auto-generate from title if missing
    if (!data.slug) {
      const base = toSlug(data.title);
      data.slug = await buildUniqueSlug(base, async (slug) => !!(await repo.findBySlug(slug)), {
        maxLength: 220,
      });
    } else {
      // sanitize provided slug and ensure uniqueness
      const base = toSlug(data.slug);
      data.slug = await buildUniqueSlug(base, async (slug) => !!(await repo.findBySlug(slug)), {
        maxLength: 220,
      });
    }
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
    // Handle slug update rules
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
      // If title changed and no slug provided, refresh slug from title
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
