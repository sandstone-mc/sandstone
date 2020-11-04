import { say, functionCmd } from '../src/commands'
import { mcfunction, saveDatapack, Tag } from '../src/core'

/* mcfunction('count_diamonds', () => {
  const totalDiamonds = Variable(0)

  execute.as('@a').run(() => {
    const myDiamonds = Variable()

    // Store the number of diamonds the player has in `myDiamonds`
    execute.store.result.score(myDiamonds).runOne.clear('@s', 'minecraft:diamonds', 0)

    // Add user diamonds to the total
    totalDiamonds.add(myDiamonds)
  })

  tellraw('@a', ['The total number of diamonds is ', totalDiamonds])
})

const DISTANCE = 0.7

const summonRubiks = mcfunction('summon', () => {
  for (let x = 0; x < 3; x += 1) {
    for (let y = 0; y < 3; y += 1) {
      for (let z = 0; z < 3; z += 1) {
        if (x === 1 && y === 1 && z === 1) continue

        const tags: string[] = []
        if (x === 0) tags.push('west')
        if (y === 0) tags.push('bottom')
        if (z === 0) tags.push('north')
        if (x === 2) tags.push('east')
        if (y === 2) tags.push('top')
        if (z === 2) tags.push('south')

        let rotation: number
        if (tags.includes('west')) {
          rotation = 270
        } else if (tags.includes('east')) {
          rotation = 90
        } else if (tags.includes('south')) {
          rotation = 180
        } else {
          rotation = 0
        }

        if ([x, y, z].filter((c) => c === 1).length === 2) {
          tags.push('center')
        }
        if ([x, y, z].filter((c) => c === 1).length === 1) {
          tags.push('middle')
        }

        summon('minecraft:armor_stand', rel(x * DISTANCE, y * DISTANCE, z * DISTANCE), {
          Invisible: 1,
          NoGravity: 1,
          ArmorItems: [{}, {}, {}, { id: 'black_concrete', Count: 1 }],
          Tags: [...tags, 'main'],
          Rotation: [NBT.floats(rotation, 0)],
        })
        // summon('minecraft:armor_stand', rel(x - 0.1, y, z), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: x === 0 ? 'red_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
        // summon('minecraft:armor_stand', rel(x, y - 0.1, z), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: y === 0 ? 'yellow_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
        // summon('minecraft:armor_stand', rel(x, y, z - 0.1), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: z === 0 ? 'blue_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
        // summon('minecraft:armor_stand', rel(x + 0.1, y, z), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: x === 2 ? 'orange_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
        // summon('minecraft:armor_stand', rel(x, y + 0.1, z), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: y === 2 ? 'white_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
        // summon('minecraft:armor_stand', rel(x, y, z + 0.1), { Invisible: 1, NoGravity: 1, ArmorItems: [{}, {}, {}, { id: z === 2 ? 'green_concrete' : 'black_concrete', Count: 1 }], Tags: tags })
      }
    }
  }
})

const bottomAS = {
  north: {
    main: Selector('@e', { type: 'minecraft:armor_stand', tag: ['north', 'bottom', 'middle'] }),
    neighbour: Selector('@e', { type: 'minecraft:armor_stand', tag: ['north', 'bottom', 'east'] }),
  },
  east: {
    main: Selector('@e', { type: 'minecraft:armor_stand', tag: ['east', 'bottom', 'middle'] }),
    neighbour: Selector('@e', { type: 'minecraft:armor_stand', tag: ['east', 'bottom', 'south'] }),
  },
  south: {
    main: Selector('@e', { type: 'minecraft:armor_stand', tag: ['south', 'bottom', 'middle'] }),
    neighbour: Selector('@e', { type: 'minecraft:armor_stand', tag: ['south', 'bottom', 'west'] }),
  },
  west: {
    main: Selector('@e', { type: 'minecraft:armor_stand', tag: ['west', 'bottom', 'middle'] }),
    neighbour: Selector('@e', { type: 'minecraft:armor_stand', tag: ['west', 'bottom', 'north'] }),
  },
}

const rotatingAS = Selector('@e', { type: 'minecraft:armor_stand', tag: ['rotating'] })
const neighbourAS = Selector('@e', { type: 'minecraft:armor_stand', tag: ['neighbour'] })

const STEPS = 10

const isLocked = Variable(0)

mcfunction('rotate', () => {
  const counter = Variable(0)

  const rotateInner = mcfunction('rotate_inner', () => {
    // This funciton rotates 2 AS: the rotating one, and the neighbour
    const rotateMainAndNeighbour = mcfunction('rotate_main_and_neigbour', (horizontal: boolean) => {
      execute.as(rotatingAS).at('@s').run(() => {
        const rotation = horizontal ? [90 / STEPS, 0] as const : [0, 90 / STEPS] as const

        execute.positioned(local(0, 0, DISTANCE)).rotated(rel(...rotation)).positioned(local(0, 0, -DISTANCE)).runOne.teleport('@s', rel(0, 0, 0), rel(0, 0))

        execute.at('@s').runOne.teleport(neighbourAS, local(DISTANCE, 0, 0), rel(0, 0))
      })
    }, { lazy: true })

    function tagAndRotate(main: SelectorClass, neighbour: SelectorClass, horizontal: boolean) {
      tag(main).add('rotating')
      tag(neighbour).add('neighbour')
      rotateMainAndNeighbour(horizontal)
      tag(main).remove('rotating')
      tag(neighbour).remove('neighbour')
    }

    function rotateBottom() {
      tagAndRotate(bottomAS.west.main, bottomAS.west.neighbour, true)
      tagAndRotate(bottomAS.east.main, bottomAS.east.neighbour, true)
      tagAndRotate(bottomAS.north.main, bottomAS.north.neighbour, true)
      tagAndRotate(bottomAS.south.main, bottomAS.south.neighbour, true)
    }

    rotateBottom()

    counter.add(1)

    _.if(counter.lowerThan(STEPS), () => {
      rotateInner.schedule('1t', 'replace')
    })
  })

  _.if(isLocked.equalTo(0), () => {
    isLocked.set(1)
    rotateInner()
  })
})

mcfunction('init', () => {
  execute.as('@p').at('@s').run(() => {
    kill('@e[type=!player]')
    summonRubiks()
  })
}, {
  runOnLoad: true,
}) */

const testFunc = mcfunction('test', () => {
  say('test')
})

const tag = Tag('functions', 'myfuncs', [testFunc])

mcfunction('call_tag', () => {
  functionCmd(tag)
})

saveDatapack('My Datapack', {
  world: 'Crea1_15',
  verbose: true,
})
