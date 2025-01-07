import { Request, Response, NextFunction } from "express";
import Logger from "../utils/Logger";
import { getError } from "../errors/error";

// Define allowed routes and methods
const allowedRoutes = [
  { path: "/execute-tree", method: "POST" },
];

// Middleware to validate routes and methods
export function validateRoutesAndMethods(req: Request, res: Response, next: NextFunction) {
  const isValidRoute = allowedRoutes.some(
    (route) => route.path === req.path && route.method === req.method
  );

  if (!isValidRoute) {
    Logger.warn(`Invalid route accessed: ${req.method} ${req.originalUrl}`);
    const error = getError(404, `Invalid route: ${req.method} ${req.originalUrl}`);
    return next(error);
  }

  next();
}