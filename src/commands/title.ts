/* eslint-disable @typescript-eslint/no-unused-vars */
import { json } from '../types'
import { register } from '../utils'

import type Sandstone from '../Sandstone'

export class Title {
  root: Sandstone

  constructor(root: Sandstone) {
    this.root = root
  }

  @register({ thisField: 'root' }, 'clear')
  clear() { return this.root }

  @register({ thisField: 'root' }, 'reset')
  reset() { return this.root }

  @register({ thisField: 'root' }, 'title')
  title(titleJson: json) {
    return this.root
  }

  @register({ thisField: 'root' }, 'subtitle')
  subtitle(subtitleJson: json) { return this.root }

  @register({ thisField: 'root' }, 'actionbar')
  actionbar(actionbarJson: json) { return this.root }
}

export function title(root: Sandstone) {
  return new Title(root)
}
