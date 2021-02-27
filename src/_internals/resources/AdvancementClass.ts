import { ResourceClass } from './Resource'

import type { AdvancementType, MultiplePlayersArgument } from '@arguments'
import type { Datapack } from '@datapack'

export class AdvancementClass<CriteriaNames extends string = string> extends ResourceClass {
  advancementJson

  constructor(datapack: Datapack, name: string, advancement: AdvancementType<CriteriaNames>) {
    super(datapack, name)

    this.advancementJson = advancement

    this.datapack.addResource(name, 'advancements', { advancement })
  }

  /**
   * Grant this advancement to the players.
   */
  grant(players: MultiplePlayersArgument, criterion?: CriteriaNames) {
    this.commandsRoot.advancement.grant(players).only(this.name, criterion)
  }

  /**
   * Revoke this advancement from the players.
   */
  revoke(players: MultiplePlayersArgument, criterion?: CriteriaNames) {
    this.commandsRoot.advancement.revoke(players).only(this.name, criterion)
  }

  /**
   * Grant this advancement and all its parent advancements to the players.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   */
  grantUntilThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.grant(players).until(this.name)
  }

  /**
   * Revoke this advancement and all its parent advancements from the players.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   */
  revokeUntilThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.revoke(players).until(this.name)
  }

  /**
   * Grant this advancement and all its children advancements to the players.
   * Think of specifying everything *from* that advancement to the end.
   *
   * The exact order the operation is carried out in is specified `advancement > child > child's child > ...`.
   * When it operates on a child that branches, it iterates through all its children before continuing.
   */
  grantFromThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.grant(players).from(this.name)
  }

  /**
   * Revoke this advancement and all its children advancements from the players.
   * Think of specifying everything *from* that advancement to the end.
   *
   * The exact order the operation is carried out in is specified `advancement > child > child's child > ...`.
   * When it operates on a child that branches, it iterates through all its children before continuing.
   */
  revokeFromThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.revoke(players).from(this.name)
  }

  /**
   * Grant this advancement, all its parent advancements, and all its children advancements to the players.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with `until` specified, then with `from` specified:
   * `parent > parent's parent > ... > root > specified advancement > child > child's child > ...`
   */
  grantThroughThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.grant(players).through(this.name)
  }

  /**
   * Revoke this advancement, all its parent advancements, and all its children advancements from the players.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with `until` specified, then with `from` specified:
   * `parent > parent's parent > ... > root > specified advancement > child > child's child > ...`
   */
  revokeThroughThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.revoke(players).through(this.name)
  }
}
