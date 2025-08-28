import express from "express";
import { singleFile } from "../Middleware/Multer.js";
import noticeService from "../Services/notice.service.js";
import { createNoticeSchema, updateNoticeSchema } from "../Validations/notice.validation.js";

const router = express.Router();

// Public: minimal list (cards)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || "published",
      isPopup: req.query.isPopup ?? undefined,
      activeNow: req.query.activeNow || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      displayFrom: req.query.displayFrom || undefined,
      displayTo: req.query.displayTo || undefined,
      tags: req.query.tags || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await noticeService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

// Public: popup list (eligible now). Optional ?limit=number
router.get("/popups", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || undefined;
    const data = await noticeService.listPopups(limit);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch popup notices" });
  }
});

// Public: full by id
router.get("/:id", async (req, res) => {
  try {
    const n = await noticeService.getById(req.params.id);
    if (!n) return res.status(404).json({ message: "Notice not found" });
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notice" });
  }
});

// Admin: create
router.post("/", singleFile, async (req, res) => {
  const { error, value } = createNoticeSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await noticeService.create(value, req.file || undefined);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notice" });
  }
});

// Admin: update
router.patch("/:id", singleFile, async (req, res) => {
  const { error, value } = updateNoticeSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await noticeService.update(req.params.id, value, req.file || undefined);
    if (!updated) return res.status(404).json({ message: "Notice not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update notice" });
  }
});

// Admin: delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await noticeService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notice" });
  }
});

export default router;
