import PlaceRepository from "../Repository/place.repository.js";
import PlaceImage from "../Models/placeImage.model.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";
import { Op } from "sequelize";

const repo = new PlaceRepository();

function toPlaceDto(place, images = []) {
  if (!place) return null;
  const p = place.toJSON ? place.toJSON() : place;
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    address: p.address,
    city: p.city,
    state: p.state,
    country: p.country,
    latitude: p.latitude,
    longitude: p.longitude,
    openingHours: p.openingHours,
    tags: p.tags,
    images: images.map((i) => i.path),
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export class PlaceService {
  async create(payload, files = []) {
    const created = await repo.create({ ...payload });
    const paths = saveImagesLocally(files, "places");
    if (paths.length) {
      const rows = paths.map((p, i) => ({ placeId: created.id, path: p, sortOrder: i }));
      await PlaceImage.bulkCreate(rows);
    }
    const imgs = paths.map((p) => ({ path: p }));
    return toPlaceDto(created, imgs);
  }

  async getById(id) {
    const p = await repo.findById(id);
    if (!p) return null;
    const images = await PlaceImage.findAll({ where: { placeId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toPlaceDto(p, images);
  }

  async list(params) {
    const result = await repo.list(params);
    const ids = result.items.map((x) => x.id);
    let allImages = [];
    if (ids.length) {
      allImages = await PlaceImage.findAll({ where: { placeId: { [Op.in]: ids } }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    }
    const map = new Map();
    for (const img of allImages) {
      const arr = map.get(img.placeId) || [];
      arr.push(img);
      map.set(img.placeId, arr);
    }
    return { ...result, items: result.items.map((pl) => toPlaceDto(pl, map.get(pl.id) || [])) };
  }

  async update(id, payload, files = []) {
    const existing = await repo.findById(id);
    if (!existing) return null;

    const data = {};
    for (const [k, v] of Object.entries(payload)) {
      if (k === "imagesToRemove") continue;
      if (v !== undefined) data[k] = v;
    }

    const newPaths = saveImagesLocally(files, "places");
    if (payload.imagesToRemove?.length) {
      const remove = Array.isArray(payload.imagesToRemove) ? payload.imagesToRemove : [payload.imagesToRemove];
      await PlaceImage.destroy({ where: { placeId: id, path: { [Op.in]: remove } } });
    }
    if (newPaths.length) {
      const currentCount = await PlaceImage.count({ where: { placeId: id } });
      const rows = newPaths.map((p, i) => ({ placeId: id, path: p, sortOrder: currentCount + i }));
      await PlaceImage.bulkCreate(rows);
    }

    const updated = Object.keys(data).length ? await repo.updateById(id, data) : existing;
    const images = await PlaceImage.findAll({ where: { placeId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toPlaceDto(updated, images);
  }

  async delete(id) {
    return repo.deleteById(id);
  }
}

export default new PlaceService();

