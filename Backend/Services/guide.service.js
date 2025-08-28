import GuideRepository from "../Repository/guide.repository.js";

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

function toGuideDto(guide) {
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
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  };
}

export class GuideService {
  async createGuide(payload) {
    const data = { ...payload };
    if (data.email) data.email = data.email.toLowerCase();
    if (data.languages !== undefined) data.languages = serializeLanguages(data.languages);
    const created = await repo.create(data);
    return toGuideDto(created);
  }

  async getById(id) {
    const g = await repo.findById(id);
    return toGuideDto(g);
  }

  async listGuides(params) {
    const filters = { ...params };
    if (filters.languages !== undefined) filters.languages = parseLanguagesIn(filters.languages);

    const result = await repo.list(filters);
    return {
      ...result,
      items: result.items.map(toGuideDto),
    };
  }

  async updateGuide(id, payload) {
    const data = { ...payload };
    if (data.email) data.email = data.email.toLowerCase();
    if (data.languages !== undefined) data.languages = serializeLanguages(data.languages);
    const updated = await repo.updateById(id, data);
    return toGuideDto(updated);
  }

  async deleteGuide(id) {
    return repo.deleteById(id);
  }
}

export default new GuideService();

