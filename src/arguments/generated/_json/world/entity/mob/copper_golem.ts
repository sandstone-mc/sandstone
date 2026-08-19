import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTLong } from 'sandstone'

export type JsonCopperGolem = (JsonMobBase & {
  /**
   * Gametime in ticks when the copper golem oxidizes. \
   * `-2` represents "waxed" \
   * `-1` will be replaced with a random time between 504000 and 552000 ticks later
   *
   * Value:
   * Range: -2..
   */
  next_weather_age?: (NBTLong<{}> | number),
  /**
   * Value:
   *
   *  - Unaffected(`unaffected`)
   *  - Exposed(`exposed`)
   *  - Weathered(`weathered`)
   *  - Oxidized(`oxidized`)
   */
  weather_state?: JsonWeatherState,
})

export type JsonWeatherState = ('unaffected' | 'exposed' | 'weathered' | 'oxidized')
