# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Build**: `bun run build` - Builds the project using tsup and runs setup
- **Watch**: `bun run watch` - Builds with watch mode
- **Type checking**: `bun run build:types` - Generates TypeScript declaration files
- **Setup**: `bun run setup` - Builds types and sets up package (required after build)
- **Lint**: `bun run lint` or `bun oxlint src` - Lints TypeScript files using OxLint
- **Format/Fix**: `bun run format` or `bun oxlint src --fix` - Lints and auto-fixes issues

## Todo Directory

The `todo/` directory contains planning and tracking documents for ongoing development. Currently empty.

## Code Architecture

Sandstone is a TypeScript library for generating Minecraft datapacks and resource packs programmatically. It provides a type-safe, fluent API with ~7,500 lines of source code across 200+ TypeScript files.

### Directory Structure

```
src/
├── arguments/           # Type-safe argument definitions
│   ├── generated/       # Auto-generated types from Minecraft data
│   │   ├── _builtin/    # Built-in Minecraft types (block states, custom data)
│   │   ├── _dispatcher/ # Dispatcher types for polymorphic features
│   │   ├── _registry/   # Registry types (ITEMS, BLOCKS, ENTITY_TYPES, etc.)
│   │   ├── assets/      # Resource pack asset types
│   │   ├── data/        # Datapack data types (advancement, loot, recipes)
│   │   ├── util/        # Utility types (GlobalPos, WeightedList)
│   │   ├── world/       # World block, entity, item component types
│   │   ├── registry.ts  # Main Registry type export
│   │   ├── dispatcher.ts
│   │   ├── pack.ts
│   │   └── util.ts
│   ├── resources/       # Resource argument definitions
│   │   ├── datapack/    # Advancement, loot table, predicate args
│   │   └── resourcepack/ # Atlas, blockstate, font, model args
│   └── *.ts             # Core argument types (basics, nbt, selector, coords)
├── core/                # Core engine and AST infrastructure
│   ├── sandstoneCore.ts # Central engine managing resources and MCFunctions
│   ├── nodes.ts         # AST node base classes (Node, ContainerNode, CommandNode)
│   ├── visitors.ts      # Visitor pattern for AST transformations
│   ├── Macro.ts         # Macro argument system
│   └── resources/       # Resource implementations
│       ├── resource.ts  # Base ResourceClass and ResourceNode
│       ├── datapack/    # MCFunction, Advancement, LootTable, etc.
│       └── resourcepack/ # Atlas, BlockState, Texture, Font, etc.
├── pack/                # Pack management and build system
│   ├── pack.ts          # SandstonePack main class
│   ├── packType.ts      # PackType definitions (datapack/resourcepack)
│   └── visitors/        # AST transformation visitors
│       ├── ifElseTransformationVisitor.ts
│       ├── loopTransformationVisitor.ts
│       ├── inlineFunctionCallVisitor.ts
│       ├── simplifyExecuteFunction.ts
│       └── ...
├── commands/            # Minecraft command implementations
│   ├── commands.ts      # SandstoneCommands registry
│   └── implementations/ # Individual command classes (50+ commands)
│       ├── block/       # clone, fill, place, setblock
│       ├── entity/      # attribute, damage, effect, summon
│       ├── player/      # gamemode, give, particle
│       ├── server/      # datapack, reload, difficulty
│       └── world/       # seed, weather, time, locate
├── variables/           # Variable and expression system
│   ├── Objective.ts     # Scoreboard objective wrapper
│   ├── Score.ts         # Scoreboard score variable
│   ├── Selector.ts      # Entity selector with fluent builder
│   ├── Data.ts          # NBT data path navigation
│   ├── Coordinates.ts   # Coordinate systems (absolute, relative, local)
│   └── nbt/             # NBT manipulation utilities
├── flow/                # Control flow abstractions
│   ├── Flow.ts          # Main Flow class (if/else, loops, switch)
│   ├── conditions/      # Condition types and builders
│   └── ...
└── index.ts             # Main entry point exporting public API
```

### Core Components

#### AST System (`src/core/nodes.ts`)
- **Node**: Abstract base for all AST nodes with `sandstoneCore` context
- **ContainerNode**: Nodes containing a body of other nodes (functions, loops)
- **CommandNode**: Represents Minecraft commands with arguments
- **MCFunctionNode**: Represents Minecraft functions as containers with context stack

#### SandstoneCore (`src/core/sandstoneCore.ts`)
Central engine managing:
- `resourceNodes`: Map of all created resources
- `mcfunctionStack`: Stack tracking active MCFunction context
- `enterMCFunction()` / `exitMCFunction()`: Context switching
- `currentMCFunction`: Getter for active function

#### Resource System (`src/core/resources/resource.ts`)
- **ResourceClass**: Abstract base for all resources with conflict resolution
- **Conflict strategies**: throw, replace, ignore, append, prepend, rename
- **Datapack resources**: MCFunction, Advancement, LootTable, Predicate, Recipe, Tag
- **ResourcePack resources**: Texture, BlockState, Model, Font, SoundEvent, Atlas

#### Visitor Pattern (`src/pack/visitors/`)
AST transformation visitors for:
- Converting container commands to MCFunctions
- Transforming if/else and loop constructs
- Initializing constants and objectives
- Inlining function calls
- Simplifying execute commands

**Visitor files** follow the naming convention `<transformationName>.ts` (e.g., `containerCommandsToMCFunction.ts`, `ifElseTransformationVisitor.ts`).

#### Node Serialization (`getValue()`)

Every node has a `getValue()` method that serializes it to mcfunction output:

```typescript
// CommandNode.getValue() returns the command string
sayNode.getValue()  // => "say hello"

// ExecuteCommandNode.getValue() requires exactly 1 child in body
executeNode.getValue()  // => "execute as @a run say hello"
// Throws if body.length > 1: "Execute nodes can only have one child node when toString is called."
```

The `getValue()` method is called during `core.save()` AFTER all visitors have transformed the AST. If a visitor fails to run, nodes may be in an invalid state for serialization.

#### Container Command Transformation Flow

`ContainerCommandNode` subclasses (like `ExecuteCommandNode`) have a `createMCFunction()` method that extracts multi-command bodies into child MCFunctions:

```typescript
// In ExecuteCommandNode
createMCFunction = (currentMCFunction: MCFunctionNode | null) => {
  if (this.isSingleExecute || !currentMCFunction) {
    return { node: this }  // No transformation needed
  }

  // Create child MCFunction with the execute's body
  const mcFunction = this.sandstonePack.MCFunction(`${currentMCFunction.resource.name}/${this.callbackName}`, ...)
  mcFunction.node.body = this.body

  // Replace body with single function call
  this.body = [new FunctionCommandNode(this.sandstonePack, mcFunction)]

  return { node: this, mcFunction: mcFunction.node }
}
```

**The transformation flow:**
1. User writes: `execute.as('@a').run(() => { say('a'); say('b') })`
2. Creates `ExecuteCommandNode` with `isSingleExecute=false` and 2 commands in body
3. During `save()`, `ContainerCommandsToMCFunctionVisitor` visits this node
4. Visitor calls `node.createMCFunction(currentMCFunction)`
5. Method creates child MCFunction containing the 2 commands
6. Execute's body is replaced with single `function` call
7. Now `getValue()` succeeds (body has exactly 1 child)

### MCFunction Context System

Understanding how commands are routed to the correct MCFunction is critical for implementing features like execute chains, macros, and async operations.

#### The MCFunction Stack (`sandstoneCore.mcfunctionStack`)
SandstoneCore maintains a stack of active MCFunctions:
```typescript
// Enter a function context - commands will go here
core.enterMCFunction(mcfunctionClass)

// Get current function (throws if outside any MCFunction)
const current = core.getCurrentMCFunctionOrThrow()

// Exit when done
core.exitMCFunction()
```

#### Node Context Stack (`MCFunctionNode.contextStack`)
Each MCFunction has its own context stack for nested structures (execute, if/else, loops):
```typescript
// Commands go to the TOP of the context stack
mcfunctionNode.enterContext(executeNode, exitOnBodyPop)
// ... commands added here go into executeNode.body ...
mcfunctionNode.exitContext()
```

**Key insight**: When you call a command like `say('hello')`, it:
1. Gets `core.getCurrentMCFunctionOrThrow()` to find the active MCFunction
2. Gets the top of that function's `contextStack`
3. Pushes the command node into that context's `body`

#### Execute Command as Container
`ExecuteCommandNode` extends `ContainerCommandNode` - it can contain child commands:
```typescript
// Single command: execute.as('@a').run.say('hi')
// - Creates ExecuteCommandNode with isSingleExecute=true
// - The say command goes into the execute's body

// Multiple commands: execute.as('@a').run(() => { say('a'); say('b') })
// - Creates ExecuteCommandNode with isSingleExecute=false
// - Both commands go into execute's body
// - Visitor later extracts to child MCFunction if needed
```

#### Deferred Execution with autoCommit
Commands normally commit immediately when created. Use `autoCommit=false` to defer:
```typescript
// Normal: command is added to current context immediately
const exec = new ExecuteCommandClass(pack)  // commits on creation

// Deferred: build up the chain without committing
const deferred = new ExecuteCommandClass(pack, undefined, false)
// ... add subcommands ...
// Later: manually add to context or create child function
```

This is essential for `createDeferredMacroExecute` which builds execute chains that will be wrapped in macro-enabled child functions.

### Macro System

#### MacroArgument Base Class (`src/core/Macro.ts`)
All macro-capable values extend `MacroArgument`:
```typescript
class MacroArgument {
  local: Map<string, string>  // Maps MCFunction name -> macro variable name
  toMacro(): string           // Returns "$(varName)" for use in commands
}
```

#### How Scores/Data Become Macros
When passed to an MCFunction as env or param:
1. `ResolveNBTPart(score)` converts Score to NBT storage
2. `score.local.set(functionName, 'env_0')` registers the macro name
3. Inside the function, `score.toMacro()` returns `"$(env_0)"`
4. Function is called with `function <name> with storage <resolved>`

#### MCFunction Parameters vs Environment Variables
```typescript
// Environment variables: captured from outer scope, array as 2nd arg
const envVar = Data('storage', 'test', 'value')
MCFunction('test', [envVar], (_loop, param: Score) => {
  // envVar -> $(env_0)
  // param -> $(param_0)
})

// When called: test(newEnvValue, paramValue)
// - newEnvValue overrides envVar
// - paramValue is the param
```

#### Creating Macro-Enabled Child Functions
Use `createDeferredMacroExecute` for commands that need macro storage:
```typescript
const deferred = new ExecuteCommandClass(pack, undefined, false)
return createDeferredMacroExecute(pack, deferred, {
  childFunctionName: '__my_macro',
  prependArgs: (envNames) => [['as', `$(${envNames[0]})`]],
  env: [someMacroVariable],  // OR use macroStorage for explicit storage
})
```

### Key Design Patterns

- **Visitor Pattern**: AST transformations in `src/pack/visitors/`
- **Builder Pattern**: Fluent API for commands, selectors, data paths
- **Resource Registry**: Central management with conflict resolution
- **Context Management**: Stack-based context for nested structures
- **Type Safety**: Generated registry types + TypeScript generics

### Generated Types System

The `src/arguments/generated/` directory contains auto-generated TypeScript definitions from [vanilla-mcdoc](https://github.com/SpyglassMC/vanilla-mcdoc) & [mcmeta](https://github.com/misode/mcmeta).

#### Three-Tier Type System

1. **Registry Types** (`_registry/`): Exhaustive enums for all Minecraft resources (ITEMS, BLOCKS, ENTITY_TYPES, etc.)
2. **Dispatcher Types** (`_dispatcher/`): Multi-dispatch for polymorphic features
3. **Built-in Types** (`_builtin/`): Fundamental structures (block states, custom data)

#### Using Generated Types

Import the `Registry` type and access specific registries using bracket notation:

```typescript
import type { Registry } from 'sandstone/arguments/generated/registry'

type Item = Registry['minecraft:item']
type EntityType = Registry['minecraft:entity_type']
type Block = Registry['minecraft:block']
```

### Command Implementation

Commands are implemented in `src/commands/implementations/` organized by category (block, entity, player, server, world).

#### File Structure

Each command file contains:
1. **CommandNode class**: Extends `CommandNode`, sets `command` property to the Minecraft command name
2. **Command class**: Extends `CommandArguments`, implements the command's methods
3. **Subcommand classes** (if needed): For chained command syntax

```typescript
// Example: src/commands/implementations/server/stopwatch.ts
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments, FinalCommandOutput } from '../../helpers'

export class StopwatchCommandNode extends CommandNode {
  command = 'stopwatch' as const
}

export class StopwatchCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = StopwatchCommandNode

  create = (id: Macroable<`${string}:${string}`, MACRO>): FinalCommandOutput =>
    this.finalCommand(['create', id])

  query = (id: Macroable<`${string}:${string}`, MACRO>, scale: Macroable<number, MACRO>): FinalCommandOutput =>
    this.finalCommand(['query', id, scale])
}
```

#### Command Method Patterns

- **`finalCommand(args)`**: Terminal command, returns `FinalCommandOutput`
- **`subCommand(args, NextClass, executable)`**: Returns another command class for chaining

#### Subcommand Classes

When a command has chained syntax (e.g., `rotate <target> facing <location>`), create a subcommand class:

```typescript
export class RotateCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RotateCommandNode

  rotate<T extends string>(target, rotation): FinalCommandOutput
  rotate<T extends string>(target): RotateFacingArguments<MACRO>  // Returns subcommand

  rotate<T extends string>(target, rotation?) {
    if (rotation !== undefined) {
      return this.finalCommand([targetParser(target), coordinatesParser(rotation)])
    }
    return this.subCommand([targetParser(target)], RotateFacingArguments<MACRO>, false)
  }
}

// IMPORTANT: Subcommand classes MUST be exported to avoid TypeScript errors
export class RotateFacingArguments<MACRO extends boolean> extends CommandArguments {
  facing = (location): FinalCommandOutput => this.finalCommand(['facing', coordinatesParser(location)])
  facingEntity = (entity, anchor?): FinalCommandOutput => this.finalCommand(['facing', 'entity', targetParser(entity), anchor])
}
```

#### Registration (3 Steps)

**1. Export from `implementations/index.ts`:**
```typescript
export * from './server/stopwatch'
```

**2. Add to `commands.ts`:**
```typescript
// Import
import { StopwatchCommand } from './implementations'

// Add getter in SandstoneCommands class (alphabetical order)
get stopwatch() {
  return new StopwatchCommand<MACRO>(this.sandstonePack)
}
```

**Getter patterns:**
- Multiple methods → `new CommandClass<MACRO>(this.sandstonePack)`
- Single entry method → `bind(this.sandstonePack, CommandClass, 'methodName') as CommandClass<MACRO>['methodName']`

**3. Export from `src/index.ts`:**
```typescript
export const {
  // ... other commands (alphabetical)
  stopwatch,
  // ...
} = commandsProxy
```

#### Common Argument Types

```typescript
import type {
  Coordinates,                    // [x, y, z] position
  Rotation,                       // [yaw, pitch] rotation
  SingleEntityArgument,           // Single entity selector
  MultipleEntitiesArgument,       // Multiple entities selector
  MultiplePlayersArgument,        // Multiple players selector
} from 'sandstone/arguments'

import type { Macroable } from 'sandstone/core'  // Wraps types for macro support
```

#### Argument Parsers

Use parsers from `sandstone/variables/parsers` for complex arguments:
- `targetParser(target)` - Entity selectors
- `coordinatesParser(coords)` - Coordinates and rotations
- `nbtStringifier(nbt)` - NBT objects to SNBT strings

#### JSDoc Style

```typescript
/**
 * Brief description of the command.
 *
 * Additional details about behavior.
 *
 * @see https://minecraft.wiki/w/Commands/commandname
 */
export class CommandNameCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Method description.
   *
   * @param paramName Description of parameter.
   */
  methodName = (paramName: Type): FinalCommandOutput => ...
}
```