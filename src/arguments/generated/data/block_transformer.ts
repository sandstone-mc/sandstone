import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { BlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature/block_state_provider.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Direction } from 'sandstone/arguments/generated/util/direction.ts'
import type { LootTableClass, NBTInt } from 'sandstone'

export type BlockTransformData = {
  /**
   * If the provider returns no result, the next transformer will be attempted.
   */
  block_state_provider: BlockStateProvider,
  /**
   * Defaults to not playing sound.
   */
  sound?: SoundEventRef,
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
  particle?: BlockTransformParticle,
  /**
   * If a disallowed face is interacted with, the next transformer will be attempted. \
   * Defaults to empty (allowing all faces).
   */
  disallowed_faces?: Array<Direction>,
  /**
   * The loot to drop on a successful transformation. \
   * Defaults to drop nothing.
   */
  loot?: (Registry['minecraft:loot_table'] | LootTableClass),
  /**
   * Where the `loot` should drop. \
   * Defaults to `from_middle`.
   *
   * Value:
   *
   *  - ClickedFace(`clicked_face`)
   *  - FromMiddle(`from_middle`)
   */
  drop_strategy?: BlockTransformDropStrategy,
  /**
   * How nearby blocks are affected by the transformation. \
   * Defaults to `single_block`.
   *
   * Value:
   *
   *  - SingleBlock(`single_block`)
   *  - CopperChest(`copper_chest`): If the original block and the transformed block are both copper chests of any kind, the transform applies to the other half of the double chest.
   */
  transform_type?: BlockTransformType,
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
  item_damage_per_use?: NBTInt<{
    min: 0,
  }>,
}

export type BlockTransformDropStrategy = ('clicked_face' | 'from_middle')

export type BlockTransformParticle = ('none' | 'scrape' | 'wax_on' | 'wax_off')

export type BlockTransformType = ('single_block' | 'copper_chest')
