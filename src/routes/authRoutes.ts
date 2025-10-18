import { Router } from "express";

import { firebaseAuth } from "../middlewares/firebaseAuth";
import { login, logout, me, profile } from "../controllers/authController";

const router = Router();





router.post("/login", login); // feito via Firebase no app
router.post("/logout", firebaseAuth, logout);
router.get("/me", firebaseAuth, me);
router.get("/profile", firebaseAuth, profile);
export default router;