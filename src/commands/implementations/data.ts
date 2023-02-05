import { CommandNode } from '@core'
import { coordinatesParser, nbtStringifier } from '@variables'

import { CommandArguments } from '../helpers'

import type { Coordinates, NBTObject, SingleEntityArgument } from '@arguments'
import type { VectorClass } from '@variables'

export class DataCommandNode extends CommandNode {
  command = 'data' as const
}

/** Allows to get, merge, modify, and remove NBT data of a block entity, entity, or Command NBT storage. */
export class DataCommand extends CommandArguments {
  public NodeType = DataCommandNode

  /** Read off the entire NBT data or the subsection of the NBT data from the targeted block position or entity, scaled by `scale` if specified. */
  get get() { return this.subCommand(['get'], DataGetCommand, false) }

  /** Merge the NBT data from the sourced block position or entity with the specified `nbt` data. */
  get merge() { return this.subCommand(['merge'], DataMergeCommand, false) }

  /** Modify the NBT data from the sourced block position or entity, with the specified operation and the given NBT. */
  get modify() { return this.subCommand(['modify'], DataModifyCommand, false) }

  /** Removes NBT data at `path` from the targeted block position or entity. Player NBT data cannot be removed. */
  get remove() { return this.subCommand(['remove'], DataRemoveCommand, false) }
}

export class DataGetCommand extends CommandArguments {
  /**
   * Get the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  block = (targetPos: Coordinates, path?: string, scale?: number) => this.finalCommand(['block', coordinatesParser(targetPos), path, scale])

  /**
   * Get the NBT of a given entity.
   *
   * @param target The entity to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  entity = (target: SingleEntityArgument, path?: string, scale?: number) => this.finalCommand(['entity', target, path, scale])

  /**
   * Get the NBT from a given storage path.
   *
   * @param target The storage to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  storage = (target: string, path?: string, scale?: number) => this.finalCommand(['storage', target, path, scale])
}

export class DataMergeCommand extends CommandArguments {
  /**
   * Merge the NBT of a block at the given position, with the given NBT.
   *
   * @param targetPos The coordinates of the block to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  block = (targetPos: Coordinates, nbt: NBTObject) => this.finalCommand(['block', coordinatesParser(targetPos), nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given entity, with the given NBT.
   *
   * @param target The entity to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  entity = (target: SingleEntityArgument, nbt: NBTObject) => this.finalCommand(['entity', target, nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given storage path, with the given NBT.
   *
   * @param target The storage to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  storage = (target: string, nbt: NBTObject) => this.finalCommand(['storage', target, nbtStringifier(nbt)])
}

export class DataModifyValuesCommand extends CommandArguments {
  from = {
    /**
     * Modify with the NBT of a block at the given position.
     *
     * @param sourcePosition The coordinates of the block to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    block: (sourcePosition: Coordinates, sourcePath: string) => this.finalCommand(['from', 'block', coordinatesParser(sourcePosition), sourcePath]),

    /**
     * Modify with the NBT of a given entity.
     *
     * @param source The entity to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    entity: (source: SingleEntityArgument, sourcePath: string) => this.finalCommand(['from', 'entity', source, sourcePath]),

    /**
     * Modify with the NBT of a given storage path.
     *
     * @param source The storage path to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    storage: (source: string, sourcePath: string) => this.finalCommand(['from', 'storage', source, sourcePath]),
  }

  string = {
    /**
     * Modify with the NBT String of a block at the given position.
     *
     * @param sourcePosition The coordinates of the block to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     * @param start Optional. Index of first character to include at the start of the string.
     * @param end Optional. Index of the first character to exclude at the end of the string
     */
    block: (sourcePosition: Coordinates, sourcePath: string, start?: number, end?: number) => {
      const command: (string | VectorClass<[string, string, string]> | number)[] = ['from', 'block', coordinatesParser(sourcePosition), sourcePath]
      if (start) {
        command.push(start)
        if (end) command.push(end)
      }
      this.finalCommand(command)
    },

    /**
     * Modify with the NBT String of a given entity.
     *
     * @param source The entity to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     * @param start Optional. Index of first character to include at the start of the string.
     * @param end Optional. Index of the first character to exclude at the end of the string
     */
    entity: (source: SingleEntityArgument, sourcePath: string, start?: number, end?: number) => {
      const command: (string | SingleEntityArgument | number)[] = ['from', 'entity', source, sourcePath]
      if (start) {
        command.push(start)
        if (end) command.push(end)
      }
      this.finalCommand(command)
    },

    /**
     * Modify with the NBT String of a given storage path.
     *
     * @param source The storage path to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     * @param start Optional. Index of first character to include at the start of the string.
     * @param end Optional. Index of the first character to exclude at the end of the string
     */
    storage: (source: string, sourcePath: string, start?: number, end?: number) => {
      const command: (string | number)[] = ['from', 'storage', source, sourcePath]
      if (start) {
        command.push(start)
        if (end) command.push(end)
      }
      this.finalCommand(command)
    },
  }

  /**
   * Modify the NBT with the given value.
   */
  value = (value: NBTObject) => this.finalCommand(['value', nbtStringifier(value)])
}

export class DataModifyTypeCommand extends CommandArguments {
  /** Append the source data onto the end of the pointed-to list. */
  get append() {
    return this.subCommand(['append'], DataModifyValuesCommand, false)
  }

  /**
   * Insert the source data into the pointed-to list as element `index`, then shift higher elements one position upwards.
   *
   * @param index The index to insert the NBT to.
   */
  insert = (index: number) => this.subCommand(['insert', index], DataModifyValuesCommand, false)

  /** Merge the source data into the pointed-to object. */
  get merge() {
    return this.subCommand(['merge'], DataModifyValuesCommand, false)
  }

  /** Prepend the source data onto the beginning of the pointed-to list. */
  get prepend() {
    return this.subCommand(['prepend'], DataModifyValuesCommand, false)
  }

  /** Set the tag specified by `targetPath` to the source data. */
  get set() {
    return this.subCommand(['set'], DataModifyValuesCommand, false)
  }
}

export class DataModifyCommand extends CommandArguments {
  /**
   * Modify the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  block = (targetPos: Coordinates, targetPath: string) => this.subCommand(['block', coordinatesParser(targetPos), targetPath], DataModifyTypeCommand, false)

  /**
   * Modify the NBT of a given entity.
   *
   * @param target The entity to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  entity = (target: SingleEntityArgument, targetPath: string) => this.subCommand(['entity', target, targetPath], DataModifyTypeCommand, false)

  /**
   * Modify the NBT from a given storage path.
   *
   * @param target The storage to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  storage = (target: string, targetPath: string) => this.subCommand(['storage', target, targetPath], DataModifyTypeCommand, false)
}

export class DataRemoveCommand extends CommandArguments {
  /**
   * Remove the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  block = (targetPos: Coordinates, targetPath: string) => this.finalCommand(['block', coordinatesParser(targetPos), targetPath])

  /**
   * Remove the NBT of a given entity.
   *
   * @param target The entity to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  entity = (target: SingleEntityArgument, targetPath: string) => this.finalCommand(['entity', target, targetPath])

  /**
   * Remove the NBT from a given storage path.
   *
   * @param target The storage to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  storage = (target: string, targetPath: string) => this.finalCommand(['storage', target, targetPath])
}
