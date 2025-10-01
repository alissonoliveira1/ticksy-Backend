import { Request, Response, NextFunction } from "express";
import { auth } from "../utils/firebase";
import prisma from "../models/prismaClient";

export interface AuthRequest extends Request {
  user?: any;
}

export const firebaseAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = await auth.verifyIdToken(token);

    let usuario = await prisma.usuarios.findUnique({
      where: { firebase_uid: decoded.uid },
    });

    if (!usuario) {
      usuario = await prisma.usuarios.create({
        data: {
          firebase_uid: decoded.uid,
          nome: decoded.name || "Usuário",
          email: decoded.email!,
          foto_perfil: decoded.picture || null,
          verificado: decoded.email_verified || false,
        },
      });
    } else {
      usuario = await prisma.usuarios.update({
        where: { id: usuario.id },
        data: { ultimo_login: new Date() },
      });
    }

    req.user = usuario;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};
