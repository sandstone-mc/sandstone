export type CommandParser = |
  // These potentialParsers come from this wiki: https://wiki.vg/Command_Data#Parsers
  'brigadier:bool' |
  'minecraft:game_profile' |
  'minecraft:block_pos' |
  'minecraft:column_pos' |
  'minecraft:vec3' |
  'minecraft:vec2' |
  'minecraft:block_state' |
  'minecraft:block_predicate' |
  'minecraft:item_stack' |
  'minecraft:item_predicate' |
  'minecraft:color' |
  'minecraft:component' |
  'minecraft:message' |
  'minecraft:nbt' |
  'minecraft:nbt_path' |
  'minecraft:objective' |
  'minecraft:objective_criteria' |
  'minecraft:operation' |
  'minecraft:particle' |
  'minecraft:rotation' |
  'minecraft:scoreboard_slot' |
  'minecraft:swizzle' |
  'minecraft:team' |
  'minecraft:item_slot' |
  'minecraft:resource_location' |
  'minecraft:mob_effect' |
  'minecraft:function' |
  'minecraft:entity_anchor' |
  'minecraft:range' |
  'minecraft:int_range' |
  'minecraft:float_range' |
  'minecraft:item_enchantment' |
  'minecraft:entity_summon' |
  'minecraft:dimension' |
  // Added potentialParsers that aren't in the wiki
  'minecraft:uuid' |
  'minecraft:nbt_tag' |
  'minecraft:nbt_compound_tag' |
  'minecraft:time' |
  // Parsers with properties
  'brigadier:double' |
  'brigadier:float' |
  'brigadier:integer' |
  'brigadier:string' |
  'minecraft:entity' |
  'minecraft:score_holder'

export type NodeWithChildren = {
  children: {
    [key: string]: CommandNode
  }
}

export type NodeMaybeWithChildren = {
  children?: {
    [key: string]: CommandNode
  }
}

// Represents the root node
export type RootNode = {
  type: 'root'
} & NodeWithChildren


// Represents a literal node, which requires to type the argument's name.
export type LiteralNode = {
  type: 'literal'
} & NodeMaybeWithChildren

type ParserProperties = {
  parser: CommandParser
  parsersId: number
  properties?: {[key: string]: any}
}

export type CompoundParserProperties = {
  parser: 'compound'
  parsersId: number
  properties?: readonly ({[key: string]: any} | undefined)[]
}

// Represents an argument node, which requires to type the argument's value.
export type ArgumentNode = {
  type: 'argument'
} & ParserProperties & NodeMaybeWithChildren

// Represents a literal node, which requires to type the argument's value.
export type LiteralArgumentNode = {
  type: 'literalArgument'
} & NodeMaybeWithChildren & (
  ParserProperties | CompoundParserProperties
)


// Represents a command or sub-command node, which can be either a literal or an argument node.
export type CommandNode = (
  ArgumentNode |
  LiteralNode |
  LiteralArgumentNode
)
