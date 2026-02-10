import { getResourceType, RESOURCE_PATHS, type MultiplePlayersArgumentOf, type SymbolResource } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft advancement.
 */
export class AdvancementNode extends ContainerNode implements ResourceNode<AdvancementClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: AdvancementClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.advancementJSON)
}

export type AdvancementClassArguments<AdvancementJSON extends SymbolResource['advancement'] | undefined = undefined> = {
  /**
   * The advancement's JSON.
   */
  advancement: AdvancementJSON
} & ResourceClassArguments<'default'>

export class AdvancementClass<AdvancementJSON extends SymbolResource['advancement'] | undefined = undefined>
  extends ResourceClass<AdvancementNode>
  implements ConditionClass {
  public advancementJSON: AdvancementClassArguments<AdvancementJSON>['advancement']

  constructor(sandstoneCore: SandstoneCore, name: string, args: AdvancementClassArguments<AdvancementJSON>) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      AdvancementNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[getResourceType(AdvancementClass)].path), // TODO: Ideally we could just put `this`, not `AdvancementClass`
      args,
    )

    this.advancementJSON = args.advancement

    this.handleConflicts()
  }

  /**
   * Grant this advancement.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grant<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>, criterion?: AdvancementJSON extends undefined ? `${any}${string}` : keyof NonNullable<AdvancementJSON>['criteria']) {
    this.pack.commands.advancement.grant(players as any).only(this.name, criterion)
  }

  /**
   * Revoke this advancement.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revoke<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>, criterion?: AdvancementJSON extends undefined ? `${any}${string}` : keyof NonNullable<AdvancementJSON>['criteria']) {
    this.pack.commands.advancement.revoke(players as any).only(this.name, criterion)
  }

  /**
   * Grant this advancement and all its parent advancements.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  grantUntilThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
    this.pack.commands.advancement.grant(players as any).until(this.name)
  }

  /**
   * Revoke this advancement and all its parent advancements.
   * Think of specifying everything from the start *until* that advancement.
   *
   * The exact order the operation is carried out in is: `parent > parent's parent > ... > root > this advancement.`
   *
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  revokeUntilThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
    this.pack.commands.advancement.revoke(players as any).until(this.name)
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
  grantFromThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
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
  revokeFromThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>){
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
  grantThroughThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
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
  revokeThroughThis<T extends string = '@s'>(players: MultiplePlayersArgumentOf<false, T> = '@s' as MultiplePlayersArgumentOf<false, T>) {
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
