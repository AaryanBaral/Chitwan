import { saveImagesLocally } from "../Utils/fileStorage.js";
import FloraFaunaImage from "../Models/floraFaunaImage.model.js";
import FloraFaunaRepository from "../Repository/floraFauna.repository.js";

const repo = new FloraFaunaRepository();

function toDto(entity, images = []) {
  if (!entity) return null;
  const e = entity.toJSON ? entity.toJSON() : entity;
  return {
    id: e.id,
    type: e.type,
    commonName: e.commonName,
    scientificName: e.scientificName,
    description: e.description,
    habitat: e.habitat,
    location: e.location,
    conservationStatus: e.conservationStatus,
    status: e.status,
    images: images.map((img) => img.path),
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export class FloraFaunaService {
  async create(payload, files = []) {
    const created = await repo.create(payload);
    const paths = saveImagesLocally(files, "flora_fauna");
    if (paths.length) await repo.addImages(created.id, paths);
    const imgs = paths.map((p) => ({ path: p }));
    return toDto(created, imgs);
  }

  async getById(id) {
    const entity = await repo.findById(id);
    if (!entity) return null;
    const images = await FloraFaunaImage.findAll({ where: { floraFaunaId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toDto(entity, images);
  }

  async list(params) {
    const result = await repo.list(params);
    const ids = result.items.map((x) => x.id);
    const imgs = await repo.listImagesByParentIds(ids);
    const map = new Map();
    for (const img of imgs) {
      const arr = map.get(img.floraFaunaId) || [];
      arr.push(img);
      map.set(img.floraFaunaId, arr);
    }
    return {
      ...result,
      items: result.items.map((e) => toDto(e, map.get(e.id) || [])),
    };
  }

  async update(id, payload, files = []) {
    const existing = await repo.findById(id);
    if (!existing) return null;

    const data = {};
    for (const [k, v] of Object.entries(payload)) {
      if (k === "imagesToRemove") continue;
      if (v !== undefined) data[k] = v;
    }

    const newPaths = saveImagesLocally(files, "flora_fauna");
    if (payload.imagesToRemove) {
      const remove = Array.isArray(payload.imagesToRemove)
        ? payload.imagesToRemove
        : [payload.imagesToRemove];
      if (remove.length) {
        await repo.removeImagesByPaths(id, remove);
      }
    }
    if (newPaths.length) {
      const currentCount = await FloraFaunaImage.count({ where: { floraFaunaId: id } });
      const rows = newPaths.map((p, i) => ({ floraFaunaId: id, path: p, sortOrder: currentCount + i }));
      await FloraFaunaImage.bulkCreate(rows);
    }

    const updated = Object.keys(data).length ? await repo.updateById(id, data) : existing;
    const images = await FloraFaunaImage.findAll({ where: { floraFaunaId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toDto(updated, images);
  }

  async delete(id) {
    return repo.deleteById(id);
  }

  
}

export default new FloraFaunaService();
