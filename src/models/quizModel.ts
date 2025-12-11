import mongoose from "mongoose";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";

export async function createQuiz(
    title: string,
    authorUsername: string,
    questions: string[],
    answers: string[][],
    correctAnswers: number[]
) {
    try {
        const author = await User.findOne({ username: authorUsername }).lean();
        if (!author) return 'No user with such username';

        const answersValue = Array(correctAnswers.length).fill(0);

        const newQuiz = new Quiz({
            title,
            author: author._id,  
            questions,
            answerVariants: answers,
            correctAnswers,
            answersValue
        });

        await newQuiz.save();
        return 'Quiz created successfully';
    } catch (err) {
        console.error("createQuiz error:", err);
        throw new Error(`Failed to create quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listQuizzesByTitle(title: string) {
    try {
        const quizzes = await Quiz.find({ title })
            .populate("author", "username -_id")
            .lean();
        return quizzes;
    } catch (err) {
        console.error("findQuizzesByTitle error:", err);
        throw new Error(`Failed to find quizzes by title: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listQuizzesByAuthor(authorUsername: string) {
    try {
        const author = await User.findOne({ username: authorUsername }).lean();
        if (!author) return [];

        const quizzes = await Quiz.find({ author: author._id })
            .populate("author", "username -_id")
            .lean();
        return quizzes;
    } catch (err) {
        console.error("findQuizzesByAuthor error:", err);
        throw new Error(`Failed to find quizzes by author: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listQuizzesByTitleAndAuthor(title: string, authorUsername: string) {
    try {
        const author = await User.findOne({ username: authorUsername }).lean();
        if (!author) return [];

        const quizzes = await Quiz.find({ title, author: author._id })
            .populate("author", "username -_id")
            .lean();
        return quizzes;
    } catch (err) {
        console.error("findQuizzesByTitleAndAuthor error:", err);
        throw new Error(`Failed to find quizzes by title and author: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listQuizzesByIdList(quizIDs: string[] | mongoose.Types.ObjectId[]) {
    try {
        if (!quizIDs || quizIDs.length === 0) return [];

        const objectIds = quizIDs.map(id => typeof id === "string" ? new mongoose.Types.ObjectId(id) : id);

        const quizzes = await Quiz.find({ _id: { $in: objectIds } })
            .populate("author", "username -_id")
            .lean();

        return quizzes;
    } catch (err) {
        console.error("listQuizzesByIdList error:", err);
        throw new Error(`Failed to list quizzes by IDs: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function editQuiz(id: string, title: string, questions: string[], answers: string[][]) {
    try {
        const updated = await Quiz.findByIdAndUpdate(
            id,
            { title, questions, answerVariants: answers },
            { new: true }
        ).lean();

        if (!updated) return 'No quiz with such id';
        return 'Edited quiz';
    } catch (err) {
        console.error("editQuiz error:", err);
        throw new Error(`Failed to edit quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function deleteQuiz(id: string) {
    try {
        const deleted = await Quiz.findByIdAndDelete(id).lean();
        if (!deleted) return 'No quiz with such id';
        return 'Deleted quiz';
    } catch (err) {
        console.error("deleteQuiz error:", err);
        throw new Error(`Failed to delete quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
}
