import { Request, Response } from "express";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
    const {username, password} = req.body;
    const result = await UserModel.createUser(username, password);
    res.status(result.status).json(result);
}

export async function login(req: Request, res: Response) {
    const {username, password} = req.body;
    const result = await UserModel.checkCredentials(username, password);
    const tokenSecret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign({ username, userID: result.userId }, tokenSecret, { expiresIn: '8h' });

    if (result.status === 200) {
        res.status(200).json({ token, userId: result.userId });
    } else {
        res.status(result.status).json({ message: result.message });
    }
}

