import type { NamespacedString } from 'sandstone'

export type JsonBannerPattern = {
  /**
   * Also resolves to `assets/<namespace>/textures/entity/shield/<name>.png`.
   *
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/banner/`
   */
  asset_id: NamespacedString,
  /**
   * Translation key prefix per dye color (e.g. `block.minecraft.banner.custom.pattern` resolves to `block.minecraft.banner.custom.pattern.<dye color>`).
   */
  translation_key: string,
}
