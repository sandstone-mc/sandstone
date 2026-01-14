import type { Dialog } from 'sandstone/arguments/generated/data/dialog.ts'
import type { SymbolMcdocCustomEvent } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Profile } from 'sandstone/arguments/generated/util/avatar.ts'
import type { RGBA } from 'sandstone/arguments/generated/util/color.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { Coordinates, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, NBTInt, NBTList, ObjectiveClass, Score } from 'sandstone'

export type ChangePage = {
  /**
   * The page number to go to.
   *
   * Value:
   * Range: 1..
   */
  page: NBTInt<{
    min: 1
  }>
}

export type ClickEvent = NonNullable<({
  [S in Extract<ClickEventAction, string>]?: ({
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
    action: S
  } & (S extends keyof SymbolClickEvent ? SymbolClickEvent[S] : RootNBT));
}[ClickEventAction])>

export type ClickEventAction = (
  | 'open_url'
  | 'run_command'
  | 'suggest_command'
  | 'change_page'
  | 'copy_to_clipboard'
  | 'show_dialog'
  | 'custom')

export type CopyToClipboard = {
  /**
   * The text value to copy to the clipboard.
   */
  value: string
}

export type CustomAction = NonNullable<({
  [S in Extract<`${string}:${string}`, string>]?: {
    /**
     * ID of a custom action.
     * Has no functionality on vanilla servers.
     */
    id: S
    payload?: (S extends keyof SymbolMcdocCustomEvent
      ? SymbolMcdocCustomEvent[S]
      : SymbolMcdocCustomEvent<'%unknown'>)
  };
}[`${string}:${string}`])>

export type HoverEvent = NonNullable<({
  [S in Extract<HoverEventAction, string>]?: ({
    /**
     * Value:
     *
     *  - ShowText(`show_text`)
     *  - ShowItem(`show_item`)
     *  - ShowEntity(`show_entity`)
     */
    action: S
  } & (S extends keyof SymbolHoverEvent ? SymbolHoverEvent[S] : RootNBT));
}[HoverEventAction])>

export type HoverEventAction = ('show_text' | 'show_item' | 'show_entity')

export type Keybind = (
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

export type OpenUrl = {
  url: `${any}${string}` | URL
}

export type RunCommand = {
  command: `${any}${string}`
}

export type ShowDialog = {
  dialog: (Registry['minecraft:dialog'] | Dialog)
}

export type ShowEntity = ({
  contents?: {
    type: Registry['minecraft:entity_type']
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
    id: (NBTList<NBTInt, {
      leftExclusive: false
      rightExclusive: false
      min: 4
      max: 4
    }> | string)
    name?: Text
  }
} & {
  id: Registry['minecraft:entity_type']
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
  uuid: (NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }> | string)
  name?: Text
})

export type ShowItem = ItemStack

export type ShowText = {
  value: Text
}

export type SuggestCommand = {
  command: `${any}${string}`
}

export type Text = (string | TextObject | NBTList<(string | TextObject), {
  leftExclusive: false
  min: 1
}>)

export type TextBase = ({
  /**
   * Value:
   * List length range: 1..
   */
  extra?: NBTList<Text, {
    leftExclusive: false
    min: 1
  }>
} & TextStyle)

export type TextColor = (
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

export type TextNbtBase = ({
  interpret?: boolean
  separator?: Text
} & TextBase)

export type TextObject = (({
  text: string
  type?: 'text'
} & TextBase) | ({
  translate: Registry['minecraft:translation_key']
  fallback?: string
  /**
   * Value:
   * List length range: 1..
   */
  with?: NBTList<Text, {
    leftExclusive: false
    min: 1
  }>
  type?: 'translatable'
} & TextBase) | ({
  score: {
    objective: `${any}${string}` | ObjectiveClass
    name: `${any}${string}` | Score
  }
  type?: 'score'
} & TextBase) | ({
  selector: MultipleEntitiesArgument
  separator?: Text
  type?: 'selector'
} & TextBase) | ({
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
  type?: 'keybind'
} & TextBase) | ({
  block: Coordinates
  nbt: `${any}${string}` | DataPointClass
  source?: 'block'
  type?: 'nbt'
} & TextNbtBase) | ({
  entity: MultipleEntitiesArgument
  nbt: `${any}${string}` | DataPointClass
  source?: 'entity'
  type?: 'nbt'
} & TextNbtBase) | ({
  storage: `${string}:${string}`
  nbt: `${any}${string}` | DataPointClass
  source?: 'storage'
  type?: 'nbt'
} & TextNbtBase) | ({
  /**
   * Defaults to `minecraft:blocks`.
   */
  atlas?: Registry['minecraft:atlas']
  sprite: Registry['minecraft:texture']
  object?: 'atlas'
  type?: 'object'
} & TextBase) | ({
  player: Profile
  /**
   * Whether the head layer is rendered. Defaults to `true`.
   */
  hat?: boolean
  object?: 'player'
  type?: 'object'
} & TextBase))

export type TextStyle = {
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
  color?: (`#${string}` | TextColor)
  /**
   * Overrides the shadow properties of the text.
   * If specified as 0, the shadow will never be displayed.
   */
  shadow_color?: RGBA
  font?: Registry['minecraft:font']
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
  insertion?: string
  click_event?: ClickEvent
  hover_event?: HoverEvent
}
type ClickEventDispatcherMap = {
  'change_page': ClickEventChangePage
  'minecraft:change_page': ClickEventChangePage
  'copy_to_clipboard': ClickEventCopyToClipboard
  'minecraft:copy_to_clipboard': ClickEventCopyToClipboard
  'custom': ClickEventCustom
  'minecraft:custom': ClickEventCustom
  'open_url': ClickEventOpenUrl
  'minecraft:open_url': ClickEventOpenUrl
  'run_command': ClickEventRunCommand
  'minecraft:run_command': ClickEventRunCommand
  'show_dialog': ClickEventShowDialog
  'minecraft:show_dialog': ClickEventShowDialog
  'suggest_command': ClickEventSuggestCommand
  'minecraft:suggest_command': ClickEventSuggestCommand
}
type ClickEventKeys = keyof ClickEventDispatcherMap
type ClickEventFallback = (
  | ClickEventChangePage
  | ClickEventCopyToClipboard
  | ClickEventCustom
  | ClickEventOpenUrl
  | ClickEventRunCommand
  | ClickEventShowDialog
  | ClickEventSuggestCommand)
type ClickEventChangePage = ChangePage
type ClickEventCopyToClipboard = CopyToClipboard
type ClickEventCustom = CustomAction
type ClickEventOpenUrl = OpenUrl
type ClickEventRunCommand = RunCommand
type ClickEventShowDialog = ShowDialog
type ClickEventSuggestCommand = SuggestCommand
export type SymbolClickEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ClickEventDispatcherMap
  : CASE extends 'keys' ? ClickEventKeys : CASE extends '%fallback' ? ClickEventFallback : never
type HoverEventDispatcherMap = {
  'show_entity': HoverEventShowEntity
  'minecraft:show_entity': HoverEventShowEntity
  'show_item': HoverEventShowItem
  'minecraft:show_item': HoverEventShowItem
  'show_text': HoverEventShowText
  'minecraft:show_text': HoverEventShowText
}
type HoverEventKeys = keyof HoverEventDispatcherMap
type HoverEventFallback = (HoverEventShowEntity | HoverEventShowItem | HoverEventShowText)
type HoverEventShowEntity = ShowEntity
type HoverEventShowItem = ShowItem
type HoverEventShowText = ShowText
export type SymbolHoverEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? HoverEventDispatcherMap
  : CASE extends 'keys' ? HoverEventKeys : CASE extends '%fallback' ? HoverEventFallback : never
