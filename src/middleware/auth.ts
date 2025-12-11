import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { redis } from "../database/redis";

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  const exists = await redis.get(token);
  if (!exists) return res.status(403).json({ error: "Token invalid or expired" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}
