import type { TextStyle } from 'sandstone/generated/util/text'

export type ChatDecoration = ({
    translation_key: string
    parameters: Array<ChatDecorationParameter>
} & {
    style?: TextStyle
})

export type ChatDecorationParameter = ('sender' | 'content' | 'team_name' | 'target')

export type ChatType = {
    chat?: ChatDecoration
    narration?: ChatDecoration
}

export type Narration = {
    decoration?: ChatDecoration
    /**
     * Value:
     *
     *  - Chat(`chat`)
     *  - System(`system`)
     */
    priority: NarrationPriority
}

export type NarrationPriority = ('chat' | 'system')

export type TextDisplay = {
    decoration?: ChatDecoration
}
