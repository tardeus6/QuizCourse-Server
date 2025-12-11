import { timeStamp } from "console";
import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
    quizID: { type: mongoose.Types.ObjectId, required: true },
    completedBy: { 
        userID: {type: mongoose.Types.ObjectId, required: true},
        username: {type: String}
     },
    answers: { type: [Number], default: [] },
    grade: { type: Number, required: true, default: 0 },
    dateOfStart: {type: Date, required: true, default: Date.now},
    dateOfCompletion: { type: Date },
})

export default mongoose.model("Completion", completionSchema);