import type { SelectorClass, SelectorPickClass } from 'sandstone/variables'
import type { UUIDClass } from 'sandstone/variables/UUID'
import type { _ShowAlias } from './basics'

// ===== Base selector literal types =====

/** Selector literals that inherently target a single entity */
type SingleEntitySelectorLiteral = '@s' | '@p' | '@n' | '@r'

/** Selector literals that inherently target only players (single) */
type SinglePlayerSelectorLiteral = '@s' | '@p' | '@r'

/** All base selector literals */
type AllSelectorLiterals = '@s' | '@p' | '@a' | '@e' | '@n' | '@r'

/** Selector literals that can target multiple entities */
type MultipleEntitySelectorLiteral = AllSelectorLiterals

/** Selector literals that can target multiple players (excludes @e, @n) */
type MultiplePlayerSelectorLiteral = '@a' | '@p' | '@r' | '@s'

// ===== String argument types with exclusions =====

/**
 * Represents a player name or UUID string.
 * Uses `string & {}` to give lower priority than specific string literals,
 * allowing TypeScript to reject known-bad literals when explicitly passed.
 */
type PlayerNameOrUUID = string & {}

/**
 * String argument for single entity: allows single-entity selectors and player names,
 * but NOT @a or @e literals.
 */
type SingleEntityStringArgument = SingleEntitySelectorLiteral | Exclude<PlayerNameOrUUID, '@a' | '@e'>

/**
 * String argument for single player: allows single-player selectors and player names,
 * but NOT @a, @e, or @n literals.
 */
type SinglePlayerStringArgument = SinglePlayerSelectorLiteral | Exclude<PlayerNameOrUUID, '@a' | '@e' | '@n'>

/**
 * String argument for multiple entities: allows all selectors and any string.
 */
type MultipleEntityStringArgument = AllSelectorLiterals | PlayerNameOrUUID

/**
 * String argument for multiple players: allows player-targeting selectors and player names,
 * but NOT @e or @n literals.
 */
type MultiplePlayerStringArgument = MultiplePlayerSelectorLiteral | Exclude<PlayerNameOrUUID, '@e' | '@n'>

// ===== Selector class type combinations =====

/** Selector classes that target multiple entities (any type) */
type MultipleEntitiesSelector<MACRO extends boolean = false> =
  | SelectorClass<MACRO, false, false>
  | SelectorPickClass<false, false>

/** Selector classes that target a single entity (any type) */
type SingleEntitySelector<MACRO extends boolean = false> =
  | SelectorClass<MACRO, true, false>
  | SelectorPickClass<true, false>

/** Selector classes that target multiple players only */
type MultiplePlayersSelector<MACRO extends boolean = false> =
  | SelectorClass<MACRO, false, true>
  | SelectorPickClass<false, true>

/** Selector classes that target a single player only */
type SinglePlayerSelector<MACRO extends boolean = false> =
  | SelectorClass<MACRO, true, true>
  | SelectorPickClass<true, true>

// ===== Combined selector argument type =====

export type SelectorArgument<
  MACRO extends boolean = false,
  MustBeSingle extends boolean = false,
  MustBePlayer extends boolean = false,
> = MustBeSingle extends true
  ? MustBePlayer extends true
    // Single player
    ? SinglePlayerStringArgument | SinglePlayerSelector<MACRO>
    // Single entity (any type)
    : SingleEntityStringArgument | SingleEntitySelector<MACRO>
  : MustBePlayer extends true
    // Multiple players
    ? MultiplePlayerStringArgument | MultiplePlayersSelector<MACRO>
    // Multiple entities (any type)
    : MultipleEntityStringArgument | MultipleEntitiesSelector<MACRO>

/*
 * The `| _ShowAlias` is to prevent Typescript from showing the ugly "SelectorClass<??, ??>",
 * and to instead show the given name (e.g. SinglePlayerArgument).
 */

/**
 * Argument for commands that require a single player target.
 * - Accepts: '@s' | '@p' | '@r' (single-targeting player selectors)
 * - Accepts: Player names/UUIDs (any string except '@a', '@e', '@n')
 * - Accepts: SelectorClass<MACRO, true, true> (single, player-only selector)
 * - Accepts: SelectorPickClass<true, boolean> (picked single entity - player not enforced at type level)
 */
export type SinglePlayerArgument<MACRO extends boolean = false> =
  | SinglePlayerStringArgument
  | SelectorClass<MACRO, true, true>
  | SelectorPickClass<true, true>
  | SelectorPickClass<true, false>
  | SelectorPickClass<true, boolean>
  | _ShowAlias

/**
 * Argument for commands that require a single entity target (any entity type).
 * - Accepts: '@s' | '@p' | '@n' | '@r' (single-targeting selectors)
 * - Accepts: Player names/UUIDs (any string except '@a', '@e')
 * - Accepts: SelectorClass<MACRO, true, boolean> (single entity, any type)
 * - Accepts: SelectorPickClass<true, boolean> (picked single entity)
 * - Accepts: UUIDClass<any> (entity UUID)
 */
export type SingleEntityArgument<MACRO extends boolean = false> =
  | SingleEntityStringArgument
  | SelectorClass<MACRO, true, true>
  | SelectorClass<MACRO, true, false>
  | SelectorPickClass<true, true>
  | SelectorPickClass<true, false>
  | SelectorPickClass<true, boolean>
  | UUIDClass<any>
  | _ShowAlias

/**
 * Argument for commands that allow multiple players to be targeted.
 * - Accepts: '@a' | '@p' | '@r' | '@s' (player-targeting selectors)
 * - Accepts: Player names/UUIDs (any string except '@e', '@n')
 * - Accepts: SelectorClass<MACRO, boolean, true> (player-only selector, single or multiple)
 * - Accepts: SelectorPickClass<boolean, boolean> (picked entity - player not enforced at type level)
 */
export type MultiplePlayersArgument<MACRO extends boolean = false> =
  | MultiplePlayerStringArgument
  | SelectorClass<MACRO, true, true>
  | SelectorClass<MACRO, false, true>
  | SelectorPickClass<true, true>
  | SelectorPickClass<true, false>
  | SelectorPickClass<true, boolean>
  | SelectorPickClass<false, true>
  | SelectorPickClass<false, false>
  | SelectorPickClass<false, boolean>
  | SelectorPickClass<boolean, boolean>
  | _ShowAlias

/**
 * Argument for commands that allow multiple entities of any type to be targeted.
 * - Accepts: All selector literals ('@e' | '@a' | '@s' | '@p' | '@n' | '@r')
 * - Accepts: Any string (player names, UUIDs)
 * - Accepts: SelectorClass<MACRO, boolean, boolean> (any selector)
 * - Accepts: SelectorPickClass<boolean, boolean> (any picked entity)
 */
export type MultipleEntitiesArgument<MACRO extends boolean = false> =
  | MultipleEntityStringArgument
  | SelectorClass<MACRO, true, true>
  | SelectorClass<MACRO, true, false>
  | SelectorClass<MACRO, false, true>
  | SelectorClass<MACRO, false, false>
  | SelectorPickClass<true, true>
  | SelectorPickClass<true, false>
  | SelectorPickClass<true, boolean>
  | SelectorPickClass<false, true>
  | SelectorPickClass<false, false>
  | SelectorPickClass<false, boolean>
  | SelectorPickClass<boolean, boolean>
  | _ShowAlias
