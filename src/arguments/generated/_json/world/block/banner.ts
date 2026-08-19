import type { JsonBannerPattern } from 'sandstone/arguments/generated/_json/data/variants/banner_pattern.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDyeColor } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonBlockEntity, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { BannerPatternClass } from 'sandstone'

export type JsonBanner = (JsonBlockEntity & JsonNameable & {
  patterns?: Array<JsonBannerPatternLayer>,
})

export type JsonBannerPatternLayer = {
  /**
   * The dye color of the pattern.
   *
   * Value:
   *
   *  - White(`white`)
   *  - Orange(`orange`)
   *  - Magenta(`magenta`)
   *  - LightBlue(`light_blue`)
   *  - Yellow(`yellow`)
   *  - Lime(`lime`)
   *  - Pink(`pink`)
   *  - Gray(`gray`)
   *  - LightGray(`light_gray`)
   *  - Cyan(`cyan`)
   *  - Purple(`purple`)
   *  - Blue(`blue`)
   *  - Brown(`brown`)
   *  - Green(`green`)
   *  - Red(`red`)
   *  - Black(`black`)
   */
  color: JsonDyeColor,
  /**
   * The banner pattern.
   */
  pattern: ((JsonRegistry['minecraft:banner_pattern'] | BannerPatternClass) | JsonBannerPattern),
}

export type JsonBannerPatternType = (
  | 'bs'
  | 'ts'
  | 'ls'
  | 'rs'
  | 'cs'
  | 'ms'
  | 'drs'
  | 'dls'
  | 'ss'
  | 'cr'
  | 'sc'
  | 'ld'
  | 'rud'
  | 'lud'
  | 'rd'
  | 'vh'
  | 'vhr'
  | 'hh'
  | 'hhb'
  | 'bl'
  | 'br'
  | 'tl'
  | 'tr'
  | 'bt'
  | 'tt'
  | 'bts'
  | 'tts'
  | 'mc'
  | 'mr'
  | 'bo'
  | 'cbo'
  | 'bri'
  | 'gra'
  | 'gru'
  | 'cre'
  | 'sku'
  | 'flo'
  | 'moj'
  | 'glb'
  | 'pig')
