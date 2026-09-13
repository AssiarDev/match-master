export interface UserPayload {
  id: number;
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
