import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
    quizID: { 
        type: mongoose.Types.ObjectId, 
        ref: "Quiz",
        required: true 
    },

    completedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

    answers: { 
        type: [Number], 
        default: [] 
    },

    grade: { 
        type: Number, 
        default: null 
    },

    dateOfStart: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },

    dateOfCompletion: { 
        type: Date 
    }
}, { timestamps: true });

export default mongoose.model("Completion", completionSchema);
