import { Text, TextObject, TextStyle } from './generated/util/text'

export type JSONContentTypes = NonNullable<TextObject['type']>

export type FormattingTags = TextStyle

export type JSONTextComponent = Text

export type { TextObject }