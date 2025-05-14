import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const middleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
)=>{
  const token = req.cookies.token
  if (!token) {
    res.status(403).json({ message: "Not Authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId  ;
    next();
  } catch (e) {
    res.status(403).json({ message: "Authentication Failed" });
  }
};