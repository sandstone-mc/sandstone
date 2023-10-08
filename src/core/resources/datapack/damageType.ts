/* eslint-disable max-len */
import { toMinecraftResourceName } from 'sandstone/utils'

import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'
import type { TagClass } from './tag.js'
import type {
  Coordinates, DamageTypeJSON, SingleEntityArgument, TAG_DAMAGE_TYPES,
} from 'sandstone/arguments'
import type { ComponentClass } from 'sandstone/variables'

const damageTypes: Map<string, TagClass<'damage_types'>> = new Map()

/**
 * A node representing a Minecraft damage type.
 */
export class DamageTypeNode extends ContainerNode implements ResourceNode<DamageTypeClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: DamageTypeClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.damageTypeJSON)
}

export type DamageTypeClassArguments = {
  /**
   * The damage type's JSON.
   */
  damageType?: DamageTypeJSON
} & ResourceClassArguments<'default'> & {
  /**
   * Optional. Automatically adds damage type to minecraft damage type group tag flags.
   */
  flags?: TAG_DAMAGE_TYPES[]
}

export class DamageTypeClass extends ResourceClass<DamageTypeNode> implements ComponentClass {
  public damageTypeJSON: NonNullable<DamageTypeClassArguments['damageType']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: DamageTypeClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'json' }, DamageTypeNode, sandstoneCore.pack.resourceToPath(name, ['trim_materials']), args)

    this.damageTypeJSON = args.damageType as DamageTypeJSON

    if (args.flags) {
      for (const flag of args.flags) {
        let tag = damageTypes.get(flag)
        if (!tag) {
          damageTypes.set(flag, sandstoneCore.pack.Tag('damage_types', `minecraft:${flag}`, []))
          tag = damageTypes.get(flag)
        }
        tag?.push(this.name)
      }
    }

    this.handleConflicts()
  }

  get translationKey() {
    return `death.attack.${this.damageTypeJSON.message_id}${this.damageTypeJSON.death_message_type === 'intentional_game_design' ? '.link' : ''}`
  }

  damage(amount: number, context?: 'entity' | 'at', source?: Coordinates | SingleEntityArgument, cause?: SingleEntityArgument): void

  damage(target: SingleEntityArgument, amount: number, context?: 'entity' | 'at', source?: Coordinates | SingleEntityArgument, cause?: SingleEntityArgument): void

  damage(...args: [amount: number, context?: 'entity' | 'at', source?: Coordinates | SingleEntityArgument, cause?: SingleEntityArgument] | [target: SingleEntityArgument, amount: number, context?: 'entity' | 'at', source?: Coordinates | SingleEntityArgument, cause?: SingleEntityArgument]) {
    const command = this.core.pack.commands.damage
    if (typeof args[0] === 'number') {
      if (args[1] === 'entity') {
        if (args[3]) {
          return command('@s', args[0], this).by(args[2] as SingleEntityArgument).from(args[3])
        }
        return command('@s', args[0], this).by(args[2] as SingleEntityArgument)
      }
      if (args[1] === 'at') {
        return command('@s', args[0], this).at(args[1] as Coordinates)
      }
      return command('@s', args[0], this)
    }
    if (args[2] === 'entity') {
      if (args[4]) {
        return command(args[0], args[1] as number, this).by(args[2] as SingleEntityArgument).from(args[4])
      }
      return command(args[0], args[1] as number, this).by(args[2] as SingleEntityArgument)
    }
    return command(args[0], args[1] as number, this)
  }

  /** @internal */
  _toChatComponent = () => ({ translate: this.translationKey })

  toString = () => toMinecraftResourceName(this.path)
}
