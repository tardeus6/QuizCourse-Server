import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizzes: [{
        type: mongoose.Types.ObjectId,
        ref: "Quiz"
    }]
}, { timestamps: true });

export default mongoose.model("QuizGroup", groupSchema);
