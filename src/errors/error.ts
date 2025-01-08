import { Request, Response, NextFunction } from "express";
import logger from "../utils/Logger";

// Function to generate error objects
export function getError(code: number, text: string) {
  return { code, text };
}

// Middleware to handle errors centrally
export function errorHandler(
  error: { code?: number; text?: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof SyntaxError) {
    const status = 400; // Bad Request for incorrect JSON format
    const text = `Invalid JSON payload format: ${error.message}`;
    
    // Log the error to the console
    logger.error(`Error [${status}]: ${text}`);
    logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
    logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);

    res.status(status).end(text);
  } else {
    const status = error.code ?? 500; // Default to 500 if no code is provided
    const text = error.text ?? `Unknown server error: ${JSON.stringify(error)}`;

    // Log the error to the console
    logger.error(`Error [${status}]: ${text}`);
    logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
    logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);

    res.status(status).end(text);
  }
}