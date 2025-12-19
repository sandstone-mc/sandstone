import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { Registry } from 'sandstone/generated/registry'
import type { NBTClass } from 'sandstone'

export type CustomData = (CustomDataMap | (`${any}${string}` | NBTClass))

export type CustomDataMap = ({
    [Key in `${any}${string}`]?: (Key extends keyof Dispatcher<'mcdoc:custom_data'>
        ? Dispatcher<'mcdoc:custom_data'>[Key]
        : Record<string, unknown>);
})

export type DataComponentExactPredicate = ({
    [Key in Extract<Registry['minecraft:data_component_type'], string>]?: (Key extends keyof Dispatcher<'minecraft:data_component'>
        ? Dispatcher<'minecraft:data_component'>[Key]
        : Record<string, unknown>);
})

export type DataComponentPatch = (({
    [Key in Extract<Registry['minecraft:data_component_type'], string>]?: (Key extends keyof Dispatcher<'minecraft:data_component'>
        ? Dispatcher<'minecraft:data_component'>[Key]
        : Record<string, unknown>);
}) & ({
    [Key in Extract<Registry['minecraft:data_component_type'], string>]?: Record<string, never>;
}))

export type DataComponentPredicate = Record<string, never>
