import { Router } from "express";
import { criarConta, deletarUsuario } from "../controllers/usersController";
import { updateImg, updateUser } from "../controllers/dateController";
import { upload } from "../middlewares/updateImgPerfil";


const userRoutes = Router();
userRoutes.post("/criar-conta", criarConta);
userRoutes.delete('/:uid', deletarUsuario);
userRoutes.put('/:uid', updateUser);
userRoutes.patch('/updatePerfil', updateUser);
userRoutes.post("/updateIMG/:uid", upload.single("file"), updateImg);
export default userRoutes;