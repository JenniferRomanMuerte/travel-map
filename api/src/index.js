import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import placesRoutes from "./routes/places.js";
import mediaRoutes from "./routes/media.js";
import r2Routes from "./routes/r2.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/places", placesRoutes);
app.use("/media", mediaRoutes);
app.use("/r2", r2Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
