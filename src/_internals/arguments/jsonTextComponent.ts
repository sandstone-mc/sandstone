import type { ComponentClass } from '@variables/abstractClasses'
import type { VectorClass } from '@variables/Coordinates'
import type { LiteralUnion } from '../generalTypes'
import type { BASIC_COLORS } from './basics'
import type { MultipleEntitiesArgument, SelectorArgument } from './selector'
// To be valid, a chat component must contain one content tag: text, translate, score, selector, keybind, or nbt.
type ContentTag = {
  /** A string containing plain text to display directly. Can also be a number or boolean that is displayed directly. */
  text: string | number | boolean
} | {
  /** A translation identifier, to be displayed as the corresponding text in the player's selected language. */
  translate: string

  /** Optional. A list of raw JSON text component arguments to be inserted into slots in the translation text.  */
  with?: TextComponentObject[]
} | {
  /**
   * Displays a score holder's current score in an objective.
   *
   * Displays nothing if the given score holder or the given objective do not exist,
   * or if the score holder is not tracked in the objective.
   */
  score: {
    /**
     * The name of the score holder whose score should be displayed.
     * This can be a selector like @p or an explicit name.
     */
    name: MultipleEntitiesArgument

    /** The internal name of the objective to display the player's score in. */
    objective: string

    /** Optional. If present, this value is used regardless of what the score would have been. */
    value?: number
  }
} | {
  /**
   * An entity selector. Displayed as the name of the player or entity found by the selector.
   *
   * If more than one player or entity is found by the selector,
   * their names are displayed in either the form "Name1 and Name2" or the form "Name1, Name2, Name3, and Name4".
   */
  selector: string
} | {
  /**
   * A keybind identifier, to be displayed as the name of the button that is currently bound to a certain action.
   * For example, {"keybind": "key.inventory"} will display "e" if the player is using the default control scheme.
   */
  keybind: string
} | (
    {
      /**
       * The NBT path used for looking up NBT values from an entity, a block entity or an NBT storage.
       *
       * NBT strings display their contents.
       * Other NBT values are displayed as SNBT with no spacing or linebreaks.
       *
       * How values are displayed depends on the value of `interpret`.
       */
      nbt: string

      /**
       * Optional.
       * If true, the game will try to parse the text of each NBT value as a raw JSON text component.
       *
       * This usually only works if the value is an NBT string containing JSON, since JSON and SNBT are not compatible.
       *
       * If parsing fails, displays nothing.
       *
       * @default false
       */
      interpret?: boolean
    } & ({
      /**
       * The coordinates of the block entity from which the NBT value is obtained.
       * The coordinates can be absolute or relative.
       */
      block: string | VectorClass<[string, string, string]>
    } | {
      /** The target selector for the entity or entities from which the NBT value is obtained. */
      entity: string
    } | {
      /** The namespaced ID of the command storage from which the NBT value is obtained */
      storage: string
    })
  )

type ChildrenTags = {
  /**
   * Optional. A list of child raw JSON text components to be displayed after this one.
   *
   * Child text components inherit all formatting and interactivity from the parent component,
   * unless they explicitly override them.
   */
  with?: TextComponentObject[]
}

type FormattingTags = {
  /** Optional. The color to render the content in. */
  color?: LiteralUnion<BASIC_COLORS>

  /**
   * Optional.
   * The resource location of the font for this component in the resource pack within assets/<namespace>/font.
   *
   * @default "minecraft:default"
   */
  font?: string

  /** Optional. Whether to render the content in bold. */
  bold?: boolean

  /**
   * Optional. Whether to render the content in italics.
   *
   * Note that text which is italicized by default, such as custom item names,
   * can be unitalicized by setting this to false.
   */
  italic?: boolean

  /** Optional. Whether to underline the content. */
  underlined?: boolean

  /** Optional. Whether to strikethrough the content. */
  strikethrough?: boolean

  /** Optional. Whether to render the content obfuscated. */
  obfuscated?: boolean
}

type InteractivityTags = {
  /**
   * Optional. When the text is shift-clicked by a player, this string is inserted in their chat input.
   * It does not overwrite any existing text the player was writing. This only works in chat messages.
   */
  insertion?: string

  /**
   * Optional. Allows for events to occur when the player clicks on text.
   * Only work in chat messages and written books, unless specified otherwise.
   */
  clickEvent?: {
    /**
     * The action to perform when clicked.
     *
     * Valid values are:
     * - `open_url`: Opens `value` as a URL in the user's default web browser.
     *
     * - `open_file`: Opens the file at `value` on the user's computer. This is used in messages automatically generated
     * by the game (e.g., on taking a screenshot) and cannot be used by players for security reasons.
     *
     * - `run_command`: Works in signs, but only on the root text component, not on any children. Activated by using the sign.
     * In chat and written books, this has `value` entered in chat as though the player typed it themselves and pressed enter.
     * This can be used to run commands, provided the player has the required permissions. Since they are being run from chat,
     * commands must be prefixed with the usual `/` slash. In signs, the command is run by the server at the sign's location,
     * with the player who used the sign as @s. Since they are run by the server, sign commands have the same permission level as a command block,
     * instead of using the player's permission level, are not restricted by chat length limits, and do not need to be prefixed with a `/` slash.
     *
     * - `suggest_command`: Opens chat and fills in `value`. If a chat message was already being composed, it is overwritten.
     *
     * - `change_page`: Can only be used in written books. Changes to page `value` if that page exists.
     *
     * - `copy_to_clipboard`: Copies `value` to the clipboard.
     */
    action: LiteralUnion<'open_url' | 'open_file' | 'run_command' | 'suggest_command' | 'change_page' | 'copy_to_clipboard'>

    /** The URL, file path, chat, command or book page used by the specified action. */
    value: string
  }

  /** Optional. Allows for a tooltip to be displayed when the player hovers their mouse over text. */
  hoverEvent?: ({
    /**
     * The type of tooltip to show.
     *
     * Valid values are:
     * - `show_text `: Shows a raw JSON text component.
     * - `show_item `: Shows the tooltip of an item as if it was being hovering over it in an inventory.
     * - `show_entity `: Shows an entity's name, type, and UUID. Used by `selector`.
     */
    action: 'show_text'

    /**
     * The formatting of this tag varies depending on the action.
     *
     * `show_text`: Another raw JSON text component. Can be any valid text component type: string, array, or object.
     * Note that clickEvent and hoverEvent do not function within the tooltip.
     * `show_item`: The item that should be displayed.
     * `show_entity`: The entity that should be displayed.
     */
    contents: JsonTextComponent
  } | {
    action: 'show_item'

    /** The item that should be displayed. */
    contents: {
      /** The namespaced item ID. Present `minecraft:air` if invalid. */
      id: string

      /** Optional. Size of the item stack. */
      count?: number

      /** Optional. A string containing the serialized NBT of the additional information about the item. */
      tag?: string
    }
  } | {
    action: 'show_entity'

    /** The entity that should be displayed */
    contents: {
      /** Optional. Hidden if not present. A raw JSON text that is displayed as the name of the entity. */
      name?: string

      /** A string containing the type of the entity. Should be a namespaced entity ID. Present `minecraft:pig` if invalid. */
      type: string

      /** A string containing the UUID of the entity in the hyphenated hexadecimal format. Should be a valid UUID. */
      id: string
    }
  })
}

/**
 * A JSON text component object.
 */
export type TextComponentObject = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  (ContentTag | {}) & ChildrenTags & FormattingTags & InteractivityTags
)

/**
 * All possible chat components
 */
type PossibleComponent = (
  string |
  boolean |
  number |
  TextComponentObject |
  ComponentClass |
  PossibleComponent[]
)

/*
 * A Json text component, that can be displayed in several locations: in-game chat, books, signs, titles...
 */
export type JsonTextComponent = (
  readonly PossibleComponent[] |
  PossibleComponent
)
