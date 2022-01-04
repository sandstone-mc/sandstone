import { CommandNode } from '@/next/core/nodes'

import { CommandArguments } from '../helpers'

export class AdvancementNode extends CommandNode {
  command = 'advancement' as const
}

class AdvancementArguments extends CommandArguments {
  everything = () => this.command(['everything'])

  only = (advancement: string, criterion?: string) => this.command(['only', advancement, criterion])

  from = (advancement: string) => this.command(['from', advancement])

  through = (advancement: string) => this.command(['through', advancement])

  until = (advancement: string) => this.command(['until', advancement])
}

export class AdvancementCommand extends CommandArguments {
  NodeType = AdvancementNode

  grant = (targets: string) => this.command(AdvancementArguments, false, ['grant', targets])

  revoke = (targets: string) => this.command(AdvancementArguments, false, ['revoke', targets])
}
