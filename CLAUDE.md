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

Sandstone is a TypeScript library for generating Minecraft datapacks and resource packs. The architecture is modular with clear separation of concerns:

### Core Modules

- **`src/index.ts`**: Main entry point exporting all public APIs including commands, resources, variables, and utilities
- **`src/core/`**: Core functionality including SandstoneCore class, resource management, and the visitor pattern for AST transformations
- **`src/pack/`**: Pack creation and management, including SandstonePack class and build visitors
- **`src/commands/`**: Minecraft command implementations organized by category (block, entity, player, server, world)
- **`src/arguments/`**: Type-safe argument definitions for commands and resources, including generated types from Minecraft data
- **`src/variables/`**: Variable system including Scores, Selectors, NBT handling, and coordinate systems  
- **`src/flow/`**: Control flow abstractions (if/else, loops, switches) that compile to optimized Minecraft commands
- **`src/core/resources/`**: Resource classes for both datapacks (functions, advancements, loot tables) and resource packs (textures, models, sounds)

### Key Design Patterns

- **Visitor Pattern**: Used extensively for AST transformations in `src/pack/visitors/` to optimize generated commands
- **Resource Management**: Central resource registry with conflict resolution strategies
- **Type Safety**: Heavy use of TypeScript generics and literal types for Minecraft data validation
- **Fluent API**: Command chaining and builder patterns throughout the API surface

### Build System

- **tsup**: Primary build tool configured in `tsup.config.mjs` for CommonJS output
- **TypeScript**: Separate type generation step required via `build-types` script
- **Package Setup**: Post-build setup script in `scripts/setupPackage.mjs` handles final package preparation
- **Biome**: Used for linting and formatting instead of ESLint/Prettier

### Generated Code

The `src/arguments/generated/` directory contains auto-generated TypeScript definitions from Minecraft registry data. These provide type-safe access to blocks, items, entities, and other game resources.