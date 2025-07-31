import type { ResourceClass } from 'sandstone/core'
import { AdvancementClass, MCFunctionClass } from 'sandstone/core'

export function getResourceType(resource: ResourceClass) {
  if (resource instanceof MCFunctionClass) {
    return 'function'
  }
  if (resource instanceof AdvancementClass) {
    return 'advancement'
  }

  throw new Error(`Failed to recognize resource class ${resource.constructor.name}`)
}
