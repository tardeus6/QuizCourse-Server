import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    questions: { type: [String], required: true},
    answerVariants: { type: [[String]], required: true},
    correctAnswers: {type: [Number], required: true},
    answersValue: {type: [Number], required: true}
})

export default mongoose.model("Quiz", quizSchema);