import { createLogger, format, transports, Logform } from "winston";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
};

// Determine the default transport (console or file)
const isFileLogging = process.env.LOG_OUTPUT === "file";

// Configure the logger instance
const logger = createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || "info", // Use LOG_LEVEL from .env, default to "info"
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Inject timestamp into log info
    format.printf((info: Logform.TransformableInfo) => {
      // Assert that timestamp, level, and message exist
      const { timestamp, level, message } = info as Logform.TransformableInfo & {
        timestamp: string;
        level: string;
        message: string;
      };
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Always log to console
    ...(isFileLogging
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
          new transports.File({ filename: "logs/combined.log" }), // Log all messages to file
        ]
      : []), // Add file transports only if LOG_OUTPUT=file
  ],
});

export default logger;