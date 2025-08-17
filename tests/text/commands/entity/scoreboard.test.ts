import { scoreboard } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Scoreboard Command', () => {
  describe('objectives subcommand', () => {
    it('should generate scoreboard objectives add command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.objectives.add('test', 'dummy')
        scoreboard.objectives.add('test', 'dummy', 'Test Objective')
      }, ['scoreboard objectives add test dummy', 'scoreboard objectives add test dummy "Test Objective"'])
    })

    it('should generate scoreboard objectives list command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.objectives.list()
      }, ['scoreboard objectives list'])
    })

    it('should generate scoreboard objectives remove command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.objectives.remove('test')
      }, ['scoreboard objectives remove test'])
    })

    it('should generate scoreboard objectives setdisplay command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.objectives.setdisplay('sidebar', 'test')
      }, ['scoreboard objectives setdisplay sidebar test'])
    })

    it('should generate scoreboard objectives modify command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.objectives.modify('test').displayname('Test Score')
      }, ['scoreboard objectives modify test displayname "Test Score"'])
    })
  })

  describe('players subcommand', () => {
    it('should generate scoreboard players add command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.add('@p', 'test', 1)
      }, ['scoreboard players add @p test 1'])
    })

    it('should generate scoreboard players set command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.set('@p', 'test', 10)
      }, ['scoreboard players set @p test 10'])
    })

    it('should generate scoreboard players remove command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.remove('@p', 'test', 5)
      }, ['scoreboard players remove @p test 5'])
    })

    it('should generate scoreboard players get command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.get('@p', 'test')
      }, ['scoreboard players get @p test'])
    })

    it('should generate scoreboard players list command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.list('@p')
      }, ['scoreboard players list @p'])
    })

    it('should generate scoreboard players reset command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.reset('@p', 'test')
      }, ['scoreboard players reset @p test'])
    })

    it('should generate scoreboard players enable command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.enable('@p', 'test')
      }, ['scoreboard players enable @p test'])
    })

    it('should generate scoreboard players operation command', async () => {
      await compareSingleOutputText(() => {
        scoreboard.players.operation('@p', 'test', '+=', '@s', 'score')
      }, ['scoreboard players operation @p test += @s score'])
    })
  })
})
