import { Router } from "express";
import { me } from "../controllers/authController";
import { firebaseAuth } from "../middlewares/auth";

const router = Router();


router.get("/me", firebaseAuth, me);

export default router;