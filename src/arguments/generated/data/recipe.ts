import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { FireworkShape } from 'sandstone/arguments/generated/world/component/item.ts'
import type { ItemStack, ItemStackTemplate } from 'sandstone/arguments/generated/world/item.ts'
import type { PatternKeys, StringSmallerThan4 } from 'sandstone/arguments'
import type { NBTFloat, NBTInt, NBTList, TagClass, TrimPatternClass } from 'sandstone'

export type CookingBookCategory = ('food' | 'blocks' | 'misc')

export type CookingBookInfo = {
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
  category?: CookingBookCategory,
}

export type CraftingBookCategory = ('building' | 'redstone' | 'equipment' | 'misc')

export type CraftingBookInfo = {
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
  category?: CraftingBookCategory,
}

export type CraftingDecoratedPot = {
  back: Ingredient,
  left: Ingredient,
  right: Ingredient,
  front: Ingredient,
  /**
   * The `pot_decorations` component will store the 4 ingredients.
   */
  result: ItemStackTemplate,
}

export type CraftingDye = (NotificationInfo & CraftingBookInfo & {
  /**
   * The item to be dyed. \
   * Its `dyed_color` component will be dyed. The other components are copied.
   */
  target: Ingredient,
  /**
   * The items to provide dye color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: Ingredient,
  result: ItemStackTemplate,
})

export type CraftingImbue = (NotificationInfo & CraftingBookInfo & {
  /**
   * The item to provide potion effect. \
   * Its `potion_contents` component will be copied. \
   * This item is placed at the center grid.
   */
  source: Ingredient,
  /**
   * Additional ingredients. \
   * 8 `material` items are required to surroud the `source` item.
   */
  material: Ingredient,
  result: ItemStackTemplate,
})

export type CraftingShaped<P1 extends string = string, P2 extends string = string, P3 extends string = string> = (NotificationInfo & CraftingBookInfo & {
  pattern: [
    StringSmallerThan4<P1>,
        StringSmallerThan4<P2>?,
        StringSmallerThan4<P3>?,
  ],
  key: PatternKeys<[
    P1,
    P2,
    P3,
  ], Ingredient>,
  result: ItemStackTemplate,
})

export type CraftingShapeless = (NotificationInfo & CraftingBookInfo & {
  /**
   * Value:
   * List length range: 1..9
   */
  ingredients: NBTList<Ingredient, {
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
    max: 9,
  }>,
  result: ItemStackTemplate,
})

export type CraftingSpecialBannerDuplicate = {
  /**
   * The banner item. The item type is required to be `BannerItem`. \
   * Exactly 2 banners of the same color are required. \
   * The one with patterns is viewed as "source". Its components will be copied. \
   * The other is viewed as "target". It is required to have no patterns. \
   * \
   * The source banner will be kept in the crafting grid.
   */
  banner: Ingredient,
  result: ItemStackTemplate,
}

export type CraftingSpecialBookCloning = {
  /**
   * The book item. \
   * Its `written_book_contents` component will be copied, with `generation` value increased by 1. \
   * The other components are copied as-is. \
   * \
   * The book will be kept in the crafting grid.
   */
  source: Ingredient,
  /**
   * Additional ingredients. \
   * Multiple materials can be used at the same time. \
   * The number of materials beyond the first one will be added to the result count.
   */
  material: Ingredient,
  /**
   * Limits the generation of the `source` item that can be copied.
   * Defaults to allow generation 0 and 1 (original and first copy).
   */
  allowed_generations?: MinMaxBounds<NBTInt<{
    min: 0,
    max: 2,
  }>>,
  result: ItemStackTemplate,
}

export type CraftingSpecialFireworkRocket = {
  /**
   * Additional ingredient. \
   * Exactly 1 additional ingredient is required.
   */
  shell: Ingredient,
  /**
   * The fuel ingredient. \
   * The count of fuel ingredients controls the `flight_duration` field. \
   * Only 1 ~ 3 fuels are allowed.
   */
  fuel: Ingredient,
  /**
   * The firework star ingredient. \
   * Provides explosion data by the `firework_explosion` component. \
   * Any count of stars (including 0) are allowed.
   */
  star: Ingredient,
  /**
   * The `fireworks` component is controlled by `fuel` and `star`.
   */
  result: ItemStackTemplate,
}

export type CraftingSpecialFireworkStar = {
  /**
   * If this ingredient is provided, the result will have `has_trail` field set.
   */
  trail: Ingredient,
  /**
   * If this ingredient is provided, the result will have `has_twinkle` field set.
   */
  twinkle: Ingredient,
  /**
   * Additional ingredient. \
   * Exactly 1 additional ingredient is required.
   */
  fuel: Ingredient,
  /**
   * The items to provide explosion color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: Ingredient,
  /**
   * If one of the ingredients is provided, the result will have the corresponding `shape` value. \
   * If no shape ingredient is provided, the shape will be `small_ball`.
   */
  shapes: ({
    [Key in Extract<FireworkShape, string>]?: Ingredient
  }),
  /**
   * The `firework_explosion` component is controlled by the ingredients.
   */
  result: ItemStackTemplate,
}

export type CraftingSpecialFireworkStarFade = {
  /**
   * The firework star item. \
   * The fade effect of its `firework_explosion` will be changed. \
   * The other components are copied.
   */
  target: Ingredient,
  /**
   * The items to provide fade color. \
   * Colors are provided by the `dye` component. \
   * Multiple dyes can be used at the same time.
   */
  dye: Ingredient,
  result: ItemStackTemplate,
}

export type CraftingSpecialMapExtending = {
  /**
   * The map item. \
   * The `map_id` component is used to determine the resulting item. \
   * The other components are copied. \
   * This item is placed at the center grid. \
   * \
   * The source map will be kept in the crafting grid.
   */
  map: Ingredient,
  /**
   * Additional ingredients. \
   * 8 `material` items are required to surroud the `map` item.
   */
  material: Ingredient,
  /**
   * The previewing result will have `map_post_processing` transient component. \
   * The crafted result will have a new `map_id` component, which shows the extended version of the original map.
   */
  result: ItemStackTemplate,
}

export type CraftingSpecialShieldDecoration = {
  /**
   * The item to be decorated. It is required to have no patterns. \
   * Its components, except `base_color` and `banner_patterns`, are copied.
   */
  target: Ingredient,
  /**
   * The banner item. The item type is required to be `BannerItem`. \
   * Determines the `base_color` component of the resulting item.
   */
  banner: Ingredient,
  result: ItemStackTemplate,
}

export type CraftingTransmute = (NotificationInfo & CraftingBookInfo & {
  /**
   * The ingredient that will transfer its data components to the result item.
   */
  input: Ingredient,
  /**
   * An additional ingredient.
   */
  material: Ingredient,
  /**
   * The allowed count of material.
   * Defaults to `1`.
   */
  material_count?: MinMaxBounds<NBTInt<{
    min: 1,
    max: 8,
  }>>,
  /**
   * When true, the number of materials will be added to the result count. \
   * Defaults to `false`.
   */
  add_material_count_to_result?: boolean,
  /**
   * The result item that will be merged with the input ingredient.
   */
  result: (ItemStack | Registry['minecraft:item']),
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
export type Ingredient = (NBTList<Registry['minecraft:item'], {
  leftExclusive: false,
  min: 1,
}> | (Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>))

export type IngredientValue = ({
  item: Registry['minecraft:item'],
} | {
  tag: (Registry['minecraft:tag/item']),
})

export type ItemResult = {
  item: Registry['minecraft:item'],
  count?: NBTInt,
}

export type NotificationInfo = {
  /**
   * Determines if a notification is shown when unlocking this recipe.
   * Defaults to `true`.
   */
  show_notification?: boolean,
}

export type Recipe = NonNullable<({
  [S in Extract<Registry['minecraft:recipe_serializer'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolRecipeSerializer ? SymbolRecipeSerializer[S] : SymbolRecipeSerializer<'%unknown'>))
}[Registry['minecraft:recipe_serializer']])>

export type Smelting = (NotificationInfo & CookingBookInfo & {
  ingredient: Ingredient,
  result: ItemStackTemplate,
  experience?: NBTFloat,
  cookingtime?: NBTInt,
})

export type Smithing = {
  base: IngredientValue,
  addition: IngredientValue,
  result: ItemResult,
}

export type SmithingTransform = (NotificationInfo & {
  /**
   * Ingredient specifying an item to be transformed.
   */
  base: Ingredient,
  /**
   * Resulting transformed item.
   */
  result: ItemStackTemplate,
} & {
  /**
   * Material that will be used.
   */
  addition?: Ingredient,
  /**
   * Template item that will be used for the pattern.
   */
  template?: Ingredient,
})

export type SmithingTrim = (NotificationInfo & {
  /**
   * Ingredient specifying an item to be trimmed.
   */
  base: Ingredient,
  /**
   * Material that will be used.
   */
  addition: Ingredient,
  /**
   * Template item that will be used for the pattern.
   */
  template: Ingredient,
  /**
   * The trim pattern to apply to the result item.
   */
  pattern: (Registry['minecraft:trim_pattern'] | TrimPatternClass),
})

export type Stonecutting = (NotificationInfo & {
  ingredient: Ingredient,
  result: ItemStackTemplate,
})
type RecipeSerializerDispatcherMap = {
  'blasting': RecipeSerializerBlasting,
  'minecraft:blasting': RecipeSerializerBlasting,
  'campfire_cooking': RecipeSerializerCampfireCooking,
  'minecraft:campfire_cooking': RecipeSerializerCampfireCooking,
  'crafting_decorated_pot': RecipeSerializerCraftingDecoratedPot,
  'minecraft:crafting_decorated_pot': RecipeSerializerCraftingDecoratedPot,
  'crafting_dye': RecipeSerializerCraftingDye,
  'minecraft:crafting_dye': RecipeSerializerCraftingDye,
  'crafting_imbue': RecipeSerializerCraftingImbue,
  'minecraft:crafting_imbue': RecipeSerializerCraftingImbue,
  'crafting_shaped': RecipeSerializerCraftingShaped,
  'minecraft:crafting_shaped': RecipeSerializerCraftingShaped,
  'crafting_shapeless': RecipeSerializerCraftingShapeless,
  'minecraft:crafting_shapeless': RecipeSerializerCraftingShapeless,
  'crafting_special_bannerduplicate': RecipeSerializerCraftingSpecialBannerduplicate,
  'minecraft:crafting_special_bannerduplicate': RecipeSerializerCraftingSpecialBannerduplicate,
  'crafting_special_bookcloning': RecipeSerializerCraftingSpecialBookcloning,
  'minecraft:crafting_special_bookcloning': RecipeSerializerCraftingSpecialBookcloning,
  'crafting_special_firework_rocket': RecipeSerializerCraftingSpecialFireworkRocket,
  'minecraft:crafting_special_firework_rocket': RecipeSerializerCraftingSpecialFireworkRocket,
  'crafting_special_firework_star': RecipeSerializerCraftingSpecialFireworkStar,
  'minecraft:crafting_special_firework_star': RecipeSerializerCraftingSpecialFireworkStar,
  'crafting_special_firework_star_fade': RecipeSerializerCraftingSpecialFireworkStarFade,
  'minecraft:crafting_special_firework_star_fade': RecipeSerializerCraftingSpecialFireworkStarFade,
  'crafting_special_mapextending': RecipeSerializerCraftingSpecialMapextending,
  'minecraft:crafting_special_mapextending': RecipeSerializerCraftingSpecialMapextending,
  'crafting_special_shielddecoration': RecipeSerializerCraftingSpecialShielddecoration,
  'minecraft:crafting_special_shielddecoration': RecipeSerializerCraftingSpecialShielddecoration,
  'crafting_transmute': RecipeSerializerCraftingTransmute,
  'minecraft:crafting_transmute': RecipeSerializerCraftingTransmute,
  'smelting': RecipeSerializerSmelting,
  'minecraft:smelting': RecipeSerializerSmelting,
  'smithing': RecipeSerializerSmithing,
  'minecraft:smithing': RecipeSerializerSmithing,
  'smithing_transform': RecipeSerializerSmithingTransform,
  'minecraft:smithing_transform': RecipeSerializerSmithingTransform,
  'smithing_trim': RecipeSerializerSmithingTrim,
  'minecraft:smithing_trim': RecipeSerializerSmithingTrim,
  'smoking': RecipeSerializerSmoking,
  'minecraft:smoking': RecipeSerializerSmoking,
  'stonecutting': RecipeSerializerStonecutting,
  'minecraft:stonecutting': RecipeSerializerStonecutting,
}
type RecipeSerializerKeys = keyof RecipeSerializerDispatcherMap
type RecipeSerializerFallback = (
  | RecipeSerializerBlasting
  | RecipeSerializerCampfireCooking
  | RecipeSerializerCraftingDecoratedPot
  | RecipeSerializerCraftingDye
  | RecipeSerializerCraftingImbue
  | RecipeSerializerCraftingShaped
  | RecipeSerializerCraftingShapeless
  | RecipeSerializerCraftingSpecialBannerduplicate
  | RecipeSerializerCraftingSpecialBookcloning
  | RecipeSerializerCraftingSpecialFireworkRocket
  | RecipeSerializerCraftingSpecialFireworkStar
  | RecipeSerializerCraftingSpecialFireworkStarFade
  | RecipeSerializerCraftingSpecialMapextending
  | RecipeSerializerCraftingSpecialShielddecoration
  | RecipeSerializerCraftingTransmute
  | RecipeSerializerSmelting
  | RecipeSerializerSmithing
  | RecipeSerializerSmithingTransform
  | RecipeSerializerSmithingTrim
  | RecipeSerializerSmoking
  | RecipeSerializerStonecutting
  | RecipeSerializerFallbackType)
export type RecipeSerializerFallbackType = Record<string, never>
type RecipeSerializerBlasting = Smelting
type RecipeSerializerCampfireCooking = Smelting
type RecipeSerializerCraftingDecoratedPot = CraftingDecoratedPot
type RecipeSerializerCraftingDye = CraftingDye
type RecipeSerializerCraftingImbue = CraftingImbue
type RecipeSerializerCraftingShaped = CraftingShaped
type RecipeSerializerCraftingShapeless = CraftingShapeless
type RecipeSerializerCraftingSpecialBannerduplicate = CraftingSpecialBannerDuplicate
type RecipeSerializerCraftingSpecialBookcloning = CraftingSpecialBookCloning
type RecipeSerializerCraftingSpecialFireworkRocket = CraftingSpecialFireworkRocket
type RecipeSerializerCraftingSpecialFireworkStar = CraftingSpecialFireworkStar
type RecipeSerializerCraftingSpecialFireworkStarFade = CraftingSpecialFireworkStarFade
type RecipeSerializerCraftingSpecialMapextending = CraftingSpecialMapExtending
type RecipeSerializerCraftingSpecialShielddecoration = CraftingSpecialShieldDecoration
type RecipeSerializerCraftingTransmute = CraftingTransmute
type RecipeSerializerSmelting = Smelting
type RecipeSerializerSmithing = Smithing
type RecipeSerializerSmithingTransform = SmithingTransform
type RecipeSerializerSmithingTrim = SmithingTrim
type RecipeSerializerSmoking = Smelting
type RecipeSerializerStonecutting = Stonecutting
export type SymbolRecipeSerializer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? RecipeSerializerDispatcherMap
  : CASE extends 'keys'
    ? RecipeSerializerKeys
    : CASE extends '%fallback'
      ? RecipeSerializerFallback
      : CASE extends '%unknown' ? RecipeSerializerFallbackType : never
