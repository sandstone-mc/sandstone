import type { AtlasDefinition, AtlasSpriteSource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'

/**
 * A node representing a Minecraft block state.
 */
export class AtlasNode extends ContainerNode implements ResourceNode<AtlasClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: AtlasClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.atlasJSON)
}

export type AtlasClassArguments = {
  /**
   * The block state's JSON.
   */
  atlas?: AtlasDefinition
} & ResourceClassArguments<'list'>

export class AtlasClass extends ResourceClass<AtlasNode> implements ListResource {
  atlasJSON: NonNullable<AtlasClassArguments['atlas']>

  constructor(core: SandstoneCore, name: string, args: AtlasClassArguments) {
    super(core, { packType: core.pack.resourcePack() }, AtlasNode, core.pack.resourceToPath(name, ['atlases']), args)

    this.atlasJSON = args.atlas || { sources: [] }

    this.handleConflicts()
  }

  push(...sources: AtlasSpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.atlasJSON.sources.push(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.atlasJSON.sources.push(...sources)
    }
  }

  unshift(...sources: AtlasSpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.atlasJSON.sources.unshift(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.atlasJSON.sources.unshift(...sources)
    }
  }

  /*
   * blockWithState<B extends keyof Blockstates>(
   * block: LiteralUnion<B>,
   * state?: (B extends keyof Blockstates ? Blockstates[B] : Blockstates[keyof Blockstates]) | { [name: string]: string},
   * ): string {
   * let id: string = block
   * if (state) {
   *  id += `[${Object.entries(state).map(([name, val]) => `${name}=${val}`).join(',')}]`
   * }
   * return id
   * }
   */
}
