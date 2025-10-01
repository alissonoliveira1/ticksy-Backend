import { Request, Response, NextFunction } from "express";
import { auth } from "../utils/firebase";
import prisma from "../models/prismaClient";

export interface AuthRequest extends Request {
  user?: any;
}

export const firebaseAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    // Verifica token no Firebase
    const decodedToken = await auth.verifyIdToken(token);

    // Busca ou cria usuário no Postgres
    let usuario = await prisma.usuarios.findUnique({
      where: { firebase_uid: decodedToken.uid },
    });

    if (!usuario) {
      usuario = await prisma.usuarios.create({
        data: {
          firebase_uid: decodedToken.uid,
          nome: decodedToken.name || "",
          email: decodedToken.email || "",
          foto_perfil: decodedToken.picture || "",
        },
      });
    }

    req.user = usuario;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};
