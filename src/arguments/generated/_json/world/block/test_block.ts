import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'

export type JsonTestBlock = (JsonBlockEntity & {
  /**
   * Value:
   *
   *  - Start(`start`)
   *  - Log(`log`)
   *  - Fail(`fail`)
   *  - Accept(`accept`)
   */
  mode?: JsonTestBlockMode,
  message?: string,
  powered?: boolean,
})

export type JsonTestBlockMode = ('start' | 'log' | 'fail' | 'accept')
