import { Request, Response } from "express";
import completionControllers from "../controllers/completionController";
import auth from "../middleware/auth";
import { Router } from "express";

const router = Router();

// Protected routes
router.post("/start", auth, completionControllers.startCompletionController);
router.post("/finish", auth, completionControllers.finishCompletionController);
router.get("/user/:quizID", auth, completionControllers.listCompletionsByUserAndQuizIDController);
router.get("/quizlist/:quizID", auth, completionControllers.listCompletionsByQuizIDController);
router.get("/list", auth, completionControllers.listLastCompletions)
export default router;