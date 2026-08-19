import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'

export type JsonJigsaw = {
  /**
   * How the resultant structure can be transformed.
   *
   * Value:
   *
   *  - Rollable(`rollable`): The structure can be rotated
   *  - Aligned(`aligned`): The structure cannot be transformed
   */
  joint?: JsonJointType,
  /**
   * Structure pool this will "spawn" in.
   */
  pool?: JsonRegistry['minecraft:worldgen/template_pool'],
  /**
   * ID this will "spawn" in.
   */
  name?: string,
  /**
   * ID of the type of jigsaw this will be "spawned" from.
   */
  target?: string,
  /**
   * Final block state of the jigsaw.
   */
  final_state?: string,
}

export type JsonJointType = ('rollable' | 'aligned')
