import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { FloatProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ModernAttributeModifier } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { DamageTypeClass, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type AttributeEntry = ({
  /**
   * Attribute type to modify.
   */
  attribute: Registry['minecraft:attribute'],
} & ModernAttributeModifier)

export type ContactDamage = {
  damage_type: (Registry['minecraft:damage_type'] | DamageTypeClass),
  amount: FloatProvider<NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>>,
  /**
   * Whether the damage is attributed to the sulfur cube.
   */
  attribute_to_source: boolean,
}

export type ExplosionData = {
  /**
   * The fuse time in ticks when ignited. \
   * When ignited by an explosion, the fuse will be a random value between `explosion_fuse / 8` and `3 * explosion_fuse / 8`.
   *
   * Value:
   * Range: 1..
   */
  fuse: NBTInt<{
    min: 1,
  }>,
  /**
   * The explosion power.
   *
   * Value:
   * Range: 0..
   */
  power: NBTInt<{
    min: 0,
  }>,
  /**
   * Whether the explosion causes fire.
   */
  causes_fire: boolean,
}

export type KnockbackModifiers = {
  /**
   * The horizontal power of the knockback.
   */
  horizontal_power: NBTFloat,
  /**
   * The vertical power of the knockback.
   */
  vertical_power: NBTFloat,
}

export type SoundSettings = {
  hit_sound: SoundEventRef,
  push_sound: SoundEventRef,
  /**
   * Minimum impact speed required to trigger the sound.
   */
  push_sound_impulse_threshold: NBTFloat,
  /**
   * Cooldown in seconds for the sound effect.
   */
  push_sound_cooldown: NBTFloat,
}

export type SulfurCubeArchetype = {
  items: ((
      | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<Registry['minecraft:item']>),
  /**
   * Defaults to `false`.
   */
  buoyant?: boolean,
  /**
   * When present, sulfur cube with this archetype will explode when ignited.
   */
  explosion?: ExplosionData,
  contact_damage?: ContactDamage,
  knockback_modifiers: KnockbackModifiers,
  attribute_modifiers: Array<AttributeEntry>,
  sound_settings: SoundSettings,
}
