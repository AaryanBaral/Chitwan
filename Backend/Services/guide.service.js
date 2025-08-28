import GuideRepository from "../Repository/guide.repository.js";
import GuideImage from "../Models/guideImage.model.js";
import { saveImagesLocally } from "../Utils/fileStorage.js";
import { Op } from "sequelize";

const repo = new GuideRepository();

function parseLanguagesIn(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  // comma-separated string
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeLanguages(out) {
  if (!out) return null;
  const arr = parseLanguagesIn(out);
  if (!arr || !arr.length) return null;
  return arr.join(",");
}

function toGuideDto(guide, imagePath = null) {
  if (!guide) return null;
  const g = guide.toJSON ? guide.toJSON() : guide;
  return {
    id: g.id,
    fullName: g.fullName,
    gender: g.gender,
    dob: g.dob,
    citizenshipNo: g.citizenshipNo,
    licenseNo: g.licenseNo,
    phone: g.phone,
    email: g.email,
    address: g.address,
    languages: g.languages ? String(g.languages).split(",").map((s) => s.trim()).filter(Boolean) : [],
    specialization: g.specialization,
    experienceYears: g.experienceYears,
    status: g.status,
    image: imagePath,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  };
}

export class GuideService {
  async createGuide(payload, file) {
    const data = { ...payload };
    if (data.email) data.email = data.email.toLowerCase();
    if (data.languages !== undefined) data.languages = serializeLanguages(data.languages);
    const created = await repo.create(data);
    let imagePath = null;
    if (file) {
      const paths = saveImagesLocally([file], "guides");
      imagePath = paths[0] || null;
      if (imagePath) await GuideImage.create({ guideId: created.id, path: imagePath });
    }
    return toGuideDto(created, imagePath);
  }

  async getById(id) {
    const g = await repo.findById(id);
    if (!g) return null;
    const img = await GuideImage.findOne({ where: { guideId: id } });
    return toGuideDto(g, img?.path || null);
  }

  async listGuides(params) {
    const filters = { ...params };
    if (filters.languages !== undefined) filters.languages = parseLanguagesIn(filters.languages);
    const result = await repo.list(filters);
    const ids = result.items.map((x) => x.id);
    let images = [];
    if (ids.length) {
      images = await GuideImage.findAll({ where: { guideId: { [Op.in]: ids } } });
    }
    const map = new Map();
    for (const img of images) map.set(img.guideId, img.path);
    return {
      ...result,
      items: result.items.map((g) => toGuideDto(g, map.get(g.id) || null)),
    };
  }

  async updateGuide(id, payload, file) {
    const data = { ...payload };
    if (data.email) data.email = data.email.toLowerCase();
    if (data.languages !== undefined) data.languages = serializeLanguages(data.languages);
    const updated = await repo.updateById(id, data);
    if (!updated) return null;
    let imagePath = null;
    if (file) {
      // Replace existing image record (if any)
      await GuideImage.destroy({ where: { guideId: id } });
      const paths = saveImagesLocally([file], "guides");
      imagePath = paths[0] || null;
      if (imagePath) await GuideImage.create({ guideId: id, path: imagePath });
    } else {
      const img = await GuideImage.findOne({ where: { guideId: id } });
      imagePath = img?.path || null;
    }
    return toGuideDto(updated, imagePath);
  }

  async deleteGuide(id) {
    return repo.deleteById(id);
  }
}

export default new GuideService();
