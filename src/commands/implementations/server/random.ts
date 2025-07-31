import { CommandNode } from 'sandstone/core/nodes'
import { rangeParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { Range } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { LiteralUnion } from '../../../utils.js'

export class RandomCommandNode extends CommandNode {
  command = 'random' as const
}

export class RandomCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RandomCommandNode

  /**
   * Generate a random integer.
   *
   * @param range Integer between minimum and maximum.
   * @param sequence Namespaced ID of random sequence to use, created upon use.
   */
  value = (range: Macroable<Range<MACRO>, MACRO>, sequence: Macroable<string, MACRO>) => {
    let seq = sequence
    if (typeof sequence === 'string' && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['value', rangeParser(this.sandstoneCore, range), seq])
  }

  /**
   * Generate a random integer and broadcasts it to all players.
   *
   * @param range Integer between minimum and maximum.
   * @param sequence Optional. Namespaced ID of random sequence to use, created upon use.
   */
  roll = (range: Macroable<Range<MACRO>, MACRO>, sequence?: Macroable<string, MACRO>) => {
    let seq = sequence
    if (sequence && typeof sequence === 'string' && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['roll', rangeParser(this.sandstoneCore, range), seq])
  }

  /**
   * Reset a random number sequence.
   *
   * @param sequence Namespaced ID of random sequence to reset, created if non-existent.
   * @param seed Optional. Long that seeds the new sequence.
   * @param includeWorldSeed Optional. Whether to include the world seed in the random. Defaults to false.
   * @param includeSequenceID Optional. Whether to include the sequence ID in the random. Defaults to false.
   * @returns
   */
  reset = (
    sequence: Macroable<LiteralUnion<'*'>, MACRO>,
    seed?: Macroable<number, MACRO>,
    includeWorldSeed?: Macroable<boolean, MACRO>,
    includeSequenceID?: Macroable<boolean, MACRO>,
  ) => {
    let seq = sequence
    if (sequence && typeof sequence === 'string' && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['reset', seq, seed, includeWorldSeed, includeSequenceID])
  }
}
