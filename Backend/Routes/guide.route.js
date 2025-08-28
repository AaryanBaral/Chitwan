import express from "express";
import guideService from "../Services/guide.service.js";
import { createGuideSchema, updateGuideSchema } from "../Validations/guide.validation.js";

const router = express.Router();

// List with filters + pagination
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);

    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      gender: req.query.gender || undefined,
      experienceMin: req.query.experienceMin ?? undefined,
      experienceMax: req.query.experienceMax ?? undefined,
      languages: req.query.languages ?? undefined, // comma-separated or repeated query: ?languages=en&languages=fr
      specialization: req.query.specialization || undefined,
      dobFrom: req.query.dobFrom || undefined,
      dobTo: req.query.dobTo || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      sortBy: req.query.sortBy || undefined, // created_at, updated_at, full_name, experience_years
      sortOrder: req.query.sortOrder || undefined, // ASC/DESC
    };

    const data = await guideService.listGuides(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch guides" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const guide = await guideService.getById(req.params.id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch guide" });
  }
});

// Create
router.post("/", async (req, res) => {
  const { error, value } = createGuideSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }
  try {
    const guide = await guideService.createGuide(value);
    res.status(201).json(guide);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      // Determine which field collided if possible
      const field = err?.errors?.[0]?.path || undefined;
      const msg = field ? `${field} already exists` : "Unique constraint violation";
      return res.status(409).json({ message: msg });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create guide" });
  }
});

// Update
router.patch("/:id", async (req, res) => {
  const { error, value } = updateGuideSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }
  try {
    const guide = await guideService.updateGuide(req.params.id, value);
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json(guide);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      const field = err?.errors?.[0]?.path || undefined;
      const msg = field ? `${field} already exists` : "Unique constraint violation";
      return res.status(409).json({ message: msg });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update guide" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await guideService.deleteGuide(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Guide not found" });
    res.json({ message: "Guide deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete guide" });
  }
});

export default router;

