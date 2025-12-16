import { Request, Response } from "express";
import CompletionModel from "../models/completionModel";
import QuizModel from "../models/quizModel";

//protected controllers
const completionControllers = {
    async startCompletionController(req: Request, res: Response) {
        const userID = req.userID as string;
        const { quizID } = req.body;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const quizData = await QuizModel.getQuizInfo(quizID);
            const completion = await CompletionModel.startCompletion(quizID, userID);

            res.status(completion.status).json({quizData: quizData.quiz, completion: completion.data});
        } catch (err) {
            console.error("startCompletionController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async finishCompletionController(req: Request, res: Response) {
        const userID = req.userID as string;
        const { completionID, answers } = req.body;

        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const result = await CompletionModel.finishCompletion(completionID, answers);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("finishCompletionController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async listCompletionsByUserAndQuizIDController(req: Request, res: Response) {
        const userID = req.userID as string;
        const { quizID } = req.params;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const result = await CompletionModel.listCompletionsByUserAndQuizID(userID, quizID);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listCompletionsByUserAndQuizIDController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }},
    async listCompletionsByQuizIDController(req: Request, res: Response) {
        const userID = req.userID as string;
        const { quizID } = req.params;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const quiz = await QuizModel.getQuizById(quizID);
        if(quiz.data?.author._id.toString() !== userID){
            return res.status(403).json({ message: 'Forbidden: You are not the author of this quiz' });
        }
        
        try {
            const result = await CompletionModel.listCompletionsByQuizID(quizID);
            res.status(result.status).json(result.data);
        } catch (err) {
            console.error("listCompletionsByQuizIDController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }},
        async listLastCompletions(req:Request, res: Response)
        {
            const userID = req.userID as string;
            const result = await CompletionModel.listCompletionsByUserID(userID);
            res.status(result.status).json(result.data);
        }
};

export default completionControllers;