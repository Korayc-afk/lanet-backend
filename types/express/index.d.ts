// src/types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: number;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}
