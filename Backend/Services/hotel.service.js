import HotelRepository from "../Repository/hotel.repository.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";
import { Op } from "sequelize";
import HotelImage from "../Models/hotelImage.model.js";

const repo = new HotelRepository();

function toHotelDto(hotel, images = []) {
  if (!hotel) return null;
  const h = hotel.toJSON ? hotel.toJSON() : hotel;
  return {
    id: h.id,
    name: h.name,
    description: h.description,
    address: h.address,
    city: h.city,
    state: h.state,
    country: h.country,
    zip: h.zip,
    contactName: h.contactName,
    contactEmail: h.contactEmail,
    contactPhone: h.contactPhone,
    images: images.length ? images.map((i) => i.path) : (h.images ? JSON.parse(h.images) : []),
    status: h.status,
    createdAt: h.createdAt,
    updatedAt: h.updatedAt,
  };
}

export class HotelService {
  async createHotel(payload, files = []) {
    const data = { ...payload };
    const created = await repo.create(data);
    const paths = saveImagesLocally(files, "hotels");
    if (paths.length) {
      const rows = paths.map((p, i) => ({ hotelId: created.id, path: p, sortOrder: i }));
      await HotelImage.bulkCreate(rows);
    }
    const imgs = paths.map((p) => ({ path: p }));
    return toHotelDto(created, imgs);
  }

  async getById(id) {
    const h = await repo.findById(id);
    if (!h) return null;
    const images = await HotelImage.findAll({ where: { hotelId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toHotelDto(h, images);
  }

  async listHotels(params) {
    const result = await repo.list(params);
    const ids = result.items.map((x) => x.id);
    let allImages = [];
    if (ids.length) {
      allImages = await HotelImage.findAll({ where: { hotelId: { [Op.in]: ids } }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    }
    const map = new Map();
    for (const img of allImages) {
      const arr = map.get(img.hotelId) || [];
      arr.push(img);
      map.set(img.hotelId, arr);
    }
    return { ...result, items: result.items.map((h) => toHotelDto(h, map.get(h.id) || [])) };
  }

  async updateHotel(id, payload, files = []) {
    const existing = await repo.findById(id);
    if (!existing) return null;

    const data = {};
    for (const [k, v] of Object.entries(payload)) {
      if (k === "imagesToRemove") continue;
      if (v !== undefined) data[k] = v;
    }

    const newPaths = saveImagesLocally(files, "hotels");
    if (payload.imagesToRemove?.length) {
      const remove = Array.isArray(payload.imagesToRemove)
        ? payload.imagesToRemove
        : [payload.imagesToRemove];
      await HotelImage.destroy({ where: { hotelId: id, path: { [Op.in]: remove } } });
    }
    if (newPaths.length) {
      const currentCount = await HotelImage.count({ where: { hotelId: id } });
      const rows = newPaths.map((p, i) => ({ hotelId: id, path: p, sortOrder: currentCount + i }));
      await HotelImage.bulkCreate(rows);
    }

    const updated = Object.keys(data).length ? await repo.updateById(id, data) : existing;
    const images = await HotelImage.findAll({ where: { hotelId: id }, order: [["sort_order", "ASC"], ["created_at", "ASC"]] });
    return toHotelDto(updated, images);
  }

  

  async deleteHotel(id) {
    return repo.deleteById(id);
  }
}

export default new HotelService();
