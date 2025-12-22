import type { DebugStickState } from 'sandstone/arguments/generated/world/component/item.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'

export type DebugStick = (ItemBase & {
  DebugProperty?: DebugStickState
})
