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