export type UnknownDynamicAdditions = ({
    [Key in `${any}${string}`]?: unknown;
})
