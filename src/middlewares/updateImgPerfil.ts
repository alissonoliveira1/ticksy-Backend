import multer from "multer";
import path from "path";

const storage = multer.memoryStorage(); // Armazena o arquivo na memória
export const upload = multer({ storage });