import { GenericSandstoneVisitor } from './visitor.js'

/**
 * Initialize the objectives of the pack.
 */
export class InitObjectivesVisitor extends GenericSandstoneVisitor {
  onStart = () => {
    const { pack } = this
    const { commands, core } = pack

    // Register all created objectives
    const sandstoneRegisteredObjectives = new Set<string>()
    const userRegisteredObjectives = new Set<string>()

    const objectives = [...pack.objectives.values()]
    if (objectives.length !== 0) {
      pack.initMCFunction.unshift(() => {
        for (const obj of objectives) {
          if (userRegisteredObjectives.has(obj.name)) {
            throw new Error(`An objective named "${obj.name}" has been created twice.`)
          }

          if (obj['creator'] === 'user') {
            userRegisteredObjectives.add(obj.name)
          } else {
            // Sandstone can create several objectives with identical names, it's okay.
            sandstoneRegisteredObjectives.add(obj.name)
          }

          commands.scoreboard.objectives.add(obj.name, obj.criteria, obj.display?.jsonTextComponent)
        }
      })
    }
  }
}
