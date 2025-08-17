import type { POINT_OF_INTEREST_TYPES, WORLDGEN_BIOMES, WORLDGEN_STRUCTURES } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { CommandArguments } from '../../helpers.js'

export class LocateCommandNode extends CommandNode {
  command = 'locate' as const
}

export class LocateCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = LocateCommandNode

  /**
   * Find the nearest structure of the specified type.
   * 
   * Searches for generated structures in the world, returning coordinates and
   * distance to the closest matching structure. Useful for navigation,
   * teleportation, and exploration systems.
   * 
   * **Common Structures:**
   * - Villages: 'minecraft:village_plains', 'minecraft:village_desert'
   * - Dungeons: 'minecraft:monster_room', 'minecraft:mineshaft'
   * - Fortresses: 'minecraft:fortress', 'minecraft:bastion_remnant'
   * - End: 'minecraft:stronghold', 'minecraft:end_city'
   * - Ocean: 'minecraft:ocean_monument', 'minecraft:shipwreck'
   * 
   * **Search Behavior:**
   * - Searches in expanding chunks outward from command location
   * - May take time for distant structures
   * - Only finds already generated or generates chunks as needed
   * - Returns coordinates, distance, and direction
   *
   * @param structure The structure type to search for.
   *                 Must be a valid worldgen structure identifier.
   * 
   * @example
   * ```ts
   * // Find different structure types
   * locate.structure('minecraft:village_plains')     // Nearest plains village
   * locate.structure('minecraft:stronghold')         // End portal location
   * locate.structure('minecraft:ocean_monument')     // Ocean monument
   * locate.structure('minecraft:woodland_mansion')   // Rare mansion
   * 
   * // Use with teleportation
   * locate.structure('minecraft:bastion_remnant')    // Then tp to coordinates
   * ```
   */
  structure = (structure: Macroable<LiteralUnion<WORLDGEN_STRUCTURES>, MACRO>) =>
    this.finalCommand(['structure', structure])

  /**
   * Find the nearest biome of the specified type.
   * 
   * Searches for specific biomes in the world, useful for resource gathering,
   * building location selection, and environmental requirements.
   * 
   * **Common Biomes:**
   * - Overworld: 'minecraft:forest', 'minecraft:desert', 'minecraft:ocean'
   * - Cold: 'minecraft:snowy_tundra', 'minecraft:ice_spikes'
   * - Rare: 'minecraft:mushroom_fields', 'minecraft:bamboo_jungle'
   * - Nether: 'minecraft:nether_wastes', 'minecraft:crimson_forest'
   * - Mountains: 'minecraft:mountains', 'minecraft:mountain_edge'
   * 
   * **Search Behavior:**
   * - Searches outward from current location
   * - May require chunk generation for distant biomes
   * - Considers biome centers, not just edges
   * - Returns coordinates and distance to biome center
   *
   * @param biome The biome type to search for.
   *             Must be a valid biome identifier.
   * 
   * @example
   * ```ts
   * // Find different biome types
   * locate.biome('minecraft:desert')           // Sand and cacti
   * locate.biome('minecraft:mushroom_fields')  // Rare mushroom island
   * locate.biome('minecraft:jungle')           // Dense jungle biome
   * locate.biome('minecraft:ice_spikes')       // Unique ice formations
   * 
   * // Resource-specific searches
   * locate.biome('minecraft:badlands')         // Terracotta and gold
   * locate.biome('minecraft:dark_forest')      // Dark oak and mansions
   * ```
   */
  biome = (biome: Macroable<LiteralUnion<WORLDGEN_BIOMES>, MACRO>) => this.finalCommand(['biome', biome])

  /**
   * Find the nearest point of interest (POI) of the specified type.
   * 
   * Searches for specific functional blocks or job sites that villagers
   * and players interact with. Useful for finding trading posts, facilities,
   * and functional areas.
   * 
   * **Common POIs:**
   * - Job Sites: 'minecraft:armorer', 'minecraft:weaponsmith', 'minecraft:librarian'
   * - Gathering: 'minecraft:meeting', 'minecraft:home' (beds)
   * - Functional: 'minecraft:fisherman', 'minecraft:farmer', 'minecraft:fletcher'
   * - Special: 'minecraft:portal', 'minecraft:lodestone'
   * 
   * **Search Behavior:**\n   * - Finds functional blocks, not just any block of that type\n   * - Considers accessibility and villager pathfinding\n   * - May include both claimed and unclaimed job sites\n   * - Returns coordinates of the functional block
   *
   * @param pointOfInterest The POI type to search for.
   *                       Must be a valid point of interest identifier.
   * 
   * @example\n   * ```ts\n   * // Find villager job sites\n   * locate.poi('minecraft:weaponsmith')    // Grindstone/smithing table\n   * locate.poi('minecraft:librarian')      // Lectern for book trades\n   * locate.poi('minecraft:armorer')        // Blast furnace for armor\n   * \n   * // Find functional areas\n   * locate.poi('minecraft:meeting')        // Village meeting point\n   * locate.poi('minecraft:home')           // Available beds\n   * ```\n   */
  poi = (pointOfInterest: Macroable<LiteralUnion<POINT_OF_INTEREST_TYPES>, MACRO>) =>
    this.finalCommand(['poi', pointOfInterest])
}
