import {
  Absolute, Relative, Selector, Vector,
  datapack, say, teleport, tellraw,
} from '../src'

datapack.mcfunction('test', () => {
  say('Hello')
  teleport('@s', Vector`0 0`).facingEntity('Exymat')
  teleport('@s', Absolute(0, 0, 0), Relative(0, 180))

  tellraw('@a', [
    { score: { name: Selector('@s'), objective: 'test' } },
    Selector('@a'),
    { nbt: 'Path', block: Relative(0, 0, 0) },
  ])
})

datapack.save('My Awesome Datapack', { verbose: true })
