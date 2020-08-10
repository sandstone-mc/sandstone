import type { TextComponentObject } from '../arguments'

type ScoreArgument = {
  [objective: string]: number | [null, number] | [number, null] | [number, number]
}

type SelectorArguments = {
  score?: ScoreArgument
  tag?: string | string[]
  name?: string
}

export class SelectorClass {
  target: string

  arguments: SelectorArguments

  constructor(target: LiteralUnion<'@s' | '@p' | '@a' | '@e' | '@r'>, selectorArguments?: SelectorArguments) {
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

    if (!Object.keys(this.arguments).length) {
      return this.target
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

    return ``
  }

  toChatComponent() : TextComponentObject {
    return {
      selector: this.toString()
    }
  }

  toJSON() {
    return this.toString()
  }
}

export function Selector(target: LiteralUnion<'@s' | '@p' | '@a' | '@e' | '@r'>, selectorArguments?: SelectorArguments): SelectorClass {
  return new SelectorClass(target, selectorArguments)
}
