import type { DIFFICULTIES } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers.js'

export class DifficultyCommandNode extends CommandNode {
  command = 'difficulty' as const
}

export class DifficultyCommand extends CommandArguments {
  protected NodeType = DifficultyCommandNode

  /**
   * Set or query the world's difficulty level.
   * 
   * Changes the global difficulty setting that affects all players and game
   * mechanics. When called without parameters, queries the current difficulty.
   * 
   * **Difficulty Effects:**
   * 
   * **Peaceful:**
   * - No hostile mobs spawn (existing ones despawn)
   * - Health regenerates automatically
   * - No hunger loss
   * - No mob drops from hostile mobs
   * 
   * **Easy:**
   * - Hostile mobs deal 0.5x to 0.75x damage
   * - Slower hunger depletion
   * - Some mechanics simplified
   * 
   * **Normal:**
   * - Standard balanced gameplay
   * - Normal mob damage and spawning
   * - Standard hunger mechanics
   * 
   * **Hard:**
   * - Hostile mobs deal 1x to 1.5x damage
   * - Faster hunger depletion
   * - Additional challenges (mob effects, etc.)
   * - Zombies can break doors
   *
   * @param difficulty Optional difficulty level to set.
   *                  If omitted, queries current difficulty instead.
   *                  Values: 'peaceful', 'easy', 'normal', 'hard'
   * 
   * @example
   * ```ts
   * // Set difficulty levels
   * difficulty('peaceful')     // Safe mode - no mobs, health regeneration
   * difficulty('easy')         // Beginner-friendly gameplay
   * difficulty('normal')       // Standard Minecraft experience
   * difficulty('hard')         // Maximum challenge and difficulty
   * 
   * // Query current difficulty
   * difficulty()              // Returns current difficulty setting
   * 
   * // Event-based difficulty changes
   * execute.if.score('@p', 'boss_fight').matches(1).run.difficulty('hard')
   * execute.unless.entity('@a[tag=in_combat]').run.difficulty('normal')
   * 
   * // Administrative uses
   * difficulty('peaceful')     // For server maintenance
   * difficulty('hard')         // For competitive events
   * ```
   */
  difficulty = (difficulty?: DIFFICULTIES) => this.finalCommand([difficulty])
}
