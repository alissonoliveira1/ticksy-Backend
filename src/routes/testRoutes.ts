import { Router } from "express";
import prisma from "../models/prismaClient";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await prisma.usuarios.create({
  data: {
    firebase_uid: "teste123",
    nome: "Alisson",
    email: "alisson@teste.com",
    senha_hash: "teste123hash" 
  }
});
    const usuarios = await prisma.usuarios.findMany(); 
    res.json(usuarios);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
