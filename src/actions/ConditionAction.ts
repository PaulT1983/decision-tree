import { Action } from "./Action";
import Logger from "../utils/Logger";
import { ACTION_TYPE_CONDITION } from "../config/constants";

export class ConditionAction extends Action {
  constructor(
    private expression: string,
    private trueAction: Action,
    private falseAction: Action
  ) {
    super();
  }

  execute(): void {
    Logger.info(`Evaluating condition: ${this.expression}`);
    const result = eval(this.expression); // Avoid eval in production; use a safer alternative.
    if (result) {
      Logger.info(`Condition met: ${this.expression}`);
      this.trueAction.execute();
    } else {
      Logger.info(`Condition not met: ${this.expression}`);
      this.falseAction.execute();
    }
  }

  serialize(): object {
    return {
      type: ACTION_TYPE_CONDITION,
      expression: this.expression,
      trueAction: this.trueAction.serialize(),
      falseAction: this.falseAction.serialize(),
    };
  }
}