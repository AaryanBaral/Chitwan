import NoticeRepository from "../Repository/notice.repository.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";

const repo = new NoticeRepository();

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

function toCardDto(n) {
  if (!n) return null;
  const x = n.toJSON ? n.toJSON() : n;
  return {
    id: x.id,
    title: x.title,
    summary: x.summary,
    attachment: x.attachment || null,
    isPopup: x.isPopup,
    priority: x.priority,
    createdAt: x.createdAt,
    displayFrom: x.displayFrom,
    displayTo: x.displayTo,
  };
}

function toFullDto(n) {
  if (!n) return null;
  const x = n.toJSON ? n.toJSON() : n;
  return {
    id: x.id,
    title: x.title,
    summary: x.summary,
    body: x.body,
    status: x.status,
    isPopup: x.isPopup,
    displayFrom: x.displayFrom,
    displayTo: x.displayTo,
    priority: x.priority,
    linkUrl: x.linkUrl,
    attachment: x.attachment || null,
    tags: parseTags(x.tags),
    createdAt: x.createdAt,
    updatedAt: x.updatedAt,
  };
}

export class NoticeService {
  async create(payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "notices");
      data.attachment = paths[0] || null;
    }
    const created = await repo.create(data);
    return toFullDto(created);
  }

  async list(params) {
    // Default public behavior: published only if not specified
    const p = { ...params };
    const result = await repo.list(p);
    return { ...result, items: result.items.map(toCardDto) };
  }

  async getById(id) {
    const n = await repo.findById(id);
    return toFullDto(n);
  }

  async listPopups(limit = 10) {
    const size = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const result = await repo.list({
      page: 1,
      pageSize: size,
      status: "published",
      isPopup: true,
      activeNow: true,
      sortBy: "priority",
      sortOrder: "DESC",
    });
    return { ...result, items: result.items.map(toCardDto) };
  }

  async update(id, payload, file) {
    const data = { ...payload };
    if (data.tags !== undefined) data.tags = normalizeTags(data.tags);
    if (file) {
      const paths = saveImagesLocally([file], "notices");
      data.attachment = paths[0] || null;
    }
    const updated = await repo.updateById(id, data);
    return toFullDto(updated);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new NoticeService();
