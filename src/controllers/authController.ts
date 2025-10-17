import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/firebaseAuth";

export const me = async (req: AuthRequest, res: Response) => {
  try {
  
    return res.status(200).json({ usuario: req.user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  return res.json(req.user);
};