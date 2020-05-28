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
} from '../commandsTree'
import { json } from '../types'
import { CompoundTypesMap } from '../commandsTree/compoundTypesMap'

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
    cmdNode extends LiteralNode ? () => void : undefined
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
  }, SandstoneObjectNode<rootNode, cmdNode>, void, cmdNode['parsersId']>
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

type SandstoneRoot<rootNode extends RootNode> = {
  [key in keyof rootNode['children']]: SandstoneNode<rootNode, rootNode['children'][key]>
} & {
  run: (callback: () => void) => SandstoneRoot<rootNode>
}

type CommandsTreeType = typeof COMMANDS_TREE

type TypedSandstoneRoot = SandstoneRoot<CommandsTreeType>

const sand: TypedSandstoneRoot = {} as unknown as any

const {
  advancement, experience, teleport, xp, align, anchored, as, at, attribute, ban, banlist, bossbar, clear, data, datapack, clone, debug, defaultgamemode, deop, difficulty, gamemode, gamerule, effect, enchant, facing, forceload, fill, function: sandFunction, give, help, if: sandIf, in: sandIn, kick, kill, locate, locatebiome, loot, setblock,
} = sand

sandIn('minecraft:the_nether').say("I'm in the nether!")

as('@a').at('@s').in('minecraft:the_nether').run(() => {
  // Create a platform of dirt with air around the player, in the nether
  setblock('~ ~1 ~', 'minecraft:air')
  setblock('~ ~ ~', 'minecraft:air')
  setblock('~ ~-1 ~', 'minecraft:dirt')
})
