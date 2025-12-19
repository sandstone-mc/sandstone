import type { MinMaxBounds } from 'sandstone/generated/data/util'
import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { Registry } from 'sandstone/generated/registry'
import type { EquipmentSlot } from 'sandstone/generated/util/slot'
import type { DataComponentExactPredicate, DataComponentPredicate } from 'sandstone/generated/world/component'
import type {
    AxolotlVariant,
    FoxType,
    HorseVariant,
    LlamaVariant,
    MooshroomType,
    ParrotVariant,
    RabbitVariant,
    TropicalFishPattern,
} from 'sandstone/generated/world/component/entity'
import type { BoatType } from 'sandstone/generated/world/entity/boat'
import type { ITEM_SLOTS } from 'sandstone/arguments'
import type { LiteralUnion, NBTClass, NBTDouble, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type AxolotlPredicate = {
    /**
     * Value:
     *
     *  - Lucy(`lucy`)
     *  - Wild(`wild`)
     *  - Gold(`gold`)
     *  - Cyan(`cyan`)
     *  - Blue(`blue`): The rare variant.
     */
    variant: AxolotlVariant
}

export type BlockPredicate<S = undefined> = {
    blocks?: ((
        | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
        | Array<Registry['minecraft:block']>)
    state?: (S extends undefined ? Dispatcher<'mcdoc:block_states', [
        '%none',
    ]> : (S extends keyof Dispatcher<'mcdoc:block_states'>
        ? Dispatcher<'mcdoc:block_states'>[S]
        : Record<string, unknown>))
    nbt?: ((
        | `${any}${string}` | NBTClass) | (
        S extends keyof Dispatcher<'minecraft:block'> ? Dispatcher<'minecraft:block'>[S] : Record<string, unknown>))
    /**
     * Match exact data component values on the block entity.
     */
    components?: DataComponentExactPredicate
    /**
     * Test data component values on the block entity.
     */
    predicates?: DataComponentPredicate
}

export type BoatPredicate = {
    /**
     * Value:
     *
     *  - Oak(`oak`)
     *  - Spruce(`spruce`)
     *  - Birch(`birch`)
     *  - Jungle(`jungle`)
     *  - Acacia(`acacia`)
     *  - DarkOak(`dark_oak`)
     *  - Mangrove(`mangrove`)
     *  - Bamboo(`bamboo`)
     *  - Cherry(`cherry`)
     */
    variant: BoatType
}

export type CatPredicate = {
    variant: ((
        | Registry['minecraft:cat_variant'] | `#${string}:${string}` | TagClass<'cat_variant'>)
        | Array<Registry['minecraft:cat_variant']>)
}

export type DamagePredicate = {
    /**
     * Amount of incoming damage before damage reduction.
     */
    dealt?: MinMaxBounds<NBTFloat>
    /**
     * Amount of incoming damage after damage reduction.
     */
    taken?: MinMaxBounds<NBTFloat>
    /**
     * Whether the damage was successfully blocked.
     */
    blocked?: boolean
    /**
     * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
     */
    source_entity?: EntityPredicate
    /**
     * The type of the damage source.
     */
    type?: DamageSourcePredicate
}

export type DamageSourcePredicate = {
    /**
     * Damage type tags that the damage type is in.
     */
    tags?: Array<DamageTagPredicate>
    /**
     * Source of the damage (eg: a skeleton shooting an arrow or player igniting tnt).
     */
    source_entity?: EntityPredicate
    /**
     * Direct entity responsible for the damage (eg: the arrow or tnt).
     */
    direct_entity?: EntityPredicate
    /**
     * Damage is direct when its direct and source entities are the same.
     */
    is_direct?: boolean
}

export type DamageTagPredicate = {
    /**
     * The damage type tag to check.
     */
    id: (Registry['minecraft:tag/damage_type'])
    /**
     * Whether the damage is expected to have or not have the tag.
     */
    expected: boolean
}

export type DistancePredicate = {
    x?: MinMaxBounds<NBTFloat>
    y?: MinMaxBounds<NBTFloat>
    z?: MinMaxBounds<NBTFloat>
    absolute?: MinMaxBounds<NBTFloat>
    horizontal?: MinMaxBounds<NBTFloat>
}

export type EnchantmentPredicate = {
    enchantments?: ((
        | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
        | Array<Registry['minecraft:enchantment']>)
    levels?: MinMaxBounds<NBTInt>
}

export type EntityFlagsPredicate = {
    is_on_fire?: boolean
    is_sneaking?: boolean
    is_sprinting?: boolean
    is_swimming?: boolean
    is_baby?: boolean
    is_on_ground?: boolean
    is_flying?: boolean
    is_in_water?: boolean
    is_fall_flying?: boolean
}

export type EntityPredicate<S = undefined> = {
    type?: ((
        | Registry['minecraft:entity_type'] | `#${Registry['minecraft:tag/entity_type']}` | TagClass<'entity_type'>)
        | Array<Registry['minecraft:entity_type']>)
    type_specific?: EntitySubPredicate
    team?: `${any}${string}`
    nbt?: ((
        | `${any}${string}` | NBTClass) | (
        S extends keyof Dispatcher<'minecraft:entity'> ? Dispatcher<'minecraft:entity'>[S] : Record<string, unknown>))
    location?: LocationPredicate
    distance?: DistancePredicate
    flags?: EntityFlagsPredicate
    equipment?: ({
        [Key in Extract<EquipmentSlot, string>]?: ItemPredicate;
    })
    vehicle?: EntityPredicate
    passenger?: EntityPredicate
    stepping_on?: LocationPredicate
    /**
     * The entity that a mob's AI/aggro is targeting.
     */
    targeted_entity?: EntityPredicate
    effects?: ({
        [Key in Extract<Registry['minecraft:mob_effect'], string>]?: MobEffectPredicate;
    })
    slots?: ({
        [Key in Extract<LiteralUnion<ITEM_SLOTS>, string>]?: ItemPredicate;
    })
    movement?: MovementPredicate
    /**
     * True every `n` ticks of an entity's lifetime.
     *
     * Value:
     * Range: 1..
     */
    periodic_tick?: NBTInt<{
        min: 1
    }>
    /**
     * Whether the block at most 0.5 blocks below the entity is present which can affect its movement.
     */
    movement_affected_by?: LocationPredicate
    /**
     * Match exact data component values on the entity.
     */
    components?: DataComponentExactPredicate
    /**
     * Test data component values on the entity.
     */
    predicates?: DataComponentPredicate
}

export type EntitySubPredicate = ({
    [S in Extract<Registry['minecraft:entity_sub_predicate_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:entity_sub_predicate'>
        ? Dispatcher<'minecraft:entity_sub_predicate'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:entity_sub_predicate_type']])

export type FishingHookPredicate = {
    in_open_water?: boolean
}

export type FluidPredicate = {
    fluids?: ((
        | Registry['minecraft:fluid'] | `#${Registry['minecraft:tag/fluid']}` | TagClass<'fluid'>)
        | Array<Registry['minecraft:fluid']>)
    state?: ({
        [Key in `${any}${string}`]?: (MinMaxBounds<NBTInt> | boolean | string);
    })
}

export type FoxPredicate = {
    /**
     * Value:
     *
     *  - Red(`red`)
     *  - Snow(`snow`)
     */
    variant: FoxType
}

export type FrogPredicate = {
    variant: ((
        | Registry['minecraft:frog_variant'] | `#${string}:${string}` | TagClass<'frog_variant'>)
        | Array<Registry['minecraft:frog_variant']>)
}

export type GameMode = ('survival' | 'creative' | 'adventure' | 'spectator')

export type HorsePredicate = {
    /**
     * Value:
     *
     *  - White(`white`)
     *  - Creamy(`creamy`)
     *  - Chestnut(`chestnut`)
     *  - Brown(`brown`)
     *  - Black(`black`)
     *  - Gray(`gray`)
     *  - DarkBrown(`dark_brown`)
     */
    variant: HorseVariant
}

export type ItemPredicate = {
    items?: ((
        | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
        | Array<Registry['minecraft:item']>)
    count?: MinMaxBounds<NBTInt>
    components?: DataComponentExactPredicate
    predicates?: DataComponentPredicate
}

export type LightningBoltPredicate = {
    blocks_set_on_fire?: MinMaxBounds<NBTInt>
    entity_struck?: EntityPredicate
}

export type LlamaPredicate = {
    /**
     * Value:
     *
     *  - Creamy(`creamy`)
     *  - White(`white`)
     *  - Brown(`brown`)
     *  - Gray(`gray`)
     */
    variant: LlamaVariant
}

export type LocationPredicate = {
    position?: {
        x?: MinMaxBounds<NBTFloat>
        y?: MinMaxBounds<NBTFloat>
        z?: MinMaxBounds<NBTFloat>
    }
    biomes?: ((
            | Registry['minecraft:worldgen/biome']
            | `#${Registry['minecraft:tag/worldgen/biome']}`
            | TagClass<'worldgen/biome'>)
        | Array<Registry['minecraft:worldgen/biome']>)
    structures?: ((
            | Registry['minecraft:worldgen/structure']
            | `#${Registry['minecraft:tag/worldgen/structure']}`
            | TagClass<'worldgen/structure'>)
        | Array<Registry['minecraft:worldgen/structure']>)
    dimension?: Registry['minecraft:dimension']
    /**
     * Calculated using: `max(sky-darkening, block)`.
     */
    light?: {
        light?: MinMaxBounds<NBTInt<{
            min: 0
            max: 15
        }>>
    }
    block?: BlockPredicate
    fluid?: FluidPredicate
    /**
     * Whether the block is above (5 blocks or less) a campfire or soul campfire.
     */
    smokey?: boolean
    /**
     * Whether the location has the maximum possible level of sky light
     */
    can_see_sky?: boolean
}

export type MobEffectPredicate = {
    amplifier?: MinMaxBounds<NBTInt>
    duration?: MinMaxBounds<NBTInt>
    ambient?: boolean
    visible?: boolean
}

export type MooshroomPredicate = {
    /**
     * Value:
     *
     *  - Red(`red`)
     *  - Brown(`brown`)
     */
    variant: MooshroomType
}

export type MovementPredicate = {
    x?: MinMaxBounds<NBTFloat>
    y?: MinMaxBounds<NBTFloat>
    z?: MinMaxBounds<NBTFloat>
    speed?: MinMaxBounds<NBTFloat>
    horizontal_speed?: MinMaxBounds<NBTFloat>
    vertical_speed?: MinMaxBounds<NBTFloat>
    fall_distance?: MinMaxBounds<NBTFloat>
}

export type PaintingPredicate = {
    variant: ((
            | Registry['minecraft:painting_variant']
            | `#${Registry['minecraft:tag/painting_variant']}`
            | TagClass<'painting_variant'>)
        | Array<Registry['minecraft:painting_variant']>)
}

export type ParrotPredicate = {
    /**
     * Value:
     *
     *  - RedBlue(`red_blue`)
     *  - Blue(`blue`)
     *  - Green(`green`)
     *  - YellowBlue(`yellow_blue`)
     *  - Gray(`gray`)
     */
    variant: ParrotVariant
}

export type PlayerPredicate = {
    advancements?: ({
        [Key in Extract<Registry['minecraft:advancement'], string>]?: (boolean | ({
            [Key in `${any}${string}`]?: boolean;
        }));
    })
    gamemode?: Array<GameMode>
    /**
     * Experience/XP level.
     */
    level?: MinMaxBounds<NBTInt>
    recipes?: ({
        [Key in Extract<Registry['minecraft:recipe'], string>]?: boolean;
    })
    stats?: Array<StatisticPredicate>
    looking_at?: EntityPredicate
    /**
     * Checks the movement keys of the player.
     */
    input?: {
        forward?: boolean
        backward?: boolean
        left?: boolean
        right?: boolean
        jump?: boolean
        sneak?: boolean
        sprint?: boolean
    }
    food?: {
        level?: MinMaxBounds<NBTInt>
        saturation?: MinMaxBounds<(NBTDouble | number)>
    }
}

export type RabbitPredicate = {
    /**
     * Value:
     *
     *  - Brown(`brown`)
     *  - White(`white`)
     *  - Black(`black`)
     *  - WhiteSplotched(`white_splotched`)
     *  - Gold(`gold`)
     *  - Salt(`salt`)
     *  - Evil(`evil`): Killer rabbit
     */
    variant: RabbitVariant
}

export type RaiderPredicate = {
    has_raid?: boolean
    is_captain?: boolean
}

export type SalmonPredicate = {
    /**
     * Value:
     *
     *  - Small(`small`)
     *  - Medium(`medium`)
     *  - Large(`large`)
     */
    variant?: SalmonVariant
}

export type SalmonVariant = ('small' | 'medium' | 'large')

export type SheepPredicate = {
    sheared?: boolean
}

export type SlimePredicate = {
    size?: MinMaxBounds<NBTInt>
}

export type SpecificType = (
    | 'any'
    | 'axolotl'
    | 'boat'
    | 'cat'
    | 'fishing_hook'
    | 'fox'
    | 'frog'
    | 'horse'
    | 'lightning'
    | 'llama'
    | 'mooshroom'
    | 'painting'
    | 'parrot'
    | 'player'
    | 'rabbit'
    | 'slime'
    | 'tropical_fish'
    | 'villager')

export type StatisticPredicate = ({
    [S in Extract<Registry['minecraft:stat_type'], string>]?: {
        type: S
        stat: (S extends keyof Dispatcher<'minecraft:statistic_type'>
            ? Dispatcher<'minecraft:statistic_type'>[S]
            : Record<string, unknown>)
        value: MinMaxBounds<NBTInt>
    };
}[Registry['minecraft:stat_type']])

export type TropicalFishPredicate = {
    /**
     * The pattern of the tropical fish.
     *
     * Value:
     *
     *  - Kob(`kob`)
     *  - Sunstreak(`sunstreak`)
     *  - Snooper(`snooper`)
     *  - Dasher(`dasher`)
     *  - Brinely(`brinely`)
     *  - Spotty(`spotty`)
     *  - Flopper(`flopper`)
     *  - Stripey(`stripey`)
     *  - Glitter(`glitter`)
     *  - Blockfish(`blockfish`)
     *  - Betty(`betty`)
     *  - Clayfish(`clayfish`)
     */
    variant: TropicalFishPattern
}

export type VillagerPredicate = {
    variant: Registry['minecraft:villager_type']
}

export type WolfPredicate = {
    variant: ((
        | Registry['minecraft:wolf_variant'] | `#${string}:${string}` | TagClass<'wolf_variant'>)
        | Array<Registry['minecraft:wolf_variant']>)
}
type EntitySubPredicateDispatcherMap = {
    'axolotl': EntitySubPredicateAxolotl
    'minecraft:axolotl': EntitySubPredicateAxolotl
    'boat': EntitySubPredicateBoat
    'minecraft:boat': EntitySubPredicateBoat
    'cat': EntitySubPredicateCat
    'minecraft:cat': EntitySubPredicateCat
    'fishing_hook': EntitySubPredicateFishingHook
    'minecraft:fishing_hook': EntitySubPredicateFishingHook
    'fox': EntitySubPredicateFox
    'minecraft:fox': EntitySubPredicateFox
    'frog': EntitySubPredicateFrog
    'minecraft:frog': EntitySubPredicateFrog
    'horse': EntitySubPredicateHorse
    'minecraft:horse': EntitySubPredicateHorse
    'lightning': EntitySubPredicateLightning
    'minecraft:lightning': EntitySubPredicateLightning
    'llama': EntitySubPredicateLlama
    'minecraft:llama': EntitySubPredicateLlama
    'mooshroom': EntitySubPredicateMooshroom
    'minecraft:mooshroom': EntitySubPredicateMooshroom
    'painting': EntitySubPredicatePainting
    'minecraft:painting': EntitySubPredicatePainting
    'parrot': EntitySubPredicateParrot
    'minecraft:parrot': EntitySubPredicateParrot
    'player': EntitySubPredicatePlayer
    'minecraft:player': EntitySubPredicatePlayer
    'rabbit': EntitySubPredicateRabbit
    'minecraft:rabbit': EntitySubPredicateRabbit
    'raider': EntitySubPredicateRaider
    'minecraft:raider': EntitySubPredicateRaider
    'salmon': EntitySubPredicateSalmon
    'minecraft:salmon': EntitySubPredicateSalmon
    'sheep': EntitySubPredicateSheep
    'minecraft:sheep': EntitySubPredicateSheep
    'slime': EntitySubPredicateSlime
    'minecraft:slime': EntitySubPredicateSlime
    'tropical_fish': EntitySubPredicateTropicalFish
    'minecraft:tropical_fish': EntitySubPredicateTropicalFish
    'villager': EntitySubPredicateVillager
    'minecraft:villager': EntitySubPredicateVillager
    'wolf': EntitySubPredicateWolf
    'minecraft:wolf': EntitySubPredicateWolf
}
type EntitySubPredicateKeys = keyof EntitySubPredicateDispatcherMap
type EntitySubPredicateFallback = (
    | EntitySubPredicateAxolotl
    | EntitySubPredicateBoat
    | EntitySubPredicateCat
    | EntitySubPredicateFishingHook
    | EntitySubPredicateFox
    | EntitySubPredicateFrog
    | EntitySubPredicateHorse
    | EntitySubPredicateLightning
    | EntitySubPredicateLlama
    | EntitySubPredicateMooshroom
    | EntitySubPredicatePainting
    | EntitySubPredicateParrot
    | EntitySubPredicatePlayer
    | EntitySubPredicateRabbit
    | EntitySubPredicateRaider
    | EntitySubPredicateSalmon
    | EntitySubPredicateSheep
    | EntitySubPredicateSlime
    | EntitySubPredicateTropicalFish
    | EntitySubPredicateVillager
    | EntitySubPredicateWolf)
type EntitySubPredicateAxolotl = AxolotlPredicate
type EntitySubPredicateBoat = BoatPredicate
type EntitySubPredicateCat = CatPredicate
type EntitySubPredicateFishingHook = FishingHookPredicate
type EntitySubPredicateFox = FoxPredicate
type EntitySubPredicateFrog = FrogPredicate
type EntitySubPredicateHorse = HorsePredicate
type EntitySubPredicateLightning = LightningBoltPredicate
type EntitySubPredicateLlama = LlamaPredicate
type EntitySubPredicateMooshroom = MooshroomPredicate
type EntitySubPredicatePainting = PaintingPredicate
type EntitySubPredicateParrot = ParrotPredicate
type EntitySubPredicatePlayer = PlayerPredicate
type EntitySubPredicateRabbit = RabbitPredicate
type EntitySubPredicateRaider = RaiderPredicate
type EntitySubPredicateSalmon = SalmonPredicate
type EntitySubPredicateSheep = SheepPredicate
type EntitySubPredicateSlime = SlimePredicate
type EntitySubPredicateTropicalFish = TropicalFishPredicate
type EntitySubPredicateVillager = VillagerPredicate
type EntitySubPredicateWolf = WolfPredicate
export type SymbolEntitySubPredicate<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? EntitySubPredicateDispatcherMap
    : CASE extends 'keys' ? EntitySubPredicateKeys : CASE extends '%fallback' ? EntitySubPredicateFallback : never
