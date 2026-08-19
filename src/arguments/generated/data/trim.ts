import type { PaletteRef } from 'sandstone/arguments/generated/assets/atlas.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { NamespacedString } from 'sandstone'

export type ArmorMaterial = ('leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'turtle')

export type OldTrimMaterialOverrides = ({
  [Key in Extract<(ArmorMaterial | `minecraft:${ArmorMaterial}`), string>]?: string
})

export type TrimMaterial = {
  /**
   * Palette ID which will be used in the resource pack.
   */
  palette: PaletteRef,
  /**
   * Text displayed in the item tooltip.
   */
  description: Text,
}

export type TrimMaterialOverrides = ({
  [Key in Extract<Registry['minecraft:equipment'], string>]?: string
})

export type TrimPattern = ({
  /**
   * ID of the pattern that will be used in the resource pack as an overlay on the armor. \
   * The texture is located under `trims/entity/<layer>/`.
   */
  asset_id: NamespacedString,
} & {
  /**
   * Text displayed in the item tooltip.
   */
  description: Text,
  /**
   * Whether the pattern texture will be masked based on the underlying armor. Defaults to `false`.
   */
  decal?: boolean,
})
