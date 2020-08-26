export type LiteralUnion<T extends U, U = string> = T | (U & {});

export type AtLeastOne<T> = [T, ...T[]]
