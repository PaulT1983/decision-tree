import express from "express";
import { DecisionTreeRouter } from "./routes/DecisionTreeRouter";
import { errorHandler } from "./errors/error";
import { validateBody, valid } from "./middleware/schemasValidation";
import { validateRoutesAndMethods } from "./middleware/routeValidation";
import schemas from "./validation-schemas/schemas";
import Logger from "./utils/Logger";
import { ROUTE_EXECUTE_TREE, PORT } from "./config/constants";

const app = express();

// Middleware to parse JSON payloads
app.use(express.json());

// Route Validation Middleware
app.use(validateRoutesAndMethods);

// Validation Middleware
app.use(validateBody(schemas)); // Validate request body
app.use(valid); // Ensure valid schema usage

// Routes
app.use(ROUTE_EXECUTE_TREE, DecisionTreeRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () =>
  Logger.info(`Server running on port ${PORT}`)
);