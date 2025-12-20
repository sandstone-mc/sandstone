# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Build**: `pnpm run build` - Builds the project using tsup and runs setup
- **Watch**: `pnpm run watch` - Builds with watch mode
- **Type checking**: `pnpm run build-types` - Generates TypeScript declaration files
- **Setup**: `pnpm run setup` - Builds types and sets up package (required after build)
- **Lint**: `pnpm run lint` or `biome lint src` - Lints TypeScript files using Biome
- **Format**: `pnpm run format` or `biome format --write src` - Formats code using Biome
- **Check**: `pnpm run check` or `biome check --write src` - Runs Biome check with auto-fix

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

## Known Type Errors

Files with type errors requiring fixes (excluding `src/arguments/generated/`):

10. `src/core/resources/datapack/mcfunction.ts` - Type mismatch
11. `src/core/resources/resource.ts` - Type mismatch
13. `src/flow/conditions/resources/tag.ts` - Overload mismatch