import { CommandNode } from 'sandstone/core/nodes'
import { rangeParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

import type { Range } from 'sandstone/arguments'
import { LiteralUnion } from 'sandstone/utils.js'

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
  value = (range: Range, sequence: string) => {
    let seq = sequence
    if (!sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['value', rangeParser(range), seq])
  }
  /**
   * Generate a random integer and broadcasts it to all players.
   *
   * @param range Integer between minimum and maximum.
   * @param sequence Optional. Namespaced ID of random sequence to use, created upon use.
   */
  roll = (range: Range, sequence?: string) => {
    let seq = sequence
    if (sequence && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['roll', rangeParser(range), seq])
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
  reset = (sequence: LiteralUnion<'*'>, seed?: number, includeWorldSeed?: boolean, includeSequenceID?: boolean) => this.finalCommand(['reset', sequence, seed, includeWorldSeed, includeSequenceID])
}
