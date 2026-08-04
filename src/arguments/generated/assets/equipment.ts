import type { PaletteRef } from 'sandstone/arguments/generated/assets/atlas.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RGB } from 'sandstone/arguments/generated/util/color.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, TrimMaterialClass, TrimPatternClass } from 'sandstone'

export type Dyeable = {
  /**
   * If the item is not dyed, this color is used instead. \
   * If not specified and the item is not dyed, this layer will be hidden.
   */
  color_when_undyed?: RGB,
}

export type Equipment = {
  /**
   * List of layers for each model layer type.
   */
  layers: Layers,
}

export type Layer<T extends NBTObject> = ({
  /**
   * Texture location for this layer, inside `entity/equipment/<layer>/`.
   */
  texture: T,
} & {
  /**
   * If specified, this layer will be tinted by the color contained in the `dyed_color` component.
   */
  dyeable?: Dyeable,
})

export type Layers = {
  humanoid?: Array<Layer<NamespacedString>>,
  humanoid_leggings?: Array<Layer<NamespacedString>>,
  humanoid_baby?: Array<Layer<NamespacedString>>,
  wings?: Array<WingsLayer<NamespacedString>>,
  wolf_body?: Array<Layer<NamespacedString>>,
  horse_body?: Array<Layer<NamespacedString>>,
  llama_body?: Array<Layer<NamespacedString>>,
  happy_ghast_body?: Array<Layer<NamespacedString>>,
  nautilus_saddle?: Array<Layer<NamespacedString>>,
  nautilus_body?: Array<Layer<NamespacedString>>,
  pig_saddle?: Array<Layer<NamespacedString>>,
  strider_saddle?: Array<Layer<NamespacedString>>,
  camel_husk_saddle?: Array<Layer<NamespacedString>>,
  camel_saddle?: Array<Layer<NamespacedString>>,
  horse_saddle?: Array<Layer<NamespacedString>>,
  donkey_saddle?: Array<Layer<NamespacedString>>,
  mule_saddle?: Array<Layer<NamespacedString>>,
  zombie_horse_saddle?: Array<Layer<NamespacedString>>,
  skeleton_horse_saddle?: Array<Layer<NamespacedString>>,
}

export type TrimOverride = {
  when: {
    pattern?: (Registry['minecraft:trim_pattern'] | TrimPatternClass),
    material?: (Registry['minecraft:trim_material'] | TrimMaterialClass),
  },
  /**
   * When present, overrides the base texture provided by trim pattern. \
   * The texture is located under `trims/entity/<layer>/`.
   */
  texture?: NamespacedString,
  /**
   * When present, overrides the palette texture provided by trim material.
   */
  palette?: PaletteRef,
}

export type TrimPredicate = {
  pattern?: (Registry['minecraft:trim_pattern'] | TrimPatternClass),
  material?: (Registry['minecraft:trim_material'] | TrimMaterialClass),
}

export type WingsLayer<T extends NBTObject> = (Layer<T> & {
  /**
   * Whether this layer texture should be overridden by the player's custom elytra texture. \
   * Defaults to `false`.
   */
  use_player_texture?: boolean,
})
