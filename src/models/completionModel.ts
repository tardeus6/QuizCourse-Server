import Completion from "../schema/completionSchema"
import User from "../schema/userSchema"
import Quiz from "../schema/quizSchema"
import mongoose from "mongoose";

export async function startCompletion(quizID: string, userID: string) {
    const user = await User.findById(userID).lean();
    if(!user) return "User not found";

    const quiz = await Quiz.findById(quizID).lean();
    if(!quiz) return "Quiz not found";

    const completion = new Completion({quizID, completedBy: {userID, username: user.username}});
    await completion.save(); 
    return completion.toObject();
}

export async function finishCompletion(completionID: string, answers: number[]) {
    const completion = await Completion.findById(completionID);
    if(!completion) return "Completion not found";

    const quiz = await Quiz.findById(completion.quizID).lean();
    if (!quiz) return "Quiz not found";

    let grade = 0;
    answers.forEach((answer: number, index: number) => {
        if (answer === quiz.correctAnswers[index]) {
            grade += quiz.answersValue[index];
        }
    });

    completion.grade = grade;
    completion.dateOfCompletion = new Date;

    await completion.save();

    return completion.toObject();
}
export async function listCompletionsByUserAndQuizID(userID: string, quizID: string) {
    const completions = await Completion.find({ "completedBy.userID": new mongoose.Types.ObjectId(userID), quizID }).lean();

    return completions;
}

export async function listCompletionsByQuizID(quizID: string) {
    const completions = await Completion.find({quizID}).lean();

    return completions;
}

export async function listCompletionsByUserID(userID: string) {
    const completions = await Completion.find({"completedBy.userID": new mongoose.Types.ObjectId(userID)}).lean();

    return completions;
};