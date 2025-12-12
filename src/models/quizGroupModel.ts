import mongoose from "mongoose";
import Quiz from "../schema/quizSchema";
import User from "../schema/userSchema";
import Group from "../schema/quizGroupShema";

const quizGroupModel = {
    async createGroup(
        title: string,
        adminID: string,
        quizIDs?: string[]
    ) {
        try {
            if (quizIDs && quizIDs.length > 0) {
                const quizzes = await Quiz.find({ _id: { $in: quizIDs } }).select('_id').lean();
                if (quizzes.length !== quizIDs.length) return { status: 404, message: "One or more quizzes not found" };
            }

            const admin = await User.findById(adminID).lean();
            if (!admin) return { status: 404, message: "User not found" };

            const newGroup = new Group({
                title,
                admin: admin._id,
                quizzes: quizIDs ?? []
            });

            await newGroup.save();

            return { status: 201, data: newGroup.toObject() };
        } catch (err) {
            console.error("createGroup error:", err);
            throw new Error(`Failed to create group: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listGroupsByTitle(title: string) {
        try {
            const groups = await Group.find({ title })
                .populate("admin", "username -_id")
                .lean();

            if (!groups || groups.length === 0) return { status: 404, message: "No groups found with the given title" };
            return { status: 200, data: groups };
        } catch (err) {
            console.error("listGroupsByTitle error:", err);
            throw new Error(`Failed to list groups by title: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async deleteGroupById(groupId: string | mongoose.Types.ObjectId) {
        try {
            const id = typeof groupId === "string" ? new mongoose.Types.ObjectId(groupId) : groupId;

            const deleted = await Group.findByIdAndDelete(id).lean();
            if (!deleted) return { status: 404, message: 'No group with such ID' };
            return { status: 200, message: 'Group deleted successfully' };
        } catch (err) {
            console.error("deleteGroupById error:", err);
            throw new Error(`Failed to delete group: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listGroupsByAdmin(adminID: string) {
        try {
            const groups = await Group.find({ admin: adminID })
                .populate("admin", "username -_id")
                .lean();
            return { status: 200, data: groups || [] };
        } catch (err) {
            console.error("listGroupsByAdmin error:", err);
            throw new Error(`Failed to list groups by admin: ${err instanceof Error ? err.message : String(err)}`);
        }
    },

    async listGroupsByQuiz(quizID: string) {
        try {
            const groups = await Group.find({ quizzes: quizID })
                .populate("admin", "username -_id")
                .lean();
            return { status: 200, data: groups || [] };
        } catch (err) {
            console.error("listGroupsByQuiz error:", err);
            throw new Error(`Failed to list groups by quiz: ${err instanceof Error ? err.message : String(err)}`);
        }
    },
    async findGroupById(groupID: string) {
        try {
            const group = await Group.findById(groupID)
                .populate("admin", "username -_id")
                .populate("quizzes")
                .lean();
            if (!group) return { status: 404, message: "Group not found" };
            return { status: 200, data: group };
        } catch (err) {
            console.error("findGroupById error:", err);
            throw new Error(`Failed to find group by ID: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
};

export default quizGroupModel;
