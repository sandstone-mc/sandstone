import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { AdvancementJSON, MultiplePlayersArgument } from 'sandstone/arguments/index.js'
import type { ConditionClass } from 'sandstone/variables/index.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'

/**
 * A node representing a Minecraft advancement.
 */
export class AdvancementNode extends ContainerNode implements ResourceNode<AdvancementClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: AdvancementClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.advancementJSON)
}

export type AdvancementClassArguments<CriteriaNames extends string = string> = {
  /**
   * The advancement's JSON.
   */
  advancement?: AdvancementJSON<CriteriaNames>
} & ResourceClassArguments<'default'>

export class AdvancementClass<CriteriaNames extends string = string> extends ResourceClass<AdvancementNode> implements ConditionClass {
  public advancementJSON: NonNullable<AdvancementClassArguments['advancement']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: AdvancementClassArguments<CriteriaNames>) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'json' }, AdvancementNode, sandstoneCore.pack.resourceToPath(name, ['advancements']), args)

    this.advancementJSON = args.advancement as AdvancementJSON

    this.handleConflicts()
  }

  /**
   * Grant this advancement.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grant(players: MultiplePlayersArgument = '@s', criterion?: CriteriaNames) {
    this.pack.commands.advancement.grant(players).only(this.name, criterion)
  }

  /**
   * Revoke this advancement.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revoke(players: MultiplePlayersArgument = '@s', criterion?: CriteriaNames) {
    this.pack.commands.advancement.revoke(players).only(this.name, criterion)
  }

  /**
   * Grant this advancement and all its parent advancements.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grantUntilThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.grant(players).until(this.name)
  }

  /**
   * Revoke this advancement and all its parent advancements.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revokeUntilThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.revoke(players).until(this.name)
  }

  /**
   * Grant this advancement and all its children advancements.
   * Think of specifying everything *from* that advancement to the end.
   *
   * The exact order the operation is carried out in is specified `advancement > child > child's child > ...`.
   * When it operates on a child that branches, it iterates through all its children before continuing.
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grantFromThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.grant(players).from(this.name)
  }

  /**
   * Revoke this advancement and all its children advancements.
   * Think of specifying everything *from* that advancement to the end.
   *
   * The exact order the operation is carried out in is specified `advancement > child > child's child > ...`.
   * When it operates on a child that branches, it iterates through all its children before continuing.
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revokeFromThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.revoke(players).from(this.name)
  }

  /**
   * Grant this advancement, all its parent advancements, and all its children advancements.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with `until` specified, then with `from` specified:
   * `parent > parent's parent > ... > root > specified advancement > child > child's child > ...`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grantThroughThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.grant(players).through(this.name)
  }

  /**
   * Revoke this advancement, all its parent advancements, and all its children advancements.
   * Think of specifying everything through the specified advancement, going both backwards and forwards.
   *
   * The exact order the operation is as if the command were executed with `until` specified, then with `from` specified:
   * `parent > parent's parent > ... > root > specified advancement > child > child's child > ...`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revokeThroughThis(players: MultiplePlayersArgument = '@s') {
    this.pack.commands.advancement.revoke(players).through(this.name)
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.pack.conditions.Advancement(this.core, this.name)

  /**
   * Test if the currently executing player has a specific advancement criterion.
   */
  criterion(criterion: string) {
    return new this.pack.conditions.Advancement(this.core, this.name, criterion)
  }
}
