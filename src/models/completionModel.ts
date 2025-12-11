import Completion from "../schema/completionSchema"
import User from "../schema/userSchema"
import Quiz from "../schema/quizSchema"

export async function createCompletion(quizID: string, completedBy: string, answers: [Number]) {
    const completedUser = await User.findOne({username: completedBy});
    if(!completedUser) return "User not found";

    const quiz = await Quiz.findById(quizID).lean();
    if(!quiz) return "Quiz not found";

    let grade = 0;
    answers.forEach((answer: Number, index: number) => {
        if(answer === quiz.correctAnswers[index]) {
            grade += quiz.answersValue[index];
        }
    });

    const completion = new Completion({
        completedBy,
        answers,
        grade,
        quizID
    })

    await completion.save();
    return completion;
}
export async function listCompletionsByUserAndQuizID(user: string, quizID: string) {
    const completions = await Completion.find({completedBy: user, quizID}).lean();

    return completions;
}
