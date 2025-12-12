import { Request, Response } from 'express';
import quizModel from '../models/quizModel';

//protected controllers
const quizControllers = {
    async createQuizController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title, authorUsername, questions, answers, correctAnswers } = req.body;

        try {
            const result = await quizModel.createQuiz(title, authorUsername, questions, answers, correctAnswers);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("createQuizController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async editQuizController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { quizID, title, questions, answersVariants, correctAnswers } = req.body;
        
        const quiz = await quizModel.getQuizById(quizID);
        if (quiz.status !== 200) {
            return res.status(quiz.status).json(quiz);
        }
        if(!quiz.data) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        if (quiz.data.author._id.toString() !== userID) {
            return res.status(403).json({ message: 'Forbidden: You are not the author of this quiz' });
        }
        try {
            const result = await quizModel.editQuiz(quizID, title, questions, answersVariants, correctAnswers);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("editQuizController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteQuizController(req: Request, res: Response) {
        const { quizID } = req.params;

        const userID = req.userID;;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const quiz = await quizModel.getQuizById(quizID);
        if (quiz.status !== 200) {
            return res.status(quiz.status).json(quiz);
        }
        if(!quiz.data) {
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
    //public controllers
    async listQuizzesByTitleController(req: Request, res: Response) {
        const { title } = req.params;
        try {
            const result = await quizModel.listQuizzesByTitle(title);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listQuizzesByTitleController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async listQuizzesByAuthorController(req: Request, res: Response) {
        const { authorUsername } = req.body;

        try {
            const result = await quizModel.listQuizzesByAuthor(authorUsername);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listQuizzesByAuthorController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async listQuizzesByTitleAndAuthorController(req: Request, res: Response) {
        const { title, authorUsername } = req.body;
        try {
            const result = await quizModel.listQuizzesByTitleAndAuthor(title, authorUsername);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listQuizzesByTitleAndAuthorController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async listQuizzesByIdListController(req: Request, res: Response) {
        const { quizIDs } = req.body;
        try {
            const result = await quizModel.listQuizzesByIdList(quizIDs);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listQuizzesByIdListController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default quizControllers;