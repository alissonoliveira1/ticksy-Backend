import express, { Request, Response } from "express";
import { sendVerificationEmail } from "../services/mailServices";
import { CodeStore } from "../types/codeStore";

const router = express.Router();


const codes: CodeStore = {};


router.post("/send-code", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório" });
  }

  
  const code = Math.floor(1000 + Math.random() * 9000).toString();


  const expiresAt = Date.now() + 5 * 60 * 1000;

  codes[email] = { code, expiresAt };

  try {
    await sendVerificationEmail(email, code);
    console.log(`Código enviado para ${email}: ${code}`);
    res.json({ success: true, message: "Código enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao enviar e-mail" });
  }
});


router.post("/verify-code", (req: Request, res: Response) => {
  const { email, code } = req.body;

  const record = codes[email];
  if (!record) {
    return res.status(400).json({ valid: false, message: "Código não encontrado" });
  }

  if (Date.now() > record.expiresAt) {
    delete codes[email];
    return res.status(400).json({ valid: false, message: "Código expirado" });
  }

  if (record.code === code) {
    delete codes[email];
    return res.json({ valid: true, message: "Código verificado com sucesso!" });
  }

  res.status(400).json({ valid: false, message: "Código incorreto" });
});

export default router;
