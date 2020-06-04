import { BaseClass } from './baseClass'
import { say, execute } from '../../src'

export class Wizard extends BaseClass {
  class = 2

  firstSkill() {
    say('This is the wizard first skill')
  }

  secondSkill() {
    say('This is the wizard second skill')
  }
}
