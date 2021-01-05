import { coordinatesParser, nbtParser } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { Coordinates, NBTObject, SingleEntityArgument } from '@arguments'

const getCmd = (name: string) => ['data', 'get', name]

const mergeCmd = (name: string) => ['data', 'merge', name]

const modifyCmd = (name: string) => ['data', 'modify', name]

const removeCmd = (name: string) => ['data', 'remove', name]

class DataGet extends Command {
  /**
   * Get the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  @command(getCmd('block'), { isRoot: true, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, path?: string, scale?: number) => { }

  /**
   * Get the NBT of a given entity.
   *
   * @param target The entity to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  @command(getCmd('entity'), { isRoot: true })
  entity = (target: SingleEntityArgument, path?: string, scale?: number) => { }

  /**
   * Get the NBT from a given storage path.
   *
   * @param target The storage to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  @command(getCmd('storage'), { isRoot: true })
  storage = (target: string, path?: string, scale?: number) => { }
}

class DataMerge extends Command {
  /**
   * Merge the NBT of a block at the given position, with the given NBT.
   *
   * @param targetPos The coordinates of the block to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  @command(mergeCmd('block'), { isRoot: true, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, nbt: string) => { }

  /**
   * Merge the NBT of the given entity, with the given NBT.
   *
   * @param target The entity to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  @command(mergeCmd('entity'), { isRoot: true })
  entity = (target: SingleEntityArgument, nbt: string) => { }

  /**
   * Merge the NBT of the given storage path, with the given NBT.
   *
   * @param target The storage to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  @command(mergeCmd('storage'), { isRoot: true })
  storage = (target: string, nbt: string) => { }
}

class DataModifyValues extends Command {
  /**
   * Modify with the NBT of a block at the given position.
   *
   * @param sourcePosition The coordinates of the block to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  @command(['from', 'block'], { parsers: { '0': coordinatesParser } })
  fromBlock = (sourcePosition: Coordinates, sourcePath: string) => { }

  /**
   * Modify with the NBT of a given entity.
   *
   * @param source The entity to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  @command(['from', 'entity'])
  fromEntity = (source: SingleEntityArgument, sourcePath: string) => { }

  /**
   * Modify with the NBT of a given storage path.
   *
   * @param source The storage path to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  @command(['from', 'storage'])
  fromStorage = (source: string, sourcePath: string) => { }

  /**
   * Modify the NBT with the given value.
   */
  @command('value', { parsers: { '0': nbtParser } })
  value = (value: NBTObject) => { }
}

class DataModifyType extends Command {
  /** Append the source data onto the end of the pointed-to list. */
  get append() {
    this.commandsRoot.arguments.push('append')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  /**
   * Insert the source data into the pointed-to list as element `index`, then shift higher elements one position upwards.
   *
   * @param index The index to insert the NBT to.
   */
  @command('insert', { isRoot: false, hasSubcommands: true, executable: false })
  insert = (index: number) => new DataModifyValues(this.commandsRoot)

  /** Merge the source data into the pointed-to object. */
  get merge() {
    this.commandsRoot.arguments.push('merge')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  /** Prepend the source data onto the beginning of the pointed-to list. */
  get prepend() {
    this.commandsRoot.arguments.push('prepend')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  /** Set the tag specified by `targetPath` to the source data. */
  get set() {
    this.commandsRoot.arguments.push('set')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }
}

class DataModify extends Command {
  /**
   * Modify the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  @command(modifyCmd('block'), {
    isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': coordinatesParser },
  })
  block = (targetPos: Coordinates, targetPath: string) => new DataModifyType(this.commandsRoot)

  /**
   * Modify the NBT of a given entity.
   *
   * @param target The entity to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  @command(modifyCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true })
  entity = (target: SingleEntityArgument, targetPath: string) => new DataModifyType(this.commandsRoot)

  /**
   * Modify the NBT from a given storage path.
   *
   * @param target The storage to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  @command(modifyCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true })
  storage = (target: string, targetPath: string) => new DataModifyType(this.commandsRoot)
}

class DataRemove extends Command {
  /**
   * Remove the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  @command(removeCmd('block'), {
    isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': coordinatesParser },
  })
  block = (targetPos: Coordinates, targetPath: string) => { }

  /**
   * Remove the NBT of a given entity.
   *
   * @param target The entity to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  @command(removeCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true })
  entity = (target: SingleEntityArgument, targetPath: string) => { }

  /**
   * Remove the NBT from a given storage path.
   *
   * @param target The storage to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  @command(removeCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true })
  storage = (target: string, targetPath: string) => { }
}

/** Allows to get, merge, modify, and remove NBT data of a block entity, entity, or Command NBT storage. */
export class Data extends Command {
  /** Read off the entire NBT data or the subsection of the NBT data from the targeted block position or entity, scaled by `scale` if specified. */
  get = new DataGet(this.commandsRoot)

  /** Merge the NBT data from the sourced block position or entity with the specified `nbt` data. */
  merge = new DataMerge(this.commandsRoot)

  /** Modify the NBT data from the sourced block position or entity, with the specified operation and the given NBT. */
  modify = new DataModify(this.commandsRoot)

  /** Removes NBT data at `path` from the targeted block position or entity. Player NBT data cannot be removed. */
  remove = new DataRemove(this.commandsRoot)
}
