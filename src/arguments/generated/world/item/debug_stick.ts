import type { DebugStickState } from 'sandstone/generated/world/component/item'
import type { ItemBase } from 'sandstone/generated/world/item'

export type DebugStick = (ItemBase & {
    DebugProperty?: DebugStickState
})
