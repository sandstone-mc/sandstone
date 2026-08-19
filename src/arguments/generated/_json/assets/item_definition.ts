import type { JsonItemDisplayContext, JsonModelRef } from 'sandstone/arguments/generated/_json/assets/model.ts'
import type {
  JsonSymbolDataComponent,
  JsonSymbolDataComponentPredicate,
  JsonSymbolMcdocBlockStateKeys,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonHumanoidArm } from 'sandstone/arguments/generated/_json/util/avatar.ts'
import type { JsonDyeColor, JSONRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonKeybind } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonTransformation } from 'sandstone/arguments/generated/_json/world/entity/display.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NamespacedString, NBTFloat, NBTInt, TrimMaterialClass } from 'sandstone'

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 3
 */
export type JsonActuallyTranslucentRGB = ((NBTInt | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
}>)

export type JsonBanner = {
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
  color: JsonDyeColor,
  /**
   * Defaults to `ground`.
   *
   * Value:
   *
   *  - Wall(`wall`)
   *  - Ground(`ground`)
   */
  attachment?: JsonBannerAttachment,
}

export type JsonBannerAttachment = ('wall' | 'ground')

export type JsonBed = {
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/bed/`
   */
  texture: NamespacedString,
  /**
   * Value:
   *
   *  - Head(`head`)
   *  - Foot(`foot`)
   */
  part: JsonBedPart,
}

export type JsonBedPart = ('head' | 'foot')

export type JsonBlockState = ({
  block_state_property: JsonSymbolMcdocBlockStateKeys<'%fallback'>,
} & JsonSelectCases<string>)

export type JsonBook = {
  /**
   * Angle in degrees between book cover and book centerline. \
   * `0.0` for closed, `90.0` for open flat.
   */
  open_angle: (NBTFloat | number),
  /**
   * The position of the first page inside the book. \
   * `0.0` for leftmost, `1.0` for rightmost.
   */
  page1: (NBTFloat | number),
  /**
   * The position of the second page inside the book. \
   * `0.0` for leftmost, `1.0` for rightmost.
   */
  page2: (NBTFloat | number),
}

export type JsonChargeType = JsonSelectCases<JsonCrossbowChargeType>

export type JsonChest = {
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/chest/`
   */
  texture: NamespacedString,
  /**
   * Defaults to `0`.
   *
   * Value:
   * Range: 0..1
   */
  openness?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Defaults to `single`.
   *
   * Value:
   *
   *  - Single(`single`)
   *  - Left(`left`)
   *  - Right(`right`)
   */
  chest_type?: JsonChestType,
}

export type JsonChestType = ('single' | 'left' | 'right')

export type JsonCompass = {
  /**
   * Value:
   *
   *  - None(`none`): Always an invalid target.
   *  - Spawn(`spawn`): Points at world spawn.
   *  - Lodestone(`lodestone`): Points at the location stored in the `lodestone_tracker` component.
   *  - Recovery(`recovery`): Points at the last player death location.
   */
  target: JsonCompassTarget,
  /**
   * Whether to oscillate for some time around target before settling. Defaults to true.
   */
  wobble?: boolean,
}

export type JsonCompassTarget = ('none' | 'spawn' | 'lodestone' | 'recovery')

export type JsonComponentFlags = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:data_component_predicate_type'], string>, string>]?: {
    /**
     * The component predicate to check.
     */
    predicate: S,
    /**
     * The predicate-specific value.
     */
    value: (S extends keyof JsonSymbolDataComponentPredicate
      ? JsonSymbolDataComponentPredicate[S]
      : JsonSymbolDataComponentPredicate<'%unknown'>),
  }
}[Extract<JsonRegistry['minecraft:data_component_predicate_type'], string>])>

export type JsonComponentStrings = (NonNullable<(({
  [S in Extract<keyof JsonSymbolDataComponent, string>]?: ({
    /**
     * The component type to check the values of.
     * If the selected value comes from a registry that the client doesn't have access to,
     * the entry will be silently ignored.
     */
    component: S,
  } & JsonSelectCases<JsonSymbolDataComponent[S]>)
})[keyof JsonSymbolDataComponent])> | (JsonRootNBT & {
  component: `${string}:${string}`,
}))

export type JsonComposite = {
  models: Array<JsonItemModel>,
  transformation?: JsonTransformation,
}

export type JsonCondition = NonNullable<({
  [S in Extract<Extract<JsonConditionalPropertyType, string>, string>]?: ({
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
    property: (S | `minecraft:${S}`),
    on_true: JsonItemModel,
    on_false: JsonItemModel,
    transformation?: JsonTransformation,
  } & (S extends keyof JsonSymbolConditionalItemProperty
    ? JsonSymbolConditionalItemProperty[S]
    : JsonSymbolConditionalItemProperty<'%unknown'>))
}[Extract<JsonConditionalPropertyType, string>])>

export type JsonConditionalPropertyType = (
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

export type JsonConstantTint = {
  /**
   * Constant tint color to apply.
   */
  value: JSONRGB,
}

export type JsonContextDimension = JsonSelectCases<JsonRegistry['minecraft:dimension']>

export type JsonContextEntityType = JsonSelectCases<JsonRegistry['minecraft:entity_type']>

export type JsonCopperGolemStatue = {
  /**
   * Value:
   *
   *  - Standing(`standing`)
   *  - Sitting(`sitting`)
   *  - Running(`running`)
   *  - Star(`star`)
   */
  pose: JsonCopperGolemStatuePose,
  texture: string,
}

export type JsonCopperGolemStatuePose = ('standing' | 'sitting' | 'running' | 'star')

export type JsonCount = {
  /**
   * If false, returns count clamped to `0..max_stack_size`.
   * If true, returns count divided by the `max_stack_size` component, clamped to `0..1`.
   * Defaults to true.
   */
  normalize?: boolean,
}

export type JsonCrossbowChargeType = ('none' | 'arrow' | 'rocket')

export type JsonCustomModelDataFlags = {
  /**
   * The index of the `flags` list in the `custom_model_data` component. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  index?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonCustomModelDataFloats = {
  /**
   * The index of the `floats` list in the `custom_model_data` component. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  index?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonCustomModelDataStrings = ({
  /**
   * The index of the `strings` list in the `custom_model_data` component. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  index?: (NBTInt<{
    min: 0,
  }> | number),
} & JsonSelectCases<string>)

export type JsonCustomModelDataTint = {
  /**
   * The index of the `colors` list in the `custom_model_data` component. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  index?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Tint to apply when the `custom_model_data` component is not present, or when it doesn't have a color in the specified index.
   */
  default: JSONRGB,
}

export type JsonDamage = {
  /**
   * If false, returns value of damage, clamped to `0..max_damage`.
   * If true, returns value of damage divided by the `max_damage` component, clamped to `0..1`.
   * Defaults to true.
   */
  normalize?: boolean,
}

export type JsonDisplayContext = JsonSelectCases<JsonItemDisplayContext>

export type JsonDyeTint = {
  /**
   * Tint to apply when the `dyed_color` component is not present.
   */
  default: JsonActuallyTranslucentRGB,
}

export type JsonEndCube = {
  /**
   * Value:
   *
   *  - Portal(`portal`)
   *  - Gateway(`gateway`)
   */
  effect: JsonEndCubeEffectType,
}

export type JsonEndCubeEffectType = ('portal' | 'gateway')

export type JsonFireworkTint = {
  /**
   * Tint to apply when the `firework_explosion` component is not present.
   */
  default: JsonActuallyTranslucentRGB,
}

export type JsonGrassTint = {
  /**
   * Value:
   * Range: 0..1
   */
  temperature: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  downfall: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonHangingSign = {
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
  wood_type: JsonWoodType,
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/signs/hanging/`
   */
  texture?: NamespacedString,
  /**
   * Defaults to `ceiling_middle`.
   *
   * Value:
   *
   *  - Wall(`wall`)
   *  - Ceiling(`ceiling`)
   *  - CeilingMiddle(`ceiling_middle`)
   */
  attachment?: JsonHangingSignAttachment,
}

export type JsonHangingSignAttachment = ('wall' | 'ceiling' | 'ceiling_middle')

export type JsonHasComponent = {
  component: JsonRegistry['minecraft:data_component_type'],
  /**
   * Whether the default components should be handled as "no component". Defaults to false.
   */
  ignore_default?: boolean,
}

export type JsonHead = ({
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
  kind: JsonHeadType,
  /**
   * Controls the animation time for piglin and dragon heads. Defaults to `0`.
   */
  animation?: (NBTFloat | number),
} & {
  /**
   * Texture to use instead of the texture from `kind`.
   *
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/`
   */
  texture?: NamespacedString,
})

export type JsonHeadType = ('creeper' | 'dragon' | 'piglin' | 'player' | 'skeleton' | 'wither_skeleton' | 'zombie')

export type JsonItemDefinition = {
  model: JsonItemModel,
  /**
   * Whether the down-and-up animation should be played in first-person view when the item stack is changed.
   * Defaults to `true`.
   */
  hand_animation_on_swap?: boolean,
  /**
   * Whether the item model is allowed to be bigger than its item slot.
   * Defaults to `false`, which clips the item model in GUI to the item slot size.
   * The behavior of `true` is **not** officially supported.
   */
  oversized_in_gui?: boolean,
  /**
   * How fast the item moves up and down when swapping items in hotbar.
   * Defaults to 1.0
   */
  swap_animation_scale?: (NBTFloat | number),
}

export type JsonItemModel = NonNullable<({
  [S in Extract<Extract<JsonItemModeltype, string>, string>]?: ({
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
    type: (S | `minecraft:${S}`),
  } & (S extends keyof JsonSymbolItemModel ? JsonSymbolItemModel[S] : JsonRootNBT))
}[Extract<JsonItemModeltype, string>])>

export type JsonItemModeltype = (
  | 'bundle/selected_item'
  | 'composite'
  | 'condition'
  | 'empty'
  | 'model'
  | 'range_dispatch'
  | 'select'
  | 'special')

export type JsonKeybindDown = {
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
   *  - DebugImprovedTransparency(`key.debug.improvedTransparency`)
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
   *  - Friends(`key.friends`)
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
  keybind: JsonKeybind,
}

export type JsonLocalTime = ({
  /**
   * Format to use for time formatting.
   * Examples: `yyyy-MM-dd`, `HH:mm:ss`.
   */
  pattern: (`${number}-${number}-${number}` | `${number}:${number}:${number}`),
  /**
   * Defaults to the root locale.
   * Examples: `en_US`, `cs_AU@numbers=thai;calendar=japanese`.
   */
  locale?: string,
  /**
   * Defaults to the timezone set on the client.
   * Examples: `Europe/Stockholm`, `GMT+0:45`.
   */
  time_zone?: string,
} & JsonSelectCases<string>)

export type JsonMainHand = JsonSelectCases<JsonHumanoidArm>

export type JsonMapColorTint = {
  /**
   * Tint to apply when the `map_color` component is not present.
   */
  default: JSONRGB,
}

export type JsonModel = {
  model: JsonModelRef,
  tints?: Array<JsonModelTint>,
  transformation?: JsonTransformation,
}

export type JsonModelTint = NonNullable<({
  [S in Extract<Extract<JsonTintSourceType, string>, string>]?: ({
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
    type: (S | `minecraft:${S}`),
  } & (S extends keyof JsonSymbolTintSource ? JsonSymbolTintSource[S] : JsonRootNBT))
}[Extract<JsonTintSourceType, string>])>

export type JsonNumericPropertyType = (
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

export type JsonPotionTint = {
  /**
   * Tint to apply when the `potion_contents` component is not present, or it has no effects and no `custom_color` is set.
   */
  default: JSONRGB,
}

export type JsonRangeDispatch = NonNullable<({
  [S in Extract<Extract<JsonNumericPropertyType, string>, string>]?: ({
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
    property: (S | `minecraft:${S}`),
    /**
     * Factor to multiply the property value with. Defaults to 1.
     */
    scale?: (NBTFloat | number),
    /**
     * List of ranges. Will select last entry with threshold less or equal to value.
     * Order does not matter, list will be sorted by threshold in ascending order.
     */
    entries: Array<{
      threshold: (NBTFloat | number),
      model: JsonItemModel,
    }>,
    /**
     * Item model to render if no entries were less or equal to the value.
     */
    fallback?: JsonItemModel,
    transformation?: JsonTransformation,
  } & (S extends keyof JsonSymbolNumericItemProperty
    ? JsonSymbolNumericItemProperty[S]
    : JsonSymbolNumericItemProperty<'%unknown'>))
}[Extract<JsonNumericPropertyType, string>])>

export type JsonRangeDispatchEntry = {
  threshold: (NBTFloat | number),
  model: JsonItemModel,
}

export type JsonSelect = NonNullable<({
  [S in Extract<Extract<JsonSelectPropertyType, string>, string>]?: ({
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
    property: (S | `minecraft:${S}`),
    /**
     * Item model to render if none of the cases matched the value.
     */
    fallback?: JsonItemModel,
    transformation?: JsonTransformation,
  } & (S extends keyof JsonSymbolSelectItemProperty
    ? JsonSymbolSelectItemProperty[S]
    : JsonSymbolSelectItemProperty<'%unknown'>))
}[Extract<JsonSelectPropertyType, string>])>

export type JsonSelectCase<T extends JsonNBTObject> = {
  when: (T | Array<T>),
  model: JsonItemModel,
}

export type JsonSelectCases<T extends JsonNBTObject> = {
  cases: Array<JsonSelectCase<T>>,
}

export type JsonSelectPropertyType = (
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

export type JsonShulkerBox = {
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/shulker/`
   */
  texture: NamespacedString,
  /**
   * Value:
   * Range: 0..1
   */
  openness?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonSpecial = {
  /**
   * Renders a special hardcoded model.
   */
  model: ({
    [S in Extract<Extract<JsonSpecialModelType, string>, string>]?: ({
      /**
       * Value:
       *
       *  - Banner(`banner`)
       *  - Bed(`bed`)
       *  - Bell(`bell`)
       *  - Book(`book`)
       *  - Conduit(`conduit`)
       *  - Chest(`chest`)
       *  - CopperGolemStatue(`copper_golem_statue`)
       *  - DecoratedPot(`decorated_pot`)
       *  - EndCube(`end_cube`)
       *  - HangingSign(`hanging_sign`)
       *  - Head(`head`)
       *  - PlayerHead(`player_head`)
       *  - Shield(`shield`)
       *  - ShulkerBox(`shulker_box`)
       *  - StandingSign(`standing_sign`)
       *  - Trident(`trident`)
       */
      type: (S | `minecraft:${S}`),
    } & (S extends keyof JsonSymbolSpecialItemModel
      ? JsonSymbolSpecialItemModel[S]
      : JsonSymbolSpecialItemModel<'%unknown'>))
  }[Extract<JsonSpecialModelType, string>]),
  /**
   * Base model, providing transformations, particle texture and GUI light.
   */
  base: JsonModelRef,
  transformation?: JsonTransformation,
}

export type JsonSpecialModel = NonNullable<({
  [S in Extract<Extract<JsonSpecialModelType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Banner(`banner`)
     *  - Bed(`bed`)
     *  - Bell(`bell`)
     *  - Book(`book`)
     *  - Conduit(`conduit`)
     *  - Chest(`chest`)
     *  - CopperGolemStatue(`copper_golem_statue`)
     *  - DecoratedPot(`decorated_pot`)
     *  - EndCube(`end_cube`)
     *  - HangingSign(`hanging_sign`)
     *  - Head(`head`)
     *  - PlayerHead(`player_head`)
     *  - Shield(`shield`)
     *  - ShulkerBox(`shulker_box`)
     *  - StandingSign(`standing_sign`)
     *  - Trident(`trident`)
     */
    type: (S | `minecraft:${S}`),
  } & (S extends keyof JsonSymbolSpecialItemModel
    ? JsonSymbolSpecialItemModel[S]
    : JsonSymbolSpecialItemModel<'%unknown'>))
}[Extract<JsonSpecialModelType, string>])>

export type JsonSpecialModelType = (
  | 'banner'
  | 'bed'
  | 'bell'
  | 'book'
  | 'conduit'
  | 'chest'
  | 'copper_golem_statue'
  | 'decorated_pot'
  | 'end_cube'
  | 'hanging_sign'
  | 'head'
  | 'player_head'
  | 'shield'
  | 'shulker_box'
  | 'standing_sign'
  | 'trident')

export type JsonStandingSign = {
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
  wood_type: JsonWoodType,
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/entity/signs/`
   */
  texture?: NamespacedString,
  /**
   * There is an extra "e" in the field name. See MC-307498. \
   * Defaults to `ground`.
   *
   * Value:
   *
   *  - Wall(`wall`)
   *  - Ground(`ground`)
   */
  attachement?: JsonStandingSignAttachment,
}

export type JsonStandingSignAttachment = ('wall' | 'ground')

export type JsonTeamTint = {
  /**
   * Tint to apply when there is no context entity, entity is not in a team or the team has no color.
   */
  default: JSONRGB,
}

export type JsonTime = {
  /**
   * Value:
   *
   *  - Daytime(`daytime`)
   *  - MoonPhase(`moon_phase`)
   *  - Random(`random`)
   */
  source: JsonTimeSource,
  /**
   * Whether to oscillate for some time around target before settling. Defaults to true.
   */
  wobble?: boolean,
}

export type JsonTimeSource = ('daytime' | 'moon_phase' | 'random')

export type JsonTintSourceType = (
  | 'constant'
  | 'custom_model_data'
  | 'dye'
  | 'firework'
  | 'grass'
  | 'map_color'
  | 'potion'
  | 'team')

export type JsonTrimMaterial = JsonSelectCases<(JsonRegistry['minecraft:trim_material'] | TrimMaterialClass)>

export type JsonUseCycle = {
  /**
   * returns remaining item use ticks modulo `period`.
   * Defaults to 1.
   */
  period?: (NBTFloat | number),
}

export type JsonUseDuration = {
  /**
   * If true, returns remaining item use ticks.
   * If false, returns item use ticks so far.
   * Defaults to false.
   */
  remaining?: boolean,
}

export type JsonViewEntity = Record<string, never>

export type JsonWoodType = (
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
type JsonConditionalItemPropertyDispatcherMap = {
  'component': JsonConditionalItemPropertyComponent,
  'minecraft:component': JsonConditionalItemPropertyComponent,
  'custom_model_data': JsonConditionalItemPropertyCustomModelData,
  'minecraft:custom_model_data': JsonConditionalItemPropertyCustomModelData,
  'has_component': JsonConditionalItemPropertyHasComponent,
  'minecraft:has_component': JsonConditionalItemPropertyHasComponent,
  'keybind_down': JsonConditionalItemPropertyKeybindDown,
  'minecraft:keybind_down': JsonConditionalItemPropertyKeybindDown,
  'view_entity': JsonConditionalItemPropertyViewEntity,
  'minecraft:view_entity': JsonConditionalItemPropertyViewEntity,
}
type JsonConditionalItemPropertyKeys = keyof JsonConditionalItemPropertyDispatcherMap
type JsonConditionalItemPropertyFallback = (
  | JsonConditionalItemPropertyComponent
  | JsonConditionalItemPropertyCustomModelData
  | JsonConditionalItemPropertyHasComponent
  | JsonConditionalItemPropertyKeybindDown
  | JsonConditionalItemPropertyViewEntity
  | JsonConditionalItemPropertyFallbackType)
export type JsonConditionalItemPropertyFallbackType = Record<string, never>
type JsonConditionalItemPropertyComponent = JsonComponentFlags
type JsonConditionalItemPropertyCustomModelData = JsonCustomModelDataFlags
type JsonConditionalItemPropertyHasComponent = JsonHasComponent
type JsonConditionalItemPropertyKeybindDown = JsonKeybindDown
type JsonConditionalItemPropertyViewEntity = JsonViewEntity
export type JsonSymbolConditionalItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonConditionalItemPropertyDispatcherMap
  : CASE extends 'keys'
    ? JsonConditionalItemPropertyKeys
    : CASE extends '%fallback'
      ? JsonConditionalItemPropertyFallback
      : CASE extends '%unknown' ? JsonConditionalItemPropertyFallbackType : never
type JsonItemModelDispatcherMap = {
  'bundle/selected_item': JsonItemModelBundleSelectedItem,
  'minecraft:bundle/selected_item': JsonItemModelBundleSelectedItem,
  'composite': JsonItemModelComposite,
  'minecraft:composite': JsonItemModelComposite,
  'condition': JsonItemModelCondition,
  'minecraft:condition': JsonItemModelCondition,
  'model': JsonItemModelModel,
  'minecraft:model': JsonItemModelModel,
  'range_dispatch': JsonItemModelRangeDispatch,
  'minecraft:range_dispatch': JsonItemModelRangeDispatch,
  'select': JsonItemModelSelect,
  'minecraft:select': JsonItemModelSelect,
  'special': JsonItemModelSpecial,
  'minecraft:special': JsonItemModelSpecial,
}
type JsonItemModelKeys = keyof JsonItemModelDispatcherMap
type JsonItemModelFallback = (
  | JsonItemModelBundleSelectedItem
  | JsonItemModelComposite
  | JsonItemModelCondition
  | JsonItemModelModel
  | JsonItemModelRangeDispatch
  | JsonItemModelSelect
  | JsonItemModelSpecial)
type JsonItemModelBundleSelectedItem = Record<string, never>
type JsonItemModelComposite = JsonComposite
type JsonItemModelCondition = JsonCondition
type JsonItemModelModel = JsonModel
type JsonItemModelRangeDispatch = JsonRangeDispatch
type JsonItemModelSelect = JsonSelect
type JsonItemModelSpecial = JsonSpecial
export type JsonSymbolItemModel<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonItemModelDispatcherMap
  : CASE extends 'keys' ? JsonItemModelKeys : CASE extends '%fallback' ? JsonItemModelFallback : never
type JsonNumericItemPropertyDispatcherMap = {
  'compass': JsonNumericItemPropertyCompass,
  'minecraft:compass': JsonNumericItemPropertyCompass,
  'count': JsonNumericItemPropertyCount,
  'minecraft:count': JsonNumericItemPropertyCount,
  'custom_model_data': JsonNumericItemPropertyCustomModelData,
  'minecraft:custom_model_data': JsonNumericItemPropertyCustomModelData,
  'damage': JsonNumericItemPropertyDamage,
  'minecraft:damage': JsonNumericItemPropertyDamage,
  'time': JsonNumericItemPropertyTime,
  'minecraft:time': JsonNumericItemPropertyTime,
  'use_cycle': JsonNumericItemPropertyUseCycle,
  'minecraft:use_cycle': JsonNumericItemPropertyUseCycle,
  'use_duration': JsonNumericItemPropertyUseDuration,
  'minecraft:use_duration': JsonNumericItemPropertyUseDuration,
}
type JsonNumericItemPropertyKeys = keyof JsonNumericItemPropertyDispatcherMap
type JsonNumericItemPropertyFallback = (
  | JsonNumericItemPropertyCompass
  | JsonNumericItemPropertyCount
  | JsonNumericItemPropertyCustomModelData
  | JsonNumericItemPropertyDamage
  | JsonNumericItemPropertyTime
  | JsonNumericItemPropertyUseCycle
  | JsonNumericItemPropertyUseDuration
  | JsonNumericItemPropertyFallbackType)
export type JsonNumericItemPropertyFallbackType = Record<string, never>
type JsonNumericItemPropertyCompass = JsonCompass
type JsonNumericItemPropertyCount = JsonCount
type JsonNumericItemPropertyCustomModelData = JsonCustomModelDataFloats
type JsonNumericItemPropertyDamage = JsonDamage
type JsonNumericItemPropertyTime = JsonTime
type JsonNumericItemPropertyUseCycle = JsonUseCycle
type JsonNumericItemPropertyUseDuration = JsonUseDuration
export type JsonSymbolNumericItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonNumericItemPropertyDispatcherMap
  : CASE extends 'keys'
    ? JsonNumericItemPropertyKeys
    : CASE extends '%fallback'
      ? JsonNumericItemPropertyFallback
      : CASE extends '%unknown' ? JsonNumericItemPropertyFallbackType : never
type JsonSelectItemPropertyDispatcherMap = {
  'block_state': JsonSelectItemPropertyBlockState,
  'minecraft:block_state': JsonSelectItemPropertyBlockState,
  'charge_type': JsonSelectItemPropertyChargeType,
  'minecraft:charge_type': JsonSelectItemPropertyChargeType,
  'component': JsonSelectItemPropertyComponent,
  'minecraft:component': JsonSelectItemPropertyComponent,
  'context_dimension': JsonSelectItemPropertyContextDimension,
  'minecraft:context_dimension': JsonSelectItemPropertyContextDimension,
  'context_entity_type': JsonSelectItemPropertyContextEntityType,
  'minecraft:context_entity_type': JsonSelectItemPropertyContextEntityType,
  'custom_model_data': JsonSelectItemPropertyCustomModelData,
  'minecraft:custom_model_data': JsonSelectItemPropertyCustomModelData,
  'display_context': JsonSelectItemPropertyDisplayContext,
  'minecraft:display_context': JsonSelectItemPropertyDisplayContext,
  'local_time': JsonSelectItemPropertyLocalTime,
  'minecraft:local_time': JsonSelectItemPropertyLocalTime,
  'main_hand': JsonSelectItemPropertyMainHand,
  'minecraft:main_hand': JsonSelectItemPropertyMainHand,
  'trim_material': JsonSelectItemPropertyTrimMaterial,
  'minecraft:trim_material': JsonSelectItemPropertyTrimMaterial,
}
type JsonSelectItemPropertyKeys = keyof JsonSelectItemPropertyDispatcherMap
type JsonSelectItemPropertyFallback = (
  | JsonSelectItemPropertyBlockState
  | JsonSelectItemPropertyChargeType
  | JsonSelectItemPropertyComponent
  | JsonSelectItemPropertyContextDimension
  | JsonSelectItemPropertyContextEntityType
  | JsonSelectItemPropertyCustomModelData
  | JsonSelectItemPropertyDisplayContext
  | JsonSelectItemPropertyLocalTime
  | JsonSelectItemPropertyMainHand
  | JsonSelectItemPropertyTrimMaterial
  | JsonSelectItemPropertyFallbackType)
export type JsonSelectItemPropertyFallbackType = JsonSelectCases<string>
type JsonSelectItemPropertyBlockState = JsonBlockState
type JsonSelectItemPropertyChargeType = JsonChargeType
type JsonSelectItemPropertyComponent = JsonComponentStrings
type JsonSelectItemPropertyContextDimension = JsonContextDimension
type JsonSelectItemPropertyContextEntityType = JsonContextEntityType
type JsonSelectItemPropertyCustomModelData = JsonCustomModelDataStrings
type JsonSelectItemPropertyDisplayContext = JsonDisplayContext
type JsonSelectItemPropertyLocalTime = JsonLocalTime
type JsonSelectItemPropertyMainHand = JsonMainHand
type JsonSelectItemPropertyTrimMaterial = JsonTrimMaterial
export type JsonSymbolSelectItemProperty<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSelectItemPropertyDispatcherMap
  : CASE extends 'keys'
    ? JsonSelectItemPropertyKeys
    : CASE extends '%fallback'
      ? JsonSelectItemPropertyFallback
      : CASE extends '%unknown' ? JsonSelectItemPropertyFallbackType : never
type JsonSpecialItemModelDispatcherMap = {
  'banner': JsonSpecialItemModelBanner,
  'minecraft:banner': JsonSpecialItemModelBanner,
  'book': JsonSpecialItemModelBook,
  'minecraft:book': JsonSpecialItemModelBook,
  'chest': JsonSpecialItemModelChest,
  'minecraft:chest': JsonSpecialItemModelChest,
  'copper_golem_statue': JsonSpecialItemModelCopperGolemStatue,
  'minecraft:copper_golem_statue': JsonSpecialItemModelCopperGolemStatue,
  'end_cube': JsonSpecialItemModelEndCube,
  'minecraft:end_cube': JsonSpecialItemModelEndCube,
  'head': JsonSpecialItemModelHead,
  'minecraft:head': JsonSpecialItemModelHead,
  'shulker_box': JsonSpecialItemModelShulkerBox,
  'minecraft:shulker_box': JsonSpecialItemModelShulkerBox,
}
type JsonSpecialItemModelKeys = keyof JsonSpecialItemModelDispatcherMap
type JsonSpecialItemModelFallback = (
  | JsonSpecialItemModelBanner
  | JsonSpecialItemModelBook
  | JsonSpecialItemModelChest
  | JsonSpecialItemModelCopperGolemStatue
  | JsonSpecialItemModelEndCube
  | JsonSpecialItemModelHead
  | JsonSpecialItemModelShulkerBox
  | JsonSpecialItemModelFallbackType)
export type JsonSpecialItemModelFallbackType = Record<string, never>
type JsonSpecialItemModelBanner = JsonBanner
type JsonSpecialItemModelBook = JsonBook
type JsonSpecialItemModelChest = JsonChest
type JsonSpecialItemModelCopperGolemStatue = JsonCopperGolemStatue
type JsonSpecialItemModelEndCube = JsonEndCube
type JsonSpecialItemModelHead = JsonHead
type JsonSpecialItemModelShulkerBox = JsonShulkerBox
export type JsonSymbolSpecialItemModel<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSpecialItemModelDispatcherMap
  : CASE extends 'keys'
    ? JsonSpecialItemModelKeys
    : CASE extends '%fallback'
      ? JsonSpecialItemModelFallback
      : CASE extends '%unknown' ? JsonSpecialItemModelFallbackType : never
type JsonTintSourceDispatcherMap = {
  'constant': JsonTintSourceConstant,
  'minecraft:constant': JsonTintSourceConstant,
  'custom_model_data': JsonTintSourceCustomModelData,
  'minecraft:custom_model_data': JsonTintSourceCustomModelData,
  'dye': JsonTintSourceDye,
  'minecraft:dye': JsonTintSourceDye,
  'firework': JsonTintSourceFirework,
  'minecraft:firework': JsonTintSourceFirework,
  'grass': JsonTintSourceGrass,
  'minecraft:grass': JsonTintSourceGrass,
  'map_color': JsonTintSourceMapColor,
  'minecraft:map_color': JsonTintSourceMapColor,
  'potion': JsonTintSourcePotion,
  'minecraft:potion': JsonTintSourcePotion,
  'team': JsonTintSourceTeam,
  'minecraft:team': JsonTintSourceTeam,
}
type JsonTintSourceKeys = keyof JsonTintSourceDispatcherMap
type JsonTintSourceFallback = (
  | JsonTintSourceConstant
  | JsonTintSourceCustomModelData
  | JsonTintSourceDye
  | JsonTintSourceFirework
  | JsonTintSourceGrass
  | JsonTintSourceMapColor
  | JsonTintSourcePotion
  | JsonTintSourceTeam)
type JsonTintSourceConstant = JsonConstantTint
type JsonTintSourceCustomModelData = JsonCustomModelDataTint
type JsonTintSourceDye = JsonDyeTint
type JsonTintSourceFirework = JsonFireworkTint
type JsonTintSourceGrass = JsonGrassTint
type JsonTintSourceMapColor = JsonMapColorTint
type JsonTintSourcePotion = JsonPotionTint
type JsonTintSourceTeam = JsonTeamTint
export type JsonSymbolTintSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTintSourceDispatcherMap
  : CASE extends 'keys' ? JsonTintSourceKeys : CASE extends '%fallback' ? JsonTintSourceFallback : never
