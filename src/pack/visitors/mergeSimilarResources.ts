/* eslint-disable dot-notation */

import { AdvancementClass, MCFunctionClass, ResourceNode, TagClass, TagNode } from '#core'

import { GenericSandstoneVisitor } from './visitor'

import type { ResourceClass } from '#core'

export type RootMap = {
  function: NestedMap
  advancement: NestedMap
}

type NestedMap = { children: Map<string, NestedMap>, resources: Set<ResourceClass> }

function* pick<T>(iterable: Iterable<T>, callback: (item: T) => boolean) {
  for (const item of iterable) {
    if (callback(item)) {
      yield item
    }
  }
}

function getResourceType(resource: ResourceClass): keyof RootMap {
  if (resource instanceof MCFunctionClass) {
    return 'function'
  }
  if (resource instanceof AdvancementClass) {
    return 'advancement'
  }

  throw new Error(`Failed to recognize resource class ${resource.constructor.name}`)
}

function getNestedMapResources(map: RootMap, resource: ResourceClass) {
  const resourceType = getResourceType(resource)

  const { resources } = resource['path'].reduce(({ children }, str) => {
    if (!children.has(str)) {
      children.set(str, { children: new Map(), resources: new Set() })
    }

    return children.get(str)!
  }, map[resourceType])

  return resources
}

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class MergeSimilarResourcesVisitor extends GenericSandstoneVisitor {
  onEnd = () => {
    // Create a map of all similarily-named resources
    function rawMap(): NestedMap { return { children: new Map(), resources: new Set() } }

    const paths: RootMap = {
      advancement: rawMap(),
      function: rawMap(),
    }

    for (const { resource } of this.core.resourceNodes) {
      const resources = getNestedMapResources(paths, resource)
      resources.add(resource)
    }

    let changeHappened = false

    // Find if two resources have identical types & names. Rename them if possible.
    for (const { resource } of this.core.resourceNodes) {
      const resources = getNestedMapResources(paths, resource)

      // No other resource has the same name.
      if (resources.size <= 1) {
        continue
      }

      // At least one another resource has the same name, but 2 of them have `onConflict=throw`
      const throwErrorResources = [...pick(resources, (r) => r.onConflict === 'throw')]
      if (throwErrorResources.length >= 2) {
        throw new Error(`Created ${resources.size} resources with the name ${resource.name}, and ${throwErrorResources.length} of them had onConflict set to "throw".`)
      }

      /*
       * If only 1 resource has onConflict & it's a user resource, we can rename Sandstone resources with the same name
       * to avoid collisions
       */
      if (throwErrorResources.length === 1 && throwErrorResources[0]['creator'] === 'user') {
        // Rename the sandstone resources
        for (const sandstoneResource of pick(resources, (r) => r['creator'] === 'sandstone')) {
          const last = sandstoneResource['path'].length - 1
          sandstoneResource['path'][last] = `_${sandstoneResource['path'][last]}`
        }

        // Restart the whole thing
        this.onEnd()
        return
      }

      let i = throwErrorResources.length

      for (const otherResource of pick(resources, (r) => r.onConflict !== 'throw')) {
        const conflict = otherResource.onConflict
        const previousResource = i > 0 ? [...resources][i - 1] : null

        if (conflict === 'replace' && previousResource) {
          // Delete the previous node
          this.core.resourceNodes.delete(previousResource['node'])
          changeHappened = true
        }
        if (conflict === 'rename') {
          // Rename the current one with _1, _2...
          const appendix = i === 0 ? '' : `_${i}`
          const p = otherResource['path']
          otherResource['path'] = [...p.slice(undefined, -1) as string[], p.at(-1)! + appendix]
          changeHappened = true
        }
        if (conflict === 'ignore') {
          // Ignore
        }

        // If we have a previous node & both of them are MCFunctions
        if (otherResource instanceof MCFunctionClass && previousResource instanceof MCFunctionClass) {
          if (conflict === 'append') {
            previousResource['node'].body.push(...otherResource['node'].body)
            this.core.resourceNodes.delete(otherResource['node'])
            changeHappened = true
          }

          if (conflict === 'prepend') {
            previousResource['node'].body = [...otherResource['node'].body, ...previousResource['node'].body]
            this.core.resourceNodes.delete(otherResource['node'])
            changeHappened = true
          }
        }

        // Awful code
        if (otherResource instanceof TagClass && previousResource instanceof TagClass) {
          if (conflict === 'append') {
            ((previousResource['node'] as ResourceNode<TagNode>).resource.resource.tagJSON.values as []).push(...((otherResource['node'] as ResourceNode<TagNode>).resource.resource.tagJSON.values as []))
            this.core.resourceNodes.delete(otherResource['node'])
            changeHappened = true
          }

          if (conflict === 'prepend') {
            ((previousResource['node'] as ResourceNode<TagNode>).resource.resource.tagJSON.values as []) = [...((otherResource['node'] as ResourceNode<TagNode>).resource.resource.tagJSON.values as []), ...((previousResource['node'] as ResourceNode<TagNode>).resource.resource.tagJSON.values as [])] as []
            this.core.resourceNodes.delete(otherResource['node'])
            changeHappened = true
          }
        }

        i += 1
      }
    }

    // If any resource was changed... Start again, in case we accidentally created several resources with identical names
    if (changeHappened) {
      this.onEnd()
    }
  }
}
