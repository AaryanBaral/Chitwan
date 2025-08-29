import express from "express";
import { multipleFiles } from "../Middleware/Multer.js";
import placeService from "../Services/place.service.js";
import { createPlaceSchema, updatePlaceSchema } from "../Validations/place.validation.js";
import PlaceCategory from "../Models/placeCategory.model.js";

const router = express.Router();

// List places
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      categoryId: req.query.categoryId || undefined,
      city: req.query.city || undefined,
      state: req.query.state || undefined,
      country: req.query.country || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await placeService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch places" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const p = await placeService.getById(req.params.id);
    if (!p) return res.status(404).json({ message: "Place not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch place" });
  }
});

// Create place
router.post("/", multipleFiles, async (req, res) => {
  const { error, value } = createPlaceSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    // ensure category exists
    const category = await PlaceCategory.findByPk(value.categoryId);
    if (!category) return res.status(400).json({ message: "Invalid categoryId" });
    const created = await placeService.create(value, req.files || []);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create place" });
  }
});

// Update place
router.patch("/:id", multipleFiles, async (req, res) => {
  const { error, value } = updatePlaceSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    if (value.categoryId) {
      const category = await PlaceCategory.findByPk(value.categoryId);
      if (!category) return res.status(400).json({ message: "Invalid categoryId" });
    }
    const updated = await placeService.update(req.params.id, value, req.files || []);
    if (!updated) return res.status(404).json({ message: "Place not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update place" });
  }
});

// Delete place
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await placeService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete place" });
  }
});

export default router;
