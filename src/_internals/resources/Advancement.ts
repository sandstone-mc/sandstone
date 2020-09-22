import type { AdvancementType, MultiplePlayersArgument } from '@arguments'
import type { CommandsRoot } from '@commands'
import { toMcFunctionName } from '@datapack/minecraft'

export class Advancement<CriteriaNames extends string> {
  private commandsRoot

  private path

  private advancementJson

  constructor(commandsRoot: CommandsRoot, name: string, advancement: AdvancementType<CriteriaNames>) {
    this.commandsRoot = commandsRoot
    this.advancementJson = advancement

    const path = this.commandsRoot.Datapack.getResourcePath(name)

    this.path = path

    this.commandsRoot.Datapack.addResource(name, 'advancements', {
      advancement,
      children: new Map(),
      isResource: true,
      path: path.fullPathWithNamespace,
    })
  }

  get name(): string {
    return toMcFunctionName(this.path.fullPathWithNamespace)
  }

  /**
   * Grant this achievement to the players.
   */
  grant(players: MultiplePlayersArgument, criterion?: CriteriaNames) {
    this.commandsRoot.advancement.grant(players).only(this.name, criterion)
  }

  /**
   * Revoke this achievement from the players.
   */
  revoke(players: MultiplePlayersArgument, criterion?: CriteriaNames) {
    this.commandsRoot.advancement.revoke(players).only(this.name, criterion)
  }

  /**
   * Grant all achievements until this one to the players.
   */
  grantUntilThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.grant(players).until(this.name)
  }

  /**
   * Revoke all achievements until this one from the players.
   */
  revokeUntilThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.revoke(players).until(this.name)
  }

  /**
   * Grant all achievements from this one to the players.
   */
  grantFromThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.grant(players).from(this.name)
  }

  /**
   * Revoke all achievements from this one from the players.
   */
  revokeFromThis(players: MultiplePlayersArgument) {
    this.commandsRoot.advancement.revoke(players).from(this.name)
  }
}
