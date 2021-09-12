import type { LiteralUnion } from '@/generalTypes'
import type { MultipleEntitiesArgument } from '@arguments'

type SINGLE_AXES = 'x' | 'y' | 'z'
type DOUBLE_AXES = `${SINGLE_AXES}${SINGLE_AXES}`
type TRIPLE_AXES = `${DOUBLE_AXES}${SINGLE_AXES}`

type DEDUP<A extends string> = (
  A extends `${infer I}${infer J}${infer K}` ? `${I}${Exclude<J, I>}${Exclude<K, I | J>}` :
  A extends `${infer I}${infer J}` ? `${I}${Exclude<J, I>}` : A
)

export type AXES = SINGLE_AXES | DEDUP<DOUBLE_AXES> | DEDUP<TRIPLE_AXES>

export type ANCHORS = 'eyes' | 'feet'

export type BASIC_COLORS = (
  'black' | 'dark_blue' | 'dark_green' | 'dark_aqua' | 'dark_aqua' | 'dark_red' | 'dark_purple' |
  'gold' | 'gray' | 'dark_gray' | 'blue' | 'green' | 'aqua' | 'red' | 'light_purple' | 'yellow' |
  'white' | 'reset'
)

export type GAMEMODES = 'survival' | 'creative' | 'adventure' | 'spectator'

export type DIFFICULTIES = 'easy' | 'normal' | 'hard' | 'peaceful'

export type OPERATORS = '=' | '+=' | '-=' | '/=' | '*=' | '%=' | '<' | '>' | '><'

export type COMPARISON_OPERATORS = '<' | '<=' | '=' | '>=' | '>'

export type SOUND_SOURCES = 'master' | 'music' | 'record' | 'weather' | 'block' | 'hostile' | 'neutral' | 'player' | 'ambient' | 'voice'

// When used as `type XX = YY | _ShowAlias`, forces Typescript to show the alias type (XX) and not the real one (YY).
export class _ShowAlias {
  private readonly xxx?: never
}

export type MessageOrSelector = (string | MultipleEntitiesArgument | number) | _ShowAlias

/**
 * A number in ticks or _ number in '_' (tick implicit), '_t' (tick explicit), '_s' (second), '_d' (day)
 */
export type TimeArgument = number | `${number}` | `${number}t` | `${number}s` | `${number}d`

export type TAG_TYPES = 'blocks' | 'entity_types' | 'fluids' | 'functions' | 'items'

export type MAP_ICONS = (
  'player' | 'frame' | 'red_marker' |
  'blue_marker' | 'target_x' | 'target_point' |
  'player_off_map' | 'player_off_limits' | 'mansion' |
  'monument' | 'banner_white' | 'minecraft:orange' |
  'minecraft:magenta' | 'minecraft:light_blue' |
  'minecraft:yellow' | 'minecraft:lime' |
  'minecraft:pink' | 'minecraft:gray' |
  'minecraft:light_gray' | 'minecraft:cyan' |
  'minecraft:purple' | 'minecraft:blue' |
  'minecraft:brown' | 'minecraft:green' |
  'minecraft:red' | 'minecraft:black' |
  'red_x'
)
