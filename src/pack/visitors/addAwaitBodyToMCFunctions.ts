import { GenericSandstoneVisitor } from './visitor.js'

export class AwaitBodyVisitor extends GenericSandstoneVisitor {
  onEnd = () => {
    const { core } = this.pack

    for (const { body, mcfunction } of core.awaitNodes) {
      mcfunction['node'].body.push(...body)
    }
  }
}
