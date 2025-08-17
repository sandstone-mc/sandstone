import { advancement } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Advancement Command', () => {
  describe('grant subcommand', () => {
    it('should generate advancement grant everything', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').everything()
      }, ['advancement grant @p everything'])
    })

    it('should generate advancement grant only', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').only('minecraft:story/mine_stone')
      }, ['advancement grant @p only minecraft:story/mine_stone'])
    })

    it('should generate advancement grant only with criterion', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').only('minecraft:story/mine_stone', 'stone_mined')
      }, ['advancement grant @p only minecraft:story/mine_stone stone_mined'])
    })

    it('should generate advancement grant from', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').from('minecraft:story/root')
      }, ['advancement grant @p from minecraft:story/root'])
    })

    it('should generate advancement grant through', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').through('minecraft:story/mine_stone')
      }, ['advancement grant @p through minecraft:story/mine_stone'])
    })

    it('should generate advancement grant until', async () => {
      await compareSingleOutputText(() => {
        advancement.grant('@p').until('minecraft:story/smelt_iron')
      }, ['advancement grant @p until minecraft:story/smelt_iron'])
    })
  })

  describe('revoke subcommand', () => {
    it('should generate advancement revoke everything', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').everything()
      }, ['advancement revoke @p everything'])
    })

    it('should generate advancement revoke only', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').only('minecraft:story/mine_stone')
      }, ['advancement revoke @p only minecraft:story/mine_stone'])
    })

    it('should generate advancement revoke only with criterion', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').only('minecraft:story/mine_stone', 'stone_mined')
      }, ['advancement revoke @p only minecraft:story/mine_stone stone_mined'])
    })

    it('should generate advancement revoke from', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').from('minecraft:story/root')
      }, ['advancement revoke @p from minecraft:story/root'])
    })

    it('should generate advancement revoke through', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').through('minecraft:story/mine_stone')
      }, ['advancement revoke @p through minecraft:story/mine_stone'])
    })

    it('should generate advancement revoke until', async () => {
      await compareSingleOutputText(() => {
        advancement.revoke('@p').until('minecraft:story/smelt_iron')
      }, ['advancement revoke @p until minecraft:story/smelt_iron'])
    })
  })
})
