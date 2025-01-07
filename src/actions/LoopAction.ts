import { Action } from "./Action";
import Logger from "../utils/Logger";
import { ACTION_TYPE_LOOP } from "../config/constants";

export class LoopAction extends Action {
  constructor(private subtree: Action, private iterations: number) {
    super();
  }

  execute(): void {
    Logger.info(`Executing loop ${this.iterations} times`);
    for (let i = 0; i < this.iterations; i++) {
      Logger.debug(`Executing iteration ${i + 1}`);
      this.subtree.execute();
    }
  }

  serialize(): object {
    return {
      type: ACTION_TYPE_LOOP,
      subtree: this.subtree.serialize(),
      iterations: this.iterations,
    };
  }
}