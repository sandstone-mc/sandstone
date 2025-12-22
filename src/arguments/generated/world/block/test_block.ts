import type { BlockEntity } from 'sandstone/arguments/generated/world/block.js'

export type TestBlock = (BlockEntity & {
  /**
     * Value:
     *
     *  - Start(`start`)
     *  - Log(`log`)
     *  - Fail(`fail`)
     *  - Accept(`accept`)
     */
  mode?: TestBlockMode
  message?: string
  powered?: boolean
})

export type TestBlockMode = ('start' | 'log' | 'fail' | 'accept')
