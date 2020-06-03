/**
 * Provides types matching closely the nodes of the commands tree
 */

export type NodeWithRedirect = {
  redirect: readonly [string] | readonly [string, string]
}

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
  children: {
    [key: string]: LiteralArgumentNode | LiteralNode
  }
}

type AnyNode = (NodeMaybeWithChildren | NodeWithRedirect)

// Represents a literal node, which requires to type the argument's name.
export type LiteralNode = {
  type: 'literal'
} & AnyNode

type _Properties = {[key: string]: any} | undefined

type ParserProperties = {
  parsers: readonly string[]
  executables?: readonly boolean[]
  parsersId: number
  properties?: readonly _Properties[]
}

// Represents an argument node, which requires to type the argument's value.
export type ArgumentNode = {
  type: 'argument'
} & ParserProperties & AnyNode

// Represents a literal node, which requires to type the argument's value.
export type LiteralArgumentNode = {
  type: 'literalArgument'
} & ParserProperties & AnyNode


// Represents a command or sub-command node, which can be either a literal or an argument node.
export type CommandNode = (
  ArgumentNode |
  LiteralNode |
  LiteralArgumentNode
)
