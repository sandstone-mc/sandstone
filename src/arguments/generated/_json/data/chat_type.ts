import type { JsonTextStyle } from 'sandstone/arguments/generated/_json/util/text.ts'

export type JsonChatDecoration = ({
  translation_key: string,
  parameters: Array<JsonChatDecorationParameter>,
} & {
  style?: JsonTextStyle,
})

export type JsonChatDecorationParameter = ('sender' | 'content' | 'team_name' | 'target')

export type JsonChatType = {
  chat: JsonChatDecoration,
  narration: JsonChatDecoration,
}

export type JsonNarration = {
  decoration?: JsonChatDecoration,
  /**
   * Value:
   *
   *  - Chat(`chat`)
   *  - System(`system`)
   */
  priority: JsonNarrationPriority,
}

export type JsonNarrationPriority = ('chat' | 'system')

export type JsonOldChatType = {
  chat?: JsonTextDisplay,
  overlay?: JsonTextDisplay,
  narration?: JsonNarration,
}

export type JsonTextDisplay = {
  decoration?: JsonChatDecoration,
}
