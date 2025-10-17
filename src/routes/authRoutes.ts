import { Router } from "express";
import { me } from "../controllers/authController";
import { firebaseAuth } from "../middlewares/firebaseAuth";
import { getProfile } from "../controllers/authController";
import { criarConta } from "../controllers/criarConta";
import { login } from "../controllers/authLogin";
import { logout } from "../controllers/authLogout";
const router = Router();


router.get("/profile", firebaseAuth, getProfile);

router.get("/me", firebaseAuth, me);

router.post("/criar-conta", criarConta);

router.post("/login", login)

router.post("/logout", logout)
export default router;