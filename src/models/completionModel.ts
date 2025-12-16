import Completion from "../schema/completionSchema";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";
import mongoose from "mongoose";

const completionModel = {
    async startCompletion(quizID: string, userID: string) {
        try {
            const user = await User.findById(userID).lean();
            if (!user) return { status: 404, message: "User not found" };

            const quiz = await Quiz.findById(quizID).lean();
            if (!quiz) return { status: 404, message: "Quiz not found" };

            const completion = new Completion({
                quizID,
                completedBy: user._id,  
                answers: [],            
                grade: 0,
                dateOfStart: new Date()
            });

            await completion.save();
            return { status: 201, data: {quizData: quiz ,completionID: completion.toObject()._id} };
        } catch (err) {
            console.error("startCompletion error:", err);
            throw new Error(`Failed to start completion: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async finishCompletion(completionID: string, answers: number[]) {
        try {
            const completion = await Completion.findById(completionID);
            if (!completion) return { status: 404, message: "Completion not found" };

            const quiz = await Quiz.findById(completion.quizID).lean();
            if (!quiz) return { status: 404, message: "Quiz not found" };

            let grade = 0;
            answers.forEach((answer, index) => {
                if (answer === quiz.correctAnswers[index]) {
                    grade += quiz.answersValue[index];
                }
            });

            completion.answers = answers;
            completion.grade = grade;
            completion.dateOfCompletion = new Date();

            await completion.save();
            const result = {grade, dateOfCompletion: completion.dateOfCompletion}
            return { status: 200, data: result };
        } catch (err) {
            console.error("finishCompletion error:", err);
            throw new Error(`Failed to finish completion: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listCompletionsByUserAndQuizID(userID: string, quizID: string) {
        try {
            const completions = await Completion.find({
                completedBy: new mongoose.Types.ObjectId(userID),
                quizID: new mongoose.Types.ObjectId(quizID)
            })
                .populate("completedBy", "username -_id")
                .populate("quizID", "title -_id")
                .lean();

            return { status: 200, data: completions };
        } catch (err) {
            console.error("listCompletionsByUserAndQuizID error:", err);
            throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listCompletionsByQuizID(quizID: string) {
        try {
            const completions = await Completion.find({ quizID: new mongoose.Types.ObjectId(quizID) })
                .populate("completedBy", "username -_id")
                .lean();

            return { status: 200, data: completions };
        } catch (err) {
            console.error("listCompletionsByQuizID error:", err);
            throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listCompletionsByUserID(userID: string) {
        try {
            const completions = await Completion.find({ 
                completedBy: new mongoose.Types.ObjectId(userID),
                dateOfCompletion: { $ne: null }
             })
                .populate("quizID", "title -_id")
                .sort({ dateOfCompletion: -1 })
                .lean()
                .limit(10);

            return { status: 200, data: completions };
        } catch (err) {
            console.error("listCompletionsByUserID error:", err);
            throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
};

export default completionModel;
