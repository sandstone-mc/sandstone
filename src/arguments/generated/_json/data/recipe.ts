import type { JsonMinMaxBounds } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonFireworkShape } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonPotionsPredicate } from 'sandstone/arguments/generated/_json/world/component/predicate.ts'
import type { JsonItemStack, JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { CRAFTING_INGREDIENT, PatternKeys, StringSmallerThan4 } from 'sandstone/arguments'
import type { JsonNBTList, NBTFloat, NBTInt, RecipeClass, TagClass, TrimPatternClass } from 'sandstone'

export type JsonBrewing = {
  /**
   * The original potion.
   */
  input: JsonPotionIngredient,
  /**
   * The ingredient.
   */
  reagent: JsonPotionIngredient,
  output: JsonItemStackTemplate,
}

export type JsonCookingBookCategory = ('food' | 'blocks' | 'misc')

export type JsonCookingBookInfo = {
  /**
   * Identifier to group multiple recipes in the recipe book.
   */
  group?: string,
  /**
   * Identifier for the category this goes in the recipe book.
   *
   * Value:
   *
   *  - Food(`food`)
   *  - Blocks(`blocks`)
   *  - Misc(`misc`)
   */
  category?: JsonCookingBookCategory,
}

export type JsonCraftingBookCategory = ('building' | 'redstone' | 'equipment' | 'misc')

export type JsonCraftingBookInfo = {
  /**
   * Identifier to group multiple recipes in the recipe book.
   */
  group?: string,
  /**
   * Identifier for the category this goes in the recipe book.
   *
   * Value:
   *
   *  - Building(`building`)
   *  - Redstone(`redstone`)
   *  - Equipment(`equipment`)
   *  - Misc(`misc`)
   */
  category?: JsonCraftingBookCategory,
}

export type JsonCraftingDecoratedPot = {
  back: JsonIngredient,
  left: JsonIngredient,
  right: JsonIngredient,
  front: JsonIngredient,
  /**
   * The `pot_decorations` component will store the 4 ingredients.
   */
  result: JsonItemStackTemplate,
}

export type JsonCraftingDye = (JsonNotificationInfo & JsonCraftingBookInfo & {
  /**
   * The item to be dyed. \
   * Its `dyed_color` component will be dyed. The other components are copied.
   */
  target: JsonIngredient,
  /**
   * The items to provide dye color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: JsonIngredient,
  result: JsonItemStackTemplate,
})

export type JsonCraftingImbue = (JsonNotificationInfo & JsonCraftingBookInfo & {
  /**
   * The item to provide potion effect. \
   * Its `potion_contents` component will be copied. \
   * This item is placed at the center grid.
   */
  source: JsonIngredient,
  /**
   * Additional ingredients. \
   * 8 `material` items are required to surroud the `source` item.
   */
  material: JsonIngredient,
  result: JsonItemStackTemplate,
})

export type JsonCraftingIngredients = ({
  [Key in Extract<CRAFTING_INGREDIENT, string>]?: JsonIngredient
})

export type JsonCraftingShaped<P1 extends string = string, P2 extends string = string, P3 extends string = string> = (JsonNotificationInfo & JsonCraftingBookInfo & {
  pattern: [
    StringSmallerThan4<P1>,
        StringSmallerThan4<P2>?,
        StringSmallerThan4<P3>?,
  ],
  key: PatternKeys<[
    P1,
    P2,
    P3,
  ], JsonIngredient>,
  result: JsonItemStackTemplate,
})

export type JsonCraftingShapeless = (JsonNotificationInfo & JsonCraftingBookInfo & {
  /**
   * Value:
   * List length range: 1..9
   */
  ingredients: JsonNBTList<JsonIngredient, {
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
    max: 9,
  }>,
  result: JsonItemStackTemplate,
})

export type JsonCraftingSpecialBannerDuplicate = {
  /**
   * The banner item. The item type is required to be `BannerItem`. \
   * Exactly 2 banners of the same color are required. \
   * The one with patterns is viewed as "source". Its components will be copied. \
   * The other is viewed as "target". It is required to have no patterns. \
   * \
   * The source banner will be kept in the crafting grid.
   */
  banner: JsonIngredient,
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialBookCloning = {
  /**
   * The book item. \
   * Its `written_book_contents` component will be copied, with `generation` value increased by 1. \
   * The other components are copied as-is. \
   * \
   * The book will be kept in the crafting grid.
   */
  source: JsonIngredient,
  /**
   * Additional ingredients. \
   * Multiple materials can be used at the same time. \
   * The number of materials beyond the first one will be added to the result count.
   */
  material: JsonIngredient,
  /**
   * Limits the generation of the `source` item that can be copied.
   * Defaults to allow generation 0 and 1 (original and first copy).
   */
  allowed_generations?: JsonMinMaxBounds<(NBTInt<{
    min: 0,
    max: 2,
  }> | number)>,
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialFireworkRocket = {
  /**
   * Additional ingredient. \
   * Exactly 1 additional ingredient is required.
   */
  shell: JsonIngredient,
  /**
   * The fuel ingredient. \
   * The count of fuel ingredients controls the `flight_duration` field. \
   * Only 1 ~ 3 fuels are allowed.
   */
  fuel: JsonIngredient,
  /**
   * The firework star ingredient. \
   * Provides explosion data by the `firework_explosion` component. \
   * Any count of stars (including 0) are allowed.
   */
  star: JsonIngredient,
  /**
   * The `fireworks` component is controlled by `fuel` and `star`.
   */
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialFireworkStar = {
  /**
   * If this ingredient is provided, the result will have `has_trail` field set.
   */
  trail: JsonIngredient,
  /**
   * If this ingredient is provided, the result will have `has_twinkle` field set.
   */
  twinkle: JsonIngredient,
  /**
   * Additional ingredient. \
   * Exactly 1 additional ingredient is required.
   */
  fuel: JsonIngredient,
  /**
   * The items to provide explosion color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: JsonIngredient,
  /**
   * If one of the ingredients is provided, the result will have the corresponding `shape` value. \
   * If no shape ingredient is provided, the shape will be `small_ball`.
   */
  shapes: ({
    [Key in Extract<JsonFireworkShape, string>]?: JsonIngredient
  }),
  /**
   * The `firework_explosion` component is controlled by the ingredients.
   */
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialFireworkStarFade = {
  /**
   * The firework star item. \
   * The fade effect of its `firework_explosion` will be changed. \
   * The other components are copied.
   */
  target: JsonIngredient,
  /**
   * The items to provide fade color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: JsonIngredient,
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialMapExtending = {
  /**
   * The map item. \
   * The `map_id` component is used to determine the resulting item. \
   * The other components are copied. \
   * This item is placed at the center grid. \
   * \
   * The source map will be kept in the crafting grid.
   */
  map: JsonIngredient,
  /**
   * Additional ingredients. \
   * 8 `material` items are required to surroud the `map` item.
   */
  material: JsonIngredient,
  /**
   * The previewing result will have `map_post_processing` transient component. \
   * The crafted result will have a new `map_id` component, which shows the extended version of the original map.
   */
  result: JsonItemStackTemplate,
}

export type JsonCraftingSpecialShieldDecoration = {
  /**
   * The item to be decorated. It is required to have no patterns. \
   * Its components, except `base_color` and `banner_patterns`, are copied.
   */
  target: JsonIngredient,
  /**
   * The banner item. The item type is required to be `BannerItem`. \
   * Determines the `base_color` component of the resulting item.
   */
  banner: JsonIngredient,
  result: JsonItemStackTemplate,
}

export type JsonCraftingTransmute = (JsonNotificationInfo & JsonCraftingBookInfo & {
  /**
   * The ingredient that will transfer its data components to the result item.
   */
  input: JsonIngredient,
  /**
   * An additional ingredient.
   */
  material: JsonIngredient,
  /**
   * The allowed count of material.
   * Defaults to `1`.
   */
  material_count?: JsonMinMaxBounds<(NBTInt<{
    min: 1,
    max: 8,
  }> | number)>,
  /**
   * When true, the number of materials will be added to the result count. \
   * Defaults to `false`.
   */
  add_material_count_to_result?: boolean,
  /**
   * The result item that will be merged with the input ingredient.
   */
  result: (JsonItemStack | JsonRegistry['minecraft:item']),
})

export type JsonFireworkShapeIngredients = ({
  [Key in Extract<JsonFireworkShape, string>]?: JsonIngredient
})

/**
 * *either*
 *
 * List length range: 1..
 *
 * *or*
 *
 * *item 1*
 */
export type JsonIngredient = (JsonNBTList<JsonRegistry['minecraft:item'], {
  leftExclusive: false,
  min: 1,
}> | (JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>))

export type JsonIngredientItem = {
  item: JsonRegistry['minecraft:item'],
}

export type JsonIngredientTag = {
  tag: (JsonRegistry['minecraft:tag/item']),
}

export type JsonIngredientValue = ({
  item: JsonRegistry['minecraft:item'],
} | {
  tag: (JsonRegistry['minecraft:tag/item']),
})

export type JsonItemResult = {
  item: JsonRegistry['minecraft:item'],
  count?: (NBTInt | number),
}

export type JsonNotificationInfo = {
  /**
   * Determines if a notification is shown when unlocking this recipe.
   * Defaults to `true`.
   */
  show_notification?: boolean,
}

export type JsonOptionalSmithingIngredients = {
  /**
   * Ingredient specifying an item to be trimmed. (eg. `"#minecraft:trimmable_armor"`)
   */
  base?: JsonIngredient,
  /**
   * Material that will be used. (eg. `"#minecraft:trim_materials"`)
   */
  addition?: JsonIngredient,
  /**
   * Template item that will be used for the pattern.
   */
  template?: JsonIngredient,
}

export type JsonPotionIngredient = {
  item: JsonIngredient,
  potion_contents?: JsonPotionsPredicate,
}

export type JsonRecipe = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:recipe_serializer'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolRecipeSerializer
    ? JsonSymbolRecipeSerializer[S]
    : JsonSymbolRecipeSerializer<'%unknown'>))
}[Extract<JsonRegistry['minecraft:recipe_serializer'], string>])>

export type JsonRecipeListRef = ((
  | JsonRegistry['minecraft:recipe'] | `#${string}:${string}` | TagClass<'recipe'> | RecipeClass)
  | Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>)

export type JsonRequiredSmithingIngredients = {
  /**
   * Ingredient specifying an item to be trimmed. (eg. `{ "tag": "minecraft:trimmable_armor" }`)
   */
  base: JsonIngredient,
  /**
   * Material that will be used. (eg. `{ "tag": "minecraft:trim_materials" }`)
   */
  addition: JsonIngredient,
  /**
   * Template item that will be used for the pattern.
   */
  template: JsonIngredient,
}

export type JsonSmelting = (JsonNotificationInfo & JsonCookingBookInfo & {
  ingredient: JsonIngredient,
  result: JsonItemStackTemplate,
  experience?: (NBTFloat | number),
  cookingtime?: (NBTInt | number),
})

export type JsonSmithing = {
  base: JsonIngredientValue,
  addition: JsonIngredientValue,
  result: JsonItemResult,
}

export type JsonSmithingIngredients = {
  /**
   * Ingredient specifying an item to be trimmed. (eg. `"#minecraft:trimmable_armor"`)
   */
  base?: JsonIngredient,
  /**
   * Material that will be used. (eg. `"#minecraft:trim_materials"`)
   */
  addition?: JsonIngredient,
  /**
   * Template item that will be used for the pattern.
   */
  template?: JsonIngredient,
}

export type JsonSmithingTransform = (JsonNotificationInfo & {
  /**
   * Ingredient specifying an item to be transformed.
   */
  base: JsonIngredient,
  /**
   * Resulting transformed item.
   */
  result: JsonItemStackTemplate,
} & {
  /**
   * Material that will be used.
   */
  addition?: JsonIngredient,
  /**
   * Template item that will be used for the pattern.
   */
  template?: JsonIngredient,
})

export type JsonSmithingTransformResult = {
  item: JsonRegistry['minecraft:item'],
}

export type JsonSmithingTrim = (JsonNotificationInfo & {
  /**
   * Ingredient specifying an item to be trimmed.
   */
  base: JsonIngredient,
  /**
   * Material that will be used.
   */
  addition: JsonIngredient,
  /**
   * Template item that will be used for the pattern.
   */
  template: JsonIngredient,
  /**
   * The trim pattern to apply to the result item.
   */
  pattern: (JsonRegistry['minecraft:trim_pattern'] | TrimPatternClass),
})

export type JsonStonecutting = (JsonNotificationInfo & {
  ingredient: JsonIngredient,
  result: JsonItemStackTemplate,
})
type JsonRecipeSerializerDispatcherMap = {
  'blasting': JsonRecipeSerializerBlasting,
  'minecraft:blasting': JsonRecipeSerializerBlasting,
  'brewing': JsonRecipeSerializerBrewing,
  'minecraft:brewing': JsonRecipeSerializerBrewing,
  'campfire_cooking': JsonRecipeSerializerCampfireCooking,
  'minecraft:campfire_cooking': JsonRecipeSerializerCampfireCooking,
  'crafting_decorated_pot': JsonRecipeSerializerCraftingDecoratedPot,
  'minecraft:crafting_decorated_pot': JsonRecipeSerializerCraftingDecoratedPot,
  'crafting_dye': JsonRecipeSerializerCraftingDye,
  'minecraft:crafting_dye': JsonRecipeSerializerCraftingDye,
  'crafting_imbue': JsonRecipeSerializerCraftingImbue,
  'minecraft:crafting_imbue': JsonRecipeSerializerCraftingImbue,
  'crafting_shaped': JsonRecipeSerializerCraftingShaped,
  'minecraft:crafting_shaped': JsonRecipeSerializerCraftingShaped,
  'crafting_shapeless': JsonRecipeSerializerCraftingShapeless,
  'minecraft:crafting_shapeless': JsonRecipeSerializerCraftingShapeless,
  'crafting_special_bannerduplicate': JsonRecipeSerializerCraftingSpecialBannerduplicate,
  'minecraft:crafting_special_bannerduplicate': JsonRecipeSerializerCraftingSpecialBannerduplicate,
  'crafting_special_bookcloning': JsonRecipeSerializerCraftingSpecialBookcloning,
  'minecraft:crafting_special_bookcloning': JsonRecipeSerializerCraftingSpecialBookcloning,
  'crafting_special_firework_rocket': JsonRecipeSerializerCraftingSpecialFireworkRocket,
  'minecraft:crafting_special_firework_rocket': JsonRecipeSerializerCraftingSpecialFireworkRocket,
  'crafting_special_firework_star': JsonRecipeSerializerCraftingSpecialFireworkStar,
  'minecraft:crafting_special_firework_star': JsonRecipeSerializerCraftingSpecialFireworkStar,
  'crafting_special_firework_star_fade': JsonRecipeSerializerCraftingSpecialFireworkStarFade,
  'minecraft:crafting_special_firework_star_fade': JsonRecipeSerializerCraftingSpecialFireworkStarFade,
  'crafting_special_mapextending': JsonRecipeSerializerCraftingSpecialMapextending,
  'minecraft:crafting_special_mapextending': JsonRecipeSerializerCraftingSpecialMapextending,
  'crafting_special_shielddecoration': JsonRecipeSerializerCraftingSpecialShielddecoration,
  'minecraft:crafting_special_shielddecoration': JsonRecipeSerializerCraftingSpecialShielddecoration,
  'crafting_transmute': JsonRecipeSerializerCraftingTransmute,
  'minecraft:crafting_transmute': JsonRecipeSerializerCraftingTransmute,
  'smelting': JsonRecipeSerializerSmelting,
  'minecraft:smelting': JsonRecipeSerializerSmelting,
  'smithing_transform': JsonRecipeSerializerSmithingTransform,
  'minecraft:smithing_transform': JsonRecipeSerializerSmithingTransform,
  'smithing_trim': JsonRecipeSerializerSmithingTrim,
  'minecraft:smithing_trim': JsonRecipeSerializerSmithingTrim,
  'smoking': JsonRecipeSerializerSmoking,
  'minecraft:smoking': JsonRecipeSerializerSmoking,
  'stonecutting': JsonRecipeSerializerStonecutting,
  'minecraft:stonecutting': JsonRecipeSerializerStonecutting,
}
type JsonRecipeSerializerKeys = keyof JsonRecipeSerializerDispatcherMap
type JsonRecipeSerializerFallback = (
  | JsonRecipeSerializerBlasting
  | JsonRecipeSerializerBrewing
  | JsonRecipeSerializerCampfireCooking
  | JsonRecipeSerializerCraftingDecoratedPot
  | JsonRecipeSerializerCraftingDye
  | JsonRecipeSerializerCraftingImbue
  | JsonRecipeSerializerCraftingShaped
  | JsonRecipeSerializerCraftingShapeless
  | JsonRecipeSerializerCraftingSpecialBannerduplicate
  | JsonRecipeSerializerCraftingSpecialBookcloning
  | JsonRecipeSerializerCraftingSpecialFireworkRocket
  | JsonRecipeSerializerCraftingSpecialFireworkStar
  | JsonRecipeSerializerCraftingSpecialFireworkStarFade
  | JsonRecipeSerializerCraftingSpecialMapextending
  | JsonRecipeSerializerCraftingSpecialShielddecoration
  | JsonRecipeSerializerCraftingTransmute
  | JsonRecipeSerializerSmelting
  | JsonRecipeSerializerSmithingTransform
  | JsonRecipeSerializerSmithingTrim
  | JsonRecipeSerializerSmoking
  | JsonRecipeSerializerStonecutting
  | JsonRecipeSerializerFallbackType)
export type JsonRecipeSerializerFallbackType = Record<string, never>
type JsonRecipeSerializerBlasting = JsonSmelting
type JsonRecipeSerializerBrewing = JsonBrewing
type JsonRecipeSerializerCampfireCooking = JsonSmelting
type JsonRecipeSerializerCraftingDecoratedPot = JsonCraftingDecoratedPot
type JsonRecipeSerializerCraftingDye = JsonCraftingDye
type JsonRecipeSerializerCraftingImbue = JsonCraftingImbue
type JsonRecipeSerializerCraftingShaped = JsonCraftingShaped
type JsonRecipeSerializerCraftingShapeless = JsonCraftingShapeless
type JsonRecipeSerializerCraftingSpecialBannerduplicate = JsonCraftingSpecialBannerDuplicate
type JsonRecipeSerializerCraftingSpecialBookcloning = JsonCraftingSpecialBookCloning
type JsonRecipeSerializerCraftingSpecialFireworkRocket = JsonCraftingSpecialFireworkRocket
type JsonRecipeSerializerCraftingSpecialFireworkStar = JsonCraftingSpecialFireworkStar
type JsonRecipeSerializerCraftingSpecialFireworkStarFade = JsonCraftingSpecialFireworkStarFade
type JsonRecipeSerializerCraftingSpecialMapextending = JsonCraftingSpecialMapExtending
type JsonRecipeSerializerCraftingSpecialShielddecoration = JsonCraftingSpecialShieldDecoration
type JsonRecipeSerializerCraftingTransmute = JsonCraftingTransmute
type JsonRecipeSerializerSmelting = JsonSmelting
type JsonRecipeSerializerSmithingTransform = JsonSmithingTransform
type JsonRecipeSerializerSmithingTrim = JsonSmithingTrim
type JsonRecipeSerializerSmoking = JsonSmelting
type JsonRecipeSerializerStonecutting = JsonStonecutting
export type JsonSymbolRecipeSerializer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonRecipeSerializerDispatcherMap
  : CASE extends 'keys'
    ? JsonRecipeSerializerKeys
    : CASE extends '%fallback'
      ? JsonRecipeSerializerFallback
      : CASE extends '%unknown' ? JsonRecipeSerializerFallbackType : never
