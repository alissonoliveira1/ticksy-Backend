import { Router } from "express";
import { criarConta, deletarUsuario } from "../controllers/usersController";
import { updateImg, updateUser } from "../controllers/dateController";
import { upload } from "../middlewares/updateImgPerfil";
import { firebaseAuth } from "../middlewares/firebaseAuth";


const userRoutes = Router();
userRoutes.post("/criar-conta", criarConta);
userRoutes.delete('/:uid', deletarUsuario);
userRoutes.patch(
    '/updatePerfil', 
    firebaseAuth, // <--- O SEU 'ISAUTHENTICATED' AQUI
    updateUser
);
userRoutes.post("/updateIMG/:uid", upload.single("file"), updateImg);
export default userRoutes;