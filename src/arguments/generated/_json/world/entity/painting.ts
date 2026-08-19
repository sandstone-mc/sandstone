import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonHorizontalDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonBlockAttachedEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { VariantClass } from 'sandstone'

export type JsonPainting = (JsonBlockAttachedEntity & {
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
  facing?: JsonHorizontalDirectionByte,
  /**
   * Type of painting.
   */
  variant?: (JsonRegistry['minecraft:painting_variant'] | VariantClass<'painting'>),
})
