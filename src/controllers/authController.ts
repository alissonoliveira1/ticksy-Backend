import { Request, Response } from "express";


export const me = (req: any, res: Response) => {
  res.json(req.user);
};
