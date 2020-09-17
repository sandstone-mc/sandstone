import { McFunction } from '@datapack/McFunction'
import {
  BLOCKS, Coordinates, ENTITY_SLOTS, ITEMS, LiteralUnion, MultiplePlayersArgument, NBT, nbtParser,
} from '../src/arguments'
import {
  comment, execute, kill, replaceitem, say, setblock, summon, teleport,
} from '../src/commands'
import { mcfunction, saveDatapack } from '../src/core'
import { createObjective, loc, rel } from '../src/variables'
import { Selector, SelectorClass, _ } from '../src/_internals'

/** A menu action can either be: a new menu bar to open, or a callback. */
type MenuAction = MenuBar | (() => void)

/** A menu item can be: just an item (for visual purpose, useless on practice), an item with an action, an item with NBT with an action. */
type MenuItem = LiteralUnion<ITEMS> | [item: LiteralUnion<ITEMS>, action: MenuAction] | [item: LiteralUnion<ITEMS>, nbt: NBT, action: MenuAction]

type PossibleSlots = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

/** The menu bar assigns a menu item to a slot, except for the 9th slot (index 8) which is reserved for closing/going back. */
type MenuBar = Partial<Record<PossibleSlots, MenuItem>>

type IdToPath = Record<number, number[]>

function getIdPathLinks(menu: MenuBar, id = 0, basePath: number[] = []): { idToPath: IdToPath, pathToId: Record<string, number>, id: number } {
  let idToPath: IdToPath = {}
  let pathToId: Record<string, number> = {}

  idToPath[id] = basePath
  pathToId[JSON.stringify(basePath)] = id

  id += 1

  for (const [key, value] of Object.entries(menu)) {
    if (!value) {
      break
    }

    // Setup the links between id & path
    const realValue = menuItemToObject(value)
    if (realValue.menuBar) {
      // Get the path to the current item
      const path = [...basePath, parseInt(key, 10)]

      const result = getIdPathLinks(realValue.menuBar, id, path)
      id = result.id
      idToPath = { ...idToPath, ...result.idToPath }
      pathToId = { ...pathToId, ...result.pathToId }
    }
  }

  return {
    idToPath,
    pathToId,
    id,
  }
}

function menuItemToObject(menuItem: MenuItem): {item: string, nbt?: NBT, callback?: () => void, menuBar?: MenuBar} {
  if (typeof menuItem === 'string') {
    return { item: menuItem }
  }

  const item = menuItem[0]
  let nbt: NBT | undefined
  let action: MenuAction

  if (menuItem.length === 2) {
    action = menuItem[1] as MenuAction
  } else {
    nbt = menuItem[1] as NBT
    action = menuItem[2] as MenuAction
  }

  const type = typeof action === 'function' ? 'callback' : 'menuBar'

  return {
    item,
    nbt,
    [type]: action,
  }
}

const menuObjective = createObjective('menu', 'dummy')
const currentMenuBarObjective = createObjective('currentMenuBar', 'dummy')
const rightClick = createObjective('rightclick', 'minecraft.used:minecraft.carrot_on_a_stick')

const selectedSlot = createObjective('selectedSlot', 'dummy')

// Sets the corresponding
const getHotbarItemId = mcfunction('__inventory__/get_hotbar_item_id', () => {
  execute.store.result.score('@s', selectedSlot).runOne.data.get.entity('@s', 'SelectedItemSlot')

  execute.if(selectedSlot.ScoreHolder('@s').equalTo(0)).ifData.entity('@s', 'Inventory[{Slot: 0b}]')
})

class Menu {
  static previousMenuId = 0

  readonly menuId: number = (Menu.previousMenuId += 1)

  readonly menuBar

  readonly links

  constructor(menuBar: MenuBar) {
    this.menuBar = menuBar

    this.links = getIdPathLinks(menuBar)

    // Initialize the check function
    this.mcfunction('__check__', () => {
      execute.as(Selector('@a', { score: { [menuObjective.name]: this.menuId, [rightClick.name]: [1, null] } })).run(() => {
        say('hello')
        say('hello2')
      })
    }, {
      runEachTick: true,
    })
  }

  mcfunction: typeof mcfunction = (name, callback, options?) => mcfunction(`__inventory__/${this.menuId}/${name}`, callback, options)

  setPlayerInventory = this.mcfunction('__start__', (path: number[]) => {
    let currentBar = this.menuBar

    for (const slot of path) {
      const item = currentBar[slot as PossibleSlots]
      if (typeof item === 'string' || !item) {
        throw new Error(`Trying to access a menu bar on an item literal: "${item}", path: ${JSON.stringify(path)}`)
      }

      if (typeof item[1] === 'function' || typeof item?.[2] === 'function') {
        throw new Error(`Trying to access a menu bar on a callback action, path: ${JSON.stringify(path)}, item: ${JSON.stringify(item)}`)
      }

      currentBar = item[item.length - 1] as MenuBar
    }

    for (const [slot, value] of Object.entries(currentBar)) {
      if (!value) {
        return
      }

      const realValue = menuItemToObject(value)

      replaceitem.entity('@s', `hotbar.${slot}` as ENTITY_SLOTS, realValue.item, 1)
    }
  }, {
    lazy: true,
  })

  start(player: MultiplePlayersArgument) {
    execute.as(player).run(() => {
      // Change the player's inventory to the base menu bar
      this.setPlayerInventory([])

      // Set the player's "menu" score to the current menu ID, and it's currentMenuBar to the 0th one
      menuObjective.ScoreHolder('@s').set(this.menuId)
      currentMenuBarObjective.ScoreHolder('@s').set(0)
    })
  }
}

const menu = new Menu({
  '0': 'minecraft:acacia_boat',
  '1': ['minecraft:item_frame', {
    '0': 'minecraft:stick',
  }],
})

mcfunction('main', () => {
  menu.start('@p')
})

saveDatapack('My datapack', { verbose: true, world: 'Nouveau monde' })
