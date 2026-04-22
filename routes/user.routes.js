import  express from "express";
import {login,signup,profile,logout} from "../Controllers/user.controllers.js" 
import { authMiddleware } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/login",login);
router.post("/signup",signup);
router.get("/profile", authMiddleware,profile );
router.post("/logout",authMiddleware,logout)

export default router;