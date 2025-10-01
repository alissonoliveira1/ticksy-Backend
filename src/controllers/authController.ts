import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/firebaseAuth";

export const me = (req: any, res: Response) => {
  res.json(req.user);
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  return res.json(req.user);
};