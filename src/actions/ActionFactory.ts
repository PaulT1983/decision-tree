import { Action } from "./Action";
import { SendSMSAction } from "./SendSMSAction";
import { SendEmailAction } from "./SendEmailAction";
import { ConditionAction } from "./ConditionAction";
import { LoopAction } from "./LoopAction";
import {
  ACTION_TYPE_SMS,
  ACTION_TYPE_EMAIL,
  ACTION_TYPE_CONDITION,
  ACTION_TYPE_LOOP,
} from "../config/constants";
import Logger from "../utils/Logger";

export class ActionFactory {
  static deserialize(data: any): Action {
    switch (data.type) {
      case ACTION_TYPE_SMS:
        Logger.debug(`Creating SendSMSAction with data: ${JSON.stringify(data)}`);
        return new SendSMSAction(data.phoneNumber);

      case ACTION_TYPE_EMAIL:
        Logger.debug(
          `Creating SendEmailAction with data: ${JSON.stringify(data)}`
        );
        return new SendEmailAction(data.sender, data.receiver);

      case ACTION_TYPE_CONDITION:
        Logger.debug(
          `Creating ConditionAction with data: ${JSON.stringify(data)}`
        );
        return new ConditionAction(
          data.expression,
          ActionFactory.deserialize(data.trueAction),
          ActionFactory.deserialize(data.falseAction)
        );

      case ACTION_TYPE_LOOP:
        Logger.debug(
          `Creating LoopAction with data: ${JSON.stringify(data)}`
        );
        return new LoopAction(
          ActionFactory.deserialize(data.subtree),
          data.iterations
        );

      default:
        Logger.error(`Unsupported action type: ${data.type}`);
        throw new Error(`Unsupported action type: ${data.type}`);
    }
  }
}