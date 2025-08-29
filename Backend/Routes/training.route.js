import express from "express";
import trainingService from "../Services/training.service.js";
import { requireAdmin } from "../Middleware/auth.js";
import { createTrainingSchema, updateTrainingSchema } from "../Validations/training.validation.js";

const router = express.Router();

// List trainings
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      mode: req.query.mode || undefined,
      department: req.query.department || undefined,
      category: req.query.category || undefined,
      startFrom: req.query.startFrom || undefined,
      startTo: req.query.startTo || undefined,
      appOpen: req.query.appOpen || undefined,
      appClose: req.query.appClose || undefined,
      activeForApplication: req.query.activeForApplication || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await trainingService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch trainings" });
  }
});

// Get by id or slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    const t = await trainingService.getById(req.params.idOrSlug);
    if (!t) return res.status(404).json({ message: "Training not found" });
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch training" });
  }
});

// Create
router.post("/", requireAdmin, async (req, res) => {
  const { error, value } = createTrainingSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await trainingService.create(value);
    res.status(201).json(created);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create training" });
  }
});

// Update
router.patch("/:id", requireAdmin, async (req, res) => {
  const { error, value } = updateTrainingSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await trainingService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "Training not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update training" });
  }
});

// Delete
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await trainingService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Training not found" });
    res.json({ message: "Training deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete training" });
  }
});

export default router;
