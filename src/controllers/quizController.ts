import { Request, Response } from 'express';
import quizModel from '../models/quizModel';

const quizControllers = {
    async createQuizController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title, questions, answersVariants, correctAnswers, answersValue } = req.body;

        try {
            const result = await quizModel.createQuiz(title, userID, questions, answersVariants, correctAnswers, answersValue);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("createQuizController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async listQuizesInfoController(req: Request, res: Response) {
        try {
            const result = await quizModel.listQuizesInfo();
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listQuizesInfoController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getQuizData(req: Request, res: Response) {
        try {
            const userID = req.userID as string;
            if (!userID) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            const data = await quizModel.getQuizData(id, userID);
            res.status(data.status).json({data: data.data})
        } catch (err) {
            console.error("listQuizesInfoController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async listUnderFilters(req: Request, res: Response){
        const {titleFilter, authorFilter} = req.body;
        try {
            const data = await quizModel.getFilteredData(titleFilter, authorFilter);
            res.status(data.status).json(data.data);
        } catch (err) {
            console.error("listQuizesInfoController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async editQuizController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { quizID, title, questions, answersVariants, correctAnswers, answersValue } = req.body;
        
        const quiz = await quizModel.getQuizById(quizID);
        if (quiz.status !== 200) {
            return res.status(quiz.status).json(quiz);
        }
        if (!quiz.data) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quiz.data.author._id.toString() !== userID) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this quiz' });
        }
        try {
            const result = await quizModel.editQuiz(quizID, title, questions, answersVariants, correctAnswers, answersValue);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("editQuizController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteQuizController(req: Request, res: Response) {
        const { quizID } = req.body;

        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const quiz = await quizModel.getQuizById(quizID);
        if (quiz.status !== 200) {
            return res.status(quiz.status).json(quiz);
        }
        if (!quiz.data) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quiz.data.author._id.toString() !== userID) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this quiz' });
        }
        try {
            const result = await quizModel.deleteQuiz(quizID);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("deleteQuizController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}

export default quizControllers;