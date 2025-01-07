import Joi from "joi";
import {
  ACTION_TYPE_SMS,
  ACTION_TYPE_EMAIL,
  ACTION_TYPE_CONDITION,
  ACTION_TYPE_LOOP,
  ROUTE_EXECUTE_TREE,
} from "../config/constants";

// Schema for SMS action
const schemaSMS = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required(),
}).id("schemaSMS");

// Schema for Email action
const schemaEmail = Joi.object({
  sender: Joi.string().email().required(),
  receiver: Joi.string().email().required(),
}).id("schemaEmail");

// Schema for Condition action
const schemaCondition = Joi.object({
  expression: Joi.string().required(),
  trueAction: Joi.object()
    .required()
    .custom((value, helpers) => {
      const result = actionSchema.validate(value);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return value;
    }),
  falseAction: Joi.object()
    .required()
    .custom((value, helpers) => {
      const result = actionSchema.validate(value);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return value;
    }),
}).id("schemaCondition");

// Schema for Loop action
const schemaLoop = Joi.object({
  iterations: Joi.number().integer().min(1).required(),
  subtree: Joi.object()
    .required()
    .custom((value, helpers) => {
      const result = actionSchema.validate(value);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return value;
    }),
}).id("schemaLoop");

// Root schema for all actions
const actionSchema = Joi.object({
  type: Joi.string()
    .valid(ACTION_TYPE_SMS, ACTION_TYPE_EMAIL, ACTION_TYPE_CONDITION, ACTION_TYPE_LOOP)
    .required()    
}).unknown(false)
  .when(Joi.object({ type: ACTION_TYPE_SMS }).unknown(), {
    then: schemaSMS,
  })
  .when(Joi.object({ type: ACTION_TYPE_EMAIL }).unknown(), {
    then: schemaEmail,
  })
  .when(Joi.object({ type: ACTION_TYPE_CONDITION }).unknown(), {
    then: schemaCondition,
  })
  .when(Joi.object({ type: ACTION_TYPE_LOOP }).unknown(), {
    then: schemaLoop,
  })
  .id("actionSchema");

// Export the schemas for validation middleware
const schemas = {
  [ROUTE_EXECUTE_TREE]: {
    POST: actionSchema,
  },
};

export default schemas;
