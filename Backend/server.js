import "dotenv/config";        
import express from "express";
import path from "path";
import cors from "cors";
import { corsOption } from "./Configurations/cors.js";
import adminRoutes from "./Routes/admin.route.js";
import guideRoutes from "./Routes/guide.route.js";
import blogRoutes from "./Routes/blog.route.js";
import noticeRoutes from "./Routes/notice.route.js";
import photoRoutes from "./Routes/photo.route.js";
import videoRoutes from "./Routes/video.route.js";
import floraFaunaRoutes from "./Routes/floraFauna.route.js";
import hotelRoutes from "./Routes/hotel.route.js";
import placeRoutes from "./Routes/place.route.js";
import feedbackRoutes from "./Routes/feedback.route.js";
import placeCategoryRoutes from "./Routes/placeCategory.route.js";
import trainingRoutes from "./Routes/training.route.js";
import trainingRegistrationRoutes from "./Routes/trainingRegistration.route.js";
import { errorMiddleWare } from "./Middleware/errorMiddleware.js";
import { connectDB } from "./Connection/database.js";
import { seedAll } from "./seeders/index.js";


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors(corsOption));

// Serve uploaded files (images/videos) statically
app.use("/uploads", express.static(path.join(process.cwd(), "Backend", "uploads")));

app.get("/", (req, res) => res.send("hellow world"));
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/guide", guideRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/notice", noticeRoutes);
app.use("/api/v1/photo", photoRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/flora-fauna", floraFaunaRoutes);
app.use("/api/v1/place", placeRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/place-category", placeCategoryRoutes);
app.use("/api/v1/training", trainingRoutes);
app.use("/api/v1/training-registration", trainingRegistrationRoutes);

await connectDB();                       

// Seed database on startup when enabled
if (process.env.SEED_ON_START === 'true') {
  try {
    const results = await seedAll();
    console.log("🌱 Seed results:", results);
  } catch (e) {
    console.error("Seed error", e);
  }
}

app.use(errorMiddleWare);
app.listen(PORT, () => {
  console.log(`🚀 server running on http://localhost:${PORT}`);
});
