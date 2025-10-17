import { Request, Response } from "express";
import { auth } from "../utils/firebase"; 
import prisma from "../models/prismaClient";

export const criarConta = async (req: Request, res: Response) => {
  try {
    const { nome, sobrenome, email, senha } = req.body;


    if (!nome || !sobrenome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

  
    try {
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }
    } catch (err: any) {
 
      if (err.code !== "auth/user-not-found") {
        return res.status(500).json({ error: err.message });
      }
    }

   
    const firebaseUser = await auth.createUser({
      email,
      password: senha,
      displayName: `${nome} ${sobrenome}`,
    });

  
    const usuario = await prisma.usuarios.create({
      data: {
        firebase_uid: firebaseUser.uid,
        nome,
        sobrenome,
        email,
        verificado: firebaseUser.emailVerified || false,
      },
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      usuario,
    });
  } catch (err: any) {
    console.error("Erro ao criar conta:", err);

   
    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({ error: "Email já cadastrado no Firebase" });
    }

    return res.status(500).json({ error: err.message });
  }
};
