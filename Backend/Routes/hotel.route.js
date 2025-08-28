import express from "express";
import { multipleFiles } from "../Middleware/Multer.js";
import hotelService from "../Services/hotel.service.js";
import {
  createHotelSchema,
  updateHotelSchema,
} from "../Validations/hotel.validation.js";

const router = express.Router();

// List hotels with filters
router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 20, 1), 100);

    const params = {
      page,
      pageSize,
      q: req.query.q?.trim() || undefined,
      status: req.query.status || undefined,
      city: req.query.city || undefined,
      state: req.query.state || undefined,
      country: req.query.country || undefined,
      createdFrom: req.query.createdFrom || undefined,
      createdTo: req.query.createdTo || undefined,
      sortBy: req.query.sortBy || undefined,
      sortOrder: req.query.sortOrder || undefined,
    };

    const data = await hotelService.listHotels(params);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
});

// Get single hotel
router.get("/:id", async (req, res) => {
  try {
    const hotel = await hotelService.getById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hotel" });
  }
});

// Create hotel
router.post("/", multipleFiles, async (req, res) => {
  const { error, value } = createHotelSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }
  try {
    const hotel = await hotelService.createHotel(value, req.files || []);
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create hotel" });
  }
});

// Update hotel
router.patch("/:id", multipleFiles, async (req, res) => {
  const { error, value } = updateHotelSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }
  try {
    const hotel = await hotelService.updateHotel(req.params.id, value, req.files || []);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update hotel" });
  }
});

// Delete hotel
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await hotelService.deleteHotel(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Hotel not found" });
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete hotel" });
  }
});

export default router;
