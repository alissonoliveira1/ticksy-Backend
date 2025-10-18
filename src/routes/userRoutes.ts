import { Router } from "express";
import { criarConta } from "../controllers/usersController";


const userRoutes = Router();
userRoutes.post("/criar-conta", criarConta);
export default userRoutes;