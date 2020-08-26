export declare type NBTObject = (string | number | {
    [NBTTAg: string]: NBTObject;
} | NBTObject[]);
export declare type NBT = Record<string, NBTObject>;
