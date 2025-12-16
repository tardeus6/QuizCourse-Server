import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface CustomJwtPayload{
  userID: string,
}
export default function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "Missing token" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
    req.userID = payload.userID;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}
