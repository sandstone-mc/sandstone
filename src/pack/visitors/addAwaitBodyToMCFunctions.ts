import { GenericSandstoneVisitor } from './visitor'

/**
 * Initialize the constants of the pack.
 */
export class AwaitBodyVisitor extends GenericSandstoneVisitor {
  onEnd = () => {
    const { core } = this.pack

    for (const { body, mcfunction } of core.awaitNodes) {
      mcfunction['node'].body = body
    }
  }
}
