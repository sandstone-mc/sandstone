import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { HorizontalDirectionByte } from 'sandstone/arguments/generated/util/direction.ts'
import type { BlockAttachedEntity } from 'sandstone/arguments/generated/world/entity.ts'
import type { VariantClass } from 'sandstone'

export type Painting = (BlockAttachedEntity & {
  /**
   * Direction it is facing.
   *
   * Value:
   *
   *  - South(`0`)
   *  - West(`1`)
   *  - North(`2`)
   *  - East(`3`)
   */
  facing?: HorizontalDirectionByte,
  /**
   * Type of painting.
   */
  variant?: (Registry['minecraft:painting_variant'] | VariantClass<'painting'>),
})
