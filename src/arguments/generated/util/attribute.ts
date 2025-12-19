export type AttributeName = (
  | 'generic.maxHealth'
  | 'generic.followRange'
  | 'generic.knockbackResistance'
  | 'generic.movementSpeed'
  | 'generic.attackDamage'
  | 'generic.armor'
  | 'generic.armorToughness'
  | 'generic.attackKnockback'
  | 'generic.attackSpeed'
  | 'generic.luck'
  | 'horse.jumpStrength'
  | 'generic.flyingSpeed'
  | 'zombie.spawnReinforcements')

export type AttributeOperation = ('add_value' | 'add_multiplied_base' | 'add_multiplied_total')

export type LegacyOperation = (0 | 1 | 2)
