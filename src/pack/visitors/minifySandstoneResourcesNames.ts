import { GenericSandstoneVisitor } from './visitor'

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'

function getMinifiedName(i: number): string {
  const letter = alphabet[i % alphabet.length]!

  if (i > alphabet.length) {
    return letter + getMinifiedName(i - alphabet.length)
  }

  return letter
}

/**
 * Rename all Sandstone resources to names like `_/a`, `_/b`...
 */
export class MinifySandstoneResourcesNamesVisitor extends GenericSandstoneVisitor {
  onEnd = () => {
    // Ensure no root folder is already named '_', else change the folder name to something like '_a'.
    let folderIndex = 0
    let folderName = '_'
    for (const { resource } of this.core.resourceNodes) {
      if (resource.path[0] === folderName) {
        folderName = `_${getMinifiedName(folderIndex)}`
        folderIndex += 1
      }
    }

    let i = 0
    for (const { resource } of this.core.resourceNodes) {
      if (resource['creator'] === 'sandstone') {
        resource.path = [resource.path[0], '_', getMinifiedName(i)]
        i += 1
      }
    }
  }
}
