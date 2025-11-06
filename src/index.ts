import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import emailRoutes from "./routes/emailRoutes";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", emailRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando na portinha ${PORT}`));
