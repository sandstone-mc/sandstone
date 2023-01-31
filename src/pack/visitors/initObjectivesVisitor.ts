import { GenericSandstoneVisitor } from './visitor'

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

    for (const obj of pack.objectives.values()) {
      if (userRegisteredObjectives.has(obj.name)) {
        throw new Error(`An objective named "${obj.name}" has been created twice.`)
      }

      if (obj['creator'] === 'user') {
        userRegisteredObjectives.add(obj.name)
      } else {
        // Sandstone can create several objectives with identical names, it's okay.
        sandstoneRegisteredObjectives.add(obj.name)
      }

      // We *have* to create 1 init function per objective. It keeps the immutable & isolated nature of Sandstone files.
      core.insideMCFunction(pack.getInitMCFunction(), () => {
        commands.scoreboard.objectives.add(obj.name, obj.criteria, obj.display?.jsonTextComponent)
      })
    }
  }
}
