import { Request, Response } from "express";


export const logout = async (req: Request, res: Response) => {
  try {
    
    return res.status(200).json({ message: "Usuário deslogado com sucesso" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
