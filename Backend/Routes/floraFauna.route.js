import express from "express";
import { multipleFiles } from "../Middleware/Multer.js";
import floraFaunaService from "../Services/floraFauna.service.js";
import { createFloraFaunaSchema, updateFloraFaunaSchema } from "../Validations/floraFauna.validation.js";

const router = express.Router();

// List
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      type: req.query.type || undefined,
      status: req.query.status || undefined,
      habitat: req.query.habitat || undefined,
      location: req.query.location || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await floraFaunaService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch records" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const ff = await floraFaunaService.getById(req.params.id);
    if (!ff) return res.status(404).json({ message: "Not found" });
    res.json(ff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch record" });
  }
});

// Create
router.post("/", multipleFiles, async (req, res) => {
  const { error, value } = createFloraFaunaSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await floraFaunaService.create(value, req.files || []);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create" });
  }
});

// Update
router.patch("/:id", multipleFiles, async (req, res) => {
  const { error, value } = updateFloraFaunaSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await floraFaunaService.update(req.params.id, value, req.files || []);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await floraFaunaService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
