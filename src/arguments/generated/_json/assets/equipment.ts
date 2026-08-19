import type { JsonPaletteRef } from 'sandstone/arguments/generated/_json/assets/atlas.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JSONRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, TrimMaterialClass, TrimPatternClass } from 'sandstone'

export type JsonDyeable = {
  /**
   * If the item is not dyed, this color is used instead. \
   * If not specified and the item is not dyed, this layer will be hidden.
   */
  color_when_undyed?: JSONRGB,
}

export type JsonEquipment = {
  /**
   * List of layers for each model layer type.
   */
  layers: JsonLayers,
  /**
   * Replaces trim texture based on armor trim. \
   * Only the first entry that matches is applied.
   */
  trim_overrides?: Array<JsonTrimOverride>,
}

export type JsonLayer<T extends JsonNBTObject> = ({
  /**
   * Texture location for this layer, inside `entity/equipment/<layer>/`.
   */
  texture: T,
} & {
  /**
   * If specified, this layer will be tinted by the color contained in the `dyed_color` component.
   */
  dyeable?: JsonDyeable,
})

export type JsonLayers = {
  humanoid?: Array<JsonLayer<NamespacedString>>,
  humanoid_leggings?: Array<JsonLayer<NamespacedString>>,
  humanoid_baby?: Array<JsonLayer<NamespacedString>>,
  wings?: Array<JsonWingsLayer<NamespacedString>>,
  wolf_body?: Array<JsonLayer<NamespacedString>>,
  horse_body?: Array<JsonLayer<NamespacedString>>,
  llama_body?: Array<JsonLayer<NamespacedString>>,
  happy_ghast_body?: Array<JsonLayer<NamespacedString>>,
  nautilus_saddle?: Array<JsonLayer<NamespacedString>>,
  nautilus_body?: Array<JsonLayer<NamespacedString>>,
  pig_saddle?: Array<JsonLayer<NamespacedString>>,
  strider_saddle?: Array<JsonLayer<NamespacedString>>,
  camel_husk_saddle?: Array<JsonLayer<NamespacedString>>,
  camel_saddle?: Array<JsonLayer<NamespacedString>>,
  horse_saddle?: Array<JsonLayer<NamespacedString>>,
  donkey_saddle?: Array<JsonLayer<NamespacedString>>,
  mule_saddle?: Array<JsonLayer<NamespacedString>>,
  zombie_horse_saddle?: Array<JsonLayer<NamespacedString>>,
  skeleton_horse_saddle?: Array<JsonLayer<NamespacedString>>,
}

export type JsonTrimOverride = {
  when: {
    pattern?: (JsonRegistry['minecraft:trim_pattern'] | TrimPatternClass),
    material?: (JsonRegistry['minecraft:trim_material'] | TrimMaterialClass),
  },
  /**
   * When present, overrides the base texture provided by trim pattern. \
   * The texture is located under `trims/entity/<layer>/`.
   */
  texture?: NamespacedString,
  /**
   * When present, overrides the palette texture provided by trim material.
   */
  palette?: JsonPaletteRef,
}

export type JsonTrimPredicate = {
  pattern?: (JsonRegistry['minecraft:trim_pattern'] | TrimPatternClass),
  material?: (JsonRegistry['minecraft:trim_material'] | TrimMaterialClass),
}

export type JsonWingsLayer<T extends JsonNBTObject> = (JsonLayer<T> & {
  /**
   * Whether this layer texture should be overridden by the player's custom elytra texture. \
   * Defaults to `false`.
   */
  use_player_texture?: boolean,
})
