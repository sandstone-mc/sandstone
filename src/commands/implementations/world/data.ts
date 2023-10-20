import { CommandNode } from 'sandstone/core'
import { coordinatesParser, nbtStringifier, targetParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { Coordinates, NBTObject, SingleEntityArgument } from 'sandstone/arguments'
import type { Macroable, MacroArgument, VectorClass } from 'sandstone/variables'

export class DataCommandNode extends CommandNode {
  command = 'data' as const
}

/** Allows to get, merge, modify, and remove NBT data of a block entity, entity, or Command NBT storage. */
export class DataCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = DataCommandNode

  /** Read off the entire NBT data or the subsection of the NBT data from the targeted block position or entity, scaled by `scale` if specified. */
  get get() { return this.subCommand(['get'], DataGetCommand<MACRO>, false) }

  /** Merge the NBT data from the sourced block position or entity with the specified `nbt` data. */
  get merge() { return this.subCommand(['merge'], DataMergeCommand<MACRO>, false) }

  /** Modify the NBT data from the sourced block position or entity, with the specified operation and the given NBT. */
  get modify() { return this.subCommand(['modify'], DataModifyCommand<MACRO>, false) }

  /** Removes NBT data at `path` from the targeted block position or entity. Player NBT data cannot be removed. */
  get remove() { return this.subCommand(['remove'], DataRemoveCommand<MACRO>, false) }
}

export class DataGetCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Get the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  block = (
    targetPos: Macroable<Coordinates<MACRO>, MACRO>,
    path?: Macroable<string, MACRO>,
    scale?: Macroable<number, MACRO>,
  ) => this.finalCommand(['block', coordinatesParser(targetPos), path, scale])

  /**
   * Get the NBT of a given entity.
   *
   * @param target The entity to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  entity = (
    target: Macroable<SingleEntityArgument<MACRO>, MACRO>,
    path?: Macroable<string, MACRO>,
    scale?: Macroable<number, MACRO>,
  ) => this.finalCommand(['entity', targetParser(target), path, scale])

  /**
   * Get the NBT from a given storage path.
   *
   * @param target The storage to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  storage = (target: Macroable<string, MACRO>, path?: Macroable<string, MACRO>, scale?: Macroable<number, MACRO>) => this.finalCommand(['storage', target, path, scale])
}

export class DataMergeCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Merge the NBT of a block at the given position, with the given NBT.
   *
   * @param targetPos The coordinates of the block to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, nbt: Macroable<NBTObject, MACRO>) => this.finalCommand(['block', coordinatesParser(targetPos), nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given entity, with the given NBT.
   *
   * @param target The entity to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, nbt: Macroable<NBTObject, MACRO>) => this.finalCommand(['entity', targetParser(target), nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given storage path, with the given NBT.
   *
   * @param target The storage to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  storage = (target: Macroable<string, MACRO>, nbt: Macroable<NBTObject, MACRO>) => this.finalCommand(['storage', target, nbtStringifier(nbt)])
}

export class DataModifyValuesCommand<MACRO extends boolean> extends CommandArguments {
  from = {
    /**
     * Modify with the NBT of a block at the given position.
     *
     * @param sourcePosition The coordinates of the block to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    block: (sourcePosition: Macroable<Coordinates<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>) => this.finalCommand(['from', 'block', coordinatesParser(sourcePosition), sourcePath]),

    /**
     * Modify with the NBT of a given entity.
     *
     * @param source The entity to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    entity: (source: Macroable<SingleEntityArgument<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>) => this.finalCommand(['from', 'entity', targetParser(source), sourcePath]),

    /**
     * Modify with the NBT of a given storage path.
     *
     * @param source The storage path to modify the NBT with.
     * @param sourcePath The path of the NBT to modify with.
     */
    storage: (source: Macroable<string, MACRO>, sourcePath: Macroable<string, MACRO>) => this.finalCommand(['from', 'storage', source, sourcePath]),
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
    block: (sourcePosition: Macroable<Coordinates<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>, start?: Macroable<number, MACRO>, end?: Macroable<number, MACRO>) => {
      const command: (string | VectorClass<[string, string, string]> | number | MacroArgument)[] = ['from', 'block', coordinatesParser(sourcePosition), sourcePath]
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
    entity: (source: Macroable<SingleEntityArgument<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>, start?: Macroable<number, MACRO>, end?: Macroable<number, MACRO>) => {
      const command: (Macroable<string | SingleEntityArgument<MACRO> | number, MACRO>)[] = ['from', 'entity', targetParser(source), sourcePath]
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
    storage: (source: Macroable<string, MACRO>, sourcePath: Macroable<string, MACRO>, start?: Macroable<number, MACRO>, end?: Macroable<number, MACRO>) => {
      const command: (string | number | MacroArgument)[] = ['from', 'storage', source, sourcePath]
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
  value = (value: Macroable<NBTObject, MACRO>) => this.finalCommand(['value', nbtStringifier(value)])
}

export class DataModifyTypeCommand<MACRO extends boolean> extends CommandArguments {
  /** Append the source data onto the end of the pointed-to list. */
  get append() {
    return this.subCommand(['append'], DataModifyValuesCommand<MACRO>, false)
  }

  /**
   * Insert the source data into the pointed-to list as element `index`, then shift higher elements one position upwards.
   *
   * @param index The index to insert the NBT to.
   */
  insert = (index: Macroable<number, MACRO>) => this.subCommand(['insert', index], DataModifyValuesCommand<MACRO>, false)

  /** Merge the source data into the pointed-to object. */
  get merge() {
    return this.subCommand(['merge'], DataModifyValuesCommand<MACRO>, false)
  }

  /** Prepend the source data onto the beginning of the pointed-to list. */
  get prepend() {
    return this.subCommand(['prepend'], DataModifyValuesCommand<MACRO>, false)
  }

  /** Set the tag specified by `targetPath` to the source data. */
  get set() {
    return this.subCommand(['set'], DataModifyValuesCommand<MACRO>, false)
  }
}

export class DataModifyCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Modify the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) => this.subCommand(['block', coordinatesParser(targetPos), targetPath], DataModifyTypeCommand<MACRO>, false)

  /**
   * Modify the NBT of a given entity.
   *
   * @param target The entity to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) => this.subCommand(['entity', targetParser(target), targetPath], DataModifyTypeCommand<MACRO>, false)

  /**
   * Modify the NBT from a given storage path.
   *
   * @param target The storage to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  storage = (target: Macroable<string, MACRO>, targetPath: Macroable<string, MACRO>) => this.subCommand(['storage', target, targetPath], DataModifyTypeCommand<MACRO>, false)
}

export class DataRemoveCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Remove the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) => this.finalCommand(['block', coordinatesParser(targetPos), targetPath])

  /**
   * Remove the NBT of a given entity.
   *
   * @param target The entity to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) => this.finalCommand(['entity', targetParser(target), targetPath])

  /**
   * Remove the NBT from a given storage path.
   *
   * @param target The storage to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  storage = (target: Macroable<string, MACRO>, targetPath: Macroable<string, MACRO>) => this.finalCommand(['storage', target, targetPath])
}
