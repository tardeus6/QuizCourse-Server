import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
    quizID: {type: String, required: true},
    completedBy: {type: String, required: true},
    answers: {type: [Number], default: []},
    grade: { type: Number, required: true},
    dateOfCompletion: {type: Date, default: Date.now()}
})

export default mongoose.model("Completion", completionSchema);