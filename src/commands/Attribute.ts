import { Command } from "./Command";
import { command } from "./decorators";
import type { SelectorArgument } from "../arguments";

export class AttributeOperation extends Command {
  /** Returns the total value of the specified attribute. */
  @command('get')
  get = (scale?: number) => { }

  /** Returns the base value of the specified attribute. */
  @command(['base', 'get'])
  baseGet = (scale?: number) => { }

  /** Overwrites the base value of the specified attribute with the given value. */
  @command(['base', 'get'])
  baseSet = (value: number) => { }

  /** Adds an attribute modifier with the specified properties if no modifier with the same UUID already existed. */
  @command(['modifier', 'add'])
  add = (uuid: string, name: string, value: number, modifier: 'add' | 'multiply' | 'multiply_base') => { }

  /** Removes the attribute modifier with the specified UUID. */
  @command(['modifier', 'remove'])
  remove = (uuid: string) => { }

  /** Returns the value of the modifier with the specified UUID. */
  @command(['modifier', 'value', 'get'])
  getModifierValue = (uuid: string, scale?: number) => { }
}

export class Attribute extends Command {
  @command('attribute', { isRoot: true, hasSubcommands: true, executable: false })
  attribute = (target: SelectorArgument<true>, attribute: string) => {
    return new AttributeOperation(this.commandsRoot)
  }
}