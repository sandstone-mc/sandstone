import { ScoreboardCommandNode } from 'sandstone/commands'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Initialize the constants of the pack.
 */
export class InitConstantsVisitor extends GenericSandstoneVisitor {
  onStart = () => {
    const { pack } = this

    if (pack.constants.size !== 0) {
      for (const constant of pack.constants) {
        pack.initMCFunction.node.body.push(
          new ScoreboardCommandNode(pack,
            'players',
            'set',
            constant,
            pack.rootObjective,
            constant,
          ),
        )
      }
    }
  }
}
