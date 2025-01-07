import { Action } from "./Action";
import Logger from "../utils/Logger";
import { ACTION_TYPE_EMAIL } from "../config/constants";

export class SendEmailAction extends Action {
  constructor(private sender: string, private receiver: string) {
    super();
  }

  execute(): void {
    Logger.info(`Sending Email from ${this.sender} to ${this.receiver}`);
  }

  serialize(): object {
    return {
      type: ACTION_TYPE_EMAIL,
      sender: this.sender,
      receiver: this.receiver,
    };
  }
}