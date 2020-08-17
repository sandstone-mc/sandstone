import {
  ArgumentNode,
  CommandNode,
  LiteralArgumentNode,
  LiteralNode,
  NodeWithChildren,
  RootNode,
  NodeWithRedirect,
} from '@commands/commandsTypes'
import { ParsersIdMap } from '@commandsTree/types'
import { COMMANDS_TREE_TYPE } from '@commandsTree/commands'


export type _SandstoneRedirectNode<rootNode extends RootNode, redirect extends string> = (
  redirect extends 'root' ?
    SandstoneRootNoExecute<rootNode> :
    SandstoneNode<rootNode, rootNode['children'][redirect]>
)

export type SandstoneRedirectNode<
  rootNode extends RootNode,
  cmdNode extends CommandNode & NodeWithRedirect
> = _SandstoneRedirectNode<rootNode, cmdNode['redirect'][0]> & (
  cmdNode['redirect'] extends {'1': any} ? _SandstoneRedirectNode<rootNode, cmdNode['redirect'][1]> : unknown
)

// An object node: `weather` in `weather.clear`, `if` in `if.score` or `if.entity`...
export type SandstoneObjectNode<rootNode extends RootNode, cmdNode extends CommandNode> = (
  cmdNode extends NodeWithChildren ?
    // A literal node with children
    { [key in keyof cmdNode['children']]: SandstoneNode<rootNode, cmdNode['children'][key]> }
  : (
    // A literal node with no children is like a property: `advancement.grant('@a').everything`
    // This doesn't look like a function call, which is bad design.
    // Therefore, we specify it's a function call to have
    // `advancement.grant('@a').everything()` instead.
    // However, it could potentially be a redirect: then we need to redirect to the correct object
    cmdNode extends (NodeWithRedirect & CommandNode) ? (
      SandstoneRedirectNode<rootNode, cmdNode>
    ) : (
      cmdNode extends LiteralNode ?
      () => void :
      void
    )
  )
)

export type SandstoneFunctionNode<
  rootNode extends RootNode,
  cmdNode extends LiteralArgumentNode | ArgumentNode
> = (
  ParsersIdMap<
    SandstoneObjectNode<rootNode, cmdNode>,
    cmdNode['parsersId']
  >
)

export interface SandstoneNode_<rootNode extends RootNode, cmdNode extends CommandNode> {
  'root': SandstoneRootNoExecute<rootNode>,
  'argument': (cmdNode extends ArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never)
  'literal': (cmdNode extends LiteralNode ? SandstoneObjectNode<rootNode, cmdNode> : never)
  'literalArgument': (cmdNode extends LiteralArgumentNode ? SandstoneFunctionNode<rootNode, cmdNode> : never)
}

export type SandstoneNode<
  rootNode extends RootNode, cmdNode extends CommandNode
> = SandstoneNode_<
  rootNode, cmdNode
>[cmdNode['type']]

type RootNodeWithoutExecute<rootNode extends RootNode> = {
  [key in Exclude<keyof rootNode['children'], 'execute'>]: rootNode['children'][key]
}

export type SandstoneRootNoExecute<rootNode extends RootNode> = {
  [key in (Exclude<keyof rootNode['children'], 'execute'>)]: SandstoneNode<rootNode, rootNode['children'][key]>
}

export type SandstoneRoot<rootNode extends RootNode> = {
  [key in keyof rootNode['children']]: SandstoneNode<rootNode, rootNode['children'][key]>
}
