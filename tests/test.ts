import {
  abs, rel, loc, Selector,
  datapack, say, teleport, tellraw, attribute, bossbar, clear, clone
} from '../src'

datapack.mcfunction('test', () => {
  say('Hello')
  teleport(Selector('@a'), abs(0, 0, 0))
  teleport(Selector('@a'), abs(0, 0, 0)).facingEntity(Selector('@s'))

  teleport(Selector('@s', {
    advancements: {
      'story/form_obsidian': true,
      'story/obtain_armor': {
        iron_helmet: true,
      }
    }
  }))

  tellraw(Selector('@a'), { text: 'cc' })

  attribute(Selector('@s'), 'BaseModifier').get()

  bossbar.add('minecraft:test', { text: 'cc' })

  clone(['0', '0', '0'], ['1', '1', '1'], ['2', '2', '2']).filtered('minecraft:acacia_button', 'force')

  clear(Selector('@a'), 'minecraft:acacia_boat[test=cc]')
})

datapack.save('My Awesome Datapack', { verbose: true })