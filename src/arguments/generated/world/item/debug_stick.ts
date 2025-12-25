import type { DebugStickState } from 'sandstone/arguments/generated/world/component/item'
import type { ItemBase } from 'sandstone/arguments/generated/world/item'

export type DebugStick = (ItemBase & {
  DebugProperty?: DebugStickState
})
