import type { Coordinates, NBTObject, SingleEntityArgumentOf } from 'sandstone/arguments'
import { type MacroArgument, type Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { makeCallable } from 'sandstone/utils'
import { DataPointClass, type VectorClass } from 'sandstone/variables'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../helpers'

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
   * data.get(dataPoint, 1)                               // Get data point NBT with scale
   * data.get.block(abs(100, 70, 200), 'Items[0]', 1)     // Get block NBT
   * data.get.entity('@p', 'Health')                      // Get player health
   * data.get.storage('minecraft:temp', 'value')          // Get storage data
   * ```
   */
  get get() {
    const cmd = this.subCommand(['get'], DataGetCommand<MACRO>, false)
    return makeCallable(cmd, (dataPoint: DataPointClass<'entity'> | DataPointClass<'block'> | DataPointClass<'storage'>, scale?: Macroable<number, MACRO>): FinalCommandOutput => {
      if (dataPoint.type === 'block') {
        return cmd.block(coordinatesParser(dataPoint.currentTarget) as Macroable<Coordinates<MACRO>, MACRO>, dataPoint.path, scale)
      }
      if (dataPoint.type === 'entity') {
        return cmd.entity(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path, scale)
      }
      return cmd.storage(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path, scale)
    })
  }

  /**
   * Merge NBT data into blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.merge.block(abs(100, 70, 200), {Items: []})      // Merge block NBT
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
   * data.modify(dataPoint).set.value(20)                                 // Modify data point
   * data.modify.entity('@p', 'Health').set.value(20)                     // Set health
   * data.modify.block(abs(100, 70, 200), 'Items').append.value({id: 'stone'}) // Add item
   * data.modify.storage('minecraft:temp', 'list').prepend.from.entity('@p', 'Inventory[0]')
   * ```
   */
  get modify() {
    const cmd = this.subCommand(['modify'], DataModifyCommand<MACRO>, false)
    return makeCallable(cmd, (dataPoint: DataPointClass<'entity'> | DataPointClass<'block'> | DataPointClass<'storage'>): DataModifyTypeCommand<MACRO> => {
      if (dataPoint.type === 'block') {
        return cmd.block(coordinatesParser(dataPoint.currentTarget) as Macroable<Coordinates<MACRO>, MACRO>, dataPoint.path)
      }
      if (dataPoint.type === 'entity') {
        return cmd.entity(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
      }
      return cmd.storage(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
    })
  }

  /**
   * Remove NBT data from blocks, entities, or storage.
   *
   * @example
   * ```ts
   * data.remove(dataPoint)                               // Remove data point NBT
   * data.remove.block(abs(100, 70, 200), 'Items[0]')     // Remove block NBT
   * data.remove.entity('@e[type=item]', 'Motion')        // Remove entity motion
   * data.remove.storage('minecraft:temp', 'old_data')    // Remove storage data
   * ```
   */
  get remove() {
    const cmd = this.subCommand(['remove'], DataRemoveCommand<MACRO>, false)
    return makeCallable(cmd, (dataPoint: DataPointClass<'entity'> | DataPointClass<'block'> | DataPointClass<'storage'>): FinalCommandOutput => {
      if (dataPoint.type === 'block') {
        return cmd.block(coordinatesParser(dataPoint.currentTarget) as Macroable<Coordinates<MACRO>, MACRO>, dataPoint.path)
      }
      if (dataPoint.type === 'entity') {
        return cmd.entity(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
      }
      return cmd.storage(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
    })
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
  ): FinalCommandOutput => {
    return this.finalCommand(['block', coordinatesParser(targetPos), path, scale])
  }

  /**
   * Get the NBT of a given entity.
   *
   * @param target The entity to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  entity = <T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    path?: Macroable<string, MACRO>,
    scale?: Macroable<number, MACRO>,
  ): FinalCommandOutput => {
    return this.finalCommand(['entity', targetParser(target), path, scale])
  }

  /**
   * Get the NBT from a given storage path.
   *
   * @param target The storage to get the NBT from.
   * @param path The path of the NBT to get.
   * @param scale The scale to multiply the NBT value by.
   */
  storage = (
    target: Macroable<string, MACRO>,
    path?: Macroable<string, MACRO>,
    scale?: Macroable<number, MACRO>,
  ): FinalCommandOutput => {
    return this.finalCommand(['storage', target, path, scale])
  }
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
  entity = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, nbt: Macroable<NBTObject, MACRO>) =>
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

export class DataModifyFromCommand<MACRO extends boolean> extends CommandArguments {
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
  entity = <T extends string>(source: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, sourcePath: Macroable<string, MACRO>) =>
    this.finalCommand(['entity', targetParser(source), sourcePath])

  /**
   * Modify with the NBT of a given storage path.
   *
   * @param source The storage target to modify the NBT with.
   * @param sourcePath The path of the NBT to modify with.
   */
  storage = (source: Macroable<string, MACRO>, sourcePath: Macroable<string, MACRO>): FinalCommandOutput => {
    return this.finalCommand(['storage', source, sourcePath])
  }
}

export class DataModifyValuesCommand<MACRO extends boolean> extends CommandArguments {
  get from() {
    const cmd = this.subCommand(['from'], DataModifyFromCommand<MACRO>, false)
    return makeCallable(cmd, (dataPoint: DataPointClass<'entity'> | DataPointClass<'block'> | DataPointClass<'storage'>): FinalCommandOutput => {
      if (dataPoint.type === 'block') {
        return cmd.block(coordinatesParser(dataPoint.currentTarget) as Macroable<Coordinates<MACRO>, MACRO>, dataPoint.path)
      }
      if (dataPoint.type === 'entity') {
        return cmd.entity(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
      }
      return cmd.storage(dataPoint.currentTarget as Macroable<string, MACRO>, dataPoint.path)
    })
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
    entity: <T extends string>(
      source: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
      sourcePath: Macroable<string, MACRO>,
      start?: Macroable<number, MACRO>,
      end?: Macroable<number, MACRO>,
    ) => {
      const command: Macroable<string | SingleEntityArgumentOf<MACRO, T> | number, MACRO>[] = [
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
  block = (targetPos: Macroable<Coordinates<MACRO>, MACRO>, targetPath: Macroable<string, MACRO>): DataModifyTypeCommand<MACRO> => {
    return this.subCommand(['block', coordinatesParser(targetPos), targetPath], DataModifyTypeCommand<MACRO>, false)
  }

  /**
   * Modify the NBT of a given entity.
   *
   * @param target The entity to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  entity = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>, targetPath: Macroable<string, MACRO>): DataModifyTypeCommand<MACRO> => {
    return this.subCommand(['entity', targetParser(target), targetPath], DataModifyTypeCommand<MACRO>, false)
  }

  /**
   * Modify the NBT from a given storage path.
   *
   * @param target The storage to modify the NBT from.
   * @param path The path of the NBT to modify.
   */
  storage = (target: Macroable<string, MACRO>, targetPath: Macroable<string, MACRO>): DataModifyTypeCommand<MACRO> => {
    return this.subCommand(['storage', target, targetPath], DataModifyTypeCommand<MACRO>, false)
  }
}

export class DataRemoveCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Remove the NBT of a block at the given position.
   *
   * @param targetPos The coordinates of the block to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  block = (
    targetPos: Macroable<Coordinates<MACRO>, MACRO>,
    targetPath: Macroable<string, MACRO>,
  ): FinalCommandOutput => {
    return this.finalCommand(['block', coordinatesParser(targetPos), targetPath])
  }

  /**
   * Remove the NBT of a given entity.
   *
   * @param target The entity to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  entity = <T extends string>(
    target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    targetPath: Macroable<string, MACRO>,
  ): FinalCommandOutput => {
    return this.finalCommand(['entity', targetParser(target), targetPath])
  }

  /**
   * Remove the NBT from a given storage path.
   *
   * @param target The storage to remove the NBT from.
   * @param path The path of the NBT to remove.
   */
  storage = (
    target: Macroable<string, MACRO>,
    targetPath: Macroable<string, MACRO>,
  ): FinalCommandOutput => {
    return this.finalCommand(['storage', target, targetPath])
  }
}
