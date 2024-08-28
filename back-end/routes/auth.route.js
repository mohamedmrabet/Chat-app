import express from "express";
import { signup ,getAll , login ,logout} from "../controlleurs/auth.control.js";

const router = express.Router();


router.get("/getUser", getAll);
router.post("/signup", signup);
router.post("/login",login)
router.post("/logout",logout)

export default router;
