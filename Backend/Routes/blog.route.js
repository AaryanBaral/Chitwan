import express from "express";
import blogService from "../Services/blog.service.js";
import { singleFile } from "../Middleware/Multer.js";
import { createBlogSchema, updateBlogSchema } from "../Validations/blog.validation.js";

const router = express.Router();

// List (cards/minimal)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined, // e.g., published
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await blogService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

// Get by id or slug (full)
router.get("/:idOrSlug", async (req, res) => {
  try {
    const blog = await blogService.getById(req.params.idOrSlug);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

// Create
router.post("/", singleFile, async (req, res) => {
  const { error, value } = createBlogSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await blogService.create(value, req.file || undefined);
    res.status(201).json(created);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create blog" });
  }
});

// Update
router.patch("/:id", singleFile, async (req, res) => {
  const { error, value } = updateBlogSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await blogService.update(req.params.id, value, req.file || undefined);
    if (!updated) return res.status(404).json({ message: "Blog not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update blog" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await blogService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
});

export default router;

