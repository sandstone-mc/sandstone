import type { NBTInstance } from '@variables/nbt/NBTs'

export type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[] |
    NBTInstance
)

export type RootNBT = Record<string, NBTObject>
