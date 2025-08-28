import express from "express";
import { singleFile } from "../Middleware/Multer.js";
import videoService from "../Services/video.service.js";
import { createVideoSchema, updateVideoSchema } from "../Validations/video.validation.js";

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
    const data = await videoService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

// Full by id
router.get("/:id", async (req, res) => {
  try {
    const v = await videoService.getById(req.params.id);
    if (!v) return res.status(404).json({ message: "Video not found" });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch video" });
  }
});

// Create
router.post("/", singleFile, async (req, res) => {
  const { error, value } = createVideoSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await videoService.create(value, req.file || undefined);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create video" });
  }
});

// Update
router.patch("/:id", singleFile, async (req, res) => {
  const { error, value } = updateVideoSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await videoService.update(req.params.id, value, req.file || undefined);
    if (!updated) return res.status(404).json({ message: "Video not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update video" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await videoService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete video" });
  }
});

export default router;

