import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Normalize environment variables
const normalizedLogLevel = process.env.LOG_LEVEL?.toLowerCase() || "info"; // Normalize to lowercase, default to "info"
const normalizedLogOutput = process.env.LOG_OUTPUT?.toLowerCase() || "console"; // Normalize to lowercase, default to "console"

// Default Logger Configuration
export const DEFAULT_LOG_LEVEL = "info"; // Default logger level
export const IS_FILE_LOGGING = normalizedLogOutput === "file"; // Determine if file logging is enabled
export const LOG_LEVEL = normalizedLogLevel; // Use normalized log level

// Action Types
export const ACTION_TYPE_SMS = "SMS";
export const ACTION_TYPE_EMAIL = "Email";
export const ACTION_TYPE_CONDITION = "Condition";
export const ACTION_TYPE_LOOP = "Loop";

// Routes
export const ROUTE_EXECUTE_TREE = "/execute-tree";

// Default Configuration
const DEFAULT_PORT = 3000;
export const PORT = process.env.PORT || DEFAULT_PORT;