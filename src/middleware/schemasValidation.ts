import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { getError } from "../errors/error";
import logger from "../utils/Logger"; // Import the logger

// Extend the Express Request interface to include custom properties
declare module "express-serve-static-core" {
  interface Request {
    validated?: boolean;
    error_message?: string;
  }
}

// Middleware to validate request body using Joi schemas
export function validateBody(schemas: { [key: string]: { [method: string]: Joi.Schema } }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas[req.path]?.[req.method]; // Locate schema based on route and method
    if (schema) {
      req.validated = true; // Add validated flag to req
      const { error } = schema.validate(req.body);
      if (error) {
        req.error_message = error.details[0]?.message;
      } else {
        logger.info(`Validation succeeded for ${req.method} ${req.path}`);
      }
    } 
    next();
  };
}

// Middleware to ensure validation was performed and handle errors
export function valid(req: Request, res: Response, next: NextFunction) {
  if (!req.validated) {
    const errorMessage = `No validation schema provided for ${req.method} ${req.path}`;
    logger.error(errorMessage);
    throw getError(500, errorMessage);
  }
  if (req.error_message) {
    logger.error(`Validation error for ${req.method} ${req.path}: ${req.error_message}`);
    throw getError(400, req.error_message);
  }
  next();
}