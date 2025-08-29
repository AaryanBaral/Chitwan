import express from "express";
import placeCategoryService from "../Services/placeCategory.service.js";
import { createPlaceCategorySchema, updatePlaceCategorySchema } from "../Validations/placeCategory.validation.js";

const router = express.Router();

// List categories
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await placeCategoryService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const c = await placeCategoryService.getById(req.params.id);
    if (!c) return res.status(404).json({ message: "Category not found" });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch category" });
  }
});

// Create
router.post("/", async (req, res) => {
  const { error, value } = createPlaceCategorySchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await placeCategoryService.create(value);
    res.status(201).json(created);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

// Update
router.patch("/:id", async (req, res) => {
  const { error, value } = updatePlaceCategorySchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await placeCategoryService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "Category not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await placeCategoryService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

export default router;
