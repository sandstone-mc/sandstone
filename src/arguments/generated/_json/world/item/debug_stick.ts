import type { JsonDebugStickState } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'

export type JsonDebugStick = (JsonItemBase & {
  DebugProperty?: JsonDebugStickState,
})
