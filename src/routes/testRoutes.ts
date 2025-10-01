import { Router } from "express";
import prisma from "../models/prismaClient";

const router = Router();

router.get("/", async (req, res) => {
  try {
  ;
    const usuarios = await prisma.usuarios.findMany(); 
    res.json(usuarios);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
