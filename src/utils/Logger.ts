import { createLogger, format, transports, Logform } from "winston";
import dotenv from "dotenv";
import { LOG_LEVEL, IS_FILE_LOGGING } from "../config/constants"; // Import constants

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

// Configure the logger instance
const logger = createLogger({
  levels: customLevels.levels,
  level: LOG_LEVEL, // Use centralized log level from constants
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Inject timestamp into log info
    format.printf((info: Logform.TransformableInfo) => {
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
    ...(IS_FILE_LOGGING
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
          new transports.File({ filename: "logs/combined.log" }), // Log all messages to file
        ]
      : []), // Add file transports only if file logging is enabled
  ],
});

export default logger;