import mongoose from "mongoose";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";

export async function createQuiz(
        title: string, 
        author: string, 
        questions: string[], 
        answers: string[][], 
        correctAnswers: number[]
    ) {
    try {
        const authorExists = await User.findOne({ Username: author }).lean();
        if (!authorExists) return 'No user with such username';

        const newQuiz = new Quiz({ title, author, questions, answers, correctAnswers });
        await newQuiz.save();

        return 'Quiz created succesfully';
    } catch (err) {
        console.error("createQuiz error:", err);
        throw new Error(`Failed to create quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function findQuizesByTitle(title: string) {
    try {
        const quizes = await Quiz.find({ title }).lean();
        return quizes;
    } catch (err) {
        console.error("findQuizesByTitle error:", err);
        throw new Error(`Failed to find quizzes by title: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function findQuizesByAuthor(author: string) {
    try {
        const quizes = await Quiz.find({ author }).lean();
        return quizes;
    } catch (err) {
        console.error("findQuizesByAuthor error:", err);
        throw new Error(`Failed to find quizzes by author: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function findQuizesByTitleAndAuthor(title: string, author: string) {
    try {
        const quizes = await Quiz.find({ title, author }).lean();
        return quizes;
    } catch (err) {
        console.error("findQuizesByTitleAndAuthor error:", err);
        throw new Error(`Failed to find quizzes by title and author: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function editQuiz(id: string, title: string, questions: string[], answers: string[][]) {
    try {
        const updated = await Quiz.findByIdAndUpdate(
            id,
            { title, questions, answers },
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