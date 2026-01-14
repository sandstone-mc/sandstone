import type {
  SymbolDataComponent,
  SymbolDataComponentPredicate,
  SymbolMcdocCustomData,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTClass } from 'sandstone'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type CustomData = (CustomDataMap | (`${any}${string}` | NBTClass))

export type CustomDataMap = ({
  [Key in `${any}${string}`]?: (Key extends keyof SymbolMcdocCustomData
    ? SymbolMcdocCustomData[Key]
    : NBTObject);
})

export type DataComponentExactPredicate = ({
  [Key in Extract<Registry['minecraft:data_component_type'], string>]?: (Key extends keyof SymbolDataComponent
    ? SymbolDataComponent[Key]
    : NBTObject);
})

export type DataComponentPatch = ({
  [Key in keyof SymbolDataComponent]?: (SymbolDataComponent[Key]);
})

export type DataComponentPredicate = Record<string, never>
