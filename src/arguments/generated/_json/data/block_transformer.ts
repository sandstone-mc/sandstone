import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonBlockStateProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { LootTableClass, NBTInt } from 'sandstone'

export type JsonBlockTransformData = {
  /**
   * If the provider returns no result, the next transformer will be attempted.
   */
  block_state_provider: JsonBlockStateProvider,
  /**
   * Defaults to not playing sound.
   */
  sound?: JsonSoundEventRef,
  /**
   * Defaults to `none`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Scrape(`scrape`)
   *  - WaxOn(`wax_on`)
   *  - WaxOff(`wax_off`)
   */
  particle?: JsonBlockTransformParticle,
  /**
   * If a disallowed face is interacted with, the next transformer will be attempted. \
   * Defaults to empty (allowing all faces).
   */
  disallowed_faces?: Array<JsonDirection>,
  /**
   * The loot to drop on a successful transformation. \
   * Defaults to drop nothing.
   */
  loot?: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
  /**
   * Where the `loot` should drop. \
   * Defaults to `from_middle`.
   *
   * Value:
   *
   *  - ClickedFace(`clicked_face`)
   *  - FromMiddle(`from_middle`)
   */
  drop_strategy?: JsonBlockTransformDropStrategy,
  /**
   * How nearby blocks are affected by the transformation. \
   * Defaults to `single_block`.
   *
   * Value:
   *
   *  - SingleBlock(`single_block`)
   *  - CopperChest(`copper_chest`): If the original block and the transformed block are both copper chests of any kind, the transform applies to the other half of the double chest.
   */
  transform_type?: JsonBlockTransformType,
  /**
   * Whether the transformed block should update based on neighboring blocks. \
   * Defaults to `true`.
   */
  update_from_neighbors?: boolean,
  /**
   * Only has effect on stackable items. \
   * Defaults to `true`.
   */
  consume_on_use?: boolean,
  /**
   * Only has effect on unstackable items. \
   * Defauls to 1.
   *
   * Value:
   * Range: 0..
   */
  item_damage_per_use?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonBlockTransformDropStrategy = ('clicked_face' | 'from_middle')

export type JsonBlockTransformParticle = ('none' | 'scrape' | 'wax_on' | 'wax_off')

export type JsonBlockTransformType = ('single_block' | 'copper_chest')
