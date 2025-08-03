import type { Range } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { rangeParser } from 'sandstone/variables/parsers'
import type { LiteralUnion } from '../../../utils.js'
import { CommandArguments } from '../../helpers.js'

export class RandomCommandNode extends CommandNode {
  command = 'random' as const
}

export class RandomCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RandomCommandNode

  /**
   * Generate random number for command results.
   *
   * @param range Number range for random generation.
   *             Examples: {min: 1, max: 10}, [5, 15], 20
   *
   * @param sequence Random sequence identifier for reproducible results.
   *                Examples: 'my_sequence', 'mypack:dice', 'combat_rng'
   *
   * @example
   * ```ts
   * random.value({min: 1, max: 6}, 'dice')        // D6 roll
   * random.value([10, 20], 'damage_roll')         // 10-20 damage
   * ```
   */
  value = (range: Macroable<Range<MACRO>, MACRO>, sequence: Macroable<string, MACRO>) => {
    let seq = sequence
    if (typeof sequence === 'string' && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['value', rangeParser(this.sandstoneCore, range), seq])
  }

  /**
   * Generate random number and broadcast result to all players.
   *
   * @param range Number range for random generation.
   * @param sequence Optional random sequence identifier.
   *
   * @example
   * ```ts
   * random.roll({min: 1, max: 100})              // 1-100 roll
   * random.roll([1, 20], 'public_dice')          // D20 with sequence
   * ```
   */
  roll = (range: Macroable<Range<MACRO>, MACRO>, sequence?: Macroable<string, MACRO>) => {
    let seq = sequence
    if (sequence && typeof sequence === 'string' && !sequence.includes(':')) {
      seq = `${this.sandstonePack.defaultNamespace}:${seq}`
    }
    return this.finalCommand(['roll', rangeParser(this.sandstoneCore, range), seq])
  }

  /**
   * Reset random sequence with new seed.
   *
   * @param sequence Sequence identifier to reset. Use '*' for all sequences.
   * @param seed Optional seed value for reproducible randomness.
   * @param includeWorldSeed Optional. Include world seed in calculation.
   * @param includeSequenceID Optional. Include sequence ID in calculation.
   *
   * @example
   * ```ts
   * random.reset('dice', 12345)                  // Reset with specific seed
   * random.reset('*')                            // Reset all sequences
   * ```
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
