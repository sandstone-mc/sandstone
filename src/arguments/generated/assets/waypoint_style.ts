import type { NBTInt, NBTList } from 'sandstone'

export type WaypointStyle = {
    /**
     * Defaults to 128.
     *
     * Value:
     * Range: 0..60000000
     */
    near_distance?: NBTInt<{
        min: 0
    }>
    /**
     * Defaults to 322.
     *
     * Value:
     * Range: 0..60000000
     */
    far_distance?: NBTInt<{
        min: 0
    }>
    /**
     * Value:
     * List length range: 1..
     */
    sprites: NBTList<`${string}:${string}`, {
        leftExclusive: false
        min: 1
    }>
}
