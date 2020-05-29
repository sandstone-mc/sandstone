import { DIMENSION_TYPES } from './dimension_type'
import { ENTITY_TYPES } from './entity_type'
import { ITEMS } from './item'
import { BLOCKS } from './block'
import { MOB_EFFECTS } from './mob_effect'
import { ENCHANTMENTS } from './enchantment'
import { PARTICLE_TYPES } from './particle_type'
import { BIOMES } from './biome'
import { SOUND_EVENTS } from './sound_event'

type LiteralUnion<T extends U, U = string> = T | (U & {});

type JsonChatComponent = JsonChatComponent[] | {
  [key: string]: JsonChatComponent | string | number
}

type SingleNBTValue = number | string | NBT | SingleNBTValue[]

type NBT = {
  [name: string]: SingleNBTValue
}

export type ParsersMap = {
  // Brigadier types //
  'brigadier:integer': number,
  'brigadier:float': number,
  'brigadier:double': number,
  'brigadier:string': string,
  'brigadier:bool': boolean,

  // Sandstone custom types //
  'sandstone:callback': () => void,
  'sandstone:biome': LiteralUnion<BIOMES>,
  'sandstone:sound': LiteralUnion<SOUND_EVENTS>,

  // Minecraft types //

  // A selector, player name, or UUID
  'minecraft:entity': string,

  // An item, optionally including NBT
  'minecraft:item_stack': LiteralUnion<ITEMS>,

  // An item, or an item tag.
  'minecraft:item_predicate': LiteralUnion<ITEMS>,

  // A predicate name
  'minecraft:predicate': string,

  // A dimension name
  'minecraft:dimension': LiteralUnion<DIMENSION_TYPES>,

  // Any message (only used in /say, and in kick/ban messages)
  'minecraft:message': string,

  // A block state, optionally including NBT and state information.
  'minecraft:block_state': LiteralUnion<BLOCKS>,

  // A block, or a block tag. TODO: add autocompletion for builtin tags.
  'minecraft:block_predicate': LiteralUnion<BLOCKS>,

  // A position of a block (aka 3 integers). TODO: set a real type.
  'minecraft:block_pos': string,

  // Something that can join a team. Allows selectors and *
  'minecraft:score_holder': LiteralUnion<'*' | '@s' | '@e' | '@a' | '@r'>,

  // A scoreboard objective name.
  'minecraft:objective': string,

  // A scoreboard objective criterion. TODO: provide autocompletion here.
  'minecraft:objective_criteria': string,

  // A resource identifier. Example: minecraft:story/shiny_gear.
  'minecraft:resource_location': string,

  // UUID
  'minecraft:uuid': string,

  // A player's name. Only used in whitelist / ban / op & equivalents
  'minecraft:game_profile': string

  // A path within an NBT value, allowing for array and member accesses. TODO: maybe make a real type
  'minecraft:nbt_path': string,

  // Represents a partial nbt tag, usable in data modify command.
  'minecraft:nbt_tag': string,

  // An effect
  'minecraft:mob_effect': LiteralUnion<MOB_EFFECTS>,

  // An enchantment
  'minecraft:item_enchantment': LiteralUnion<ENCHANTMENTS>,

  // A range of integers. TODO: make a real type.
  'minecraft:int_range': string,

  // A rotation. TODO: maybe make a real type
  'minecraft:rotation': number,

  // A location, represented as 2 numbers. May use relative or local coordinates.
  'minecraft:vec2': string,

  // A location, represented as 3 numbers. May use relative or local coordinates.
  'minecraft:vec3': string,

  // A collection of up to 3 axes.
  'minecraft:swizzle': LiteralUnion<'x' | 'xy' | 'yz' | 'xyz'>

  // The entity anchor related to the facing argument in the teleport command. Is "feet" or "eyes".
  'minecraft:entity_anchor': LiteralUnion<'feet' | 'eyes'>

  // A column location, represented as 3 numbers (which must be integers). Can use relative or local coordinates.
  'minecraft:column_pos': string,

  // Name of a function. Should probably be kept in case people want to call external functions.
  'minecraft:function': string,

  // A name for an inventory slot. TODO: probably add autocomplete, or make a real type.
  'minecraft:item_slot': string,

  // A particle effect
  'minecraft:particle': LiteralUnion<PARTICLE_TYPES>,

  // A JSON chat component
  'minecraft:component': JsonChatComponent,

  // A scoreboard display position slot. list, sidebar, belowName, and sidebar.team.${color} for all chat colors.
  'minecraft:scoreboard_slot': LiteralUnion<
    'list' | 'sidebar' | 'belowName' | 'sidebar.team.'
  >

  // The name of an entity.
  'minecraft:entity_summon': LiteralUnion<ENTITY_TYPES>,

  // The name of a team. Parsed as an unquoted string.
  'minecraft:team': string,

  // A chat color. One of the color names, RGB value, or "reset".
  'minecraft:color': LiteralUnion<
    'black' | 'dark_blue' | 'dark_green' | 'dark_aqua' | 'dark_aqua' | 'dark_red' | 'dark_purple' |
    'gold' | 'gray' | 'dark_gray' | 'blue' | 'green' | 'aqua' | 'red' | 'light_purple' | 'yellow' |
    'white' | 'reset'
  >

  // A full NBT tag
  'minecraft:nbt_compound_tag': NBT,

  // A scoreboard operator
  'minecraft:operation': LiteralUnion<
    '+=' | '-=' | '/=' | '*=' | '<=' | '>=' | '<>'
  >

  // A time duration, like 1t or 5s or 8d. TODO: maybe create a real type
  'minecraft:time': string,

  // Should not be there, will be removed when the bug is fixed. TODO: remove.
  'undefined': undefined,
}
