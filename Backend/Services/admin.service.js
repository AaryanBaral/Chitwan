
import bcrypt from "bcrypt";
import { sequelize } from "../Connection/database.js";
import AdminRepository from "../Repository/admin.repository.js";
import { createToken } from "../Auth/Jwt.js";

const adminRepo = new AdminRepository();

function toAdminDto(admin) {
  if (!admin) return null;
  const { id, email, isSuperAdmin, lastLoginAt, createdAt, updatedAt } =
    admin;
  return { id, email, isSuperAdmin, lastLoginAt, createdAt, updatedAt };
}


export class AdminService {
  async createAdmin({
    fullName,
    email,
    password,
    isSuperAdmin = false,
    status = "active",
  }) {
    const passwordHash = await bcrypt.hash(password, 12);
    const created = await adminRepo.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      isSuperAdmin,
      status,
    });
    return toAdminDto(created);
  }

  // 🔐 LOGIN — verify password and issue JWT
  async login({ email, password }) {
    const admin = await adminRepo.findForAuthByEmail(email);
    if (!admin) {
      return { ok: false, code: "INVALID_CREDENTIALS" };
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return { ok: false, code: "INVALID_CREDENTIALS" };
    }

    const token = createToken(admin);
    return {
      ok: true,
      token,
      tokenType: "Bearer",
      admin: toAdminDto(admin),
    };
  }

  async getById(id) {
    const admin = await adminRepo.findById(id);
    return toAdminDto(admin);
  }

  async getByEmail(email) {
    return adminRepo.findByEmail(email);
  }

  async listAdmins(params) {
    return adminRepo.list(params);
  }

  async updateAdmin(id, { fullName, email, password, isSuperAdmin, status }) {
    const data = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (email !== undefined) data.email = email.toLowerCase();
    if (isSuperAdmin !== undefined) data.isSuperAdmin = isSuperAdmin;
    if (status !== undefined) data.status = status;
    if (password) data.passwordHash = await bcrypt.hash(password, 12);

    const updated = await adminRepo.updateById(id, data);
    return toAdminDto(updated);
  }

  async deleteAdmin(id) {
    return adminRepo.deleteById(id);
  }

  // Example: transactional operation (easy to expand later)
  async disableAdminAndLog(id) {
    return sequelize.transaction(async (t) => {
      const updated = await adminRepo.updateById(
        id,
        { status: "disabled" },
        { transaction: t }
      );
      // await AuditRepo.create({ action: 'DISABLE_ADMIN', adminId: id }, { transaction: t });
      return toAdminDto(updated);
    });
  }
}

export default new AdminService();
