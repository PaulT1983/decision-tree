import { Action } from "../actions/Action";
import { ActionFactory } from "../actions/ActionFactory";
import Logger from "../utils/Logger";

export class DecisionTree {
  constructor(private rootAction: Action) {}

  execute(): void {
    Logger.info("Executing decision tree...");
    this.rootAction.execute();
    Logger.info("Decision tree execution completed.");
  }

  serialize(): object {
    Logger.debug("Serializing decision tree...");
    return this.rootAction.serialize();
  }

  static deserialize(data: any): DecisionTree {
    Logger.debug("Deserializing decision tree...");
    const rootAction = ActionFactory.deserialize(data);
    return new DecisionTree(rootAction);
  }
}