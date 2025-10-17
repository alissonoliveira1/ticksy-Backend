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

    const decodedToken = await auth.verifyIdToken(token);

  
    let usuario = await prisma.usuarios.findUnique({
      where: { firebase_uid: decodedToken.uid },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não registrado. Complete o cadastro." });
    }

    req.user = usuario;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};


export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { uid, email } = req.body; 
    const { nome, sobrenome } = req.body;

    if (!uid || !nome || !sobrenome) {
      return res.status(400).json({ error: "UID, nome e sobrenome são obrigatórios" });
    }

    
    const firebaseUser = await auth.getUser(uid);
    if (!firebaseUser) {
      return res.status(400).json({ error: "Conta Firebase não encontrada" });
    }

    
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { firebase_uid: uid },
    });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuário já registrado no banco" });
    }

  
    const usuario = await prisma.usuarios.create({
      data: {
        firebase_uid: uid,
        nome,
        sobrenome,
        email: firebaseUser.email || "",
      },
    });

    return res.status(201).json({ usuario });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
