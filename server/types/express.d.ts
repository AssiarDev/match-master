export interface UserPayload {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
