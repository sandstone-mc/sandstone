/* eslint-disable camelcase */
import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS, JsonTextComponent, NBT } from '@arguments'
import type { MCFunctionInstance } from '@datapack/Datapack'
import type { AdvancementClass } from '@resources'
import type { AdvancementTriggers } from './AdvancementTriggers'

/** A representation of a Minecraft advancement. */
export interface AdvancementType<CRITERIA_NAMES extends string = string> {
  /** The optional display data. */
  display?: {
    /** The data for the icon. */
    icon: {
      /** The item id. */
      item: LiteralUnion<ITEMS>

      /** The nbt data of the item. Must be a string. */
      nbt?: string
    }

    /** The title for this advancement. */
    title: JsonTextComponent

    /**
     * The optional type of frame for the icon.
     * `challenge` for a tile with a more fancy spiked border as it is used for the kill all mobs advancement,
     * `goal` for a tile with a rounded border as it is used for the full beacon advancement,
     * `task` for a normal tile (default.)
     */
    frame?: 'challenge' | 'goal' | 'task'

    /** The description of the advancement. */
    description: JsonTextComponent

    /** Whether or not to show the toast pop up after completing this advancement. Defaults to `true`. */
    show_toast?: boolean

    /** Whether or not to announce in the chat when this advancement has been completed. Defaults to `true`. */
    announce_to_chat?: boolean

    /**
     * Whether or not to hide this advancement and all its children from the advancement screen,
     * until this advancement have been completed.
     * Has no effect on root advancements themselves, but still affects all their children.
     * Defaults to `false`.
     */
    hidden?: boolean

    /** The optional directory for the background to use in this advancement tab (used only for the root advancement). */
    background?: string
  }

  /**
   * The required criteria that have to be met.
   *
   * Must be an object: the keys are the criteria names, the values are objects with a `trigger` and `conditions`.
   *
   * @example
   *
   * {
   *   criteria: {
   *     bred_two_cows: {
   *       trigger: 'minecraft:bred_animals',
   *       conditions: { ... },
   *     }
   *   }
   * }
   */
  criteria: Record<CRITERIA_NAMES, AdvancementTriggers>

  /**
   * An optional list of requirements (all the <criteriaNames>).
   * If all criteria are required, this may be omitted.
   * With multiple criteria: requirements contains a list of lists with criteria (all criteria need to be mentioned).
   * If all of the lists each have any criteria met, the advancement is complete.
   * (basically AND grouping of OR groups)
   */
  requirements?: (keyof this['criteria'])[] | (keyof this['criteria'])[][]

  /** An optional object representing the rewards provided when this advancement is obtained. */
  rewards?: {
    /** A list of recipes to unlock. */
    recipes?: string[]

    /** A list of loot tables to give to the player. */
    loot?: string[]

    /** An amount of experience. */
    experience?: number

    /** A function to run. Function tags are not allowed. */
    function?: string | MCFunctionInstance
  }

  /**
   * The optional parent advancement directory of this advancement.
   * If this field is absent, this advancement is a root advancement.
   * Circular references cause a loading failure.
   */
  parent?: string | AdvancementClass<string>
}
