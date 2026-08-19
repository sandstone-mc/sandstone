import type { JsonSymbolEnvironmentAttribute } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NBTFloat, NBTInt, NonEmptyString, WorldClockClass } from 'sandstone'

export type JsonAttributeTrackBase = {
  /**
   * Defaults to `linear`.
   * For visualization, check out: https://easings.net/
   */
  ease?: JsonEasingType,
}

export type JsonCubicBezierEase = {
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
    (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number),
    (NBTFloat | number),
    (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number),
    (NBTFloat | number)
  ],
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
export type JsonEasingType = (JsonSimpleEasingType | JsonCubicBezierEase)

export type JsonEnvironmentAttributeTrackMap = ({
  [Key in Extract<JsonRegistry['minecraft:environment_attribute'], string>]?: (Key extends keyof JsonSymbolEnvironmentAttribute ?
    ('attribute_track' extends keyof JsonSymbolEnvironmentAttribute[Key]
      ? JsonSymbolEnvironmentAttribute[Key]['attribute_track']
      : JsonSymbolEnvironmentAttribute<'%unknown'>)
    : JsonSymbolEnvironmentAttribute<'%unknown'>)
})

export type JsonSimpleEasingType = (
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

export type JsonTimeline = {
  /**
   * When not present, the timeline will not repeat.
   *
   * Value:
   * Range: 1..
   */
  period_ticks?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * The world clock this timeline is tied to.
   */
  clock: (JsonRegistry['minecraft:world_clock'] | WorldClockClass),
  time_markers?: JsonTimeMarkerMap,
  tracks?: JsonEnvironmentAttributeTrackMap,
}

export type JsonTimeMarker = {
  /**
   * Value:
   * Range: 0..
   */
  ticks: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Whether the time marker shows up in command suggestions. \
   * The time marker is still available in commands even if it is not suggested. \
   * Defaults to `false`.
   */
  show_in_commands?: boolean,
}

export type JsonTimeMarkerMap = ({
  [Key in Extract<NonEmptyString, string>]?: ((NBTInt<{
    min: 0,
  }> | number) | JsonTimeMarker)
})
