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

app.use((req, res, next) => {
    console.log("--- DEBUG START ---");
    console.log("Recebido na URL:", req.originalUrl);
 
    console.log("Content-Type Header:", req.headers['content-type']);
    console.log("req.body após express.json():", req.body);
    console.log("--- DEBUG END ---");
    next();
});




app.use("/api", emailRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Rodando na portinha ${PORT}`));
