import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../routes/authRouter";

const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, secretKey);

    console.log("decoded token =>", decoded);

    // (req as any).user = decoded;
    req.user = {
      id : decoded._id,
      userName : decoded.username
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default middleware;