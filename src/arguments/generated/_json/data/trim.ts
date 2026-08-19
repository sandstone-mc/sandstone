import type { JsonPaletteRef } from 'sandstone/arguments/generated/_json/assets/atlas.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { NamespacedString } from 'sandstone'

export type JsonArmorMaterial = ('leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'turtle')

export type JsonOldTrimMaterialOverrides = ({
  [Key in Extract<(JsonArmorMaterial | `minecraft:${JsonArmorMaterial}`), string>]?: string
})

export type JsonTrimMaterial = {
  /**
   * Palette ID which will be used in the resource pack.
   */
  palette: JsonPaletteRef,
  /**
   * Text displayed in the item tooltip.
   */
  description: JsonText,
}

export type JsonTrimMaterialOverrides = ({
  [Key in Extract<JsonRegistry['minecraft:equipment'], string>]?: string
})

export type JsonTrimPattern = ({
  /**
   * ID of the pattern that will be used in the resource pack as an overlay on the armor. \
   * The texture is located under `trims/entity/<layer>/`.
   */
  asset_id: NamespacedString,
} & {
  /**
   * Text displayed in the item tooltip.
   */
  description: JsonText,
  /**
   * Whether the pattern texture will be masked based on the underlying armor. Defaults to `false`.
   */
  decal?: boolean,
})
