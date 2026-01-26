export type BannerPattern = {
  /**
   * Also resolves to `assets/<namespace>/textures/entity/shield/<name>.png`.
   *
   * Value:
   *
   * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/banner/`
   */
  asset_id: `${string}:${string}`,
  /**
   * Translation key prefix per dye color (e.g. `block.minecraft.banner.custom.pattern` resolves to `block.minecraft.banner.custom.pattern.<dye color>`).
   */
  translation_key: string,
}
