import type { SymbolEnvironmentAttribute } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
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
  [Key in Extract<Registry['minecraft:environment_attribute'], string>]?: (Key extends keyof SymbolEnvironmentAttribute ?
    ('attribute_track' extends keyof SymbolEnvironmentAttribute[Key]
      ? SymbolEnvironmentAttribute[Key]['attribute_track']
      : SymbolEnvironmentAttribute<'%unknown'>)
    : SymbolEnvironmentAttribute<'%unknown'>);
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
  /**
   * The world clock this timeline is tied to.
   */
  clock: `${string}:${string}`
  time_markers?: TimeMarkerMap
  tracks?: EnvironmentAttributeTrackMap
}

export type TimeMarker = {
  /**
   * Value:
   * Range: 0..
   */
  ticks: NBTInt<{
    min: 0
  }>
  /**
   * Whether the time marker shows up in command suggestions. \
   * The time marker is still available in commands even if it is not suggested. \
   * Defaults to `false`.
   */
  show_in_commands?: boolean
}

export type TimeMarkerMap = ({
  [Key in Extract<`${any}${string}`, string>]?: (NBTInt<{
    min: 0
  }> | TimeMarker);
})
