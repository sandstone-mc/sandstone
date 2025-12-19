import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { ItemStack, SingleItem } from 'sandstone/arguments/generated/world/item.js'
import type { CRAFTING_INGREDIENT } from 'sandstone/arguments.js'
import type { NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'

export type CookingBookCategory = ('food' | 'blocks' | 'misc')

export type CraftingBookCategory = ('building' | 'redstone' | 'equipment' | 'misc')

export type CraftingShaped = {
    /**
     * Identifier to group multiple recipes in the recipe book.
     */
    group?: string
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
    category?: CraftingBookCategory
    /**
     * Value:
     * List length range: 1..3
     */
    pattern: NBTList<`${any}${string}`, {
        leftExclusive: false
        rightExclusive: false
        min: 1
        max: 3
    }>
    key: ({
        [Key in Extract<CRAFTING_INGREDIENT, string>]?: Ingredient;
    })
    result: ItemStack
    /**
     * Determines if a notification is shown when unlocking this recipe. Defaults to true.
     */
    show_notification?: boolean
}

export type CraftingShapeless = {
    group?: string
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
    category?: CraftingBookCategory
    /**
     * Value:
     * List length range: 1..9
     */
    ingredients: NBTList<Ingredient, {
        leftExclusive: false
        rightExclusive: false
        min: 1
        max: 9
    }>
    result: ItemStack
}

export type CraftingTransmute = {
    group?: string
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
    category?: CraftingBookCategory
    /**
     * The ingredient that will transfer its data components to the result item.
     */
    input: Ingredient
    /**
     * An additional ingredient.
     */
    material: Ingredient
    /**
     * The result item that will be merged with the input ingredient.
     */
    result: (Registry['minecraft:item'] | ItemStack)
}

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
    leftExclusive: false
    min: 1
}> | (Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>))

export type IngredientValue = ({
    item: Registry['minecraft:item']
} | {
    tag: (Registry['minecraft:tag/item'])
})

export type ItemResult = {
    item: Registry['minecraft:item']
    count?: NBTInt
}

export type Recipe = ({
    [S in Extract<Registry['minecraft:recipe_serializer'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:recipe_serializer'>
        ? Dispatcher<'minecraft:recipe_serializer'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:recipe_serializer']])

export type Smelting = {
    group?: string
    /**
     * Identifier for the category this goes in the recipe book.
     *
     * Value:
     *
     *  - Food(`food`)
     *  - Blocks(`blocks`)
     *  - Misc(`misc`)
     */
    category?: CookingBookCategory
    ingredient: Ingredient
    result: SingleItem
    experience?: NBTFloat
    cookingtime?: NBTInt
}

export type Smithing = {
    base: IngredientValue
    addition: IngredientValue
    result: ItemResult
}

export type SmithingTransform = ({
    /**
     * Ingredient specifying an item to be transformed.
     */
    base: Ingredient
    /**
     * Resulting transformed item.
     */
    result: ItemStack
} & {
    /**
     * Material that will be used.
     */
    addition?: Ingredient
    /**
     * Template item that will be used for the pattern.
     */
    template?: Ingredient
})

export type SmithingTrim = {
    /**
     * Ingredient specifying an item to be trimmed.
     */
    base: Ingredient
    /**
     * Material that will be used.
     */
    addition: Ingredient
    /**
     * Template item that will be used for the pattern.
     */
    template: Ingredient
    /**
     * The trim pattern to apply to the result item.
     */
    pattern: Registry['minecraft:trim_pattern']
}

export type Stonecutting = {
    group?: string
    ingredient: Ingredient
    result: ItemStack
}
type RecipeSerializerDispatcherMap = {
    'blasting': RecipeSerializerBlasting
    'minecraft:blasting': RecipeSerializerBlasting
    'campfire_cooking': RecipeSerializerCampfireCooking
    'minecraft:campfire_cooking': RecipeSerializerCampfireCooking
    'crafting_shaped': RecipeSerializerCraftingShaped
    'minecraft:crafting_shaped': RecipeSerializerCraftingShaped
    'crafting_shapeless': RecipeSerializerCraftingShapeless
    'minecraft:crafting_shapeless': RecipeSerializerCraftingShapeless
    'crafting_transmute': RecipeSerializerCraftingTransmute
    'minecraft:crafting_transmute': RecipeSerializerCraftingTransmute
    'smelting': RecipeSerializerSmelting
    'minecraft:smelting': RecipeSerializerSmelting
    'smithing': RecipeSerializerSmithing
    'minecraft:smithing': RecipeSerializerSmithing
    'smithing_transform': RecipeSerializerSmithingTransform
    'minecraft:smithing_transform': RecipeSerializerSmithingTransform
    'smithing_trim': RecipeSerializerSmithingTrim
    'minecraft:smithing_trim': RecipeSerializerSmithingTrim
    'smoking': RecipeSerializerSmoking
    'minecraft:smoking': RecipeSerializerSmoking
    'stonecutting': RecipeSerializerStonecutting
    'minecraft:stonecutting': RecipeSerializerStonecutting
}
type RecipeSerializerKeys = keyof RecipeSerializerDispatcherMap
type RecipeSerializerFallback = (
    | RecipeSerializerBlasting
    | RecipeSerializerCampfireCooking
    | RecipeSerializerCraftingShaped
    | RecipeSerializerCraftingShapeless
    | RecipeSerializerCraftingTransmute
    | RecipeSerializerSmelting
    | RecipeSerializerSmithing
    | RecipeSerializerSmithingTransform
    | RecipeSerializerSmithingTrim
    | RecipeSerializerSmoking
    | RecipeSerializerStonecutting
    | RecipeSerializerFallbackType)
type RecipeSerializerFallbackType = Record<string, never>
type RecipeSerializerBlasting = Smelting
type RecipeSerializerCampfireCooking = Smelting
type RecipeSerializerCraftingShaped = CraftingShaped
type RecipeSerializerCraftingShapeless = CraftingShapeless
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
    | '%none' = 'map'> = CASE extends 'map'
    ? RecipeSerializerDispatcherMap
    : CASE extends 'keys' ? RecipeSerializerKeys : CASE extends '%fallback' ? RecipeSerializerFallback : never
