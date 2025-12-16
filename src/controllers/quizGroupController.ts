import { Request, Response } from "express";
import QuizGroupModel from "../models/quizGroupModel";

const quizGroupControllers = {
    //protected controllers
    async createGroupController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { title, quizIDs } = req.body;

        try {
            const result = await QuizGroupModel.createGroup(title, userID, quizIDs);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("createGroupController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async deleteGroupByIdController(req: Request, res: Response) {
        const userID = req.userID as string;
        if (!userID) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { groupId } = req.body;
        const group = await QuizGroupModel.findGroupById(groupId);
        if(group.data?.admin._id.toString() !== userID){
            return res.status(403).json({ message: 'Forbidden: You are not the admin of this group' });
        }
        try {
            const result = await QuizGroupModel.deleteGroupById(groupId);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("deleteGroupByIdController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    //public controllers
    async listGroupsByTitleController(req: Request, res: Response) {
        const { title } = req.params;
        try {
            const result = await QuizGroupModel.listGroupsByTitle(title);
            res.status(result.status).json(result);
        } catch (err) {
            console.error("listGroupsByTitleController error:", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default quizGroupControllers;