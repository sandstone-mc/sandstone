import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { TRANSLATION_KEYS } from 'sandstone/arguments'
import type { LiteralUnion, NBTFloat, NBTInt } from 'sandstone'

export type Sound = ({
    [S in Extract<SoundType, string>]?: {
        /**
         * Changes how `name` is interpreted. Defaults to `sound`.
         *
         * Value:
         *
         *  - File(`file`): A file.
         *  - SoundEvent(`event`): An already defined event.
         */
        type?: S
        name: (S extends undefined ? Dispatcher<'minecraft:sound_type', [
            '%none',
        ]> : (S extends keyof Dispatcher<'minecraft:sound_type'>
            ? Dispatcher<'minecraft:sound_type'>[S]
            : Record<string, unknown>))
        /**
         * Defaults to 1.0.
         *
         * Value:
         * Range: 0<..
         * Minimum is exclusive; must be higher than 0
         */
        volume?: NBTFloat<{
            leftExclusive: true
            min: 1
        }>
        /**
         * Default is 1.0.
         *
         * Value:
         * Range: 0<..
         * Minimum is exclusive; must be higher than 0
         */
        pitch?: NBTFloat<{
            leftExclusive: true
            min: 1
        }>
        /**
         * Chance that this sound is selected to play. Defaults to 1.
         *
         * Value:
         * Range: 1..
         */
        weight?: NBTInt<{
            min: 1
        }>
        /**
         * Whether the sound should be loaded when loading the pack instead of when the sound is played. Used by the underwater ambience. Defaults to false.
         */
        preload?: boolean
        /**
         * If true it will be streamed from its file. Sounds longer than a few seconds should enable this to avoid lag. Defaults to false.
         * When false many instances of the sound can be ran at the same time. When true only allows 4 instances (of that type) can be played.
         */
        stream?: boolean
        /**
         * Modify sound reduction rate based on distance. Defaults to 16.
         */
        attenuation_distance?: NBTInt
    };
}[SoundType])

export type SoundEventRegistration = {
    /**
     * The sound files this sound event uses. One sound is randomly selected to play when the event is triggered. Defaults to assumed path.
     */
    sounds?: Array<(string | Sound)>
    /**
     * If true the sounds listed should replace the ones listed in the minecraft sounds.json for this sound event.
     * False if the sounds listed should be added. If undefined. Defaults to false.
     */
    replace?: boolean
    /**
     * Translated as the subtitle when Show Subtitles is enabled. Section sign formatting codes are supported.
     */
    subtitle?: LiteralUnion<TRANSLATION_KEYS>
}

export type Sounds = ({
    [Key in Extract<`${string}:${string}`, string>]?: SoundEventRegistration;
})

export type SoundType = ('file' | 'event')
