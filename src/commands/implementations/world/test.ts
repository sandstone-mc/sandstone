
import type { Macroable, TestInstanceClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments, FinalCommandOutput } from '../../helpers'
import { LiteralUnion, SetType } from 'sandstone'
import { TEST_INSTANCES, TEST_INSTANCES_SET } from 'sandstone/arguments/generated/_registry/test_instances'

export type TEST_INSTANCE_SELECTOR = (
  | LiteralUnion<SetType<typeof TEST_INSTANCES_SET>>
  | `minecraft:${SetType<typeof TEST_INSTANCES_SET>}`)

export class TestCommandNode extends CommandNode {
  command = 'test' as const
}

export class TestCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TestCommandNode

  create(test: Macroable<TestInstanceClass | TEST_INSTANCES, MACRO>): FinalCommandOutput

  create(test: Macroable<TestInstanceClass | TEST_INSTANCES, MACRO>, width: Macroable<number, MACRO>): FinalCommandOutput

  create(
    test: Macroable<TestInstanceClass | TEST_INSTANCES, MACRO>,
    width: Macroable<number, MACRO>,
    height: Macroable<number, MACRO>,
    depth: Macroable<number, MACRO>,
  ): FinalCommandOutput

  create(
    test: Macroable<TestInstanceClass | TEST_INSTANCES, MACRO>,
    width?: Macroable<number, MACRO>,
    height?: Macroable<number, MACRO>,
    depth?: Macroable<number, MACRO>,
  ) {
    if (width === undefined) {
      return this.finalCommand(['create', test])
    }
    if (height === undefined) {
      return this.finalCommand(['create', test, width])
    }
    return this.finalCommand(['create', test, width, height, depth])
  }

  /**
   * Verify (run) all of the selected tests 400 times each; 100 iterations per cardinal direction.
   * 
   * @param testSelector Select test(s) to verify through a mojank glob pattern.
   *                      - `*` - matches from 0 to any number of alphanumeric characters.
   *                      - `?` - matches exactly one alphanumeric character.
   * 
   *                     Official examples:
   *                      - `*:*` - matches all IDs.
   *                      - `*` - matches everything in the minecraft namespace.
   *                      - `custom:foo/*_test_?` - matches IDs in the `foo` subfolder in the `custom` namespace \
   *                        that end in `_test_` followed by one additional character (probably a number).
   */
  verify = (testSelector: Macroable<TestInstanceClass | TEST_INSTANCE_SELECTOR, MACRO>) =>
    this.finalCommand(['verify', testSelector])


  /**
   * Run one or more tests.
   * 
   * @param testSelector Select test(s) to run through a mojank glob pattern.
   *                      - `*` - matches from 0 to any number of alphanumeric characters.
   *                      - `?` - matches exactly one alphanumeric character.
   * 
   *                     Official examples:
   *                      - `*:*` - matches all IDs.
   *                      - `*` - matches everything in the minecraft namespace.
   *                      - `custom:foo/*_test_?` - matches IDs in the `foo` subfolder in the `custom` namespace \
   *                        that end in `_test_` followed by one additional character (probably a number).
   * 
   * @param repeat Optional. Times to repeat each test, one being no repetition. Defaults to `1`.
   * @param untilFail Optional. Whether each individual test in the run will stop repeating if they fail once. Defaults to `false`.
   * @param rotation Optional. Static rotation to apply to every test structure for the entire run. Defaults to `0`.
   * @param gridLength Optional. Number of tests to place per row in the grid layout, width increases dynamically with test count. Defaults to `8`.
   */
  run(
    testSelector: Macroable<TestInstanceClass | TEST_INSTANCE_SELECTOR, MACRO>,
    repeat?: Macroable<number, MACRO>,
    untilFail?: Macroable<boolean, MACRO>,
    rotation?: Macroable<0 | 90 | 180 | 270, MACRO>,
    gridLength?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Run targeted test(s).
   * 
   * @param target Which test(s) to target:
   *                - `'closest'` - Targets the single closest test instance block (execution position).
   *                - `'that'` - Targets a single test instance block via the structure bounding box that is being targeted (execution position and rotation).
   *                - `'these'` - Targets all test instance blocks within 250 blocks (execution position).
   * @param repeat Optional. Times to repeat each test, one being no repetition. Defaults to `1`.
   * @param untilFail Optional. Whether each individual test in the run will stop repeating if they fail once. Defaults to `false`.
   */
  run(
    target: 'closest' | 'that' | 'these',
    repeat?: Macroable<number, MACRO>,
    untilFail?: Macroable<boolean, MACRO>,
  ): FinalCommandOutput

  run(
    testSelector: any,
    repeat: Macroable<number, MACRO> = 1,
    untilFail: Macroable<boolean, MACRO> = false,
    rotation: Macroable<0 | 90 | 180 | 270, MACRO> = 0,
    gridLength: Macroable<number, MACRO> = 8,
  ) {
    if (
      testSelector === 'closest'
      || testSelector === 'that'
      || testSelector === 'these'
    ) {
      return this.finalCommand([`run${testSelector}`, repeat, untilFail])
    }
    return this.finalCommand(['run', testSelector, repeat, untilFail, typeof rotation === 'number' ? rotation / 90 : rotation, gridLength])
  }

  /**
   * Re-runs all of the tests that failed in the last run.
   * 
   * When starting any test run (whether its multiple tests or a single test, including when using this method),
   * the internal list of failed tests is reset. After the test run completes or is stopped, all failed tests are added to the list.
   */
  runFailed(): FinalCommandOutput

  /**
   * Re-runs all of the tests that failed in the last run.
   * 
   * When starting any test run (whether its multiple tests or a single test, including when using this method),
   * the internal list of failed tests is reset. After the test run completes or is stopped, all failed tests are added to the list.
   * 
   * @param repeat Times to repeat each test, one being no repetition.
   * @param untilFail Optional. each individual test in the run will stop repeating if they fail once. Defaults to `false`.
   * @param rotation Optional. Static rotation to apply to every test structure for the entire run. Defaults to `0`.
   * @param gridLength Optional. Number of tests to place per row in the grid layout, width increases dynamically with test count. Defaults to `8`.
   */
  runFailed(
    repeat: Macroable<number, MACRO>,
    untilFail?: Macroable<boolean, MACRO>,
    rotation?: Macroable<0 | 90 | 180 | 270, MACRO>,
    gridLength?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Re-runs all `TestData#required` tests that failed in the last run.
   * 
   * When starting any test run (whether its multiple tests or a single test, including when using this method),
   * the internal list of failed tests is reset. After the test run completes or is stopped, all failed tests are added to the list.
   * 
   * @param repeat Optional. Times to repeat each test, one being no repetition. Defaults to `1`.
   */
  runFailed(
    onlyRequired: true,
    repeat?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  runFailed(
    repeatOrOnlyRequired?: Macroable<number | boolean, MACRO>,
    untilFailOrRepeat?: Macroable<number | boolean, MACRO>,
    rotation: Macroable<0 | 90 | 180 | 270, MACRO> = 0,
    gridLength: Macroable<number, MACRO> = 8,
  ) {
    if (repeatOrOnlyRequired === undefined) {
      return this.finalCommand(['runfailed'])
    }
    if (typeof repeatOrOnlyRequired === 'boolean') {
      untilFailOrRepeat = untilFailOrRepeat ?? 1
      return this.finalCommand(['runfailed', repeatOrOnlyRequired, untilFailOrRepeat])
    }
    untilFailOrRepeat = untilFailOrRepeat ?? false

    return this.finalCommand(['runfailed', repeatOrOnlyRequired, untilFailOrRepeat, typeof rotation === 'number' ? rotation / 90 : rotation, gridLength])
  }

  /**
   * Locate one or more tests currently active in loaded chunks.
   * 
   * Command output 
   * 
   * @param testSelector Select test(s) to locate through a mojank glob pattern.
   *                      - `*` - matches from 0 to any number of alphanumeric characters.
   *                      - `?` - matches exactly one alphanumeric character.
   * 
   *                     Official examples:
   *                      - `*:*` - matches all IDs.
   *                      - `*` - matches everything in the minecraft namespace.
   *                      - `custom:foo/*_test_?` - matches IDs in the `foo` subfolder in the `custom` namespace \
   *                        that end in `_test_` followed by one additional character (probably a number).
   * @returns Result of how many test structures were located.
   */
  locate = (testSelector: Macroable<TestInstanceClass | TEST_INSTANCE_SELECTOR, MACRO>) =>
    this.finalCommand(['locate', testSelector])

  /**
   * Renders a special highlight on the targeted block with relative coordinates info.
   * 
   * Command output contains a text component with the relative position of the targeted block within the test bounds
   * and generated Java code with hardcoded relative coordinates in a `copy_to_clipboard` click event:
   * 
   * ```java
   * final BlockPos variableName = new BlockPos(x, y, z);
   * ```
   */
  pos = (variableName: Macroable<`${any}${string}`, MACRO>) =>
    this.finalCommand(['pos', variableName])

  /**
   * Resets the test state & structure(s) for the targeted test(s).
   * 
   * @param target Which test(s) to target:
   *                - `'closest'` - Targets the single closest test instance block (execution position).
   *                - `'that'` - Targets a single test instance block via the structure bounding box that is being targeted (execution position and rotation).
   *                - `'these'` - Targets all test instance blocks within 250 blocks (execution position).
   */
  reset = (target: 'closest' | 'that' | 'these') =>
    this.finalCommand([`reset${target}`])

  /**
   * Removes the structures and blocks associated with all tests within a block radius of the execution position context.
   * 
   * @param radius Optional. Block radius from the execution position context to clear tests in. Defaults to 200.
   */
  clear(radius?: Macroable<number, MACRO>): FinalCommandOutput

  /**
   * Removes the structure(s) and blocks associated with test(s).
   * 
   * @param target Which test(s) to target:
   *                - `'that'` - Targets a single test instance block via the structure bounding box that is being targeted (execution position and rotation).
   *                - `'these'` - Targets all test instance blocks within 250 blocks (execution position).
   */
  clear(target: 'that' | 'these'): FinalCommandOutput

  clear(radiusOrTarget?: 'that' | 'these' | Macroable<number, MACRO>) {
    if (typeof radiusOrTarget === 'string') {
      return this.finalCommand([`clear${radiusOrTarget}`])
    }
    if (typeof radiusOrTarget === undefined) {
      return this.finalCommand(['clearall'])
    }
    return this.finalCommand(['clearall', radiusOrTarget])
  }
  /**
   * Stops all tests.
   */
  stop = () => this.finalCommand(['stop'])
}