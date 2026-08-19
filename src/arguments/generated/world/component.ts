import type {
  SymbolDataComponent,
  SymbolDataComponentExistencePredicate,
  SymbolDataComponentPredicate,
  SymbolMcdocCustomData,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTClass, NonEmptyString } from 'sandstone'

export type CustomData = (CustomDataMap | (NonEmptyString | NBTClass))

export type CustomDataMap = ({
  [Key in NonEmptyString]?: (Key extends keyof SymbolMcdocCustomData
    ? SymbolMcdocCustomData[Key]
    : SymbolMcdocCustomData<'%unknown'>)
})

export type DataComponentExactPredicate = ({
  [Key in Extract<PersistentDataComponent, string>]?: (Key extends keyof SymbolDataComponent
    ? SymbolDataComponent[Key]
    : RootNBT)
})

export type DataComponentPatch = (({
  [Key in Extract<keyof SymbolDataComponent, string>]?: (SymbolDataComponent[Key])
}) & ({
  [Key in Extract<keyof SymbolDataComponent, string> as `!${Extract<Key, string>}`]?: Record<string, never>
}))

export type DataComponentPredicate = ({
  [Key in Extract<Registry['minecraft:data_component_type'], string>]?: ((
      | Key extends keyof SymbolDataComponentPredicate
        ? SymbolDataComponentPredicate[Key]
        : SymbolDataComponentPredicate<'%unknown'>) | (
      Key extends keyof SymbolDataComponentExistencePredicate
        ? SymbolDataComponentExistencePredicate[Key]
        : SymbolDataComponentExistencePredicate<'%unknown'>))
})

export type PersistentDataComponent = Registry['minecraft:data_component_type']
