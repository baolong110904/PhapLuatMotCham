import express from "express";
import { Nice } from "../controllers/modelController";

const router = express.Router();

router.post("/request", Nice);

export default router;
