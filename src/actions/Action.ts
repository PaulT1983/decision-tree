export abstract class Action {
  abstract execute(): void;
  abstract serialize(): object;
}