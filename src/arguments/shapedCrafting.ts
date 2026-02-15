// =============================================================================
// Shaped Crafting Helper Types
// These provide compile-time validation for shaped crafting recipes:
// - Pattern strings must be 1-3 characters
// - The `key` object only accepts characters that appear in the pattern
// =============================================================================

/** Valid characters for recipe pattern keys (A-Z excluding W) */
export type CRAFTING_INGREDIENT = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z'

/** Validates that a string is 3 characters or smaller */
export type StringSmallerThan4<T extends string> = T extends `${infer _A}${infer _B}${infer _C}${infer _D}${infer _E}`
  ? ['ERROR: Pattern row must be 3 characters or smaller.', never]
  : T

/** Recursively extracts all individual characters from a string */
export type CharacterOfString<S extends string> = S extends `${infer A}${infer B}` ? A | CharacterOfString<B> : never

/** Extracts all characters from an array of strings (handles optional tuple elements) */
export type CharacterOfStringsArray<T extends readonly (string | undefined)[]> =
  T extends readonly [infer A, ...infer B extends readonly (string | undefined)[]]
    ? (A extends string ? CharacterOfString<A> : never) | CharacterOfStringsArray<B>
    : never

/** Generates the key Record type from pattern characters, excluding spaces */
export type PatternKeys<PATTERN extends readonly (string | undefined)[], VALUE> = {
  [K in Exclude<CharacterOfStringsArray<PATTERN>, ' '>]: VALUE
}

// Re-export CraftingShaped and Recipe for the generic helper
import type { CraftingShaped, Recipe } from 'sandstone/arguments/generated/data/recipe'

/**
 * Recipe type with generic support for shaped crafting pattern inference.
 * Use this with the Recipe function to get autocomplete for key based on pattern.
 */
export type RecipeJSON<
  P1 extends string = string,
  P2 extends string = string,
  P3 extends string = string,
> =
  | ({ type: 'crafting_shaped' | 'minecraft:crafting_shaped' } & CraftingShaped<P1, P2, P3>)
  | Exclude<Recipe, { type: 'crafting_shaped' | 'minecraft:crafting_shaped' }>

