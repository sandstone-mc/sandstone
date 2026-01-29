import type { Coordinates, Registry } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments, FinalCommandOutput } from '../../helpers'

export class CloneCommandNode extends CommandNode {
  command = 'clone' as const
}

export class CloneCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = CloneCommandNode

  /**
   * Clone blocks from a source region to a destination.
   * 
   * Copies all blocks within the defined 3D region to the new location.
   * The source region is defined by two opposite corners, and the destination
   * is the corresponding corner where the copied region will be placed.
   * 
   * **Region Definition:**
   * - Source region: defined by any two opposite corners (begin/end)
   * - Destination: the corner of the target region that corresponds to the "lowest" corner
   *   (minimum X, Y, Z values) of the source region
   * 
   * **Coordinate Systems:**
   * - Absolute: `[100, 64, 200]` - exact world coordinates
   * - Relative: `['~5', '~1', '~-3']` - relative to command execution point
   * - Local: `['^2', '^', '^-1']` - relative to facing direction
   *
   * @param begin One corner of the source region to copy from.
   *              Can be any corner - the command automatically determines the bounds.
   *
   * @param end The opposite corner of the source region.
   *            Together with `begin`, defines the complete 3D area to copy.
   *
   * @param destination The target location for the copied region.
   *                   This corresponds to where the "minimum corner" of the source
   *                   region will be placed (lowest X, Y, Z coordinates).
   * 
   * @returns CloneOptionsCommand for chaining filtering and mode options.
   * 
   * @example
   * ```ts
   * // Copy a house from one location to another
   * clone([100, 64, 100], [120, 80, 120], [200, 64, 200])
   * 
   * // Copy relative to current position
   * clone(['~-10', '~', '~-10'], ['~10', '~20', '~10'], ['~50', '~', '~'])
   * 
   * // Copy with options
   * clone(template_start, template_end, build_location).masked('normal')
   * clone(old_location, old_end, new_location).replace('move') // Move structure
   * ```
   */
  clone(
    begin: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>,
    destination: Macroable<Coordinates<MACRO>, MACRO>,
  ): CloneOptionsCommand<MACRO>

  /**
   * Clone blocks from a source region in a different dimension to a destination.
   */
  clone(): CloneFromDimensionCommand<MACRO>

  clone(
    begin?: Macroable<Coordinates<MACRO>, MACRO>,
    end?: Macroable<Coordinates<MACRO>, MACRO>,
    destination?: Macroable<Coordinates<MACRO>, MACRO>,
  ) {
    if (begin === undefined) {
      return this.subCommand([], CloneFromDimensionCommand<MACRO>, false)
    }
    return this.subCommand([begin, end, destination].map(coordinatesParser), CloneOptionsCommand<MACRO>, true)
  }
}

export class CloneFromDimensionCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Clone blocks from a source region in a specific dimension to a destination in the context dimension.
   * 
   * Copies all blocks within the defined 3D region to the new location.
   * The source region is defined by two opposite corners, and the destination
   * is the corresponding corner where the copied region will be placed.
   * 
   * **Region Definition:**
   * - Source region: defined by any two opposite corners (begin/end)
   * - Destination: the corner of the target region that corresponds to the "lowest" corner
   *   (minimum X, Y, Z values) of the source region
   * 
   * **Coordinate Systems:**
   * - Absolute: `[100, 64, 200]` - exact world coordinates
   * - Relative: `['~5', '~1', '~-3']` - relative to command execution point
   * - Local: `['^2', '^', '^-1']` - relative to facing direction
   * 
   * @param dimension Dimension of the source region.
   *
   * @param begin One corner of the source region to copy from.
   *              Can be any corner - the command automatically determines the bounds.
   *
   * @param end The opposite corner of the source region.
   *            Together with `begin`, defines the complete 3D area to copy.
   *
   * @param destination The target location for the copied region.
   *                   This corresponds to where the "minimum corner" of the source
   *                   region will be placed (lowest X, Y, Z coordinates).
   * 
   * @returns CloneOptionsCommand for chaining filtering and mode options.
   * 
   * @example
   * ```ts
   * // Copy a house from one location to another
   * clone().from('overworld', [100, 64, 100], [120, 80, 120], [200, 64, 200])
   * 
   * // Copy relative to current position
   * clone().from('the_nether', ['~-10', '~', '~-10'], ['~10', '~20', '~10'], ['~50', '~', '~'])
   * 
   * // Copy with options
   * clone().from('the_end', template_start, template_end, build_location).masked('normal')
   * clone().from('the_end', old_location, old_end, new_location).replace('move') // Move structure
   * ```
   */
  from(
    dimension: Macroable<Registry['minecraft:dimension_type'], MACRO>,
    begin: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>,
    destination: Macroable<Coordinates<MACRO>, MACRO>
  ): CloneOptionsCommand<MACRO>

  /**
   * Clone blocks from a source region in a specific dimension to a destination in a specific dimension.
   * 
   * Copies all blocks within the defined 3D region to the new location.
   * The source region is defined by two opposite corners, and the destination
   * is the corresponding corner where the copied region will be placed.
   * 
   * **Region Definition:**
   * - Source region: defined by any two opposite corners (begin/end)
   * - Destination: the corner of the target region that corresponds to the "lowest" corner
   *   (minimum X, Y, Z values) of the source region
   * 
   * **Coordinate Systems:**
   * - Absolute: `[100, 64, 200]` - exact world coordinates
   * - Relative: `['~5', '~1', '~-3']` - relative to command execution point
   * - Local: `['^2', '^', '^-1']` - relative to facing direction
   * 
   * @param dimension Dimension of the source region.
   *
   * @param begin One corner of the source region to copy from.
   *              Can be any corner - the command automatically determines the bounds.
   *
   * @param end The opposite corner of the source region.
   *            Together with `begin`, defines the complete 3D area to copy.
   * 
   * @returns CloneToDimensionCommand for setting the destination dimension & coordinates.
   */
  from(
    dimension: Macroable<Registry['minecraft:dimension_type'], MACRO>,
    begin: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>
  ): CloneToDimensionCommand<MACRO>

  from(
    dimension: Macroable<Registry['minecraft:dimension_type'], MACRO>,
    begin: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>,
    destination?: Macroable<Coordinates<MACRO>, MACRO>
  ) {
    if (destination === undefined) {
      return this.subCommand(['from', dimension, coordinatesParser(begin), coordinatesParser(end)], CloneToDimensionCommand<MACRO>, false)
    }
    return this.subCommand(['from', ...[begin, end, destination].map(coordinatesParser)], CloneOptionsCommand<MACRO>, true)
  }
}

export class CloneToDimensionCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Clone blocks from a source region in a specific dimension to a destination in a specific dimension.
   * 
   * Copies all blocks within the defined 3D region to the new location.
   * The source region is defined by two opposite corners, and the destination
   * is the corresponding corner where the copied region will be placed.
   * 
   * **Region Definition:**
   * - Destination: the corner of the target region that corresponds to the "lowest" corner
   *   (minimum X, Y, Z values) of the source region
   * 
   * @param dimension Dimension of the destination region.
   *
   * @param destination The target location for the copied region.
   *                   This corresponds to where the "minimum corner" of the source
   *                   region will be placed (lowest X, Y, Z coordinates).
   * 
   * @returns CloneOptionsCommand for chaining filtering and mode options.
   * 
   * @example
   * ```ts
   * // Copy a house from one location to another
   * clone().from('overworld', [100, 64, 100], [120, 80, 120]).to('the_nether', [200, 64, 200])
   * 
   * // Copy relative to current position
   * clone().from('the_nether', ['~-10', '~', '~-10'], ['~10', '~20', '~10']).to('overworld', ['~50', '~', '~'])
   * 
   * // Copy with options
   * clone().from('the_end', template_start, template_end).to('overworld', build_location).masked('normal')
   * clone().from('the_end', old_location, old_end).to('overworld', new_location).replace('move') // Move structure
   * ```
   */
  to = (dimension: Macroable<Registry['minecraft:dimension_type'], MACRO>, destination: Macroable<Coordinates<MACRO>, MACRO>) =>
    this.subCommand(['to', dimension, coordinatesParser(destination)], CloneOptionsCommand<MACRO>, true)
}

// TODO: These are chainable. Similar issues arise with the other block manipulation commands.
export class CloneOptionsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Copy all blocks, completely replacing the destination region.
   * 
   * This mode copies every block from the source, including air blocks,
   * completely overwriting whatever exists at the destination,
   * issuing relevant block updates. This is the most comprehensive copying mode.
   * 
   * **Behavior:**
   * - Copies ALL blocks (including air)
   * - Completely overwrites destination region
   * - Preserves exact structure including empty spaces
   *
   * @param mode Optional operation mode:
   *            - `'normal'` (default): Standard copying behavior
   *            - `'force'`: Allow copying even if source and destination overlap
   *            - `'move'`: Copy then replace source region with air (relocate structure)
   * 
   * @example
   * ```ts
   * // Standard replacement copy
   * clone(source, source_end, dest).replace()
   * 
   * // Move a structure to new location
   * clone([100, 64, 100], [110, 74, 110], [200, 64, 200]).replace('move')
   * 
   * // Force copy overlapping regions
   * clone(['~-5', '~', '~-5'], ['~5', '~10', '~5'], ['~3', '~', '~3']).replace('force')
   * ```
   */
  replace = (mode?: Macroable<'force' | 'move' | 'normal', MACRO>) => this.finalCommand(['replace', mode])

  /**
   * This mode copies blocks from the source without issuing block updates.
   */
  strict = () => this.finalCommand(['strict'])

  /**
   * Copy only solid blocks, preserving existing blocks where source has air.
   * 
   * This mode only copies non-air blocks from the source region. Air blocks
   * in the source are ignored, leaving whatever blocks exist at the destination
   * unchanged. Perfect for merging structures or adding details.
   * 
   * **Behavior:**
   * - Only copies solid (non-air) blocks
   * - Leaves existing destination blocks where source has air
   * - Great for layering or merging structures
   *
   * @param mode Optional operation mode (same as replace):
   *            - `'normal'` (default): Standard masked copying
   *            - `'force'`: Allow overlapping regions
   *            - `'move'`: Move only the solid blocks, leave air gaps
   * 
   * @example
   * ```ts
   * // Add decorations without removing existing structure
   * clone(decoration_source, decoration_end, building_location).masked()
   * 
   * // Merge two structures together
   * clone(detail_template, detail_end, base_structure).masked('normal')
   * 
   * // Move only the solid parts of a structure
   * clone(partial_build, partial_end, new_location).masked('move')
   * ```
   */
  masked = (mode?: Macroable<'force' | 'move' | 'normal', MACRO>) => this.finalCommand(['masked', mode])

  /**
   * Copy only blocks of a specific type.
   * 
   * This mode applies a filter, copying only blocks that match the specified
   * block type. All other blocks (including air) are ignored, leaving the
   * destination unchanged where non-matching blocks exist in the source.
   * 
   * **Behavior:**
   * - Only copies blocks matching the filter
   * - Ignores all other block types
   * - Useful for extracting specific materials or patterns
   *
   * @param filter The specific block type to copy. Examples:
   *              - `'minecraft:stone'` - only stone blocks
   *              - `'minecraft:oak_log'` - only oak logs
   *              - `'minecraft:redstone_wire'` - only redstone wiring
   *
   * @param mode Optional operation mode (same as other modes):
   *            - `'normal'` (default): Standard filtered copying
   *            - `'force'`: Allow overlapping regions
   *            - `'move'`: Move only the filtered blocks, replace with air
   * 
   * @example
   * ```ts
   * // Copy only the stone foundation
   * clone(building_source, building_end, new_site).filtered('minecraft:stone')
   * 
   * // Extract redstone circuit pattern
   * clone(machine_source, machine_end, circuit_area).filtered('minecraft:redstone_wire')
   * 
   * // Move only wooden parts of structure
   * clone(house_source, house_end, new_location).filtered('minecraft:oak_planks', 'move')
   * ```
   */
  filtered = (filter: Macroable<Registry['minecraft:block'], MACRO>, mode?: Macroable<'force' | 'move' | 'normal', MACRO>) =>
    this.finalCommand(['filtered', filter, mode])
}
