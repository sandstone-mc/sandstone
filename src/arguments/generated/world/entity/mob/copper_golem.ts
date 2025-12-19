import type { MobBase } from 'sandstone/generated/world/entity/mob'
import type { NBTLong } from 'sandstone'

export type CopperGolem = (MobBase & {
    /**
     * Gametime in ticks when the copper golem oxidizes
     * -2 represents "waxed"
     * -1 will be replaced with a random time between 504000 and 552000 ticks later
     *
     * Value:
     * Range: -2..
     */
    next_weather_age?: NBTLong<{}>
    /**
     * Value:
     *
     *  - Unaffected(`unaffected`)
     *  - Exposed(`exposed`)
     *  - Weathered(`weathered`)
     *  - Oxidized(`oxidized`)
     */
    weather_state?: WeatherState
})

export type WeatherState = ('unaffected' | 'exposed' | 'weathered' | 'oxidized')
