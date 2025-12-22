import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Gene = ('normal' | 'lazy' | 'worried' | 'playful' | 'brown' | 'weak' | 'aggressive')

export type Panda = (Breedable & {
  /**
     * Displayed gene.
     * If this gene is recessive and 'HiddenGene' is not the same, the panda will display the 'normal' gene.
     *
     * Value:
     *
     *  - Normal(`normal`): (dominant)
     *  - Lazy(`lazy`): (dominant)
     *  - Worried(`worried`): (dominant)
     *  - Playful(`playful`): (dominant)
     *  - Brown(`brown`): (recessive)
     *  - Weak(`weak`): (recessive)
     *  - Aggressive(`aggressive`): (dominant)
     */
  MainGene?: Gene
  /**
     * Hidden gene.
     *
     * Value:
     *
     *  - Normal(`normal`): (dominant)
     *  - Lazy(`lazy`): (dominant)
     *  - Worried(`worried`): (dominant)
     *  - Playful(`playful`): (dominant)
     *  - Brown(`brown`): (recessive)
     *  - Weak(`weak`): (recessive)
     *  - Aggressive(`aggressive`): (dominant)
     */
  HiddenGene?: Gene
})
