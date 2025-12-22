import type { ItemDisplayContext, ModelRef } from 'sandstone/arguments/generated/assets/model.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { HumanoidArm } from 'sandstone/arguments/generated/util/avatar.js'
import type { DyeColor, RGB } from 'sandstone/arguments/generated/util/color.js'
import type { Direction } from 'sandstone/arguments/generated/util/direction.js'
import type { Keybind } from 'sandstone/arguments/generated/util/text.js'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type Banner = {
  /**
     * Value:
     *
     *  - White(`white`)
     *  - Orange(`orange`)
     *  - Magenta(`magenta`)
     *  - LightBlue(`light_blue`)
     *  - Yellow(`yellow`)
     *  - Lime(`lime`)
     *  - Pink(`pink`)
     *  - Gray(`gray`)
     *  - LightGray(`light_gray`)
     *  - Cyan(`cyan`)
     *  - Purple(`purple`)
     *  - Blue(`blue`)
     *  - Brown(`brown`)
     *  - Green(`green`)
     *  - Red(`red`)
     *  - Black(`black`)
     */
  color: DyeColor
}

export type Bed = {
  /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/bed/`
     */
  texture: `${string}:${string}`
}

export type BlockState = ({
  block_state_property: Dispatcher<'mcdoc:block_state_keys', [
    '%fallback',
  ]>
} & SelectCases<string>)

export type ChargeType = SelectCases<CrossbowChargeType>

export type Chest = {
  /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/chest/`
     */
  texture: `${string}:${string}`
  /**
     * Defaults to `0`.
     *
     * Value:
     * Range: 0..1
     */
  openness?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type Compass = {
  /**
     * Value:
     *
     *  - None(`none`): Always an invalid target.
     *  - Spawn(`spawn`): Points at world spawn.
     *  - Lodestone(`lodestone`): Points at the location stored in the `lodestone_tracker` component.
     *  - Recovery(`recovery`): Points at the last player death location.
     */
  target: CompassTarget
  /**
     * Whether to oscillate for some time around target before settling. Defaults to true.
     */
  wobble?: boolean
}

export type CompassTarget = ('none' | 'spawn' | 'lodestone' | 'recovery')

export type ComponentFlags = ({
  [S in Extract<Registry['minecraft:data_component_predicate_type'], string>]?: {
    /**
         * The component predicate to check.
         */
    predicate: S
    /**
         * The predicate-specific value.
         */
    value: (S extends keyof Dispatcher<'minecraft:data_component_predicate'>
      ? Dispatcher<'minecraft:data_component_predicate'>[S]
      : Record<string, unknown>)
  };
}[Registry['minecraft:data_component_predicate_type']])

export type ComponentStrings = ({
  [S in Extract<Registry['minecraft:data_component_type'], string>]?: ({
    /**
         * The component type to check the values of.
         * If the selected value comes from a registry that the client doesn't have access to,
         * the entry will be silently ignored.
         */
    component: S
  } & SelectCases<(S extends keyof Dispatcher<'minecraft:data_component'>
    ? Dispatcher<'minecraft:data_component'>[S]
    : Record<string, unknown>)>);
}[Registry['minecraft:data_component_type']])

export type Composite = {
  models: Array<ItemModel>
}

export type Condition = ({
  [S in Extract<ConditionalPropertyType, string>]?: ({
    /**
         * Value:
         *
         *  - Broken(`broken`)
         *  - BundleHasSelectedItem(`bundle/has_selected_item`)
         *  - Carried(`carried`)
         *  - Component(`component`)
         *  - CustomModelData(`custom_model_data`)
         *  - Damaged(`damaged`)
         *  - ExtendedView(`extended_view`)
         *  - FishingRod(`fishing_rod/cast`)
         *  - HasComponent(`has_component`)
         *  - KeybindDown(`keybind_down`)
         *  - Selected(`selected`)
         *  - UsingItem(`using_item`)
         *  - ViewEntity(`view_entity`)
         */
    property: (S | `minecraft:${S}`)
    on_true: ItemModel
    on_false: ItemModel
  } & (S extends keyof Dispatcher<'minecraft:conditional_item_property'>
    ? Dispatcher<'minecraft:conditional_item_property'>[S]
    : Record<string, unknown>));
}[ConditionalPropertyType])

export type ConditionalPropertyType = (
  | 'broken'
  | 'bundle/has_selected_item'
  | 'carried'
  | 'component'
  | 'custom_model_data'
  | 'damaged'
  | 'extended_view'
  | 'fishing_rod/cast'
  | 'has_component'
  | 'keybind_down'
  | 'selected'
  | 'using_item'
  | 'view_entity')

export type ConstantTint = {
  /**
     * Constant tint color to apply.
     */
  value: RGB
}

export type ContextDimension = SelectCases<Registry['minecraft:dimension']>

export type ContextEntityType = SelectCases<Registry['minecraft:entity_type']>

export type CopperGolemStatue = {
  /**
     * Value:
     *
     *  - Standing(`standing`)
     *  - Sitting(`sitting`)
     *  - Running(`running`)
     *  - Star(`star`)
     */
  pose: CopperGolemStatuePose
  texture: string
}

export type CopperGolemStatuePose = ('standing' | 'sitting' | 'running' | 'star')

export type Count = {
  /**
     * If false, returns count clamped to `0..max_stack_size`.
     * If true, returns count divided by the `max_stack_size` component, clamped to `0..1`.
     * Defaults to true.
     */
  normalize?: boolean
}

export type CrossbowChargeType = ('none' | 'arrow' | 'rocket')

export type CustomModelDataFlags = {
  /**
     * The index of the `flags` list in the `custom_model_data` component. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  index?: NBTInt<{
    min: 0
  }>
}

export type CustomModelDataFloats = {
  /**
     * The index of the `floats` list in the `custom_model_data` component. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  index?: NBTInt<{
    min: 0
  }>
}

export type CustomModelDataStrings = ({
  /**
     * The index of the `strings` list in the `custom_model_data` component. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  index?: NBTInt<{
    min: 0
  }>
} & SelectCases<string>)

export type CustomModelDataTint = {
  /**
     * The index of the `colors` list in the `custom_model_data` component. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  index?: NBTInt<{
    min: 0
  }>
  /**
     * Tint to apply when the `custom_model_data` component is not present, or when it doesn't have a color in the specified index.
     */
  default: RGB
}

export type Damage = {
  /**
     * If false, returns value of damage, clamped to `0..max_damage`.
     * If true, returns value of damage divided by the `max_damage` component, clamped to `0..1`.
     * Defaults to true.
     */
  normalize?: boolean
}

export type DisplayContext = SelectCases<ItemDisplayContext>

export type DyeTint = {
  /**
     * Tint to apply when the `dyed_color` component is not present.
     *
     * Value:
     * *either*
     *
     * *item 0*
     *
     * *or*
     *
     * List length range: 3
     */
  default: (NBTInt | NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>)
}

export type FireworkTint = {
  /**
     * Tint to apply when the `firework_explosion` component is not present.
     *
     * Value:
     * *either*
     *
     * *item 0*
     *
     * *or*
     *
     * List length range: 3
     */
  default: (NBTInt | NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>)
}

export type GrassTint = {
  /**
     * Value:
     * Range: 0..1
     */
  temperature: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  downfall: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type HangingSign = {
  /**
     * Value:
     *
     *  - Oak(`oak`)
     *  - Spruce(`spruce`)
     *  - Birch(`birch`)
     *  - Acacia(`acacia`)
     *  - Cherry(`cherry`)
     *  - Jungle(`jungle`)
     *  - DarkOak(`dark_oak`)
     *  - PaleOak(`pale_oak`)
     *  - Mangrove(`mangrove`)
     *  - Bamboo(`bamboo`)
     *  - Crimson(`crimson`)
     *  - Warped(`warped`)
     */
  wood_type: WoodType
  /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/signs/hanging/`
     */
  texture: `${string}:${string}`
}

export type HasComponent = {
  component: Registry['minecraft:data_component_type']
  /**
     * Whether the default components should be handled as "no component". Defaults to false.
     */
  ignore_default?: boolean
}

export type Head = ({
  /**
     * Value:
     *
     *  - Creeper(`creeper`)
     *  - Dragon(`dragon`)
     *  - Piglin(`piglin`)
     *  - Player(`player`)
     *  - Skeleton(`skeleton`)
     *  - WitherSkeleton(`wither_skeleton`)
     *  - Zombie(`zombie`)
     */
  kind: HeadType
  /**
     * Controls the animation time for piglin and dragon heads. Defaults to `0`.
     */
  animation?: NBTFloat
} & {
  /**
     * Texture to use instead of the texture from `kind`.
     *
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/`
     */
  texture?: `${string}:${string}`
})

export type HeadType = ('creeper' | 'dragon' | 'piglin' | 'player' | 'skeleton' | 'wither_skeleton' | 'zombie')

export type ItemDefinition = {
  model: ItemModel
  /**
     * Whether the down-and-up animation should be played in first-person view when the item stack is changed.
     * Defaults to `true`.
     */
  hand_animation_on_swap?: boolean
  /**
     * Whether the item model is allowed to be bigger than its item slot.
     * Defaults to `false`, which clips the item model in GUI to the item slot size.
     * The behavior of `true` is **not** officially supported.
     */
  oversized_in_gui?: boolean
  /**
     * How fast the item moves up and down when swapping items in hotbar.
     * Defaults to 1.0
     */
  swap_animation_scale?: NBTFloat
}

export type ItemModel = ({
  [S in Extract<ItemModeltype, string>]?: ({
    /**
         * Value:
         *
         *  - BundleSelectedItem(`bundle/selected_item`)
         *  - Composite(`composite`)
         *  - Condition(`condition`)
         *  - Empty(`empty`)
         *  - Model(`model`)
         *  - RangeDispatch(`range_dispatch`)
         *  - Select(`select`)
         *  - Special(`special`)
         */
    type: (S | `minecraft:${S}`)
  } & (S extends keyof Dispatcher<'minecraft:item_model'>
    ? Dispatcher<'minecraft:item_model'>[S]
    : Record<string, unknown>));
}[ItemModeltype])

export type ItemModeltype = (
  | 'bundle/selected_item'
  | 'composite'
  | 'condition'
  | 'empty'
  | 'model'
  | 'range_dispatch'
  | 'select'
  | 'special')

export type KeybindDown = {
  /**
     * The keybind ID to check for.
     *
     * Value:
     *
     *  - Advancements(`key.advancements`)
     *  - Attack(`key.attack`)
     *  - Back(`key.back`)
     *  - Chat(`key.chat`)
     *  - Command(`key.command`)
     *  - DebugClearChat(`key.debug.clearChat`)
     *  - DebugCopyLocation(`key.debug.copyLocation`)
     *  - DebugCopyRecreateCommand(`key.debug.copyRecreateCommand`)
     *  - DebugCrash(`key.debug.crash`)
     *  - DebugOptionsMenu(`key.debug.debugOptions`)
     *  - DebugDumpDynamicTextures(`key.debug.dumpDynamicTextures`)
     *  - DebugDumpVersion(`key.debug.dumpVersion`)
     *  - DebugFocusPause(`key.debug.focusPause`)
     *  - DebugFpsCharts(`key.debug.fpsCharts`)
     *  - DebugLightmapTexture(`key.debug.lightmapTexture`)
     *  - DebugModifier(`key.debug.modifier`)
     *  - DebugNetworkCharts(`key.debug.networkCharts`)
     *  - DebugOverlay(`key.debug.overlay`)
     *  - DebugProfiling(`key.debug.profiling`)
     *  - DebugProfilingChart(`key.debug.profilingChart`)
     *  - DebugReloadChunk(`key.debug.reloadChunk`)
     *  - DebugReloadResourcePacks(`key.debug.reloadResourcePacks`)
     *  - DebugShowAdvancedTooltips(`key.debug.showAdvancedTooltips`)
     *  - DebugShowChunkBorders(`key.debug.showChunkBorders`)
     *  - DebugShowHitboxes(`key.debug.showHitboxes`)
     *  - DebugSpectate(`key.debug.spectate`)
     *  - DebugSwitchGameMode(`key.debug.switchGameMode`)
     *  - Drop(`key.drop`)
     *  - Forward(`key.forward`)
     *  - Fullscreen(`key.fullscreen`)
     *  - Hotbar1(`key.hotbar.1`)
     *  - Hotbar2(`key.hotbar.2`)
     *  - Hotbar3(`key.hotbar.3`)
     *  - Hotbar4(`key.hotbar.4`)
     *  - Hotbar5(`key.hotbar.5`)
     *  - Hotbar6(`key.hotbar.6`)
     *  - Hotbar7(`key.hotbar.7`)
     *  - Hotbar8(`key.hotbar.8`)
     *  - Hotbar9(`key.hotbar.9`)
     *  - Inventory(`key.inventory`)
     *  - Jump(`key.jump`)
     *  - Left(`key.left`)
     *  - LoadToolbarActivator(`key.loadToolbarActivator`)
     *  - PickItem(`key.pickItem`)
     *  - Playerlist(`key.playerlist`)
     *  - QuickActions(`key.quickActions`)
     *  - Right(`key.right`)
     *  - SaveToolbarActivator(`key.saveToolbarActivator`)
     *  - Screenshot(`key.screenshot`)
     *  - SmoothCamera(`key.smoothCamera`)
     *  - Sneak(`key.sneak`)
     *  - SpectatorHotbar(`key.spectatorHotbar`)
     *  - SpectatorOutlines(`key.spectatorOutlines`)
     *  - Sprint(`key.sprint`)
     *  - SwapOffhand(`key.swapOffhand`)
     *  - ToggleGui(`key.toggleGui`)
     *  - TogglePerspective(`key.togglePerspective`)
     *  - ToggleSpectatorShaderEffects(`key.toggleSpectatorShaderEffects`)
     *  - Use(`key.use`)
     */
  keybind: Keybind
}

export type LocalTime = ({
  /**
     * Format to use for time formatting.
     * Examples: `yyyy-MM-dd`, `HH:mm:ss`.
     */
  pattern: (`${number}-${number}-${number}` | `${number}:${number}:${number}`)
  /**
     * Defaults to the root locale.
     * Examples: `en_US`, `cs_AU@numbers=thai;calendar=japanese`.
     */
  locale?: string
  /**
     * Defaults to the timezone set on the client.
     * Examples: `Europe/Stockholm`, `GMT+0:45`.
     */
  time_zone?: string
} & SelectCases<string>)

export type MainHand = SelectCases<HumanoidArm>

export type MapColorTint = {
  /**
     * Tint to apply when the `map_color` component is not present.
     */
  default: RGB
}

export type Model = {
  model: ModelRef
  tints?: Array<ModelTint>
}

export type ModelTint = ({
  [S in Extract<TintSourceType, string>]?: ({
    /**
         * Value:
         *
         *  - Constant(`constant`)
         *  - CustomModelData(`custom_model_data`)
         *  - Dye(`dye`)
         *  - Firework(`firework`)
         *  - Grass(`grass`)
         *  - MapColor(`map_color`)
         *  - Potion(`potion`)
         *  - Team(`team`)
         */
    type: (S | `minecraft:${S}`)
  } & (S extends keyof Dispatcher<'minecraft:tint_source'>
    ? Dispatcher<'minecraft:tint_source'>[S]
    : Record<string, unknown>));
}[TintSourceType])

export type NumericPropertyType = (
  | 'bundle/fullness'
  | 'compass'
  | 'cooldown'
  | 'count'
  | 'crossbow/pull'
  | 'custom_model_data'
  | 'damage'
  | 'time'
  | 'use_cycle'
  | 'use_duration')

export type PotionTint = {
  /**
     * Tint to apply when the `potion_contents` component is not present, or it has no effects and no `custom_color` is set.
     */
  default: RGB
}

export type RangeDispatch = ({
  [S in Extract<NumericPropertyType, string>]?: ({
    /**
         * Value:
         *
         *  - BundleFullness(`bundle/fullness`)
         *  - Compass(`compass`)
         *  - Cooldown(`cooldown`)
         *  - Count(`count`)
         *  - CrossbowPull(`crossbow/pull`)
         *  - CustomModelData(`custom_model_data`)
         *  - Damage(`damage`)
         *  - Time(`time`)
         *  - UseCycle(`use_cycle`)
         *  - UseDuration(`use_duration`)
         */
    property: (S | `minecraft:${S}`)
    /**
         * Factor to multiply the property value with. Defaults to 1.
         */
    scale?: NBTFloat
    /**
         * List of ranges. Will select last entry with threshold less or equal to value.
         * Order does not matter, list will be sorted by threshold in ascending order.
         */
    entries: Array<{
      threshold: NBTFloat
      model: ItemModel
    }>
    /**
         * Item model to render if no entries were less or equal to the value.
         */
    fallback?: ItemModel
  } & (S extends keyof Dispatcher<'minecraft:numeric_item_property'>
    ? Dispatcher<'minecraft:numeric_item_property'>[S]
    : Record<string, unknown>));
}[NumericPropertyType])

export type Select = ({
  [S in Extract<SelectPropertyType, string>]?: ({
    /**
         * Value:
         *
         *  - BlockState(`block_state`)
         *  - ChargeType(`charge_type`)
         *  - Component(`component`)
         *  - ContextDimension(`context_dimension`)
         *  - ContextEntityType(`context_entity_type`)
         *  - CustomModelData(`custom_model_data`)
         *  - DisplayContext(`display_context`)
         *  - LocalTime(`local_time`)
         *  - MainHand(`main_hand`)
         *  - TrimMaterial(`trim_material`)
         */
    property: (S | `minecraft:${S}`)
    /**
         * Item model to render if none of the cases matched the value.
         */
    fallback?: ItemModel
  } & (S extends keyof Dispatcher<'minecraft:select_item_property'>
    ? Dispatcher<'minecraft:select_item_property'>[S]
    : Record<string, unknown>));
}[SelectPropertyType])

export type SelectCase<T> = {
  when: (T | Array<T>)
  model: ItemModel
}

export type SelectCases<T> = {
  cases: Array<SelectCase<T>>
}

export type SelectPropertyType = (
  | 'block_state'
  | 'charge_type'
  | 'component'
  | 'context_dimension'
  | 'context_entity_type'
  | 'custom_model_data'
  | 'display_context'
  | 'local_time'
  | 'main_hand'
  | 'trim_material')

export type ShulkerBox = {
  /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/shulker/`
     */
  texture: `${string}:${string}`
  /**
     * Value:
     * Range: 0..1
     */
  openness?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Defaults to `up`.
     *
     * Value:
     *
     *  - Down(`down`)
     *  - Up(`up`)
     *  - North(`north`)
     *  - East(`east`)
     *  - South(`south`)
     *  - West(`west`)
     */
  orientation?: Direction
}

export type Special = {
  /**
     * Renders a special hardcoded model.
     */
  model: ({
    [S in Extract<SpecialModelType, string>]?: ({
      /**
             * Value:
             *
             *  - Banner(`banner`)
             *  - Bed(`bed`)
             *  - Conduit(`conduit`)
             *  - Chest(`chest`)
             *  - CopperGolemStatue(`copper_golem_statue`)
             *  - DecoratedPot(`decorated_pot`)
             *  - HangingSign(`hanging_sign`)
             *  - Head(`head`)
             *  - PlayerHead(`player_head`)
             *  - Shield(`shield`)
             *  - ShulkerBox(`shulker_box`)
             *  - StandingSign(`standing_sign`)
             *  - Trident(`trident`)
             */
      type: (S | `minecraft:${S}`)
    } & (S extends keyof Dispatcher<'minecraft:special_item_model'>
      ? Dispatcher<'minecraft:special_item_model'>[S]
      : Record<string, unknown>));
  }[SpecialModelType])
  /**
     * Base model, providing transformations, particle texture and GUI light.
     */
  base: ModelRef
}

export type SpecialModel = ({
  [S in Extract<SpecialModelType, string>]?: ({
    /**
         * Value:
         *
         *  - Banner(`banner`)
         *  - Bed(`bed`)
         *  - Conduit(`conduit`)
         *  - Chest(`chest`)
         *  - CopperGolemStatue(`copper_golem_statue`)
         *  - DecoratedPot(`decorated_pot`)
         *  - HangingSign(`hanging_sign`)
         *  - Head(`head`)
         *  - PlayerHead(`player_head`)
         *  - Shield(`shield`)
         *  - ShulkerBox(`shulker_box`)
         *  - StandingSign(`standing_sign`)
         *  - Trident(`trident`)
         */
    type: (S | `minecraft:${S}`)
  } & (S extends keyof Dispatcher<'minecraft:special_item_model'>
    ? Dispatcher<'minecraft:special_item_model'>[S]
    : Record<string, unknown>));
}[SpecialModelType])

export type SpecialModelType = (
  | 'banner'
  | 'bed'
  | 'conduit'
  | 'chest'
  | 'copper_golem_statue'
  | 'decorated_pot'
  | 'hanging_sign'
  | 'head'
  | 'player_head'
  | 'shield'
  | 'shulker_box'
  | 'standing_sign'
  | 'trident')

export type StandingSign = {
  /**
     * Value:
     *
     *  - Oak(`oak`)
     *  - Spruce(`spruce`)
     *  - Birch(`birch`)
     *  - Acacia(`acacia`)
     *  - Cherry(`cherry`)
     *  - Jungle(`jungle`)
     *  - DarkOak(`dark_oak`)
     *  - PaleOak(`pale_oak`)
     *  - Mangrove(`mangrove`)
     *  - Bamboo(`bamboo`)
     *  - Crimson(`crimson`)
     *  - Warped(`warped`)
     */
  wood_type: WoodType
  /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/entity/signs/`
     */
  texture: `${string}:${string}`
}

export type TeamTint = {
  /**
     * Tint to apply when there is no context entity, entity is not in a team or the team has no color.
     */
  default: RGB
}

export type Time = {
  /**
     * Value:
     *
     *  - Daytime(`daytime`)
     *  - MoonPhase(`moon_phase`)
     *  - Random(`random`)
     */
  source: TimeSource
  /**
     * Whether to oscillate for some time around target before settling. Defaults to true.
     */
  wobble?: boolean
}

export type TimeSource = ('daytime' | 'moon_phase' | 'random')

export type TintSourceType = (
  | 'constant'
  | 'custom_model_data'
  | 'dye'
  | 'firework'
  | 'grass'
  | 'map_color'
  | 'potion'
  | 'team')

export type TrimMaterial = SelectCases<Registry['minecraft:trim_material']>

export type UseCycle = {
  /**
     * returns remaining item use ticks modulo `period`.
     * Defaults to 1.
     */
  period?: NBTFloat
}

export type UseDuration = {
  /**
     * If true, returns remaining item use ticks.
     * If false, returns item use ticks so far.
     * Defaults to false.
     */
  remaining?: boolean
}

export type ViewEntity = Record<string, never>

export type WoodType = (
  | 'oak'
  | 'spruce'
  | 'birch'
  | 'acacia'
  | 'cherry'
  | 'jungle'
  | 'dark_oak'
  | 'pale_oak'
  | 'mangrove'
  | 'bamboo'
  | 'crimson'
  | 'warped')
type ConditionalItemPropertyDispatcherMap = {
  'component': ConditionalItemPropertyComponent
  'minecraft:component': ConditionalItemPropertyComponent
  'custom_model_data': ConditionalItemPropertyCustomModelData
  'minecraft:custom_model_data': ConditionalItemPropertyCustomModelData
  'has_component': ConditionalItemPropertyHasComponent
  'minecraft:has_component': ConditionalItemPropertyHasComponent
  'keybind_down': ConditionalItemPropertyKeybindDown
  'minecraft:keybind_down': ConditionalItemPropertyKeybindDown
  'view_entity': ConditionalItemPropertyViewEntity
  'minecraft:view_entity': ConditionalItemPropertyViewEntity
}
type ConditionalItemPropertyKeys = keyof ConditionalItemPropertyDispatcherMap
type ConditionalItemPropertyFallback = (
  | ConditionalItemPropertyComponent
  | ConditionalItemPropertyCustomModelData
  | ConditionalItemPropertyHasComponent
  | ConditionalItemPropertyKeybindDown
  | ConditionalItemPropertyViewEntity
  | ConditionalItemPropertyFallbackType)
type ConditionalItemPropertyFallbackType = Record<string, never>
type ConditionalItemPropertyComponent = ComponentFlags
type ConditionalItemPropertyCustomModelData = CustomModelDataFlags
type ConditionalItemPropertyHasComponent = HasComponent
type ConditionalItemPropertyKeybindDown = KeybindDown
type ConditionalItemPropertyViewEntity = ViewEntity
export type SymbolConditionalItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? ConditionalItemPropertyDispatcherMap
  : CASE extends 'keys'
    ? ConditionalItemPropertyKeys
    : CASE extends '%fallback' ? ConditionalItemPropertyFallback : never
type ItemModelDispatcherMap = {
  'bundle/selected_item': ItemModelBundleSelectedItem
  'minecraft:bundle/selected_item': ItemModelBundleSelectedItem
  'composite': ItemModelComposite
  'minecraft:composite': ItemModelComposite
  'condition': ItemModelCondition
  'minecraft:condition': ItemModelCondition
  'model': ItemModelModel
  'minecraft:model': ItemModelModel
  'range_dispatch': ItemModelRangeDispatch
  'minecraft:range_dispatch': ItemModelRangeDispatch
  'select': ItemModelSelect
  'minecraft:select': ItemModelSelect
  'special': ItemModelSpecial
  'minecraft:special': ItemModelSpecial
}
type ItemModelKeys = keyof ItemModelDispatcherMap
type ItemModelFallback = (
  | ItemModelBundleSelectedItem
  | ItemModelComposite
  | ItemModelCondition
  | ItemModelModel
  | ItemModelRangeDispatch
  | ItemModelSelect
  | ItemModelSpecial)
type ItemModelBundleSelectedItem = Record<string, never>
type ItemModelComposite = Composite
type ItemModelCondition = Condition
type ItemModelModel = Model
type ItemModelRangeDispatch = RangeDispatch
type ItemModelSelect = Select
type ItemModelSpecial = Special
export type SymbolItemModel<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? ItemModelDispatcherMap
  : CASE extends 'keys' ? ItemModelKeys : CASE extends '%fallback' ? ItemModelFallback : never
type NumericItemPropertyDispatcherMap = {
  'compass': NumericItemPropertyCompass
  'minecraft:compass': NumericItemPropertyCompass
  'count': NumericItemPropertyCount
  'minecraft:count': NumericItemPropertyCount
  'custom_model_data': NumericItemPropertyCustomModelData
  'minecraft:custom_model_data': NumericItemPropertyCustomModelData
  'damage': NumericItemPropertyDamage
  'minecraft:damage': NumericItemPropertyDamage
  'time': NumericItemPropertyTime
  'minecraft:time': NumericItemPropertyTime
  'use_cycle': NumericItemPropertyUseCycle
  'minecraft:use_cycle': NumericItemPropertyUseCycle
  'use_duration': NumericItemPropertyUseDuration
  'minecraft:use_duration': NumericItemPropertyUseDuration
}
type NumericItemPropertyKeys = keyof NumericItemPropertyDispatcherMap
type NumericItemPropertyFallback = (
  | NumericItemPropertyCompass
  | NumericItemPropertyCount
  | NumericItemPropertyCustomModelData
  | NumericItemPropertyDamage
  | NumericItemPropertyTime
  | NumericItemPropertyUseCycle
  | NumericItemPropertyUseDuration
  | NumericItemPropertyFallbackType)
type NumericItemPropertyFallbackType = Record<string, never>
type NumericItemPropertyCompass = Compass
type NumericItemPropertyCount = Count
type NumericItemPropertyCustomModelData = CustomModelDataFloats
type NumericItemPropertyDamage = Damage
type NumericItemPropertyTime = Time
type NumericItemPropertyUseCycle = UseCycle
type NumericItemPropertyUseDuration = UseDuration
export type SymbolNumericItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? NumericItemPropertyDispatcherMap
  : CASE extends 'keys' ? NumericItemPropertyKeys : CASE extends '%fallback' ? NumericItemPropertyFallback : never
type SelectItemPropertyDispatcherMap = {
  'block_state': SelectItemPropertyBlockState
  'minecraft:block_state': SelectItemPropertyBlockState
  'charge_type': SelectItemPropertyChargeType
  'minecraft:charge_type': SelectItemPropertyChargeType
  'component': SelectItemPropertyComponent
  'minecraft:component': SelectItemPropertyComponent
  'context_dimension': SelectItemPropertyContextDimension
  'minecraft:context_dimension': SelectItemPropertyContextDimension
  'context_entity_type': SelectItemPropertyContextEntityType
  'minecraft:context_entity_type': SelectItemPropertyContextEntityType
  'custom_model_data': SelectItemPropertyCustomModelData
  'minecraft:custom_model_data': SelectItemPropertyCustomModelData
  'display_context': SelectItemPropertyDisplayContext
  'minecraft:display_context': SelectItemPropertyDisplayContext
  'local_time': SelectItemPropertyLocalTime
  'minecraft:local_time': SelectItemPropertyLocalTime
  'main_hand': SelectItemPropertyMainHand
  'minecraft:main_hand': SelectItemPropertyMainHand
  'trim_material': SelectItemPropertyTrimMaterial
  'minecraft:trim_material': SelectItemPropertyTrimMaterial
}
type SelectItemPropertyKeys = keyof SelectItemPropertyDispatcherMap
type SelectItemPropertyFallback = (
  | SelectItemPropertyBlockState
  | SelectItemPropertyChargeType
  | SelectItemPropertyComponent
  | SelectItemPropertyContextDimension
  | SelectItemPropertyContextEntityType
  | SelectItemPropertyCustomModelData
  | SelectItemPropertyDisplayContext
  | SelectItemPropertyLocalTime
  | SelectItemPropertyMainHand
  | SelectItemPropertyTrimMaterial
  | SelectItemPropertyFallbackType)
type SelectItemPropertyFallbackType = SelectCases<string>
type SelectItemPropertyBlockState = BlockState
type SelectItemPropertyChargeType = ChargeType
type SelectItemPropertyComponent = ComponentStrings
type SelectItemPropertyContextDimension = ContextDimension
type SelectItemPropertyContextEntityType = ContextEntityType
type SelectItemPropertyCustomModelData = CustomModelDataStrings
type SelectItemPropertyDisplayContext = DisplayContext
type SelectItemPropertyLocalTime = LocalTime
type SelectItemPropertyMainHand = MainHand
type SelectItemPropertyTrimMaterial = TrimMaterial
export type SymbolSelectItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? SelectItemPropertyDispatcherMap
  : CASE extends 'keys' ? SelectItemPropertyKeys : CASE extends '%fallback' ? SelectItemPropertyFallback : never
type SpecialItemModelDispatcherMap = {
  'banner': SpecialItemModelBanner
  'minecraft:banner': SpecialItemModelBanner
  'bed': SpecialItemModelBed
  'minecraft:bed': SpecialItemModelBed
  'chest': SpecialItemModelChest
  'minecraft:chest': SpecialItemModelChest
  'copper_golem_statue': SpecialItemModelCopperGolemStatue
  'minecraft:copper_golem_statue': SpecialItemModelCopperGolemStatue
  'hanging_sign': SpecialItemModelHangingSign
  'minecraft:hanging_sign': SpecialItemModelHangingSign
  'head': SpecialItemModelHead
  'minecraft:head': SpecialItemModelHead
  'shulker_box': SpecialItemModelShulkerBox
  'minecraft:shulker_box': SpecialItemModelShulkerBox
  'standing_sign': SpecialItemModelStandingSign
  'minecraft:standing_sign': SpecialItemModelStandingSign
}
type SpecialItemModelKeys = keyof SpecialItemModelDispatcherMap
type SpecialItemModelFallback = (
  | SpecialItemModelBanner
  | SpecialItemModelBed
  | SpecialItemModelChest
  | SpecialItemModelCopperGolemStatue
  | SpecialItemModelHangingSign
  | SpecialItemModelHead
  | SpecialItemModelShulkerBox
  | SpecialItemModelStandingSign
  | SpecialItemModelFallbackType)
type SpecialItemModelFallbackType = Record<string, never>
type SpecialItemModelBanner = Banner
type SpecialItemModelBed = Bed
type SpecialItemModelChest = Chest
type SpecialItemModelCopperGolemStatue = CopperGolemStatue
type SpecialItemModelHangingSign = HangingSign
type SpecialItemModelHead = Head
type SpecialItemModelShulkerBox = ShulkerBox
type SpecialItemModelStandingSign = StandingSign
export type SymbolSpecialItemModel<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? SpecialItemModelDispatcherMap
  : CASE extends 'keys' ? SpecialItemModelKeys : CASE extends '%fallback' ? SpecialItemModelFallback : never
type TintSourceDispatcherMap = {
  'constant': TintSourceConstant
  'minecraft:constant': TintSourceConstant
  'custom_model_data': TintSourceCustomModelData
  'minecraft:custom_model_data': TintSourceCustomModelData
  'dye': TintSourceDye
  'minecraft:dye': TintSourceDye
  'firework': TintSourceFirework
  'minecraft:firework': TintSourceFirework
  'grass': TintSourceGrass
  'minecraft:grass': TintSourceGrass
  'map_color': TintSourceMapColor
  'minecraft:map_color': TintSourceMapColor
  'potion': TintSourcePotion
  'minecraft:potion': TintSourcePotion
  'team': TintSourceTeam
  'minecraft:team': TintSourceTeam
}
type TintSourceKeys = keyof TintSourceDispatcherMap
type TintSourceFallback = (
  | TintSourceConstant
  | TintSourceCustomModelData
  | TintSourceDye
  | TintSourceFirework
  | TintSourceGrass
  | TintSourceMapColor
  | TintSourcePotion
  | TintSourceTeam)
type TintSourceConstant = ConstantTint
type TintSourceCustomModelData = CustomModelDataTint
type TintSourceDye = DyeTint
type TintSourceFirework = FireworkTint
type TintSourceGrass = GrassTint
type TintSourceMapColor = MapColorTint
type TintSourcePotion = PotionTint
type TintSourceTeam = TeamTint
export type SymbolTintSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TintSourceDispatcherMap
  : CASE extends 'keys' ? TintSourceKeys : CASE extends '%fallback' ? TintSourceFallback : never
