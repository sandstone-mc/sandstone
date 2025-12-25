import type { Registry } from 'sandstone/arguments/generated/registry'

export type Jigsaw = {
  /**
     * How the resultant structure can be transformed.
     *
     * Value:
     *
     *  - Rollable(`rollable`): The structure can be rotated
     *  - Aligned(`aligned`): The structure cannot be transformed
     */
  joint?: JointType
  /**
     * Structure pool this will "spawn" in.
     */
  pool?: Registry['minecraft:worldgen/template_pool']
  /**
     * ID this will "spawn" in.
     */
  name?: string
  /**
     * ID of the type of jigsaw this will be "spawned" from.
     */
  target?: string
  /**
     * Final block state of the jigsaw.
     */
  final_state?: string
}

export type JointType = ('rollable' | 'aligned')
