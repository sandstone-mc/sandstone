import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'

export type JsonGene = ('normal' | 'lazy' | 'worried' | 'playful' | 'brown' | 'weak' | 'aggressive')

export type JsonPanda = (JsonBreedable & {
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
  MainGene?: JsonGene,
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
  HiddenGene?: JsonGene,
})
