// routes/user.routes.js

import express from "express";
import { deleteUser, updateUser, signout } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signout", verifyToken, signout);

export default router;
