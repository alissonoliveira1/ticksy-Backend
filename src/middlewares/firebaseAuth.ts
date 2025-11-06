import { Request, Response, NextFunction } from "express";
import { auth } from "../utils/firebase";
import prisma from "../models/prismaClient";

export interface AuthRequest extends Request {
  user?: any;
}

export const firebaseAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1️⃣ Extrair token
  const authHeader = req.headers.authorization;
  console.log("🔑 Token recebido:", req.headers.authorization);
  if (!authHeader) {
    console.error("Header Authorization não encontrado");
    return res.status(401).json({ error: "Token não fornecido" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.error("Header Authorization mal formatado:", authHeader);
    return res.status(401).json({ error: "Token mal formatado" });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  // 2️⃣ Verificar token no Firebase
  let decoded: any;
  try {
    decoded = await auth.verifyIdToken(token);
    console.log("Token verificado com sucesso. UID:", decoded.uid);
  } catch (err: any) {
    console.error("Erro ao verificar token:", err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  // 3️⃣ Buscar usuário no banco
  let usuario;
  try {
    usuario = await prisma.usuarios.findUnique({
      where: { firebase_uid: decoded.uid },
    });
    if (!usuario) {
      console.warn("Usuário não encontrado no banco. UID:", decoded.uid);
      return res.status(404).json({ error: "Usuário não encontrado no banco" });
    }
  } catch (err: any) {
    console.error("Erro ao consultar usuário no banco:", err);
    return res.status(500).json({ error: "Erro interno no banco" });
  }

  // 4️⃣ Anexa usuário à requisição e continua
  req.user = usuario;
  next();
};
