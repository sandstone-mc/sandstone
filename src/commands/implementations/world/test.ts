
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

  // TODO: Improve description
  /**
   * "Verify" one or more tests.
   * 
   * @param testSelector Select test(s) to "verify" through a mojank glob pattern.
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

  // TODO: Improve rotationSteps documentation
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
   * @param repeat Optional. Times to repeat each test in different batches, one being no repetition. Defaults to `1`.
   * @param untilFail Optional. Whether the tests should be stopped as soon as one iteration fails. Defaults to `false`.
   * @param rotationSteps Optional. Extra `90` degree steps to apply to the tests. Defaults to `0`.
   * @param gridLength Optional. Number of tests to place per row in the grid layout, width increases dynamically with test count. Defaults to `8`.
   */
  run(
    testSelector: Macroable<TestInstanceClass | TEST_INSTANCE_SELECTOR, MACRO>,
    repeat?: Macroable<number, MACRO>,
    untilFail?: Macroable<boolean, MACRO>,
    rotationSteps?: Macroable<number, MACRO>,
    gridLength?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Run targeted tests.
   * 
   * @param target Which test(s) to target:
   *                - `'closest'` - Only one, the closest test instance block.
   *                - `'that'` - Only one, the first test bounding box directly in front of the execution context rotation/position.
   *                - `'these'` - All test instance blocks within 250 blocks of the execution context position.
   * @param repeat Optional. Times to repeat each test, one being no repetition. Defaults to `1`.
   * @param untilFail Optional. Whether the tests should be stopped as soon as one iteration fails. Defaults to `false`.
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
    rotationSteps: Macroable<number, MACRO> = 0,
    gridLength: Macroable<number, MACRO> = 8,
  ) {
    if (
      testSelector === 'closest'
      || testSelector === 'that'
      || testSelector === 'these'
    ) {
      return this.finalCommand([`run${testSelector}`, repeat, untilFail])
    }
    return this.finalCommand(['run', testSelector, repeat, untilFail, rotationSteps, gridLength])
  }

  /**
   * Run all tests in `LAST_FAILED_TESTS`.
   */
  runFailed(): FinalCommandOutput

  /**
   * Run all tests in `LAST_FAILED_TESTS`.
   * 
   * @param repeat Times to repeat each test, one being no repetition.
   * @param untilFail Optional. Whether the test should be stopped as soon as one iteration fails. Defaults to `false`.
   * @param rotationSteps Optional. Extra `90` degree steps to apply to the tests. Defaults to `0`.
   * @param gridLength Optional. Number of tests to place per row in the grid layout, width increases dynamically with test count. Defaults to `8`.
   */
  runFailed(
    repeat: Macroable<number, MACRO>,
    untilFail?: Macroable<boolean, MACRO>,
    rotationSteps?: Macroable<number, MACRO>,
    gridLength?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Run all tests in `LAST_FAILED_TESTS`.
   * 
   * @param onlyRequired Whether to only run tests with `TestData#required` set to true.
   * @param repeat Optional. Times to repeat each test, one being no repetition. Defaults to `1`.
   */
  runFailed(
    onlyRequired: boolean,
    repeat?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  runFailed(
    repeatOrOnlyRequired?: Macroable<number | boolean, MACRO>,
    untilFailOrRepeat?: Macroable<number | boolean, MACRO>,
    rotationSteps: Macroable<number, MACRO> = 0,
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

    return this.finalCommand(['runfailed', repeatOrOnlyRequired, untilFailOrRepeat, rotationSteps, gridLength])
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
   * Resets the test structure(s) for the test(s).
   * 
   * @param target Which test(s) to target:
   *                - `'closest'` - Only one, the closest test instance block.
   *                - `'that'` - Only one, the first test bounding box directly in front of the execution context rotation/position.
   *                - `'these'` - All test instance blocks within 250 blocks of the execution context position.
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
   *                - `'closest'` - Only one, the closest test instance block.
   *                - `'that'` - Only one, the first test bounding box directly in front of the execution context rotation/position.
   *                - `'these'` - All test instance blocks within 250 blocks of the execution context position.
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