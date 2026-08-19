import type { JsonDialog } from 'sandstone/arguments/generated/_json/data/dialog.ts'
import type { JsonSymbolMcdocCustomEvent } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonProfile } from 'sandstone/arguments/generated/_json/util/avatar.ts'
import type { JSONRGBA } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonDataComponentPatch } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { Coordinates, MultipleEntitiesArgument, SingleEntityArgument, TextureType } from 'sandstone/arguments'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  AtlasClass,
  DialogClass,
  FontClass,
  JsonNBTList,
  NamespacedString,
  NBTInt,
  NonEmptyString,
  ObjectiveClass,
  TextureClass,
} from 'sandstone'
import type { TextComponentClass } from 'sandstone/variables'

export type JsonBlockNbtText = ({
  block: Coordinates,
  nbt: NonEmptyString,
  source?: 'block',
  type?: 'nbt',
} & JsonTextNbtBase)

export type JsonChangePage = {
  /**
   * The page number to go to.
   *
   * Value:
   * Range: 1..
   */
  page: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonClickEvent = NonNullable<({
  [S in Extract<Extract<JsonClickEventAction, string>, string>]?: ({
    /**
     * Value:
     *
     *  - OpenUrl(`open_url`)
     *  - RunCommand(`run_command`)
     *  - SuggestCommand(`suggest_command`)
     *  - ChangePage(`change_page`)
     *  - CopyToClipboard(`copy_to_clipboard`)
     *  - ShowDialog(`show_dialog`)
     *  - Custom(`custom`)
     */
    action: S,
  } & (S extends keyof JsonSymbolClickEvent ? JsonSymbolClickEvent[S] : JsonRootNBT))
}[Extract<JsonClickEventAction, string>])>

export type JsonClickEventAction = (
  | 'open_url'
  | 'run_command'
  | 'suggest_command'
  | 'change_page'
  | 'copy_to_clipboard'
  | 'show_dialog'
  | 'custom')

export type JsonCopyToClipboard = {
  /**
   * The text value to copy to the clipboard.
   */
  value: string,
}

export type JsonCustomAction = NonNullable<({
  [S in Extract<Extract<NamespacedString, string>, string>]?: {
    /**
     * ID of a custom action.
     * Has no functionality on vanilla servers.
     */
    id: S,
    payload?: (S extends keyof JsonSymbolMcdocCustomEvent
      ? JsonSymbolMcdocCustomEvent[S]
      : JsonSymbolMcdocCustomEvent<'%unknown'>),
  }
}[Extract<NamespacedString, string>])>

export type JsonEntityHoverContent = {
  type: JsonRegistry['minecraft:entity_type'],
  /**
   * Value:
   * *either*
   *
   * List length range: 4
   *
   * *or*
   *
   * *item 1*
   */
  id: (JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }> | string),
  name?: JsonText,
}

export type JsonEntityHoverValue = {
  name?: string,
  type?: string,
  id?: string,
}

export type JsonEntityNbtText = ({
  entity: MultipleEntitiesArgument,
  nbt: NonEmptyString,
  source?: 'entity',
  type?: 'nbt',
} & JsonTextNbtBase)

export type JsonEntityTooltipInfo = {
  id: JsonRegistry['minecraft:entity_type'],
  /**
   * Value:
   * *either*
   *
   * List length range: 4
   *
   * *or*
   *
   * *item 1*
   */
  uuid: (JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }> | string),
  name?: JsonText,
}

export type JsonHoverEvent = NonNullable<({
  [S in Extract<Extract<JsonHoverEventAction, string>, string>]?: ({
    /**
     * Value:
     *
     *  - ShowText(`show_text`)
     *  - ShowItem(`show_item`)
     *  - ShowEntity(`show_entity`)
     */
    action: S,
  } & (S extends keyof JsonSymbolHoverEvent ? JsonSymbolHoverEvent[S] : JsonRootNBT))
}[Extract<JsonHoverEventAction, string>])>

export type JsonHoverEventAction = ('show_text' | 'show_item' | 'show_entity')

export type JsonItemHoverContent = {
  id: JsonRegistry['minecraft:item'],
  count?: (NBTInt | number),
  components?: JsonDataComponentPatch,
}

export type JsonKeybind = (
  | 'key.advancements'
  | 'key.attack'
  | 'key.back'
  | 'key.chat'
  | 'key.command'
  | 'key.debug.clearChat'
  | 'key.debug.copyLocation'
  | 'key.debug.copyRecreateCommand'
  | 'key.debug.crash'
  | 'key.debug.debugOptions'
  | 'key.debug.dumpDynamicTextures'
  | 'key.debug.dumpVersion'
  | 'key.debug.focusPause'
  | 'key.debug.fpsCharts'
  | 'key.debug.improvedTransparency'
  | 'key.debug.lightmapTexture'
  | 'key.debug.modifier'
  | 'key.debug.networkCharts'
  | 'key.debug.overlay'
  | 'key.debug.profiling'
  | 'key.debug.profilingChart'
  | 'key.debug.reloadChunk'
  | 'key.debug.reloadResourcePacks'
  | 'key.debug.showAdvancedTooltips'
  | 'key.debug.showChunkBorders'
  | 'key.debug.showHitboxes'
  | 'key.debug.spectate'
  | 'key.debug.switchGameMode'
  | 'key.drop'
  | 'key.forward'
  | 'key.friends'
  | 'key.fullscreen'
  | 'key.hotbar.1'
  | 'key.hotbar.2'
  | 'key.hotbar.3'
  | 'key.hotbar.4'
  | 'key.hotbar.5'
  | 'key.hotbar.6'
  | 'key.hotbar.7'
  | 'key.hotbar.8'
  | 'key.hotbar.9'
  | 'key.inventory'
  | 'key.jump'
  | 'key.left'
  | 'key.loadToolbarActivator'
  | 'key.pickItem'
  | 'key.playerlist'
  | 'key.quickActions'
  | 'key.right'
  | 'key.saveToolbarActivator'
  | 'key.screenshot'
  | 'key.smoothCamera'
  | 'key.sneak'
  | 'key.spectatorHotbar'
  | 'key.spectatorOutlines'
  | 'key.sprint'
  | 'key.swapOffhand'
  | 'key.toggleGui'
  | 'key.togglePerspective'
  | 'key.toggleSpectatorShaderEffects'
  | 'key.use')

export type JsonKeybindText = ({
  /**
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
  type?: 'keybind',
} & JsonTextBase)

export type JsonNormalText = ({
  text: string,
  type?: 'text',
} & JsonTextBase)

export type JsonObjectTextConfig = {
  /**
   * Used in places where object component cannot be displayed (for example, server log or narration).
   */
  fallback?: JsonText,
}

export type JsonOpenUrl = {
  url: NonEmptyString | URL,
}

export type JsonPlayerHeadText = ({
  player: JsonProfile,
  /**
   * Whether the head layer is rendered. Defaults to `true`.
   */
  hat?: boolean,
  object?: 'player',
  type?: 'object',
} & JsonObjectTextConfig & JsonTextBase)

export type JsonRunCommand = {
  command: NonEmptyString,
}

export type JsonScoreHolder = {
  objective: NonEmptyString | ObjectiveClass,
  name: NonEmptyString | SingleEntityArgument,
}

export type JsonScoreText = ({
  score: {
    objective: NonEmptyString | ObjectiveClass,
    name: NonEmptyString | SingleEntityArgument,
  },
  type?: 'score',
} & JsonTextBase)

export type JsonSelectorText = ({
  selector: MultipleEntitiesArgument,
  separator?: JsonText,
  type?: 'selector',
} & JsonTextBase)

export type JsonShowDialog = {
  dialog: ((JsonRegistry['minecraft:dialog'] | DialogClass) | JsonDialog),
}

export type JsonShowEntity = {
  id: JsonRegistry['minecraft:entity_type'],
  /**
   * Value:
   * *either*
   *
   * List length range: 4
   *
   * *or*
   *
   * *item 1*
   */
  uuid: (JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }> | string),
  name?: JsonText,
}

export type JsonShowItem = JsonItemStack

export type JsonShowText = {
  value: JsonText,
}

export type JsonSpriteText = ({
  /**
   * Defaults to `minecraft:blocks`.
   */
  atlas?: (JsonRegistry['minecraft:atlas'] | AtlasClass),
  sprite: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  object?: 'atlas',
  type?: 'object',
} & JsonObjectTextConfig & JsonTextBase)

export type JsonStorageNbtText = ({
  storage: NamespacedString,
  nbt: NonEmptyString,
  source?: 'storage',
  type?: 'nbt',
} & JsonTextNbtBase)

export type JsonSuggestCommand = {
  command: NonEmptyString,
}

export type JsonText = (string | JsonTextObject | TextComponentClass | JsonText[])

export type JsonTextBase = ({
  /**
   * Value:
   * List length range: 1..
   */
  extra?: JsonNBTList<JsonText, {
    leftExclusive: false,
    min: 1,
  }>,
} & JsonTextStyle)

export type JsonTextColor = (
  | 'black'
  | 'dark_blue'
  | 'dark_green'
  | 'dark_aqua'
  | 'dark_red'
  | 'dark_purple'
  | 'gold'
  | 'gray'
  | 'dark_gray'
  | 'blue'
  | 'green'
  | 'aqua'
  | 'red'
  | 'light_purple'
  | 'yellow'
  | 'white')

export type JsonTextFormat = ('obfuscated' | 'bold' | 'strikethrough' | 'underline' | 'italic' | 'reset')

export type JsonTextNbtBase = ({
  interpret?: boolean,
  /**
   * Whether to remove colors from pretty-printed NBT structure when `interpret` is `false`.
   * Defaults to `false`. \
   * Cannot be `true` when `interpret` is `true`.
   */
  plain?: boolean,
  separator?: JsonText,
} & JsonTextBase)

export type JsonTextObject = (({
  text: string,
  type?: 'text',
} & JsonTextBase) | ({
  translate: JsonRegistry['minecraft:translation_key'],
  fallback?: string,
  /**
   * Value:
   * List length range: 1..
   */
  with?: JsonNBTList<JsonText, {
    leftExclusive: false,
    min: 1,
  }>,
  type?: 'translatable',
} & JsonTextBase) | ({
  score: {
    objective: NonEmptyString | ObjectiveClass,
    name: NonEmptyString | SingleEntityArgument,
  },
  type?: 'score',
} & JsonTextBase) | ({
  selector: MultipleEntitiesArgument,
  separator?: JsonText,
  type?: 'selector',
} & JsonTextBase) | ({
  /**
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
  type?: 'keybind',
} & JsonTextBase) | ({
  block: Coordinates,
  nbt: NonEmptyString,
  source?: 'block',
  type?: 'nbt',
} & JsonTextNbtBase) | ({
  entity: MultipleEntitiesArgument,
  nbt: NonEmptyString,
  source?: 'entity',
  type?: 'nbt',
} & JsonTextNbtBase) | ({
  storage: NamespacedString,
  nbt: NonEmptyString,
  source?: 'storage',
  type?: 'nbt',
} & JsonTextNbtBase) | ({
  /**
   * Defaults to `minecraft:blocks`.
   */
  atlas?: (JsonRegistry['minecraft:atlas'] | AtlasClass),
  sprite: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  object?: 'atlas',
  type?: 'object',
} & JsonObjectTextConfig & JsonTextBase) | ({
  player: JsonProfile,
  /**
   * Whether the head layer is rendered. Defaults to `true`.
   */
  hat?: boolean,
  object?: 'player',
  type?: 'object',
} & JsonObjectTextConfig & JsonTextBase))

export type JsonTextStyle = {
  /**
   * Value:
   * *either*
   *
   * *item 0*
   *
   * *or*
   *
   *
   */
  color?: (`#${string}` | JsonTextColor),
  /**
   * Overrides the shadow properties of the text.
   * If specified as 0, the shadow will never be displayed.
   */
  shadow_color?: JSONRGBA,
  font?: (JsonRegistry['minecraft:font'] | FontClass),
  bold?: boolean,
  italic?: boolean,
  underlined?: boolean,
  strikethrough?: boolean,
  obfuscated?: boolean,
  insertion?: string,
  click_event?: JsonClickEvent,
  hover_event?: JsonHoverEvent,
}

export type JsonTranslatedText = ({
  translate: JsonRegistry['minecraft:translation_key'],
  fallback?: string,
  /**
   * Value:
   * List length range: 1..
   */
  with?: JsonNBTList<JsonText, {
    leftExclusive: false,
    min: 1,
  }>,
  type?: 'translatable',
} & JsonTextBase)
type JsonClickEventDispatcherMap = {
  'change_page': JsonClickEventChangePage,
  'minecraft:change_page': JsonClickEventChangePage,
  'copy_to_clipboard': JsonClickEventCopyToClipboard,
  'minecraft:copy_to_clipboard': JsonClickEventCopyToClipboard,
  'custom': JsonClickEventCustom,
  'minecraft:custom': JsonClickEventCustom,
  'open_url': JsonClickEventOpenUrl,
  'minecraft:open_url': JsonClickEventOpenUrl,
  'run_command': JsonClickEventRunCommand,
  'minecraft:run_command': JsonClickEventRunCommand,
  'show_dialog': JsonClickEventShowDialog,
  'minecraft:show_dialog': JsonClickEventShowDialog,
  'suggest_command': JsonClickEventSuggestCommand,
  'minecraft:suggest_command': JsonClickEventSuggestCommand,
}
type JsonClickEventKeys = keyof JsonClickEventDispatcherMap
type JsonClickEventFallback = (
  | JsonClickEventChangePage
  | JsonClickEventCopyToClipboard
  | JsonClickEventCustom
  | JsonClickEventOpenUrl
  | JsonClickEventRunCommand
  | JsonClickEventShowDialog
  | JsonClickEventSuggestCommand)
type JsonClickEventChangePage = JsonChangePage
type JsonClickEventCopyToClipboard = JsonCopyToClipboard
type JsonClickEventCustom = JsonCustomAction
type JsonClickEventOpenUrl = JsonOpenUrl
type JsonClickEventRunCommand = JsonRunCommand
type JsonClickEventShowDialog = JsonShowDialog
type JsonClickEventSuggestCommand = JsonSuggestCommand
export type JsonSymbolClickEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonClickEventDispatcherMap
  : CASE extends 'keys' ? JsonClickEventKeys : CASE extends '%fallback' ? JsonClickEventFallback : never
type JsonHoverEventDispatcherMap = {
  'show_entity': JsonHoverEventShowEntity,
  'minecraft:show_entity': JsonHoverEventShowEntity,
  'show_item': JsonHoverEventShowItem,
  'minecraft:show_item': JsonHoverEventShowItem,
  'show_text': JsonHoverEventShowText,
  'minecraft:show_text': JsonHoverEventShowText,
}
type JsonHoverEventKeys = keyof JsonHoverEventDispatcherMap
type JsonHoverEventFallback = (JsonHoverEventShowEntity | JsonHoverEventShowItem | JsonHoverEventShowText)
type JsonHoverEventShowEntity = JsonShowEntity
type JsonHoverEventShowItem = JsonShowItem
type JsonHoverEventShowText = JsonShowText
export type JsonSymbolHoverEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonHoverEventDispatcherMap
  : CASE extends 'keys' ? JsonHoverEventKeys : CASE extends '%fallback' ? JsonHoverEventFallback : never
