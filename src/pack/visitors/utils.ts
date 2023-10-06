import { AdvancementClass, MCFunctionClass } from 'sandstone/core/index.js'

import type { ResourceClass } from 'sandstone/core/index.js'

export function getResourceType(resource: ResourceClass) {
  if (resource instanceof MCFunctionClass) {
    return 'function'
  }
  if (resource instanceof AdvancementClass) {
    return 'advancement'
  }

  throw new Error(`Failed to recognize resource class ${resource.constructor.name}`)
}
