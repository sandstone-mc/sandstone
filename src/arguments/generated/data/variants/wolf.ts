import type { SoundEventRef } from 'sandstone/generated/data/util'
import type { SpawnPrioritySelectors } from 'sandstone/generated/data/variants'
import type { Registry } from 'sandstone/generated/registry'

export type WolfSoundVariant = {
    ambient_sound: SoundEventRef
    death_sound: SoundEventRef
    growl_sound: SoundEventRef
    hurt_sound: SoundEventRef
    pant_sound: SoundEventRef
    whine_sound: SoundEventRef
}

export type WolfVariant = ({
    /**
     * The texture set to use for this wolf variant.
     */
    assets: WolfVariantAssetInfo
} & SpawnPrioritySelectors)

export type WolfVariantAssetInfo = {
    wild: Registry['minecraft:texture']
    tame: Registry['minecraft:texture']
    angry: Registry['minecraft:texture']
}
