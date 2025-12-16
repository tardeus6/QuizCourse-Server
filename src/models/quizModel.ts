import mongoose from "mongoose";
import User from "../schema/userSchema";
import Quiz from "../schema/quizSchema";

type QuizWithAuthor = {
    _id: mongoose.Types.ObjectId;
    title: string;
    questions: string[];
    answersValue: number[];
    author: {
        username: string;
        _id: string;
    };
};


const quizModel = {
    async createQuiz(
        title: string,
        authorID: string,
        questions: string[],
        answers: string[][],
        correctAnswers: number[],
        answersValue: number[],
    ) {
        try {
            const author = await User.findById(authorID).lean();
            if (!author) return { status: 404, message: 'No user with such username' };

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

    async getQuizById(quizID: string) {
        try {
            const quiz = await Quiz.findById(quizID)
                .populate("author", "username _id")
                .lean();
            if (!quiz) return { status: 404, message: 'No quiz with such id' };
            return { status: 200, data: quiz };
        } catch (err) {
            console.error("getQuizById error:", err);
            throw new Error(`Failed to get quiz by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async getQuizData(quizID: string, userID: string) {
        try {
            const quiz = await Quiz.findById(quizID)
                .lean();
            if (!quiz) return { status: 404, message: 'No quiz with such id' };

            if (quiz.author._id.toString() !== userID) return { status: 402, message: "not a creator of quiz" }
            return { status: 200, data: quiz };
        } catch (err) {
            console.error("getQuizById error:", err);
            throw new Error(`Failed to get quiz by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async editQuiz(id: string, title: string, questions: string[], answers: string[][], correctAnswers: number[], answersValue: number[]) {
        try {
            const updated = await Quiz.findByIdAndUpdate(
                id,
                { title, questions, answerVariants: answers, correctAnswers, answersValue },
                { new: true }
            ).lean();

            if (!updated) return { status: 404, message: 'No quiz with such id' };
            return { status: 200, message: 'Edited quiz' };
        } catch (err) {
            console.error("editQuiz error:", err);
            throw new Error(`Failed to edit quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async listQuizesInfo() {
        try {
            const quizzes = await Quiz.find()
                .populate("author", "username _id")
                .select("title author questions answersValue")
                .lean<QuizWithAuthor[]>();

            const data = quizzes.map((quiz) => ({
                title: quiz.title,
                questionsCount: quiz.questions.length,
                author: quiz.author.username,
                authorID: quiz.author._id,
                maxGrade: quiz.answersValue.reduce((a, b) => a + b, 0),
                _id: quiz._id.toString(),
            }));

            return { status: 200, data };
        } catch (err) {
            console.error("deleteQuiz error:", err);
            throw new Error(`Failed to delete quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async getQuizInfo(quizID: string) {
        try {
            const quiz = await Quiz.findById(quizID).select("_id title questions answerVariants").lean();
            if (!quiz) return { status: 404, message: 'Quiz not found' };
            return { status: 200, quiz }
        } catch (err) {
            console.error("getQuizInfo error:", err);
            throw new Error(`Failed to get quiz by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async getFilteredData(titleFilter?: string, authorFilter?: string) {
        try {
            const match: any = {};

            if (titleFilter) {
                match.title = { $regex: titleFilter, $options: "i" };
            }

            if (authorFilter) {
                match["user.username"] = { $regex: authorFilter, $options: "i" };
            }

            const quizzes = await Quiz.aggregate([
                // join users
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                // filters
                { $match: match },

                // format output
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        author: "$user.username",
                        authorID: "$user._id",
                        questionsCount: { $size: "$questions" },
                        maxGrade: { $sum: "$answersValue" }
                    }
                }
            ]);
            return { status: 200, data: quizzes };
        } catch (err) {
            console.error("getFilteredData error:", err);
            return { status: 500, message: "Failed to filter quizzes" };
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
}

export default quizModel;