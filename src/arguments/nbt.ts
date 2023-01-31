import type { NBTClass } from '#variables/nbt/NBTs'

export type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[] |
    NBTClass
)

export type RootNBT = Record<string, NBTObject>
