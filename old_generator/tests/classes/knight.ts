import { BaseClass } from './baseClass'

import { say, execute } from '../../src'

export class Knight extends BaseClass {
  class = 1

  firstSkill() {
    say('This is the knight first skill')
  }

  secondSkill() {
    say('This is the knight second skill')
  }
}
