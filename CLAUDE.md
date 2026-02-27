# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Build**: `bun dev:build` - Builds the project using a custom Bun Build based script
- **Watch**: `bun dev:watch` - Builds with watch mode
- **Type checking**: `bun build:types` - Generates TypeScript declaration files
- **Lint**: `bun lint` - Lints TypeScript files using OxLint
- **Format/Fix**: `bun format` - Lints and auto-fixes issues

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

Visitors transform the AST before serialization. They run in sequence during `core.save()`.

**Visitor Base Class:**
```typescript
class GenericSandstoneVisitor {
  // Override to transform specific node types
  visitExecuteCommandNode(node: ExecuteCommandNode) {
    // Transform node, return replacement (or same node)
    return this.genericVisit(node)  // Recursively visit children
  }
}
```

**Execute-Related Visitors:**

| Visitor | Purpose |
|---------|---------|
| `UnifyChainedExecutesVisitor` | Merges `execute run execute run...` into single execute; unwraps empty executes (`execute run say hi` → `say hi`) |
| `SimplifyExecuteFunctionVisitor` | Inlines single-command MCFunctions called from execute |
| `ContainerCommandsToMCFunctionVisitor` | Extracts multi-command execute bodies into child MCFunctions |

**UnifyChainedExecutesVisitor Details:**
```typescript
visitExecuteCommandNode = (node) => {
  // Merge nested execute: execute.run.execute.run.say → execute.run.say
  if (node.body[0] instanceof ExecuteCommandNode) {
    node.body = chainedExecute.body
    node.args.push(...chainedExecute.args)
  }

  // Unwrap empty execute: execute run say hi → say hi
  const flattenedArgs = node.args.flat(1).filter(a => a != null)
  if (flattenedArgs.length === 0 && node.body.length === 1) {
    return this.genericVisit(node.body[0])  // Return child directly
  }
}
```

**Other Key Visitors:**

| Visitor | Purpose |
|---------|---------|
| `IfElseTransformationVisitor` | Transforms `_.if()` flow control into execute if/unless chains |
| `LoopTransformationVisitor` | Transforms `_.while()`, `_.forScore()` into recursive function calls; sets `loopExecute` on `LoopArgument` nodes |
| `SwitchTransformationVisitor` | Transforms `_.switch()` into MCFunctions with O(1) dispatch via macros |
| `InitConstantsVisitor` | Generates scoreboard objective creation commands |
| `InlineFunctionCallVisitor` | Inlines tiny MCFunctions to reduce function call overhead |

**Visitor Execution Order:**
Visitors run in a specific order defined in `pack.ts`. Order matters because:
- Flow transformations must run before container extraction
- Simplification visitors run after structural transformations
- Constant initialization runs early to set up scoreboards
- **SwitchTransformationVisitor runs before IfElseTransformationVisitor** since it creates IfNodes that need to be processed

#### Switch Transformation Flow

The `SwitchTransformationVisitor` transforms `_.switch()` into efficient MCFunction dispatch:

**Score-based switches** (switching on a `Score`):
- Case functions are named by their value: `case_0`, `case_5`, `case_100`
- Score is copied to NBT storage, then used as macro: `function case_$(value)`
- Uses `execute store success` to detect if the macro function exists
- Falls through to condition cases / default if no match
- Can be inlined when switch is last node in parent MCFunction

**Data-based switches** (switching on NBT data):
- Uses O(1) NBT storage lookup to map values to sequential indices
- Case functions are named by index: `case_0`, `case_1`, `case_2`
- Lookup table initialized in `initMCFunction`
- Falls through to condition cases / default if no match

**Key implementation details:**

1. **enterContext with addNode=false**: When populating the IfNode body for data switches, pass `false` to `enterContext` to avoid auto-adding the node:
```typescript
// Pass false - we manually push ifNode to body later
switchMCFunction.node.enterContext(ifNode, false)
functionCmd(innerMCFunction.name, 'with', switchMCFunction.macroPoint!)
switchMCFunction.node.exitContext()
```

2. **Push IfNode before buildFallback**: The IfNode must be added to the body BEFORE calling `buildFallback`, because `buildFallback` may create an `ElseNode` whose constructor auto-adds it to the body. This ensures correct order `[IfNode, ElseNode]` for `IfElseTransformationVisitor`.

3. **Score switch inlining**: For Score-based switches, the macro call is isolated in a child function (`try_case`), so the main switch function body doesn't contain macros and can be inlined.

#### Loop Transformation Flow

Loops (`_.while()`, `_.for()`, etc.) undergo a multi-stage transformation:

**1. User Code Creates LoopNode:**
```typescript
_.while(foo.matches([0,10]), () => {
  say("foo")
  foo['+='](1)
})
```
Creates a `WhileNode` (extends `LoopNode`) with:
- `executeArgs`: The condition as execute subcommands
- `callback`: User's loop body
- `loopback`: Creates `IfStatement` containing `LoopArgument` for recursion

**2. LoopTransformationVisitor:**
- Transforms `LoopNode` → `ExecuteCommandNode` with `callbackName: 'loop'`
- Tracks `currentLoopExecute` while visiting children
- Sets `loopArgument.loopExecute = currentLoopExecute` on any `LoopArgument` found
- This reference is critical for later resolving the recursive call target

**3. IfElseTransformationVisitor:**
- Transforms the loopback's `IfNode` → `ExecuteCommandNode` with `callbackName: 'if'`
- Creates nested execute structure for the condition check

**4. ContainerCommandsToMCFunctionVisitor:**
- Extracts multi-command execute bodies into child MCFunctions
- For the loop execute: creates `parent/loop` MCFunction
- For the if execute: creates `parent/loop/if` (or `if2` on conflict) MCFunction
- **Critical**: Sets `executeNode.createdMCFunction` when creating the child function
- This allows `LoopArgument` to later resolve the correct function name

**5. SimplifyExecuteFunctionVisitor:**
- Finds execute nodes whose body is a single function call
- If that function contains only a `LoopArgument`:
  - Gets `loopArgument.loopExecute.createdMCFunction.name` (the loop function)
  - Replaces execute body with direct call to loop function
  - Deletes the intermediate if function
- **Important**: Must check `instanceof LoopArgument` BEFORE `instanceof CommandNode` since `LoopArgument` extends `Node`, not `CommandNode`

**Final Output:**
```mcfunction
# parent/loop.mcfunction
say foo
scoreboard players add counter __sandstone 1
execute if score counter __sandstone matches 0..10 run function namespace:parent/loop
```

**Key Fields for Loop Resolution:**
- `ExecuteCommandNode.createdMCFunction`: Set by `createMCFunction()`, stores the MCFunction created from this execute
- `LoopArgument.loopExecute`: Set by `LoopTransformationVisitor`, references the loop's execute node
- These together allow `LoopArgument` to produce `function <correct-loop-name>` at serialization or simplification time

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

#### enterContext Pitfalls

The `enterContext` method has an `addNode` parameter that defaults to `true`:

```typescript
enterContext = (node: ContainerNode | ContainerCommandNode, addNode: boolean = true) => {
  if (addNode) {
    this.currentContext.append(node)  // Auto-adds to current context's body!
  }
  this.contextStack.push(node)
}
```

**Pitfall 1: Duplicate nodes when manually pushing**

If you call `enterContext(node)` and later manually push the same node to the body, you'll get duplicates:

```typescript
// WRONG - node gets added twice!
mcfunction.enterContext(ifNode)  // Auto-adds ifNode to body
// ... populate ifNode.body ...
mcfunction.exitContext()
mcfunction.body.push(ifNode)  // Duplicate!

// CORRECT - pass false to prevent auto-add
mcfunction.enterContext(ifNode, false)  // Does NOT add to body
// ... populate ifNode.body ...
mcfunction.exitContext()
mcfunction.body.push(ifNode)  // Only addition
```

**Pitfall 2: Node constructors that call enterContext**

Some node constructors (like `ElseNode`) automatically call `enterContext(this)`:

```typescript
export class ElseNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, callback: () => void) {
    super(sandstoneCore)
    // This auto-adds the ElseNode to the current MCFunction's body!
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
  }
}
```

When creating such nodes in visitors, be aware they'll be auto-added to the body. If you only want to link them (e.g., via `nextFlowNode`), you may need to account for their position in the body.

**Pitfall 3: Order matters for if/else chains**

For `IfElseTransformationVisitor` to work correctly, nodes must be in the body in the correct order:

```typescript
// WRONG order - ElseNode added before IfNode
this.buildFallback(ifNode, ...)  // Creates ElseNode, auto-adds to body
mcfunction.body.push(ifNode)     // IfNode comes after ElseNode

// CORRECT order - IfNode first, then ElseNode
mcfunction.body.push(ifNode)     // IfNode added first
this.buildFallback(ifNode, ...)  // ElseNode auto-added after
// Result: [IfNode, ElseNode] - correct order for visitor
```

#### Execute Command Internals

`ExecuteCommandNode` extends `ContainerCommandNode` and has special context management for the fluent `.run` API.

**Key Properties:**
- `isSingleExecute`: `true` for `.run.command`, `false` for `.run(() => {...})` callbacks
- `pendingCommit`: Set when `.run` is accessed on an uncommitted execute; triggers commit after body receives command
- `args`: Array of subcommands like `[['as', '@a'], ['at', '@s'], ['positioned', '0 0 0']]`
- `body`: Child command(s) that run after the execute modifiers
- `createdMCFunction`: Set by `createMCFunction()` when body is extracted to a child MCFunction; used by `LoopArgument` to resolve recursive call targets
- `macroStorage`: If set, the child function is called with `function <name> with storage <macroStorage> {}`

**The `.run` Getter Flow:**

```typescript
// execute.positioned(...).run.say('hello')

get run() {
  const node = this.getNode()  // Get or create ExecuteCommandNode

  return new Proxy(commands, {
    get: (_, prop) => {
      // Mark for deferred commit if not already committed
      if (!node.commited) {
        node.pendingCommit = true
      }
      // Enter execute's context (commands go to execute.body)
      mcfunction.enterContext(node, false)  // false = don't add node yet
      return commands[prop]
    }
  })
}
```

**Context and Commit Lifecycle:**

1. **Subcommand commits execute**: `.positioned(...)` calls `subCommand([...], ExecuteCommand, executable=true)` which commits the execute to MCFunction
2. **`.run` enters context**: Pushes execute onto `contextStack`, subsequent commands go to `execute.body`
3. **Child command commits**: `say('hello')` creates node, commits to current context (the execute)
4. **`append()` handles cleanup**: Exits context AND commits execute if `pendingCommit` was set

```typescript
// In ExecuteCommandNode
append = (...nodes: Node[]) => {
  for (const node of nodes) {
    this.body.push(node)
    if (this.isSingleExecute) {
      // Exit context first (parent becomes current)
      mcfunction.exitContext()
      // Then commit this execute to parent if pending
      if (this.pendingCommit && !this.commited) {
        this.commit()  // Adds execute to parent context
      }
    }
  }
}
```

**Nested Execute Chains:**

For `execute.positioned(...).run.execute.run.say('hi')`:
1. Outer execute committed via `.positioned`
2. `.run.execute` enters outer's context, returns NEW ExecuteCommand (inner)
3. `.run.say` on inner enters inner's context
4. `say('hi')` commits to inner's body
5. Inner's `append()` exits inner context, commits inner to outer's body (current context)
6. Outer's `append()` exits outer context (outer already committed)

Result: `execute positioned 0 0 0 run execute run say hi` (visitor simplifies later)

**Single vs Multiple Command Mode:**

```typescript
// Single command: isSingleExecute=true (default)
execute.as('@a').run.say('hi')
// - One command in body, stays as single execute node

// Callback mode: isSingleExecute=false
execute.as('@a').run(() => { say('a'); say('b') })
// - Multiple commands in body
// - ContainerCommandsToMCFunctionVisitor extracts to child MCFunction
```

**IMPORTANT - isSingleExecute in Visitors:**
When creating `ExecuteCommandNode` during visitor transformation, always use `isSingleExecute: false` even for single-command bodies. The `append()` method has special behavior when `isSingleExecute: true` that calls `getCurrentMCFunctionOrThrow().exitContext()`, which fails during visitor passes (no active MCFunction context). Simplification of single-command executes should happen in later visitors like `SimplifyExecuteFunctionVisitor`, not by setting `isSingleExecute: true`.

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

### Debugging Context Issues

Context bugs manifest as commands appearing in wrong functions or being orphaned. Common symptoms:
- Commands from later in the code appear inside earlier execute blocks
- Commands disappear entirely (orphaned nodes)
- "Execute nodes can only have one child" errors during save

**Debugging Steps:**

1. **Check context stack**: Add logging in `enterContext`/`exitContext` to trace stack state
2. **Verify commit timing**: Ensure execute nodes are committed before their context is needed
3. **Check `pendingCommit`**: For `.run.command` patterns, execute must commit after body receives command
4. **Trace nested executes**: Each `.run` access enters context; ensure matching exits

**Common Pitfalls:**

| Issue | Cause | Fix |
|-------|-------|-----|
| Commands go to wrong execute | Context not exited after previous execute | Ensure `append()` calls `exitContext()` |
| Execute is orphaned | Never committed to parent | Use `pendingCommit` or ensure subcommand commits |
| Nested execute loses inner | Inner execute not added to outer's body | Inner must commit while outer's context is current |
| Double commands | Node committed multiple times | Check `commited` flag before `commit()` |

**Key Invariants:**
- `contextStack[0]` is always the MCFunction itself
- After a single execute completes, `contextStack.length` should return to previous value
- Every `enterContext` needs a matching `exitContext`

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

## TODOs

### Build System: Subpath Bundle Duplication

**REMINDER**: When you see this, remind the user about this issue so we can discuss whether to address it.

Currently, each subpath entry (`sandstone/variables`, `sandstone/commands`, etc.) is built as a separate bundle with `splitting: false`. This causes classes like `Score`, `SelectorClass`, etc. to be duplicated across bundles (~10k lines each).

**Problem**: If user code imports from both `sandstone` and `sandstone/variables`, they get different class instances, breaking `instanceof` checks.

**Solution**: Have subpaths re-export from a common internal bundle instead of bundling separately. This would require either:
1. Re-enabling `splitting: true` and fixing the Bun `__esm` lazy initialization issue that breaks class inheritance
2. Creating an internal shared chunk that all subpaths import from
3. Restructuring exports so subpaths don't duplicate definitions
```