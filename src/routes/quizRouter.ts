import { Router } from "express";
import quizControllers from "../controllers/quizController";
import authMiddleware from "../middleware/auth";

const router = Router();

// Public routes
router.get("/list", quizControllers.listQuizesInfoController);
router.post("/filter", quizControllers.listUnderFilters);
// Protected routes
router.post("/create", authMiddleware, quizControllers.createQuizController);
router.put("/edit", authMiddleware, quizControllers.editQuizController);
router.delete("/delete", authMiddleware, quizControllers.deleteQuizController);
router.get('/:id', authMiddleware, quizControllers.getQuizData)
export default router;