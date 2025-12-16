import { Router } from "express";
import authRouter from "./authRouter";
import completionRouter from "./completionRouter";
import quizRouter from "./quizRouter";


const router = Router();

router.use("/auth", authRouter);
router.use("/completions", completionRouter);
router.use("/quizzes", quizRouter);

export default router;