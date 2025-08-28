import express from "express";
import { singleFile } from "../Middleware/Multer.js";
import photoService from "../Services/photo.service.js";
import { createPhotoSchema, updatePhotoSchema } from "../Validations/photo.validation.js";

const router = express.Router();

// List (cards)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      tags: req.query.tags || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await photoService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
});

// Full by id
router.get("/:id", async (req, res) => {
  try {
    const p = await photoService.getById(req.params.id);
    if (!p) return res.status(404).json({ message: "Photo not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch photo" });
  }
});

// Create
router.post("/", singleFile, async (req, res) => {
  const { error, value } = createPhotoSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await photoService.create(value, req.file || undefined);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create photo" });
  }
});

// Update
router.patch("/:id", singleFile, async (req, res) => {
  const { error, value } = updatePhotoSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await photoService.update(req.params.id, value, req.file || undefined);
    if (!updated) return res.status(404).json({ message: "Photo not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update photo" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await photoService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Photo not found" });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete photo" });
  }
});

export default router;

