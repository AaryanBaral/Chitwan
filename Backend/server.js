import "dotenv/config";        
import express from "express";
import cors from "cors";
import { corsOption } from "./Configurations/cors.js";
import adminRoutes from "./Routes/admin.route.js";
import guideRoutes from "./Routes/guide.route.js";
import floraFaunaRoutes from "./Routes/floraFauna.route.js";
import hotelRoutes from "./Routes/hotel.route.js";
import { errorMiddleWare } from "./Middleware/errorMiddleware.js";
import { connectDB } from "./Connection/database.js";


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors(corsOption));

app.get("/", (req, res) => res.send("hellow world"));
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/guide", guideRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1/flora-fauna", floraFaunaRoutes);

await connectDB();                       

app.use(errorMiddleWare);
app.listen(PORT, () => {
  console.log(`🚀 server running on http://localhost:${PORT}`);
});
