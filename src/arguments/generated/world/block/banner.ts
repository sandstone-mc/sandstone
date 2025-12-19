import type { BannerPattern } from 'sandstone/generated/data/variants/banner_pattern'
import type { Registry } from 'sandstone/generated/registry'
import type { DyeColor } from 'sandstone/generated/util/color'
import type { BlockEntity, Nameable } from 'sandstone/generated/world/block'

export type Banner = (BlockEntity & Nameable & {
    patterns?: Array<BannerPatternLayer>
})

export type BannerPatternLayer = {
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
    color: DyeColor
    /**
     * The banner pattern.
     */
    pattern: (Registry['minecraft:banner_pattern'] | BannerPattern)
}

export type BannerPatternType = (
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
