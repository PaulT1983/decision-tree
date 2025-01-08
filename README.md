
# Decision Tree Processing Backend

## Overview
The Decision Tree Processing Backend is a TypeScript application designed to process and execute decision trees. It enables customers to define and execute custom business logic tailored to their needs. The application is extensible, testable, and supports advanced features like serialization and deserialization of decision trees.

---

## Features
- **Serialization Support**: 
  - Serialize decision trees to JSON and deserialize them from JSON for easy persistence and reuse.
- **Supported Actions**:
  - **Send SMS**: Sends an SMS to a specified phone number.
  - **Send Email**: Sends an email from a sender to a receiver.
  - **Condition**: Evaluates a JavaScript expression and executes either a trueAction or falseAction branch.
  - **Loop**: Executes a subtree a specified number of times.
- **Extensibility**: Designed for easy addition of new action types.
- **Validation**: Robust request validation using `Joi` to ensure correct schema adherence.
- **Logging**: Structured logging for monitoring and debugging.

---

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/PaulT1983/decision-tree.git
    cd decision-tree
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the application:
    ```bash
    npm start
    ```

4. For development mode with live reloading:
    ```bash
    npm run dev
    ```

---

## Environment Variables

The application uses the following environment variables for configuration:

| Variable    | Description                                       | Default Value |
|-------------|---------------------------------------------------|---------------|
| PORT        | The port on which the application runs.           | 3000          |
| LOG_LEVEL   | Specifies the logging level.                      | INFO          |
| LOG_OUTPUT  | Determines where logs are output (console or file)| console       |

### Configuring Environment Variables

1. Using a `.env` File:
    - Create a `.env` file in the root of your project:
        ```plaintext
        PORT=8080
        LOG_LEVEL=DEBUG
        LOG_OUTPUT=file
        ```

2. Setting Variables Directly:
    - Pass environment variables when starting the application:
        ```bash
        PORT=8080 LOG_LEVEL=DEBUG LOG_OUTPUT=file npm start
        ```

---

## API Documentation

### Endpoint: `/execute-tree`
- **Method**: POST
- **Description**: Executes the provided decision tree.
- **Request Body Schema**: Refer to the Supported Actions for JSON structure.

### Example Requests:

1. **SMS Action**
    ```json
    {
      "type": "SMS",
      "phoneNumber": "+1234567890"
    }
    ```

2. **Email Action**
    ```json
    {
      "type": "Email",
      "sender": "noreply@example.com",
      "receiver": "user@example.com"
    }
    ```

3. **Condition Action**
    ```json
    {
      "type": "Condition",
      "expression": "new Date().getDay() === 5",
      "trueAction": {
        "type": "SMS",
        "phoneNumber": "+1234567890"
      },
      "falseAction": {
        "type": "Email",
        "sender": "noreply@example.com",
        "receiver": "user@example.com"
      }
    }
    ```

4. **Loop with Conditional Subtree**
    ```json
    {
      "type": "Loop",
      "iterations": 3,
      "subtree": {
        "type": "Condition",
        "expression": "Math.random() > 0.5",
        "trueAction": { "type": "SMS", "phoneNumber": "+1234567890" },
        "falseAction": { "type": "Email", "sender": "noreply@example.com", "receiver": "user@example.com" }
      }
    }
    ```

### Incorrect Examples

- **Missing required fields**:
    ```json
    {
      "type": "SMS"
    }
    ```
    **Response**:
    ```plaintext
    "phoneNumber" is required
    ```

- **Invalid type**:
    ```json
    {
      "type": "UnknownType",
      "phoneNumber": "+1234567890"
    }
    ```
    **Response**:
    ```plaintext
    "type" must be one of [SMS, Email, Condition, Loop]
    ```

- **Invalid field**:
    ```json
    {
      "type": "Email",
      "senderX": "noreply@example.com",
      "receiver": "user@example.com"
    }
    ```
    **Response**:
    ```plaintext
    "sender" is required
    ```

---

## Extending the Application

To add a new action type to the application, follow these steps:

1. **Add the Action Type to `constants.ts`**
    Define a new constant for the action type in `constants.ts` to maintain consistency across the app:
    ```typescript
    export const ACTION_TYPE_NEW_ACTION = "NewAction";
    ```

2. **Define the Schema**
    Add a new Joi schema in `schemas.ts` for the new action. Use the constant from `constants.ts`:
    ```typescript
    import { ACTION_TYPE_NEW_ACTION } from "../config/constants";

    const schemaNewAction = Joi.object({
      type: Joi.string().valid(ACTION_TYPE_NEW_ACTION).required(),
      customField: Joi.string().required()
    }).id("schemaNewAction");
    ```

3. **Update the Action Schema**
    Update `actionSchema` in `schemas.ts` to include the new action. Use the constant to ensure consistent type handling:
    ```typescript
    import { ACTION_TYPE_NEW_ACTION } from "../config/constants";

    const actionSchema = Joi.object({
      type: Joi.string()
        .valid(
          ACTION_TYPE_SMS,
          ACTION_TYPE_EMAIL,
          ACTION_TYPE_CONDITION,
          ACTION_TYPE_LOOP,
          ACTION_TYPE_NEW_ACTION
        )
        .required()
    }).when(Joi.object({ type: ACTION_TYPE_NEW_ACTION }).unknown(false), {
      then: schemaNewAction,
    });
    ```

4. **Implement the Action Class**
    Create a new class in the `actions` folder extending the `Action` class. Use the constant for defining the action type:
    ```typescript
    import { Action } from "./Action";
    import { ACTION_TYPE_NEW_ACTION } from "../config/constants";

    export class NewAction extends Action {
      constructor(private customField: string) {
        super();
      }

      execute(): void {
        console.log(`Executing ${ACTION_TYPE_NEW_ACTION} with customField: ${this.customField}`);
      }

      serialize(): object {
        return { type: ACTION_TYPE_NEW_ACTION, customField: this.customField };
      }
    }
    ```

5. **Update the ActionFactory**
    Update the `ActionFactory` to handle the new action type. Again, use the constant to avoid hardcoding:
    ```typescript
    import { ACTION_TYPE_NEW_ACTION } from "../config/constants";
    import { NewAction } from "./NewAction";

    export class ActionFactory {
      static deserialize(data: any): Action {
        switch (data.type) {
          case ACTION_TYPE_SMS:
            return new SendSMSAction(data.phoneNumber);
          case ACTION_TYPE_EMAIL:
            return new SendEmailAction(data.sender, data.receiver);
          case ACTION_TYPE_CONDITION:
            return new ConditionAction(
              data.expression,
              ActionFactory.deserialize(data.trueAction),
              ActionFactory.deserialize(data.falseAction)
            );
          case ACTION_TYPE_LOOP:
            return new LoopAction(
              ActionFactory.deserialize(data.subtree),
              data.iterations
            );
          case ACTION_TYPE_NEW_ACTION:
            return new NewAction(data.customField);
          default:
            throw new Error(`Unsupported action type: ${data.type}`);
        }
      }
    }
    ```

---

## Logging

The application provides structured logging to help you monitor validation, deserialization, and execution processes. Logs are generated using the Winston library and can be configured to suit your needs.

### Logging Levels

The application supports the following logging levels (ordered by priority):
1. **ERROR**: Logs critical errors that prevent the application from functioning.
2. **WARN**: Logs non-critical issues or potential problems.
3. **INFO**: Logs general information about application execution (e.g., successful validation or tree execution).
4. **HTTP**: Logs HTTP-related events (e.g., incoming requests, response status codes).
5. **DEBUG**: Logs detailed debugging information useful for developers.

The default logging level is INFO. Lower priority levels (e.g., DEBUG) will include logs of all higher priority levels (e.g., ERROR, WARN, INFO).

### Configuring Logging

Logging behavior can be customized using the following environment variables:
- **LOG_LEVEL**:
    - Specifies the logging level.
    - Default: INFO.
    - Example:
        ```plaintext
        LOG_LEVEL=DEBUG
        ```

- **LOG_OUTPUT**:
    - Determines whether logs are written to the console or files.
    - Accepted values:
        - `console` (default): Logs are written to the console.
        - `file`: Logs are written to:
            - `logs/error.log`: Logs at the ERROR level.
            - `logs/combined.log`: Logs at all levels.
    - Example:
        ```plaintext
        LOG_OUTPUT=file
        ```

### Passing Variables Directly:
```bash
LOG_LEVEL=DEBUG LOG_OUTPUT=file npm start
```

## Example Logs

### Console Output (Default)
```plaintext
2025-01-08 11:02:25 [INFO]: Validation succeeded for POST /execute-tree
2025-01-08 11:02:25 [INFO]: Executing loop 3 times
2025-01-08 11:02:25 [DEBUG]: Evaluating condition: Math.random() > 0.5
2025-01-08 11:02:25 [ERROR]: Invalid JSON payload format: Unexpected token '+'
```

### File Output (When LOG_OUTPUT=file)

- **logs/error.log**:
  ```plaintext
  2025-01-08 11:02:25 [ERROR]: Invalid JSON payload format: Unexpected token '+'
  ```

- **logs/combined.log**:
  ```plaintext
  2025-01-08 11:02:25 [INFO]: Validation succeeded for POST /execute-tree
  2025-01-08 11:02:25 [INFO]: Executing loop 3 times
  2025-01-08 11:02:25 [DEBUG]: Evaluating condition: Math.random() > 0.5
  2025-01-08 11:02:25 [ERROR]: Invalid JSON payload format: Unexpected token '+'
  ```

---

## Testing

This application includes a Postman collection for testing the API endpoints. The tests are automated using Newman, which is already included as a devDependency in the project.

### Steps to Test

1. **Install Dependencies**:
   Run the following command to install all the required dependencies, including Newman:
   ```bash
   npm install
   ```

2. **Run Tests**:
   After installing dependencies, run the tests with the following command:
   ```bash
   npm test
   ```

3. **Expected Test Results**:
   The `npm test` command executes the Postman tests and outputs the results directly in the console. The collection includes various scenarios, such as:
   - Sending SMS and Email.
   - Evaluating Conditions with true/false branches.
   - Executing loops with conditional subtrees.
   - Handling invalid requests with appropriate error messages.

4. **No Global Installation Required**:
   Since Newman is included in the `package.json` file, there is no need to install it globally. The tests will run using the locally installed Newman.

---

## Known Limitations

1. **JavaScript Expression Execution**:
   The Condition action currently uses `eval` to execute JavaScript expressions. While functional, this approach poses significant security risks and is not recommended for production environments. To mitigate these risks, consider replacing `eval` with a safer alternative such as a library like `math.js` or implementing a sandboxed execution environment.

2. **Verbose Error Messages for Nested Validation**:
   Deeply nested decision trees can generate verbose and hard-to-read error messages during validation. While the current schema captures detailed errors, this verbosity may make troubleshooting more challenging. Future improvements could include customizing error messages to provide clearer and more actionable insights for deeply nested structures.

---

## Changelog

1. **Initial Commit**:
   - Initialize Decision Tree app with core features.
   - Set up initial project structure.
   - Added validation schemas for request validation.
   - Implemented basic routing and middleware.
   - Implemented logging.
   - Implemented project logic.

2. **Enhanced Validation, Logging, and Testing**:
   - Improved logging with configurable levels and output modes.
   - Updated validation schemas for better error handling.
   - Added Postman tests and Newman integration for automated testing.
   - Updated documentation with testing and configuration instructions.
