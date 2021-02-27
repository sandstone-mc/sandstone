import type { LiteralUnion } from '@/generalTypes'
import type { ITEMS } from '@arguments/generated'
import type { TagClass } from '@resources'

/**
 * Ensures that the given string has 3 characters or less - else, evaluates as `never`
 *
 * How does this black magic works?
 * Well `${infer X}${infer Y}`, when given a string, will put the 1st character in X and all the rest in Y.
 * If the string has only 1 character, it will be put in X, and Y will be an empty string.
 * If the string has 0 character, X will be an empty string, and Y... Nothing! It will fail the `extends` clause, since it
 * doesn't know what to put in Y.
 *
 * Therefore, testing with 2 variables checks if the string has 1 character or more.
 * Here, we test with 5 variables to see if the string has 4 characters or more. If it does, we evaluate to `never`.
 */
type StringSmallerThan4<T extends string> = (
  T extends `${infer A}${infer B}${infer C}${infer D}${infer E}` ? ['ERROR: String must be 3 characters long, or smaller.', never] : T
)

type CharacterOfString<STRING extends string> = (
  STRING extends `${infer A}${infer B}` ? (A | CharacterOfString<B>) : never
)

type CharacterOfStringsArray<ARRAY extends string[]> = (
  ARRAY extends [infer A, ...infer B] ? (
    A extends string ?
    B extends string[] ?
      (CharacterOfString<A> | CharacterOfStringsArray<B>)
      : never
      : never
  ) : never
)

// A list of all special crafting recipes
type SPECIAL_CRAFTING_RECIPES = (
  'armordye' | 'bannerduplicate' | 'bookcloning' | 'firework_rocket' |
  'firework_star' | 'firework_star_fade' | 'mapcloning' | 'mapextending' |
  'repairitem' | 'shielddecoration' | 'shulkerboxcoloring' | 'tippedarrow' |
  'suspiciousstew'
)

type ItemOrTag = {
  /** The item. */
  item: LiteralUnion<ITEMS>,
} | {
  /** An item tag. */
  tag: string | TagClass<'items'>
}

type CookingRecipe = {
  /** The ingredient, or the list of ingredients. */
  ingredient: ItemOrTag | ItemOrTag[]

  /** The output item of the recipe. */
  result: LiteralUnion<ITEMS>

  /** The output experience of the recipe. */
  experience: number

  /** Optional. The cook time of the recipe in ticks. Defaults to 100 ticks (5 seconds). */
  cookingtime?: number
}

type RecipeKind<NAME extends string, VALUES extends Record<string, unknown> | unknown, HAS_GROUP extends boolean = false> = {
  /**
   * A namespaced ID indicating the type of serializer of the recipe. Must be one of:
   * - `blasting`: Represents a recipe in a blast furnace
   * - `campfire_cooking`: Represents a recipe in a campfire.
   * - `crafting_shape`: Represents a shaped crafting recipe in a crafting table.
   * - `crafting_shapeless`: Represents a shapeless crafting recipe in a crafting table.
   * - `crafting_special_*`: Represents a crafting recipe in a crafting table that is handled with builtin logic instead of being data-driven.
   *    When the "vanilla" data pack is disabled, they can be used to reenable desired builtin crafting recipes.
   * - `smelting`: Represents a recipe in a furnace.
   * - `smithing`: Represents a recipe in a smithing table.
   * - `smoking`: Represents a recipe in a smoker.
   * - `stonecutting`: Represents a recipe in a stonecutter.
   */
  type: NAME
} & VALUES & (
    HAS_GROUP extends true ? {
    /**
     * Used to group multiple recipes together in the recipe book.
     * Example: group all boats recipes.
     */
    group: string
    } : unknown
)

type KeysIngredients<T extends [string, string, string]> = Record<Exclude<CharacterOfStringsArray<T>, ' '>, ItemOrTag | ItemOrTag[]>

export type RecipeType<P1 extends string = string, P2 extends string = string, P3 extends string = string> = (
  RecipeKind<'blasting', CookingRecipe>
  | RecipeKind<'campfire_cooking', CookingRecipe>
  | RecipeKind<'crafting_shaped', {

    /**
     * A list of single-character keys used to describe a pattern for shaped crafting.
     *
     * Each row in the crafting grid is one string in this list containing 3 or less keys.
     *
     * All strings in this list need to have the same amount of keys. A space can be used to indicate an empty spot.
     *
     * @example
     * {
     *   // An acacia boat
     *   patterns: [
     *     'W W',
     *     'WWW',
     *   ],
     *   key: {W: {item: 'minecraft:acacia_wood'}},
     *   result: {item: 'minecraft:acacia_boat'},
     *
     *   // A dropper (cobblestone around one redstone dust at the bottom, center empty)
     *   patterns: [
     *     'CCC',
     *     'C C',
     *     'CRC',
     *   ],
     *   key: {C: {item: 'minecraft:cobblestone'}, R: {item: 'minecraft:redstone'}},
     *   result: {item: 'minecraft:dropper'}
     * }
     */
    pattern: [
      StringSmallerThan4<P1>,
      StringSmallerThan4<P2>?,
      StringSmallerThan4<P3>?,
    ]
  } & ({
    /*
     * Note: you might notice a little trick here.
     * As you can see, the object here is:
     * { pattern: [] } & ({recipe: foo<P1, P2, P3>, result: bar} | never )
     *
     * This (theoretically) should resolve to { pattern: [], recipe: foo<P1, P2, P3>, result: bar }.
     * So why not use the latter, both more simple & more obvious?
     * Because of a small bug in VSCode, who doesn't autocomplete generics-derived types until
     * all properties of the object has been defined. Here, you won't get this keys autocompletion,
     * until you define the `result` property.
     *
     * This little trick forces VSCode to autocomplete properly the keys.
     */

    /**
     * All keys used for this shaped crafting recipe.
     *
     * Each key corresponds to a character present in `pattern`.
     * Their values are either an ingredient, or a list of possible ingredients.
     *
     * @example
     * {
     *    pattern: ['CRC'],
     *    key: {
     *      // C can be a cobblestone or a stone
     *      C: [{item: 'minecraft:cobblestone'}, {item: 'minecraft:stone'}],
     *      R: {item: 'minecraft:redstone'}
     *    }
     * }
     */
    key: KeysIngredients<[P1, P2, P3]>

    /** The output item of the recipe. */
    result: {
      /** The resulting item. */
      item: LiteralUnion<ITEMS>

      /**
       * Optional. The amount of the item.
       * @default 1
       */
      count?: number
    }
   } | never)
  >
  | RecipeKind<`crafting_special_${SPECIAL_CRAFTING_RECIPES}`, unknown, false>
  | RecipeKind<'smelting', CookingRecipe>
  | RecipeKind<'smithing', {
      /** Ingredient specifying an item to be upgraded. */
      base: ItemOrTag
      /** Item that will be used for upgrading. */
      addition: ItemOrTag
      /** Item specifying the resulting type of the upgraded item. */
      result: LiteralUnion<ITEMS>
  }>
  | RecipeKind<'smoking', CookingRecipe>
  | RecipeKind<'stonecutting', {
    /** The ingredient or the list of ingredients for the recipe. */
    ingredient: ItemOrTag | ItemOrTag[]
    /** The output item of the recipe. */
    result: LiteralUnion<ITEMS>
    /** The amount of the output item. */
    count: number
  }>
)
