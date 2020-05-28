import {
  ArgumentNode,
  CommandNode,
  CommandParser,
  COMMANDS_TREE,
  LiteralArgumentNode,
  LiteralNode,
  NodeWithChildren,
  RootNode,
  CompoundParserProperties,
  NodeWithRedirect,
} from '../commandsTree'
import { json } from '../types'
import { CompoundTypesMap } from '../commandsTree/compoundTypesMap'

type SandstoneRedirectNode<rootNode extends RootNode, cmdNode extends CommandNode & NodeWithRedirect> = (
  cmdNode['redirect'][0] extends 'execute' ?
    SandstoneNode<rootNode, rootNode['children'][cmdNode['redirect'][0]]> &
    SandstoneRoot<rootNode>
    :
    SandstoneNode<rootNode, rootNode['children'][cmdNode['redirect'][0]]>
)

// An object node: `weather` in `weather.clear`, `if` in `if.score` or `if.entity`...
type SandstoneObjectNode<rootNode extends RootNode, cmdNode extends CommandNode> = (
  cmdNode extends NodeWithChildren ?
    // A literal node with children
    { [key in keyof cmdNode['children']]: SandstoneNode<rootNode, cmdNode['children'][key]> }
  : (
    // A literal node with no children is like a property: `advancement.grant('@a').everything`
    // This doesn't look like a function call, which is bad design.
    // Therefore, we specify it's a function call to have
    // `advancement.grant('@a').everything()` instead.
    // However, it could potentially be a redirect: then we need to redirect to the correct object
    cmdNode extends NodeWithRedirect & CommandNode ? (
      cmdNode extends LiteralNode ?
      () => SandstoneRedirectNode<rootNode, cmdNode> :
      SandstoneRedirectNode<rootNode, cmdNode>
    ) : (
      cmdNode extends LiteralNode ?
      () => void :
      string
    )
  )
)

type SandstoneFunctionNode<
  rootNode extends RootNode,
  cmdNode extends LiteralArgumentNode | ArgumentNode
> = (
  CompoundTypesMap<{
    'minecraft:entity': string,
    'minecraft:item_stack': string,
    'minecraft:predicate': string,
    'brigadier:integer': number,
    'minecraft:dimension': 'minecraft:overworld' | 'minecraft:the_end' | 'minecraft:the_nether',
    'minecraft:message': string,
    'minecraft:block': string,
    'minecraft:block_pos': string,
    'minecraft:block_state': string,
    'sandstone:callback': () => void,
  }, SandstoneObjectNode<rootNode, cmdNode>, SandstoneObjectNode<rootNode, cmdNode>, cmdNode['parsersId']>
)

type SandstoneNode_<rootNode extends RootNode, cmdNode extends CommandNode> = {
  'root': SandstoneRoot<rootNode>,
  'argument': (cmdNode extends ArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never)
  'literal': (cmdNode extends LiteralNode ? SandstoneObjectNode<rootNode, cmdNode> : never)
  'literalArgument': (cmdNode extends LiteralArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never)
}

type SandstoneNode<
  rootNode extends RootNode, cmdNode extends CommandNode
> = SandstoneNode_<
  rootNode, cmdNode
>[cmdNode['type']]

export type SandstoneRoot<rootNode extends RootNode> = {
  [key in keyof rootNode['children']]: SandstoneNode<rootNode, rootNode['children'][key]>
}
