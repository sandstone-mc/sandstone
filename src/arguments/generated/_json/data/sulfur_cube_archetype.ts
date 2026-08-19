import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonFloatProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonModernAttributeModifier } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { DamageTypeClass, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonAttributeEntry = ({
  /**
   * Attribute type to modify.
   */
  attribute: JsonRegistry['minecraft:attribute'],
} & JsonModernAttributeModifier)

export type JsonContactDamage = {
  damage_type: (JsonRegistry['minecraft:damage_type'] | DamageTypeClass),
  amount: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number)>,
  /**
   * Whether the damage is attributed to the sulfur cube.
   */
  attribute_to_source: boolean,
}

export type JsonExplosionData = {
  /**
   * The fuse time in ticks when ignited. \
   * When ignited by an explosion, the fuse will be a random value between `explosion_fuse / 8` and `3 * explosion_fuse / 8`.
   *
   * Value:
   * Range: 1..
   */
  fuse: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * The explosion power.
   *
   * Value:
   * Range: 0..
   */
  power: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Whether the explosion causes fire.
   */
  causes_fire: boolean,
}

export type JsonKnockbackModifiers = {
  /**
   * The horizontal power of the knockback.
   */
  horizontal_power: (NBTFloat | number),
  /**
   * The vertical power of the knockback.
   */
  vertical_power: (NBTFloat | number),
}

export type JsonSoundSettings = {
  hit_sound: JsonSoundEventRef,
  push_sound: JsonSoundEventRef,
  /**
   * Minimum impact speed required to trigger the sound.
   */
  push_sound_impulse_threshold: (NBTFloat | number),
  /**
   * Cooldown in seconds for the sound effect.
   */
  push_sound_cooldown: (NBTFloat | number),
}

export type JsonSulfurCubeArchetype = {
  items: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
  /**
   * Defaults to `false`.
   */
  buoyant?: boolean,
  /**
   * When present, sulfur cube with this archetype will explode when ignited.
   */
  explosion?: JsonExplosionData,
  contact_damage?: JsonContactDamage,
  knockback_modifiers: JsonKnockbackModifiers,
  attribute_modifiers: Array<JsonAttributeEntry>,
  sound_settings: JsonSoundSettings,
}
