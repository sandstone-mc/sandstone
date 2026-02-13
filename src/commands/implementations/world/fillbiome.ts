import type { Coordinates } from 'sandstone/arguments'
import type { WORLDGEN_BIOMES } from 'sandstone/arguments/generated/_registry/worldgen_biomes'
import type { Macroable, TagClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables'
import { CommandArguments, type FinalCommandOutput } from '../../helpers'

export class FillBiomeCommandNode extends CommandNode {
  command = 'fillbiome' as const
}

/**
 * Fills a cuboid region with a specific biome.
 *
 * Because biomes are stored in 4×4×4 block cells, this command operates on cells rather than individual blocks.
 * Only modifies biome data, not blocks themselves.
 *
 * @see https://minecraft.wiki/w/Commands/fillbiome
 */
export class FillBiomeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FillBiomeCommandNode

  /**
   * Fills a cuboid region with a biome.
   * 
   * Because biomes are stored in 4×4×4 block cells, this command operates on cells rather than individual blocks.
   * Only modifies biome data, not blocks themselves.
   *
   * @param from One corner of the region.
   * @param to The opposite corner of the region.
   * @param biome The biome to fill the region with.
   */
  fillbiome(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    biome: Macroable<WORLDGEN_BIOMES, MACRO>,
  ): FinalCommandOutput

  /**
   * Fills a cuboid region with a biome, replacing only biomes matching the filter.
   * 
   * Because biomes are stored in 4×4×4 block cells, this command operates on cells rather than individual blocks.
   * Only modifies biome data, not blocks themselves.
   *
   * @param from One corner of the region.
   * @param to The opposite corner of the region.
   * @param biome The biome to fill the region with.
   * @param filter The biome or biome tag to replace.
   */
  fillbiome(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    biome: Macroable<WORLDGEN_BIOMES, MACRO>,
    filter: Macroable<WORLDGEN_BIOMES | TagClass<'worldgen/biome'>, MACRO>,
  ): FinalCommandOutput

  fillbiome(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    biome: Macroable<WORLDGEN_BIOMES, MACRO>,
    filter?: Macroable<WORLDGEN_BIOMES | TagClass<'worldgen/biome'>, MACRO>,
  ) {
    if (filter !== undefined) {
      return this.finalCommand([coordinatesParser(from), coordinatesParser(to), biome, 'replace', filter])
    }
    return this.finalCommand([coordinatesParser(from), coordinatesParser(to), biome])
  }
}
