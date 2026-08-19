import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { InstrumentClass } from 'sandstone'

export type JsonGoatHorn = (JsonItemBase & {
  instrument?: (JsonRegistry['minecraft:instrument'] | InstrumentClass),
})
