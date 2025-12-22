import type { RGB } from 'sandstone/arguments/generated/util/color.js'

export type Dyeable = {
  /**
     * If specified, this layer will be tinted by the color contained in the `dyed_color` component.
     * If the item is not dyeable or not dyed, it will be tinted by this color.
     * If not specified and the item is not dyed, the layer will be hidden.
     */
  color_when_undyed?: RGB
}

export type Equipment = {
  /**
     * List of layers for each model layer type.
     */
  layers: Layers
}

export type Layer<T> = {
  /**
     * Texture location for this layer, inside `entity/equipment/<layer>/`.
     */
  texture: T
  /**
     * Configures how this layer behaves when dyed (in the `#dyeable` item tag, and has the `dyed_color` component).
     */
  dyeable?: Dyeable
}

export type Layers = {
  humanoid?: Array<Layer<`${string}:${string}`>>
  humanoid_leggings?: Array<Layer<`${string}:${string}`>>
  wings?: Array<WingsLayer<`${string}:${string}`>>
  wolf_body?: Array<Layer<`${string}:${string}`>>
  horse_body?: Array<Layer<`${string}:${string}`>>
  llama_body?: Array<Layer<`${string}:${string}`>>
  happy_ghast_body?: Array<Layer<`${string}:${string}`>>
  pig_saddle?: Array<Layer<`${string}:${string}`>>
  strider_saddle?: Array<Layer<`${string}:${string}`>>
  camel_husk_saddle?: Array<Layer<`${string}:${string}`>>
  camel_saddle?: Array<Layer<`${string}:${string}`>>
  horse_saddle?: Array<Layer<`${string}:${string}`>>
  donkey_saddle?: Array<Layer<`${string}:${string}`>>
  mule_saddle?: Array<Layer<`${string}:${string}`>>
  zombie_horse_saddle?: Array<Layer<`${string}:${string}`>>
  skeleton_horse_saddle?: Array<Layer<`${string}:${string}`>>
}

export type WingsLayer<T> = (Layer<T> & {
  /**
     * Whether this layer texture should be overridden by the player's custom elytra texture.
     * Defaults to `false`.
     */
  use_player_texture?: boolean
})
