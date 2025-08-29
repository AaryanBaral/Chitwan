import express from "express";
import adminService from "../Services/admin.service.js";
import { requireAdmin, requireSuperAdmin } from "../Middleware/auth.js";
import {
  createAdminSchema,
  updateAdminSchema,
  loginSchema
} from "../Validations/admin.validation.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Math.min(Number(req.query.pageSize) || 20, 100);
    const q = req.query.q?.trim() || undefined;

    const data = await adminService.listAdmins({ page, pageSize, q });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// Get by id
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const admin = await adminService.getById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin" });
  }
});

router.post("/", requireSuperAdmin, async (req, res) => {
  const { error, value } = createAdminSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });

  try {
    const admin = await adminService.createAdmin(value);
    res.status(201).json(admin);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create admin" });
  }
});

// Update
router.patch("/:id", requireSuperAdmin, async (req, res) => {
  const { error, value } = updateAdminSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });

  try {
    const admin = await adminService.updateAdmin(req.params.id, value);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update admin" });
  }
});

// Delete
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const deleted = await adminService.deleteAdmin(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete admin" });
  }
});
router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error)
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });

  const result = await adminService.login(value);
  if (!result.ok)
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    token: result.token,
    tokenType: result.tokenType,
    admin: result.admin,
  });
});

export default router;
