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

/** Selector literals that can target multiple players (excludes @e, @n) */
type MultiplePlayerSelectorLiteral = '@a' | '@p' | '@r' | '@s'

// ===== String argument validation types =====

/**
 * Validates a string for single entity context.
 * Rejects '@a' and '@e' literals, allows everything else.
 */
export type ValidateSingleEntityString<T extends string> = T extends '@a' | '@e' ? never : T

/**
 * Validates a string for single player context.
 * Rejects '@a', '@e', and '@n' literals, allows everything else.
 */
export type ValidateSinglePlayerString<T extends string> = T extends '@a' | '@e' | '@n' ? never : T

/**
 * Validates a string for multiple players context.
 * Rejects '@e' and '@n' literals, allows everything else.
 */
export type ValidateMultiplePlayersString<T extends string> = T extends '@e' | '@n' ? never : T

// ===== Non-generic string argument types (for backwards compatibility) =====

/**
 * String argument for single entity (non-generic version).
 * Use ValidateSingleEntityString<T> in generic contexts for full validation.
 */
type SingleEntityStringArgument = SingleEntitySelectorLiteral | (string & {})

/**
 * String argument for single player (non-generic version).
 * Use ValidateSinglePlayerString<T> in generic contexts for full validation.
 */
type SinglePlayerStringArgument = SinglePlayerSelectorLiteral | (string & {})

/**
 * String argument for multiple entities.
 */
type MultipleEntityStringArgument = AllSelectorLiterals | (string & {})

/**
 * String argument for multiple players (non-generic version).
 * Use ValidateMultiplePlayersString<T> in generic contexts for full validation.
 */
type MultiplePlayerStringArgument = MultiplePlayerSelectorLiteral | (string & {})

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

// ===== Generic argument types with string literal validation =====

/**
 * Matches SelectorPickClass instances that are NOT SelectorClass.
 * SelectorClass has __selectorBrand, other SelectorPickClass subclasses (UUIDClass, EntityLabel) don't.
 * This allows accepting "picked" entities without enforcing IsPlayer, while still
 * enforcing IsPlayer on raw SelectorClass instances.
 */
type PureSelectorPickClass<IsSingle extends boolean, IsPlayer extends boolean> =
  SelectorPickClass<IsSingle, IsPlayer> & { __selectorBrand?: never }

/**
 * Generic version of SinglePlayerArgument that validates string literals.
 * Use this with a generic type parameter to reject invalid selectors like '@e'.
 *
 * @example
 * ```ts
 * function foo<T extends string>(target: SinglePlayerArgumentOf<false, T>) { ... }
 * foo('@s')  // OK
 * foo('@e')  // Error: '@e' is not assignable to 'never'
 * ```
 */
export type SinglePlayerArgumentOf<MACRO extends boolean, T extends string> =
  | ValidateSinglePlayerString<T>
  | SelectorClass<MACRO, true, true>
  // Pure SelectorPickClass (not SelectorClass) - player not enforced
  | PureSelectorPickClass<true, true>
  | PureSelectorPickClass<true, false>
  | PureSelectorPickClass<true, boolean>

/**
 * Generic version of SingleEntityArgument that validates string literals.
 * Use this with a generic type parameter to reject invalid selectors like '@e' or '@a'.
 *
 * @example
 * ```ts
 * function foo<T extends string>(target: SingleEntityArgumentOf<false, T>) { ... }
 * foo('@s')  // OK
 * foo('@e')  // Error: '@e' is not assignable to 'never'
 * ```
 */
export type SingleEntityArgumentOf<MACRO extends boolean, T extends string> =
  | ValidateSingleEntityString<T>
  | SelectorClass<MACRO, true, true>
  | SelectorClass<MACRO, true, false>
  // Pure SelectorPickClass (not SelectorClass) - player not enforced
  | PureSelectorPickClass<true, true>
  | PureSelectorPickClass<true, false>
  | PureSelectorPickClass<true, boolean>
  | UUIDClass<any>

/**
 * Generic version of MultiplePlayersArgument that validates string literals.
 * Use this with a generic type parameter to reject invalid selectors like '@e' or '@n'.
 */
export type MultiplePlayersArgumentOf<MACRO extends boolean, T extends string> =
  | ValidateMultiplePlayersString<T>
  | SelectorClass<MACRO, true, true>
  | SelectorClass<MACRO, false, true>
  // Pure SelectorPickClass (not SelectorClass) - player not enforced
  | PureSelectorPickClass<true, true>
  | PureSelectorPickClass<true, false>
  | PureSelectorPickClass<true, boolean>
  | PureSelectorPickClass<false, true>
  | PureSelectorPickClass<false, false>
  | PureSelectorPickClass<false, boolean>
  | PureSelectorPickClass<boolean, boolean>
