import type { NBTCustomObject } from '@variables/NBTs'

export type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[] |
    NBTCustomObject
)

export type RootNBT = Record<string, NBTObject>
