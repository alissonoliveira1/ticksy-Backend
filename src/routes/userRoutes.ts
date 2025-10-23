import { Router } from "express";
import { criarConta, deletarUsuario } from "../controllers/usersController";


const userRoutes = Router();
userRoutes.post("/criar-conta", criarConta);
userRoutes.delete('/:uid', deletarUsuario);
export default userRoutes;