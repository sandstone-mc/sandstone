import type {
  ENTITY_SLOTS, ITEMS, LiteralUnion, MultiplePlayersArgument, NBT,
} from '../src/arguments'
import {
  clear, execute, replaceitem,
} from '../src/commands'
import { MCFunction } from '../src/core'
import type { PlayerScore } from '../src/variables'
import { createObjective, Variable } from '../src/variables'
import { nbtParser, SelectorCreator, _ } from '../src/_internals'

/** A menu action can either be: a new menu bar to open, or a callback. */
type MenuAction<SLOTS extends number> = SubMenu<SLOTS> | (() => void)

/** A menu item can be: just an item (for visual purpose, useless on practice), an item with an action, an item with NBT with an action. */
type MenuItem<SLOTS extends number> = (
  LiteralUnion<ITEMS> |
  [item: LiteralUnion<ITEMS>, action: MenuAction<SLOTS>] |
  [item: LiteralUnion<ITEMS>, nbt: NBT, action: MenuAction<SLOTS>]
  )

/** The submenu assigns a menu item to a slot in the hotbar, except for the 9th slot (index 8) which is reserved for closing/going back. */
type SubMenu<SLOTS extends number> = Partial<Record<SLOTS, MenuItem<SLOTS>>>

type PossibleSlots = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
type AllSlots = PossibleSlots | 8

type IdSubMenuMap = Map<number, SubMenu<AllSlots>>
type SubMenuIdMap = Map<SubMenu<AllSlots>, number>
type ParentsMap = Map<SubMenu<AllSlots>, SubMenu<AllSlots>>

function getIdSubmenuMap(menu: SubMenu<PossibleSlots>, id = 0): {
  idSubMenuMap: IdSubMenuMap
  subMenuIdMap: SubMenuIdMap

  /** The keys are children, values are their parent. */
  parents: ParentsMap
  id: number
} {
  let idSubMenuMap: IdSubMenuMap = new Map()
  let subMenuIdMap: SubMenuIdMap = new Map()
  let parents: ParentsMap = new Map()

  // Setup the links between id & submenu
  idSubMenuMap.set(id, menu)
  subMenuIdMap.set(menu, id)

  id += 1

  // Find all submenus
  Object.values(menu).forEach((value) => {
    // Filter away items that are undefined, or that are not sub menus
    if (!value) { return }

    const { subMenu } = menuItemToObject(value)
    if (!subMenu) { return }

    const result = getIdSubmenuMap(subMenu, id)
    id = result.id

    // Merge the two maps
    idSubMenuMap = new Map([...idSubMenuMap, ...result.idSubMenuMap])
    subMenuIdMap = new Map([...subMenuIdMap, ...result.subMenuIdMap])
    parents = new Map([...parents, ...result.parents])

    // Add the submenu as parent
    parents.set(subMenu, menu)
  })

  return {
    idSubMenuMap,
    subMenuIdMap,
    parents,
    id,
  }
}

function menuItemToObject(menuItem: MenuItem<AllSlots>): {item: string, nbt?: NBT, callback?: () => void, subMenu?: SubMenu<AllSlots>} {
  if (!Array.isArray(menuItem)) {
    return { item: menuItem as string }
  }

  const item = menuItem[0] as string
  let nbt: NBT | undefined
  let action: MenuAction<AllSlots>

  if (menuItem.length === 2) {
    action = menuItem[1] as MenuAction<AllSlots>
  } else {
    nbt = menuItem[1] as NBT
    action = menuItem[2] as MenuAction<AllSlots>
  }

  const type = typeof action === 'function' ? 'callback' : 'subMenu'

  return {
    item,
    nbt,
    [type]: action,
  }
}

const currentMenuObjective = createObjective('currentMenu', 'dummy')
const currentSubMenuObjective = createObjective('currentSubMenu', 'dummy')
const rightClick = createObjective('rightclick', 'minecraft.used:minecraft.carrot_on_a_stick')

export class Menu {
  static previousMenuId = 0

  readonly menuId: number = (Menu.previousMenuId += 1)

  readonly menu

  readonly maps

  constructor(menuBar: SubMenu<PossibleSlots>) {
    this.menu = menuBar

    this.maps = getIdSubmenuMap(menuBar)

    // Initialize the check function
    this.mcfunction('__check__', () => {
      execute.as(SelectorCreator('@a', { scores: { [currentMenuObjective.name]: this.menuId, [rightClick.name]: [1, null] } })).run(() => {
        // Reset clicks to 0
        rightClick.ScoreHolder('@s').set(0)

        const selectedSlot = Variable(undefined, 'selected_slot')

        // On right click, store the current selected item slot
        execute.store.result.score(selectedSlot).runOne.data.get.entity('@s', 'SelectedItemSlot')

        // Call the callback
        this.executeCallback(selectedSlot)
      })
    }, {
      runEachTick: true,
    })

    // Add the exit/return option to all submenus
    for (const subMenu of this.maps.subMenuIdMap.keys()) {
      const isRoot = subMenu === this.menu

      subMenu[8] = ['minecraft:barrier', {
        display: {
          Name: JSON.stringify([{
            text: isRoot ? 'Exit' : 'Go back',
            color: 'red',
            italic: false,
            bold: true,
          }]),
        },
      }, () => {
        const parent = this.maps.parents.get(subMenu)

        // No parent means the menu is the main one. A right click means exit!
        if (!parent) {
          currentMenuObjective.ScoreHolder('@s').set(0)
          currentSubMenuObjective.ScoreHolder('@s').set(0)
          clear('@s')
        } else {
          this.switchSubMenu(parent)
        }
      }]
    }
  }

  mcfunction: typeof MCFunction = (name, callback, options?) => MCFunction(`__inventory__/${this.menuId}/${name}`, callback, options)

  executeCallback = this.mcfunction('callback', (playerSelectedSlot: PlayerScore) => {
    const playerSubMenu = currentSubMenuObjective.ScoreHolder('@s')

    _.binaryMatch(playerSubMenu, 0, this.maps.id, (subMenuId) => {
      const currentSubMenu = this.maps.idSubMenuMap.get(subMenuId)
      if (!currentSubMenu) { throw new Error(`Cannot get subMenu ID ${subMenuId}`) }

      for (let slot = 0; slot < 9; slot += 1) {
        const clickedItem = currentSubMenu[slot as AllSlots]

        if (!clickedItem) {
          continue
        }

        execute.if(playerSelectedSlot.equalTo(slot)).run(() => {
          const item = menuItemToObject(clickedItem)

          // If the item triggered a callback
          if (item.callback) {
            item.callback()
          }

          // If the item enters a nested submenu
          if (item.subMenu) {
            this.switchSubMenu(item.subMenu)
          }
        })
      }
    })
  }, {
    lazy: true,
  })

  switchSubMenu = this.mcfunction('__switch__', (subMenu: SubMenu<AllSlots>) => {
    function setHotbarItem(slot: string, item: string, nbt?: NBT, count = 1) {
      const nbtRepresentation = nbt ? nbtParser(nbt) : ''
      replaceitem.entity('@s', `hotbar.${slot}` as ENTITY_SLOTS, item + nbtRepresentation, count)
    }

    const id = this.maps.subMenuIdMap.get(subMenu)
    if (id === undefined) { throw new Error(`Cannot get ID of subMenu ${JSON.stringify(subMenu)}`) }

    currentSubMenuObjective.ScoreHolder('@s').set(id)

    // Clear
    clear('@s')

    // Set the 8 first slots
    for (const [slot, value] of Object.entries(subMenu)) {
      if (!value) { return }

      // Set the item
      const { item, nbt } = menuItemToObject(value)
      setHotbarItem(slot, item, nbt, 1)
    }

    // Set the carrot on a stick
    replaceitem.entity('@s', 'weapon.offhand', 'minecraft:carrot_on_a_stick', 1)
  }, {
    lazy: true,
  })

  start(player: MultiplePlayersArgument) {
    execute.as(player).run(() => {
      // Set the player's "menu" score to the current menu ID
      currentMenuObjective.ScoreHolder('@s').set(this.menuId)

      // Change the player's inventory to the base menu bar
      this.switchSubMenu(this.menu)
    })
  }
}
