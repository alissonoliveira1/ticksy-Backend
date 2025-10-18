import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/firebaseAuth";
import { auth } from "../utils/firebase";



export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: "Email e senha obrigatórios" });

  

    const user = await auth.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

   
    const customToken = await auth.createCustomToken(user.uid);

    return res.status(200).json({ token: customToken, user: { uid: user.uid, email: user.email, nome: user.displayName } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ usuario: req.user });
};

export const profile = async (req: AuthRequest, res: Response) => {
  const usuario = req.user;
  return res.status(200).json({
    nome: usuario.nome,
    sobrenome: usuario.sobrenome,
    email: usuario.email,
    verificado: usuario.verificado,
  });
};

export const logout = async (req: Request, res: Response) => {
  try {
    
    return res.status(200).json({ message: "Usuário deslogado com sucesso" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
