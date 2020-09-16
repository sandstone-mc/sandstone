import { BLOCKS, Coordinates } from '../src/arguments'
import {
  comment, execute, kill, say, setblock, summon, teleport,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'
import { createObjective, loc, rel } from '../src/variables'
import { Selector, _ } from '../src/_internals'

/* const kills = createObjective('kills', 'playerKillCount', 'Player Kills')

function summonArmorStand(coords: Coordinates, headBlock: BLOCKS, tags: string[] = []) {
  summon('minecraft:armor_stand', coords, {
    ArmorItems: [{}, {}, {}, { Count: 1, id: headBlock }],
    NoGravity: 1,
    Invisible: tags.includes('main') ? 0 : 1,
    Tags: tags,
  })
}

mcfunction('summon_rubiks', () => {
  kill(Selector('@e', { type: '!minecraft:player' }))

  execute.align('xyz').positioned(rel(0.5, 0.5, 0.5)).run(() => {
    comment('Summons a rubik\'s cube.')
    const COLORS: BLOCKS[] = [
      'minecraft:red_wool',
      'minecraft:lime_wool',
      'minecraft:yellow_wool',
      'minecraft:white_wool',
      'minecraft:blue_wool',
      'minecraft:orange_wool',
    ]

    // Summon the armorstands
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        for (let z = 0; z < 3; z += 1) {
          if (x === 1 && y === 1 && z === 1) {
            summonArmorStand(rel(x, y, z), 'minecraft:air', ['center'])
            continue
          }

          const isCorner = x !== 1 && y !== 1 && z !== 1
          const isCenter = [x === 1, y === 1, z === 1].filter((v) => v).length === 2
          const isMiddle = !isCorner && !isCenter

          const tags: string[] = []
          if (x === 0) {
            tags.push('west')
          }
          if (x === 2) {
            tags.push('east')
          }
          if (y === 0) {
            tags.push('bottom')
          }
          if (y === 2) {
            tags.push('top')
          }
          if (z === 0) {
            tags.push('north')
          }
          if (z === 2) {
            tags.push('south')
          }

          if (isMiddle) {
            tags.push('middle')
          }

          if (!tags.includes('east') && tags.includes('bottom')) {
            continue
          }

          summonArmorStand(rel(x, y, z), 'minecraft:air', [...tags, 'main'])
          summonArmorStand(rel(x - 0.1, y, z), x === 0 ? COLORS[0] : 'minecraft:black_wool', tags)
          summonArmorStand(rel(x, y - 0.1, z), y === 0 ? COLORS[1] : 'minecraft:black_wool', tags)
          summonArmorStand(rel(x, y, z - 0.1), z === 0 ? COLORS[2] : 'minecraft:black_wool', tags)
          summonArmorStand(rel(x + 0.1, y, z), x === 2 ? COLORS[3] : 'minecraft:black_wool', tags)
          summonArmorStand(rel(x, y + 0.1, z), y === 2 ? COLORS[4] : 'minecraft:black_wool', tags)
          summonArmorStand(rel(x, y, z + 0.1), z === 2 ? COLORS[5] : 'minecraft:black_wool', tags)
        }
      }
    }
  })
})

mcfunction('rotate', () => {
  // Rotate bottom layer from 1 degree
  execute
    .as(Selector('@e', { tag: ['bottom', 'middle', 'main'], type: 'minecraft:armor_stand' }))
    .at('@s')
    .facingEntity(Selector('@e', {
      tag: 'center', type: 'minecraft:armor_stand', limit: 1, sort: 'nearest',
    }), 'feet')
    .run(() => {
      // Use scoreboards! no other choice
      teleport('@s', loc(0.1, 0, 0), rel(0, 0))
      // execute.ifEntity('@s[tag=east]').as(Selector('@e', { tag: ['bottom', 'east'] })).positionedAs('@s').runOne.teleport('@s', loc(0.1, 0, 0)).facingEntity
      // execute.ifEntity('@s[tag=west]').as(Selector('@e', { tag: ['bottom', 'west'] })).positionedAs('@s').runOne.teleport('@s', loc(0.01, 0, 0))
      // execute.ifEntity('@s[tag=south]').as(Selector('@e', { tag: ['bottom', 'south'] })).positionedAs('@s').runOne.teleport('@s', loc(0.01, 0, 0))
      // execute.ifEntity('@s[tag=north]').as(Selector('@e', { tag: ['bottom', 'north'] })).positionedAs('@s').runOne.teleport('@s', loc(0.01, 0, 0))
    })
}, {
  runEachTick: true,
}) */

const kills = createObjective('kills', 'playerKillCount')
const myKills = kills.ScoreHolder('@s')

mcfunction('test', () => {
  _.if(myKills.greaterThan(0), () => {
    say('cc')
  })

  _.while(myKills.greaterThan(0), () => {
    say('ccWhile')
  })

  _.doWhile(myKills.greaterThan(0), () => {
    say('ccDOwhile')
  })

  execute.as('@s').run(() => {
    say('heeeyyyoooo')
  })
})

saveDatapack('My datapack', { verbose: true, world: 'Crea1_15' })
