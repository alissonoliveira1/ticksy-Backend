// Em seu emailRoutes.ts
import express, { Request, Response } from "express";
import { sendVerificationEmail } from "../services/mailServices";
import { auth } from "../utils/firebase";
import prisma from "../models/prismaClient"; 

const router = express.Router();


router.post("/send-code", async (req: Request, res: Response) => {
  const { email, uid } = req.body; 

  if (!email || !uid) {
    return res.status(400).json({ error: "E-mail e UID são obrigatórios" });
  }

 
  const user = await prisma.usuarios.findUnique({ where: { firebase_uid: uid } });
  if (!user || user.email !== email) {
    return res.status(403).json({ error: "Usuário inválido" });
  }
  
  
  if (user.verificado) {
     return res.status(400).json({ message: "E-mail já verificado" });
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {

    await prisma.verificationCode.upsert({
      where: { email: email },
      create: {
     
        email: email,
        code: code,
        uid: uid,
        expiresAt: expiresAt,
      },
      update: {
     
        code: code,
        expiresAt: expiresAt,
        uid: uid,
      },
    });

    await sendVerificationEmail(email, code);
    res.json({ success: true, message: "Código reenviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});



router.post("/verify-code", async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
     return res.status(400).json({ valid: false, message: "E-mail e código são obrigatórios" });
  }


  const record = await prisma.verificationCode.findUnique({
    where: { email: email },
  });

  if (!record) {
    return res.status(400).json({ valid: false, message: "Código não encontrado ou inválido" });
  }


  if (new Date() > record.expiresAt) {
 
    await prisma.verificationCode.delete({ where: { email: email } });
    return res.status(400).json({ valid: false, message: "Código expirado" });
  }


  if (record.code === code) {
    try {
     

   
      await auth.updateUser(record.uid, { emailVerified: true });

    
      await prisma.usuarios.update({
        where: { firebase_uid: record.uid },
        data: { verificado: true },
      });

  
      await prisma.verificationCode.delete({ where: { email: email } });

      return res.json({ valid: true, message: "Código verificado com sucesso!" });
    
    } catch (error) {
      console.error("Erro ao verificar código e atualizar usuário:", error);
      return res.status(500).json({ valid: false, message: "Erro ao atualizar usuário" });
    }
  }


  res.status(400).json({ valid: false, message: "Código incorreto" });
});

export default router;