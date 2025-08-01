import { execute } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Execute Command', () => {
  describe('modify subcommands', () => {
    it('should generate execute as command', async () => {
      await compareSingleOutputText(() => {
        execute.as('@p').run.say('Hello!')
      }, ['execute as @p run say Hello!'])
    })

    it('should generate execute at command', async () => {
      await compareSingleOutputText(() => {
        execute.at('@p').run.say('Hello!')
      }, ['execute at @p run say Hello!'])
    })

    it('should generate execute positioned command', async () => {
      await compareSingleOutputText(() => {
        execute.positioned('0 64 0').run.say('Hello!')
      }, ['execute positioned 0 64 0 run say Hello!'])
    })

    it('should generate execute rotated command', async () => {
      await compareSingleOutputText(() => {
        execute.rotated('0 0').run.say('Hello!')
      }, ['execute rotated 0 0 run say Hello!'])
    })

    it('should generate execute facing command', async () => {
      await compareSingleOutputText(() => {
        execute.facing('0 64 0').run.say('Hello!')
      }, ['execute facing 0 64 0 run say Hello!'])
    })

    it('should generate execute anchored command', async () => {
      await compareSingleOutputText(() => {
        execute.anchored('eyes').run.say('Hello!')
      }, ['execute anchored eyes run say Hello!'])
    })

    it('should generate execute in command', async () => {
      await compareSingleOutputText(() => {
        execute.in('minecraft:the_nether').run.say('Hello!')
      }, ['execute in minecraft:the_nether run say Hello!'])
    })
  })

  describe('condition subcommands', () => {
    it('should generate execute if entity command', async () => {
      await compareSingleOutputText(() => {
        execute.if.entity('@p').run.say('Player found!')
      }, ['execute if entity @p run say Player found!'])
    })

    it('should generate execute unless entity command', async () => {
      await compareSingleOutputText(() => {
        execute.unless.entity('@p').run.say('No player!')
      }, ['execute unless entity @p run say No player!'])
    })

    it('should generate execute if block command', async () => {
      await compareSingleOutputText(() => {
        execute.if.block('~ ~ ~', 'stone').run.say('Stone found!')
      }, ['execute if block ~ ~ ~ stone run say Stone found!'])
    })

    it('should generate execute if score command', async () => {
      await compareSingleOutputText(() => {
        execute.if.score('@p', 'test', '>=', '@p', 'min').run.say('Score check!')
      }, ['execute if score @p test >= @p min run say Score check!'])
    })
  })

  describe('store subcommands', () => {
    it('should generate execute store result score command', async () => {
      await compareSingleOutputText(() => {
        execute.store.result.score('@p', 'result').run.say('Stored!')
      }, ['execute store result score @p result run say Stored!'])
    })

    it('should generate execute store success score command', async () => {
      await compareSingleOutputText(() => {
        execute.store.success.score('@p', 'success').run.say('Stored!')
      }, ['execute store success score @p success run say Stored!'])
    })
  })

  describe('chained subcommands', () => {
    it('should generate complex chained execute command', async () => {
      await compareSingleOutputText(() => {
        execute.as('@p').at('@s').if.entity('@s[gamemode=creative]').run.say('Creative player!')
      }, ['execute as @p at @s if entity @s[gamemode=creative] run say Creative player!'])
    })
  })
})
