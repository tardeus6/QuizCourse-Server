import mongoose from "mongoose";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";

const quizModel = {
    async createQuiz(
        title: string,
        authorUsername: string,
        questions: string[],
        answers: string[][],
        correctAnswers: number[]
    ) {
        try {
            const author = await User.findOne({ username: authorUsername }).lean();
            if (!author) return { status: 404, message: 'No user with such username' };

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
            return { status: 201, message: 'Quiz created successfully' };
        } catch (err) {
            console.error("createQuiz error:", err);
            throw new Error(`Failed to create quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listQuizzesByTitle(title: string) {
        try {
            const quizzes = await Quiz.find({ title })
                .populate("author", "username -_id")
                .lean();
            return { status: 200, data: quizzes };
        } catch (err) {
            console.error("findQuizzesByTitle error:", err);
            throw new Error(`Failed to find quizzes by title: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listQuizzesByAuthor(authorUsername: string) {
        try {
            const author = await User.findOne({ username: authorUsername }).lean();
            if (!author) return { status: 404, message: 'No user with such username' };

            const quizzes = await Quiz.find({ author: author._id })
                .populate("author", "username -_id")
                .lean();
            return { status: 200, data: quizzes };
        } catch (err) {
            console.error("findQuizzesByAuthor error:", err);
            throw new Error(`Failed to find quizzes by author: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listQuizzesByTitleAndAuthor(title: string, authorUsername: string) {
        try {
            const author = await User.findOne({ username: authorUsername }).lean();
            if (!author) return { status: 404, message: 'No user with such username' };

            const quizzes = await Quiz.find({ title, author: author._id })
                .populate("author", "username -_id")
                .lean();
            return { status: 200, data: quizzes };
        } catch (err) {
            console.error("findQuizzesByTitleAndAuthor error:", err);
            throw new Error(`Failed to find quizzes by title and author: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listQuizzesByIdList(quizIDs: string[] | mongoose.Types.ObjectId[]) {
        try {
            if (!quizIDs || quizIDs.length === 0) return { status: 400, message: 'No quiz IDs provided' };

            const objectIds = quizIDs.map(id => typeof id === "string" ? new mongoose.Types.ObjectId(id) : id);

            const quizzes = await Quiz.find({ _id: { $in: objectIds } })
                .populate("author", "username -_id")
                .lean();

            return { status: 200, data: quizzes };
        } catch (err) {
            console.error("listQuizzesByIdList error:", err);
            throw new Error(`Failed to list quizzes by IDs: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async editQuiz(id: string, title: string, questions: string[], answers: string[][], correctAnswers: number[]) {
        try {
            const updated = await Quiz.findByIdAndUpdate(
                id,
                { title, questions, answerVariants: answers, correctAnswers },
                { new: true }
            ).lean();

            if (!updated) return { status: 404, message: 'No quiz with such id' };
            return { status: 200, message: 'Edited quiz' };
        } catch (err) {
            console.error("editQuiz error:", err);
            throw new Error(`Failed to edit quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async deleteQuiz(id: string) {
        try {
            const deleted = await Quiz.findByIdAndDelete(id).lean();
            if (!deleted) return { status: 404, message: 'No quiz with such id' };
            return { status: 200, message: 'Deleted quiz' };
        } catch (err) {
            console.error("deleteQuiz error:", err);
            throw new Error(`Failed to delete quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async getQuizById(quizID: string) {
        try {
            const quiz = await Quiz.findById(quizID)
                .populate("author", "username -_id")
                .lean();
            if (!quiz) return { status: 404, message: 'No quiz with such id' };
            return { status: 200, data: quiz };
        } catch (err) {
            console.error("getQuizById error:", err);
            throw new Error(`Failed to get quiz by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
}

export default quizModel;