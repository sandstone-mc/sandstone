import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'

export type BlockPalette = ({
    palette: Array<BlockState>
} | {
    /**
     * Sets of different block states used in the structure, a random palette gets selected based on coordinates.
     */
    palettes: Array<Array<BlockState>>
})
