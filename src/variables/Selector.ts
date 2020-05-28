type ScoreArgument = {
  [objective: string]: number | [null, number] | [number, null] | [number, number]
}

type SelectorArguments = {
  score?: ScoreArgument
  tag?: string | string[]
  name?: string
}

export class Selector {
  target: string

  arguments: SelectorArguments

  constructor(target: string, selectorArguments?: SelectorArguments) {
    this.target = target
    this.arguments = selectorArguments ?? {}
  }

  private inArguments(key: string): key is keyof SelectorArguments {
    // eslint-disable-next-line no-prototype-builtins
    return this.arguments.hasOwnProperty(key)
  }

  toString() {
    function score(scores: ScoreArgument): string {
      return Object.entries(scores).map(([scoreName, value]) => {
        if (Array.isArray(value)) {
          return [scoreName, `${value[0] ?? ''}..${value[1] ?? ''}`].join('=')
        }
        return [scoreName, value].join('=')
      }).join(', ')
    }

    const result: string[][] = []

    if (this.arguments) {
      const args = { ...this.arguments }

      if (args.score) {
        result.push(['score', score(args.score)])
        delete args.score
      }

      if (args.tag) {
        const tags = Array.isArray(args.tag) ? args.tag : [args.tag]
        result.push(...tags.map((tag) => ['tag', tag]))
        delete args.tag
      }
    }
  }
}
