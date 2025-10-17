import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import emailRoutes from "./routes/emailRoutes";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", emailRoutes);
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando na portinha ${PORT}`));
