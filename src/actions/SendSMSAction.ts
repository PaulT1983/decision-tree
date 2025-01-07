import { Action } from "./Action";
import Logger from "../utils/Logger";
import { ACTION_TYPE_SMS } from "../config/constants";

export class SendSMSAction extends Action {
  constructor(private phoneNumber: string) {
    super();
  }

  execute(): void {
    Logger.info(`Sending SMS to ${this.phoneNumber}`);
  }

  serialize(): object {
    return { type: ACTION_TYPE_SMS, phoneNumber: this.phoneNumber };
  }
}