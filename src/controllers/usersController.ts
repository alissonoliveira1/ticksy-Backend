import { Request, Response } from "express";
import { auth } from "../utils/firebase";
import prisma from "../models/prismaClient";
import { sendVerificationEmail } from "../services/mailServices"; // Importe seu serviço de e-mail
import { upload } from "../middlewares/updateImgPerfil";

export const criarConta = async (req: Request, res: Response) => {
  try {
    const { nome, sobrenome, email, senha } = req.body;
    if (!nome || !sobrenome || !email || !senha)
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" }); // 1. Criar usuário no Firebase

    const firebaseUser = await auth.createUser({
      email,
      password: senha,
      displayName: `${nome} ${sobrenome}`,
    });

    // 2. GERAR O CUSTOM TOKEN AQUI E ARMAZENAR (Não salvar no DB!)
    const jwtToken = await auth.createCustomToken(firebaseUser.uid); // 3. Criar usuário no seu banco de dados Prisma

    const usuario = await prisma.usuarios.create({
      data: {
        firebase_uid: firebaseUser.uid,
        nome,
        sobrenome,
        email,
        verificado: firebaseUser.emailVerified || false, // REMOVIDO: customToken: await auth.createCustomToken(firebaseUser.uid)
      },
    }); // --- INÍCIO DA NOVA LÓGICA --- // 4. Gerar e salvar o código de verificação

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos a partir de agora // Salva o código no banco de dados

    await prisma.verificationCode.create({
      data: {
        email: email,
        code: code,
        uid: firebaseUser.uid,
        expiresAt: expiresAt,
      },
    }); // 5. Enviar o e-mail de verificação

    await sendVerificationEmail(email, code); 

    return res.status(201).json({
      message: "Usuário criado. E-mail de verificação enviado.",
      usuario: usuario,
      token: jwtToken, 
    });
  } catch (err: any) {
    if (err.code === "auth/email-already-exists")
      return res.status(400).json({ error: "Email já cadastrado" });
    console.error("❌ Erro DETALHADO ao criar usuário/enviar e-mail:", err);
    return res.status(500).json({ error: "Erro interno: " + err.message });
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {

  const { uid } = req.params;

  if (!uid) {
    return res
      .status(400)
      .json({ error: "O ID do usuário (UID) é obrigatório." });
  }

  try {
 
    await auth.deleteUser(uid); 
    const usuarioDeletado = await prisma.usuarios.delete({
      where: {
        firebase_uid: uid,
      },
    });

    return res.status(200).json({
      message: "Usuário e todos os seus dados foram deletados com sucesso.",
      deletedEmail: usuarioDeletado.email,
    });
  } catch (error: any) {
    console.error(`Erro ao deletar usuário com UID ${uid}:`, error); 

    if (error.code === "P2025" || error.code === "auth/user-not-found") {
      return res.status(404).json({
        error: "Usuário não encontrado no Firebase ou no Banco de Dados.",
      });
    }

    return res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }

  
};


  
 
