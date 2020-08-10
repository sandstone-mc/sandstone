import { execute } from '../../src'

export abstract class BaseClass {
  abstract class: number

  skill = () => {
    execute.as('@s[scores={skill=1}]').run(this.firstSkill)
    execute.as('@s[scores={skill=2}]').run(this.secondSkill)
  }

  abstract firstSkill();


  abstract secondSkill();
}
