import { Router } from "express";

import { firebaseAuth } from "../middlewares/firebaseAuth";
import {  login, logout, profile } from "../controllers/authController";

const router = Router();





router.post("/login", login); 
router.post("/logout", firebaseAuth, logout);
router.get("/profile", firebaseAuth, profile);

export default router;