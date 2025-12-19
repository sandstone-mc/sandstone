import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTFloat, NBTInt } from 'sandstone'

export type AttributeTrackBase = {
    /**
     * Defaults to `linear`.
     * For visualization, check out: https://easings.net/
     */
    ease?: EasingType
}

export type CubicBezierEase = {
    /**
     * `[x1, y1, x2, y2]`
     * For an easy GUI, check out: https://cubic-bezier.com/
     *
     * Value:
     * Range: 0..1
     *
     * *or*
     *
     * *item 1*
     *
     * *or*
     *
     * Range: 0..1
     *
     * *or*
     *
     * *item 3*
     */
    cubic_bezier: [
        NBTFloat<{
            leftExclusive: false
            rightExclusive: false
            min: 0
            max: 1
        }>,
        NBTFloat,
        NBTFloat<{
            leftExclusive: false
            rightExclusive: false
            min: 0
            max: 1
        }>,
        NBTFloat,
    ]
}

/**
 * *either*
 *
 *
 *
 * *or*
 *
 * *item 1*
 */
export type EasingType = (SimpleEasingType | CubicBezierEase)

export type EnvironmentAttributeTrackMap = ({
    [Key in Extract<Registry['minecraft:environment_attribute'], string>]?: (Key extends keyof Dispatcher<'minecraft:environment_attribute'> ?
        ('attribute_track' extends keyof Dispatcher<'minecraft:environment_attribute'>[Key]
            ? Dispatcher<'minecraft:environment_attribute'>[Key]['attribute_track']
            : Record<string, unknown>)
        : Record<string, unknown>);
})

export type SimpleEasingType = (
  | 'constant'
  | 'linear'
  | 'in_back'
  | 'in_bounce'
  | 'in_circ'
  | 'in_cubic'
  | 'in_elastic'
  | 'in_expo'
  | 'in_quad'
  | 'in_quart'
  | 'in_quint'
  | 'in_sine'
  | 'in_out_back'
  | 'in_out_bounce'
  | 'in_out_circ'
  | 'in_out_cubic'
  | 'in_out_elastic'
  | 'in_out_expo'
  | 'in_out_quad'
  | 'in_out_quart'
  | 'in_out_quint'
  | 'in_out_sine'
  | 'out_back'
  | 'out_bounce'
  | 'out_circ'
  | 'out_cubic'
  | 'out_elastic'
  | 'out_expo'
  | 'out_quad'
  | 'out_quart'
  | 'out_quint'
  | 'out_sine')

export type Timeline = {
    /**
     * When not present, the timeline will not repeat.
     *
     * Value:
     * Range: 1..
     */
    period_ticks?: NBTInt<{
        min: 1
    }>
    tracks?: EnvironmentAttributeTrackMap
}
