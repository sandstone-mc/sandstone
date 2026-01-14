import type { MultipleEntitiesArgument, NBTSerializable, Registry } from 'sandstone/arguments'

type SINGLE_AXES = 'x' | 'y' | 'z'
type DOUBLE_AXES = `${SINGLE_AXES}${SINGLE_AXES}`
type TRIPLE_AXES = `${DOUBLE_AXES}${SINGLE_AXES}`

type DEDUP<A extends string> = A extends `${infer I}${infer J}${infer K}`
  ? `${I}${Exclude<J, I>}${Exclude<K, I | J>}`
  : A extends `${infer I}${infer J}`
    ? `${I}${Exclude<J, I>}`
    : A

export type AXES = SINGLE_AXES | DEDUP<DOUBLE_AXES> | DEDUP<TRIPLE_AXES>

export type ANCHORS = 'eyes' | 'feet'

export type BASIC_COLORS =
  | 'black'
  | 'dark_blue'
  | 'dark_green'
  | 'dark_aqua'
  | 'dark_aqua'
  | 'dark_red'
  | 'dark_purple'
  | 'gold'
  | 'gray'
  | 'dark_gray'
  | 'blue'
  | 'green'
  | 'aqua'
  | 'red'
  | 'light_purple'
  | 'yellow'
  | 'white'
  | 'reset'

export type GAMEMODES = 'survival' | 'creative' | 'adventure' | 'spectator'

export type DIFFICULTIES = 'easy' | 'normal' | 'hard' | 'peaceful'

export type OPERATORS = '=' | '+=' | '-=' | '/=' | '*=' | '%=' | '<' | '>' | '><'

export type COMPARISON_OPERATORS = '<' | '<=' | '=' | '>=' | '>'

export type CRAFTING_INGREDIENT = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z'

export type SOUND_SOURCES =
  | 'master'
  | 'music'
  | 'record'
  | 'weather'
  | 'block'
  | 'hostile'
  | 'neutral'
  | 'player'
  | 'ambient'
  | 'voice'

// When used as `type XX = YY | _ShowAlias`, forces Typescript to show the alias type (XX) and not the real one (YY).
export class _ShowAlias implements NBTSerializable {
  toNBT(): string {
    throw new Error('You\'re not supposed to use the _ShowAlias class directly')
  }
}

export type STRUCTURE_ROTATION = 'none' | 'clockwise_90' | 'counterclockwise_90' | '180'

export type STRUCTURE_MIRROR = 'none' | 'front_back' | 'left_right'

export type MessageOrSelector = (string | MultipleEntitiesArgument<boolean> | number) | _ShowAlias

export type TimeArgument = number | `${number}` | `${number}${'t' | 's' | 'd'}`

export type MAP_ICONS =
  | 'player'
  | 'frame'
  | 'red_marker'
  | 'blue_marker'
  | 'target_x'
  | 'target_point'
  | 'player_off_map'
  | 'player_off_limits'
  | 'mansion'
  | 'monument'
  | 'banner_white'
  | 'minecraft:orange'
  | 'minecraft:magenta'
  | 'minecraft:light_blue'
  | 'minecraft:yellow'
  | 'minecraft:lime'
  | 'minecraft:pink'
  | 'minecraft:gray'
  | 'minecraft:light_gray'
  | 'minecraft:cyan'
  | 'minecraft:purple'
  | 'minecraft:blue'
  | 'minecraft:brown'
  | 'minecraft:green'
  | 'minecraft:red'
  | 'minecraft:black'
  | 'red_x'

export type SOUND_TYPES =
  | 'ambient'
  | 'block'
  | 'hostile'
  | 'master'
  | 'music'
  | 'neutral'
  | 'player'
  | 'record'
  | 'voice'
  | 'weather'

export type TEXTURE_TYPES =
  | 'block'
  | 'colormap'
  | 'effect'
  | `entity/${Registry['minecraft:entity_type']}`
  | 'environment'
  | 'font'
  | 'gui'
  | 'item'
  | 'map'
  | 'misc'
  | 'mob_effect'
  | 'models/armor'
  | 'painting'
  | 'particle'
  | 'trims'