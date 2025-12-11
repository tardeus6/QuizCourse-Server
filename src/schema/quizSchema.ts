import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: { type: String },
    author: { type: String },
    questions: { type: [String] },
    answers: { type: [[String]] }
})

export default mongoose.model("quiz", quizSchema);