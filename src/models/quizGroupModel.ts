import mongoose from "mongoose";
import Quiz from "../schema/quizSchema";
import User from "../schema/userSchema";
import Group from "../schema/quizGroupShema";

export async function createGroup(
    title: string,
    adminID: string,
    quizIDs?: string[]
) {
    try {
        if (quizIDs && quizIDs.length > 0) {
            const quizzes = await Quiz.find({ _id: { $in: quizIDs } }).select('_id').lean();
            if (quizzes.length !== quizIDs.length) return "One or more quizzes not found";
        }

        const admin = await User.findById(adminID).lean();
        if (!admin) return "User not found";

        const newGroup = new Group({
            title,
            admin: admin._id,
            quizzes: quizIDs ?? []
        });

        await newGroup.save();

        return newGroup.toObject();
    } catch (err) {
        console.error("createGroup error:", err);
        throw new Error(`Failed to create group: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listGroupsByTitle(title: string) {
    try {
        const groups = await Group.find({ title })
            .populate("admin", "username -_id")
            .lean();

        if (!groups || groups.length === 0) return [];
        return groups;
    } catch (err) {
        console.error("listGroupsByTitle error:", err);
        throw new Error(`Failed to list groups by title: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function deleteGroupById(groupId: string | mongoose.Types.ObjectId) {
    try {
        const id = typeof groupId === "string" ? new mongoose.Types.ObjectId(groupId) : groupId;

        const deleted = await Group.findByIdAndDelete(id).lean();
        if (!deleted) return 'No group with such ID';
        return 'Group deleted successfully';
    } catch (err) {
        console.error("deleteGroupById error:", err);
        throw new Error(`Failed to delete group: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listGroupsByAdmin(adminID: string) {
    try {
        const groups = await Group.find({ admin: adminID })
            .populate("admin", "username -_id")
            .lean();
        return groups || [];
    } catch (err) {
        console.error("listGroupsByAdmin error:", err);
        throw new Error(`Failed to list groups by admin: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function listGroupsByQuiz(quizID: string) {
    try {
        const groups = await Group.find({ quizzes: quizID })
            .populate("admin", "username -_id")
            .lean();
        return groups || [];
    } catch (err) {
        console.error("listGroupsByQuiz error:", err);
        throw new Error(`Failed to list groups by quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
}
