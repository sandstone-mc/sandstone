/* eslint-disable no-useless-constructor */

import { NAMESPACE, PACK_UID } from '../env'
import { SandstonePack } from './pack/pack'

const sandstonePack = new SandstonePack(NAMESPACE ?? 'default', PACK_UID ?? 'dangerously_unset_uid')
const { MCFunction } = sandstonePack
const {
  say, execute, advancement, functionCmd,
} = sandstonePack.sandstoneCommands

const otherMcFunction = MCFunction('other', () => {
  say('Hello world!')
})

MCFunction('test', () => {
  say('Hello, world!')

  advancement.grant('@a').everything()
  advancement.grant('@a').only('minecraft:advancements/root', 'minecraft:advancements/root/kill_a_mob')

  execute.as('@a').at('~ ~ ~').run.say('Hello, world!')
  execute.as('@a').at('~ ~ ~').run.execute.if('bite').run.say('2 runs!')
  execute.as('@a').at('~ ~ ~').run(() => {
    say('Nested 1')
    say('Nested 2')
  })
  execute.as('@a').at('~ ~ ~').run(() => {
    say('Nested 1')
  })

  execute.as('@a').run(() => functionCmd(otherMcFunction))

  say('Outside')
})

sandstonePack.save()
