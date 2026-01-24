/* eslint-disable max-len */

import type { Coordinates, SingleEntityArgument, SymbolResource } from 'sandstone/arguments'
import type { SetType } from 'sandstone/utils'
import { toMinecraftResourceName } from 'sandstone/utils'
import type { ComponentClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'
import type { TagClass } from './tag'
import type { TAG_DAMAGE_TYPES_SET } from 'sandstone/arguments/generated/_registry/tag_damage_types'

const damageTypes: Map<string, TagClass<'damage_type'>> = new Map()

/**
 * A node representing a Minecraft damage type.
 */
export class DamageTypeNode extends ContainerNode implements ResourceNode<DamageTypeClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: DamageTypeClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.damageTypeJSON)
}

export type DamageTypeClassArguments = {
  /**
   * The damage type's JSON.
   */
  damageType: SymbolResource['damage_type']
} & ResourceClassArguments<'default'> & {
    /**
     * Optional. Automatically adds damage type to minecraft damage type group tag flags.
     */
    flags?: (SetType<typeof TAG_DAMAGE_TYPES_SET> | 'bypasses_cooldown')[] // Haha funny bypasses_cooldown doesn't show up in the server reports
  }

export class DamageTypeClass extends ResourceClass<DamageTypeNode> implements ComponentClass {
  public damageTypeJSON: DamageTypeClassArguments['damageType']

  constructor(sandstoneCore: SandstoneCore, name: string, args: DamageTypeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      DamageTypeNode,
      sandstoneCore.pack.resourceToPath(name, ['damage_type']),
      args,
    )

    this.damageTypeJSON = args.damageType

    if (args.flags) {
      for (const flag of args.flags) {
        let tag = damageTypes.get(flag)
        if (!tag) {
          damageTypes.set(flag, sandstoneCore.pack.Tag('damage_type', `minecraft:${flag}`, []))
          tag = damageTypes.get(flag)
        }
        tag!.push(this)
      }
    }

    this.handleConflicts()
  }

  get translationKey() {
    return `death.attack.${this.damageTypeJSON.message_id}${this.damageTypeJSON.death_message_type === 'intentional_game_design' ? '.link' : ''}`
  }

  damage(
    amount: number,
    context?: 'entity' | 'at',
    source?: Coordinates<false> | SingleEntityArgument<false>,
    cause?: SingleEntityArgument<false>,
  ): void

  damage(
    target: SingleEntityArgument<false>,
    amount: number,
    context?: 'entity' | 'at',
    source?: Coordinates<false> | SingleEntityArgument<false>,
    cause?: SingleEntityArgument<false>,
  ): void

  damage(
    ...args:
      | [
          amount: number,
          context?: 'entity' | 'at',
          source?: Coordinates<false> | SingleEntityArgument<false>,
          cause?: SingleEntityArgument<false>,
        ]
      | [
          target: SingleEntityArgument<false>,
          amount: number,
          context?: 'entity' | 'at',
          source?: Coordinates<false> | SingleEntityArgument<false>,
          cause?: SingleEntityArgument<false>,
        ]
    // eslint-disable-next-line function-paren-newline
  ) {
    const command = this.core.pack.commands.damage
    if (typeof args[0] === 'number') {
      if (args[1] === 'entity') {
        if (args[3]) {
          return command('@s', args[0], this)
            .by(args[2] as SingleEntityArgument<false>)
            .from(args[3])
        }
        return command('@s', args[0], this).by(args[2] as SingleEntityArgument<false>)
      }
      if (args[1] === 'at') {
        return command('@s', args[0], this).at(args[1] as Coordinates<false>)
      }
      return command('@s', args[0], this)
    }
    if (args[2] === 'entity') {
      if (args[4]) {
        return command(args[0], args[1] as number, this)
          .by(args[2] as SingleEntityArgument<false>)
          .from(args[4])
      }
      return command(args[0], args[1] as number, this).by(args[2] as SingleEntityArgument<false>)
    }
    return command(args[0], args[1] as number, this)
  }

  /** @internal */
  _toChatComponent = () => ({ translate: this.translationKey })

  toString = () => toMinecraftResourceName(this.path)
}
