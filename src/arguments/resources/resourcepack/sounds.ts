import type { SOUND_TYPES } from '../../basics'

/** Assumed to be in `minecraft`, namespace can be defined with `:`. */
type SoundEvent = `${SOUND_TYPES}.${string}`

export type SoundsDefinitions = {
  [key: SoundEvent]: {
    /**
     * Optional. If true the sounds listed should replace the ones listed in the minecraft sounds.json for this sound event.
     * False if the sounds listed should be added. If undefined. Defaults to false.
     */
    replace?: boolean
    /**
     * Optional. Translated as the subtitle when Show Subtitles is enabled. Section sign formatting codes are supported.
     */
    subtitle?: string
    /**
     * Optional. The sound files this sound event uses. One sound is randomly selected to play when the event is triggered. Defaults to assumed path.
     */
    sounds: SoundEvent[] | {
      name: SoundEvent

      /** Optional. Value is a decimal between 0.0 and 1.0. Defaults to 1.0. */
      volume?: number

      /** Optional. Default is 1.0. */
      pitch?: number

      /** An integer. Chance that this sound is selected to play. Defaults to 1.*/
      weight: number

      /**
       * Optional. If true it will be streamed from its file. Sounds longer than a few seconds should enable this to avoid lag. Defaults to false.
       *
       * When false many instances of the sound can be ran at the same time. When true only allows 4 instances (of that type) can be played.
       */
      stream?: boolean

      /**
       * Optional. An integer. Modify sound reduction rate based on distance. Defaults to 16.
       */
      attenuation_distance: number

      /**
       * Optional. Whether the sound should be loaded when loading the pack instead of when the sound is played. Used by the underwater ambience. Defaults to false.
       *
       * TODO: Find difference between this and stream
       */
      preload?: boolean

      /**
       * Optional. Changes how `name` is interpreted. Defaults to `sound`.
       *
       * - `sound` the name of a file.
       * - `event` the name of an already defined event.
       */
      type: 'sound' | 'event'
    }[]
  }
}
