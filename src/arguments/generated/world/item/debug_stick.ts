import type { DebugStickState } from 'sandstone/arguments/generated/world/component/item.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'

export type DebugStick = (ItemBase & {
  DebugProperty?: DebugStickState
})
