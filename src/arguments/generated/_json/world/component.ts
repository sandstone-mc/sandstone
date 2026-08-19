import type {
  JsonSymbolDataComponent,
  JsonSymbolDataComponentExistencePredicate,
  JsonSymbolDataComponentPredicate,
  JsonSymbolMcdocCustomData,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTClass, NonEmptyString } from 'sandstone'

export type JsonCustomData = (JsonCustomDataMap | (NonEmptyString | NBTClass))

export type JsonCustomDataMap = ({
  [Key in NonEmptyString]?: (Key extends keyof JsonSymbolMcdocCustomData
    ? JsonSymbolMcdocCustomData[Key]
    : JsonSymbolMcdocCustomData<'%unknown'>)
})

export type JsonDataComponentExactPredicate = ({
  [Key in Extract<JsonPersistentDataComponent, string>]?: (Key extends keyof JsonSymbolDataComponent
    ? JsonSymbolDataComponent[Key]
    : JsonRootNBT)
})

export type JsonDataComponentPatch = (({
  [Key in Extract<keyof JsonSymbolDataComponent, string>]?: (JsonSymbolDataComponent[Key])
}) & ({
  [Key in Extract<keyof JsonSymbolDataComponent, string> as `!${Extract<Key, string>}`]?: Record<string, never>
}))

export type JsonDataComponentPredicate = ({
  [Key in Extract<JsonRegistry['minecraft:data_component_type'], string>]?: ((
      | Key extends keyof JsonSymbolDataComponentPredicate
        ? JsonSymbolDataComponentPredicate[Key]
        : JsonSymbolDataComponentPredicate<'%unknown'>) | (
      Key extends keyof JsonSymbolDataComponentExistencePredicate
        ? JsonSymbolDataComponentExistencePredicate[Key]
        : JsonSymbolDataComponentExistencePredicate<'%unknown'>))
})

export type JsonPersistentDataComponent = JsonRegistry['minecraft:data_component_type']
