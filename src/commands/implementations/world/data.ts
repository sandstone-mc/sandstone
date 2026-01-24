import type { Coordinates, NBTObject, SingleEntityArgument } from 'sandstone/arguments'
import { isMacroArgument, type MacroArgument, type Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { DataPointClass, VectorClass } from 'sandstone/variables'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class DataCommandNode extends CommandNode {
  command = 'data' as const
}

export class DataCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = DataCommandNode

  /**
   * Read NBT data from blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.get.block([100, 70, 200], 'Items[0]', 1)      // Get block NBT
   * data.get.entity('@p', 'Health')                    // Get player health
   * data.get.storage('minecraft:temp', 'value')        // Get storage data
   * ```
   */
  get get() {
    return this.subCommand(['get'], DataGetCommand<MACRO>, false)
  }

  /**
   * Merge NBT data into blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.merge.block([100, 70, 200], {Items: []})      // Merge block NBT
   * data.merge.entity('@p', {Health: 20})              // Merge entity NBT
   * data.merge.storage('minecraft:temp', {flag: true}) // Merge storage data
   * ```
   */
  get merge() {
    return this.subCommand(['merge'], DataMergeCommand<MACRO>, false)
  }

  /**
   * Modify NBT data in blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.modify.entity('@p', 'Health').set.value(20)                    // Set health
   * data.modify.block([100, 70, 200], 'Items').append.value({id: 'stone'}) // Add item
   * data.modify.storage('minecraft:temp', 'list').prepend.from.entity('@p', 'Inventory[0]')
   * ```
   */
  get modify() {
    return this.subCommand(['modify'], DataModifyCommand<MACRO>, false)
  }

  /**
   * Remove NBT data from blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.remove.block([100, 70, 200], 'Items[0]')      // Remove block NBT
   * data.remove.entity('@e[type=item]', 'Motion')      // Remove entity motion
   * data.remove.storage('minecraft:temp', 'old_data')  // Remove storage data
   * ```
   */
  get remove() {
    return this.subCommand(['remove'], DataRemoveCommand<MACRO>, false)
  }
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
  storage = (target: Macroable<string, MACRO>, path?: Macroable<string, MACRO>, scale?: Macroable<number, MACRO>) =>
    this.finalCommand(['storage', target, path, scale])
}

export class DataMergeCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Merge the NBT of a block at the given position, with the given NBT.
   *
   * @param targetPos The coordinates of the block to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, nbt: Macroable<NBTObject, MACRO>) =>
    this.finalCommand(['block', coordinatesParser(targetPos), nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given entity, with the given NBT.
   *
   * @param target The entity to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, nbt: Macroable<NBTObject, MACRO>) =>
    this.finalCommand(['entity', targetParser(target), nbtStringifier(nbt)])

  /**
   * Merge the NBT of the given storage path, with the given NBT.
   *
   * @param target The storage to merge the NBT with.
   * @param nbt The NBT to merge with.
   */
  storage = (target: Macroable<string, MACRO>, nbt: Macroable<NBTObject, MACRO>) =>
    this.finalCommand(['storage', target, nbtStringifier(nbt)])
}

class DataModifyFromCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Modify with the NBT of a block at the given position.
   *
   * @param sourcePosition The coordinates of the block to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  block = (sourcePosition: Macroable<Coordinates<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>) =>
    this.finalCommand(['block', coordinatesParser(sourcePosition), sourcePath])

  /**
   * Modify with the NBT of a given entity.
   *
   * @param source The entity to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  entity = (source: Macroable<SingleEntityArgument<MACRO>, MACRO>, sourcePath: Macroable<string, MACRO>) =>
    this.finalCommand(['entity', targetParser(source), sourcePath])

  /**
   * Modify with the NBT of a given storage data point.
   *
   * @param source The storage data point to modify the NBT with.
   */
  storage(source: DataPointClass<'storage'>): void

  /**
   * Modify with the NBT of a given storage path.
   *
   * @param source The storage target to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  storage(source: Macroable<string, MACRO>, sourcePath: Macroable<string, MACRO>): void

  storage(source: DataPointClass<'storage'> | Macroable<string, MACRO>, sourcePath?: Macroable<string, MACRO>) {
    let storageArg: string | MacroArgument
    if (isMacroArgument(this.sandstoneCore, source) || typeof source === 'string') {
      storageArg = source
    } else {
      const dataPoint = source as DataPointClass<'storage'>
      storageArg = `${dataPoint.currentTarget} ${dataPoint.path}`
    }
    return this.finalCommand(['storage', storageArg, sourcePath])
  }
}

export class DataModifyValuesCommand<MACRO extends boolean> extends CommandArguments {
  get from() {
    return this.subCommand(['from'], DataModifyFromCommand<MACRO>, false)
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
    block: (
      sourcePosition: Macroable<Coordinates<MACRO>, MACRO>,
      sourcePath: Macroable<string, MACRO>,
      start?: Macroable<number, MACRO>,
      end?: Macroable<number, MACRO>,
    ) => {
      const command: (string | VectorClass<[string, string, string]> | number | MacroArgument)[] = [
        'string',
        'block',
        coordinatesParser(sourcePosition),
        sourcePath,
      ]
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
    entity: (
      source: Macroable<SingleEntityArgument<MACRO>, MACRO>,
      sourcePath: Macroable<string, MACRO>,
      start?: Macroable<number, MACRO>,
      end?: Macroable<number, MACRO>,
    ) => {
      const command: Macroable<string | SingleEntityArgument<MACRO> | number, MACRO>[] = [
        'string',
        'entity',
        targetParser(source),
        sourcePath,
      ]
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
    storage: (
      source: Macroable<string, MACRO>,
      sourcePath: Macroable<string, MACRO>,
      start?: Macroable<number, MACRO>,
      end?: Macroable<number, MACRO>,
    ) => {
      const command: (string | number | MacroArgument)[] = ['string', 'storage', source, sourcePath]
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
  insert = (index: Macroable<number, MACRO>) =>
    this.subCommand(['insert', index], DataModifyValuesCommand<MACRO>, false)

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
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.subCommand(['block', coordinatesParser(targetPos), targetPath], DataModifyTypeCommand<MACRO>, false)

  /**
   * Modify the NBT of a given entity.
   *
   * @param target The entity to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.subCommand(['entity', targetParser(target), targetPath], DataModifyTypeCommand<MACRO>, false)

  /**
   * Modify the NBT from a given storage path.
   *
   * @param target The storage to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  storage = (target: Macroable<string, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.subCommand(['storage', target, targetPath], DataModifyTypeCommand<MACRO>, false)
}

export class DataRemoveCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Remove the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.finalCommand(['block', coordinatesParser(targetPos), targetPath])

  /**
   * Remove the NBT of a given entity.
   *
   * @param target The entity to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  entity = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.finalCommand(['entity', targetParser(target), targetPath])

  /**
   * Remove the NBT from a given storage path.
   *
   * @param target The storage to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  storage = (target: Macroable<string, MACRO>, targetPath: Macroable<string, MACRO>) =>
    this.finalCommand(['storage', target, targetPath])
}
