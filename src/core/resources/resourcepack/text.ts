/* eslint-disable no-lone-blocks */

import type { ContentTag, JSONTextComponent } from 'sandstone/arguments'
import { JSONTextComponentClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

/**
 * A node representing a Minecraft text.
 */
export class PlainTextNode extends ContainerNode implements ResourceNode<PlainTextClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: PlainTextClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.texts
}

export type PlainTextArguments = {
  /**
   * The text.
   */
  text?: string | JSONTextComponent | string[] | JSONTextComponent[]
} & ResourceClassArguments<'list'>

export class PlainTextClass extends ResourceClass<PlainTextNode> implements ListResource {
  static readonly resourceType = 'text'

  texts: NonNullable<PlainTextArguments['text']> = ''

  constructor(core: SandstoneCore, name: string, args: PlainTextArguments) {
    super(
      core,
      { packType: core.pack.resourcePack(), extension: 'txt' },
      PlainTextNode,
      core.pack.resourceToPath(name, ['texts']),
      args,
    )

    this.texts = ''
    if (args.text) {
      if (Array.isArray(args.text)) {
        this.push(...args.text)
      } else {
        this.push(args.text)
      }
    }

    this.handleConflicts()
  }

  componentToPlainText(__text: JSONTextComponent): string {
    const text = new JSONTextComponentClass(__text).toJSON() as JSONTextComponent

    let converted = ''

    const type = typeof text

    if (type === 'string') {
      converted += text
    } else if (type === 'boolean' || type === 'number') {
      converted += `${text}`
    } else if (Array.isArray(text)) {
      for (const _text of text) {
        converted += this.componentToPlainText(_text)
      }
    } else {
      const currentText = text as ContentTag<'text'>

      if (!currentText.text) {
        throw new Error('Dynamic JSON content is not supported in plaintext')
      }

      if (currentText.color) {
        const { color } = currentText
        if (color.startsWith('#')) {
          throw new Error('Hex codes are not supported in plaintext')
        }
        // eslint-disable-next-line max-len
        const colors = [
          'black',
          'dark_blue',
          'dark_green',
          'dark_aqua',
          'dark_red',
          'dark_purple',
          'gold',
          'gray',
          'dark_gray',
          'blue',
          'green',
          'aqua',
          'red',
          'light_purple',
          'yellow',
          'white',
        ] as const

        converted = `§${colors.indexOf(color as 'black').toString(16)}`
      }

      if (currentText.obfuscated) {
        converted += '§k'
      }
      if (currentText.bold) {
        converted += '§l'
      }
      if (currentText.strikethrough) {
        converted += '§m'
      }
      if (currentText.underlined) {
        converted += '§n'
      }
      if (currentText.italic) {
        converted += '§o'
      }

      converted += `${currentText.text}`

      if (currentText.extra) {
        converted += this.componentToPlainText(currentText.extra)
      }
    }

    return converted
  }

  push(...texts: string[] | JSONTextComponent[]) {
    if (typeof texts[0] === 'string') {
      for (const text of texts) {
        this.texts += `${text}\n`
      }
    } else {
      for (const text of texts) {
        this.texts += `${this.componentToPlainText(text)}\n`
      }
    }
  }

  unshift(...texts: string[] | JSONTextComponent[]) {
    if (typeof texts[0] === 'string') {
      for (const text of texts) {
        this.texts = `${text}\n${this.texts}`
      }
    } else {
      for (const text of texts) {
        this.texts = `${this.componentToPlainText(text)}\n${this.texts}`
      }
    }
  }
}
