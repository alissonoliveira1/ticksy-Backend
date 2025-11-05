import { Router } from "express";
import { criarConta, deletarUsuario } from "../controllers/usersController";
import { updateImg, updateUser } from "../controllers/dateController";
import { upload } from "../middlewares/updateImgPerfil";
import { firebaseAuth } from "../middlewares/firebaseAuth";
import express from 'express';
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const userRoutes = Router();
userRoutes.post("/criar-conta", criarConta);
userRoutes.delete('/:uid', deletarUsuario);
userRoutes.patch('/updatePerfil', firebaseAuth, updateUser);
userRoutes.post("/updateIMG/:uid", upload.single("file"), updateImg);
export default userRoutes;