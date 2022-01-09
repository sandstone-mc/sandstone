import type { NBTInstance } from '@variables/nbt/NBTs'

export type NBTObject = (
    string |
    number |
    { [Key: string]: NBTObject | undefined } |
    NBTObject[] |
    NBTInstance
)

export type RootNBT = Record<string, NBTObject | undefined>
