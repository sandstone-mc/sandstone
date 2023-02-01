import { GenericSandstoneVisitor } from './visitor'

/**
 * Initialize the constants of the pack.
 */
export class InitConstantsVisitor extends GenericSandstoneVisitor {
  onStart = () => {
    const { pack } = this
    const { commands, core } = pack

    // Remove duplicates
    let constants = [...pack.constants.values()]
    constants = constants.filter((item: number, index) => constants.indexOf(item) === index)

    core.insideMCFunction(pack.getInitMCFunction(), () => {
      for (const constant of constants) {
        commands.scoreboard.players.set(constant, pack.rootObjective, constant)
      }
    })
  }
}
