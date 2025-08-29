import express from "express";
import feedbackService from "../Services/feedback.service.js";
import { createFeedbackSchema, updateFeedbackSchema } from "../Validations/feedback.validation.js";

const router = express.Router();

// List feedbacks
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);
    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      rating: req.query.rating || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };
    const data = await feedbackService.list(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const f = await feedbackService.getById(req.params.id);
    if (!f) return res.status(404).json({ message: "Feedback not found" });
    res.json(f);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// Create feedback
router.post("/", async (req, res) => {
  const { error, value } = createFeedbackSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const created = await feedbackService.create(value);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create feedback" });
  }
});

// Update feedback (e.g., status or fields)
router.patch("/:id", async (req, res) => {
  const { error, value } = updateFeedbackSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ message: "Validation error", details: error.details });
  try {
    const updated = await feedbackService.update(req.params.id, value);
    if (!updated) return res.status(404).json({ message: "Feedback not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update feedback" });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await feedbackService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
});

export default router;

