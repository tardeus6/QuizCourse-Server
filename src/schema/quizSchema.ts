import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    questions: {
        type: [String],
        required: true,
        validate: (arr: string[]) => arr.length > 0
    },

    answerVariants: [{
        type: [String],
        required: true,
        validate: (arr: string[]) => arr.length >= 2
    }],

    correctAnswers: [{
        type: Number,
        required: true
    }],

    answersValue: [{
        type: Number,
        required: true
    }]
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
