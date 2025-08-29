import express from "express";
import trainingRegistrationService from "../Services/trainingRegistration.service.js";
import { requireAdmin } from "../Middleware/auth.js";
import { createTrainingRegistrationSchema, updateTrainingRegistrationSchema } from "../Validations/trainingRegistration.validation.js";

const router = express.Router();

// Public: get my registrations by email or citizenshipNo
router.get("/mine", async (req, res) => {
  try {
    const registrantEmail = req.query.email || undefined;
    const citizenshipNo = req.query.citizenshipNo || undefined;
    const result = await trainingRegistrationService.getMine({ registrantEmail, citizenshipNo });
    res.json(result);
  } catch (err) {
    const status = err?.status || 500;
    res.status(status).json({ message: err.message || "Failed to fetch registrations" });
  }
});

// List registrations
router.get("/", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      trainingId: req.query.trainingId || undefined,
      q: req.query.q?.trim() || undefined,
      registrationStatus: req.query.registrationStatus || undefined,
      email: req.query.email || undefined,
      phone: req.query.phone || undefined,
      submittedFrom: req.query.submittedFrom || undefined,
      submittedTo: req.query.submittedTo || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await trainingRegistrationService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// Get by id
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const r = await trainingRegistrationService.getById(req.params.id);
    if (!r) return res.status(404).json({ message: "Registration not found" });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch registration" });
  }
});

// Create
router.post("/", async (req, res) => {
  const { error, value } = createTrainingRegistrationSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await trainingRegistrationService.create(value);
    res.status(201).json(created);
  } catch (err) {
    if (err?.status === 400) return res.status(400).json({ message: err.message });
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Duplicate registration (email/phone) for this training" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create registration" });
  }
});

// Update
router.patch("/:id", requireAdmin, async (req, res) => {
  const { error, value } = updateTrainingRegistrationSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await trainingRegistrationService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "Registration not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Duplicate registration (email/phone) for this training" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update registration" });
  }
});

// Delete
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await trainingRegistrationService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete registration" });
  }
});

export default router;
