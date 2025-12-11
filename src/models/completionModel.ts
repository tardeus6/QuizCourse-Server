import Completion from "../schema/completionSchema";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";
import mongoose from "mongoose";

export async function startCompletion(quizID: string, userID: string) {
    try {
        const user = await User.findById(userID).lean();
        if (!user) return "User not found";

        const quiz = await Quiz.findById(quizID).lean();
        if (!quiz) return "Quiz not found";

        const completion = new Completion({
            quizID,
            completedBy: user._id,  
            answers: [],            
            grade: 0,
            dateOfStart: new Date()
        });

        await completion.save();
        return completion.toObject();
    } catch (err) {
        console.error("startCompletion error:", err);
        throw new Error(`Failed to start completion: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function finishCompletion(completionID: string, answers: number[]) {
    try {
        const completion = await Completion.findById(completionID);
        if (!completion) return "Completion not found";

        const quiz = await Quiz.findById(completion.quizID).lean();
        if (!quiz) return "Quiz not found";

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
        return completion.toObject();
    } catch (err) {
        console.error("finishCompletion error:", err);
        throw new Error(`Failed to finish completion: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listCompletionsByUserAndQuizID(userID: string, quizID: string) {
    try {
        const completions = await Completion.find({
            completedBy: new mongoose.Types.ObjectId(userID),
            quizID: new mongoose.Types.ObjectId(quizID)
        })
            .populate("completedBy", "username -_id")
            .populate("quizID", "title -_id")
            .lean();

        return completions;
    } catch (err) {
        console.error("listCompletionsByUserAndQuizID error:", err);
        throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listCompletionsByQuizID(quizID: string) {
    try {
        const completions = await Completion.find({ quizID: new mongoose.Types.ObjectId(quizID) })
            .populate("completedBy", "username -_id")
            .lean();

        return completions;
    } catch (err) {
        console.error("listCompletionsByQuizID error:", err);
        throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listCompletionsByUserID(userID: string) {
    try {
        const completions = await Completion.find({ completedBy: new mongoose.Types.ObjectId(userID) })
            .populate("quizID", "title -_id")
            .lean();

        return completions;
    } catch (err) {
        console.error("listCompletionsByUserID error:", err);
        throw new Error(`Failed to list completions: ${err instanceof Error ? err.message : String(err)}`);
    }
}
