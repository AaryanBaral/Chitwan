import express from "express";
import { corsOption } from "./Configurations/Cors.js";
import cors from "cors";
import { errorMiddleWare } from "./Middleware/ErrorMiddleware.js";
import {connectDB} from "./Connection/Database.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors(corsOption));

await connectDB();

app.get("/", (req, res) => {
  res.send("hellow world");
});

app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});