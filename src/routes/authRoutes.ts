import { Router } from "express";
import { me } from "../controllers/authController";
import { firebaseAuth } from "../middlewares/auth";
import { getProfile } from "../controllers/authController";
const router = Router();


router.get("/profile", firebaseAuth, getProfile);

router.get("/me", firebaseAuth, me);

export default router;