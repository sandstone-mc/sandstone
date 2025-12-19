import type { BlockState } from 'sandstone/generated/util/block_state'

export type BlockPalette = ({
    palette: Array<BlockState>
} | {
    /**
     * Sets of different block states used in the structure, a random palette gets selected based on coordinates.
     */
    palettes: Array<Array<BlockState>>
})
