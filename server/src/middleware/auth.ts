import { Request, Response, NextFunction } from "express";
export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("hitting Routes");
  next();
};
