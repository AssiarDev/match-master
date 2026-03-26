import "express-session";

export interface UserPayload {
  id: number;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user?: { id: number; email: string; username: string };
  }
}

export {};
