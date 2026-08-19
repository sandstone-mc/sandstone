import type { JsonTestEnvironment } from 'sandstone/arguments/generated/_json/data/gametest/test_environment.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRotation } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt, StructureClass, TestEnvironmentClass } from 'sandstone'

export type JsonBlockBasedTestInstance = JsonTestData

export type JsonFunctionTestInstance = (JsonTestData & {
  /**
   * Test function (Java code) to run.
   */
  function: JsonRegistry['minecraft:test_function'],
})

export type JsonTestData = {
  /**
   * The test environment to run this test as part of.
   */
  environment: ((JsonRegistry['minecraft:test_environment'] | TestEnvironmentClass) | JsonTestEnvironment),
  /**
   * Structure NBT file to use for the test.
   */
  structure: (JsonRegistry['minecraft:structure'] | StructureClass),
  /**
   * Maximum number of ticks allowed to pass before the test is considered timed out.
   *
   * Value:
   * Range: 1..
   */
  max_ticks: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Ticks to wait after placing the structure before starting the test. Defaults to `0`.
   *
   * Value:
   * Range: 0..
   */
  setup_ticks?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Whether the test is considered required to pass for the full test suite to pass. Defaults to `true`.
   */
  required?: boolean,
  /**
   * Rotation to apply to the test structure. Defaults to `none`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Clockwise90(`clockwise_90`)
   *  - Clockwise180(`180`)
   *  - CounterClockwise90(`counterclockwise_90`)
   */
  rotation?: JsonRotation,
  /**
   * If `true`, test is not included as part of automated test runs. Defaults to `false`.
   */
  manual_only?: boolean,
  /**
   * Number of attempts to run the test. Defaults to `1`.
   *
   * Value:
   * Range: 1..
   */
  max_attempts?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Number of attempts that must succeed for the test to be considered successful. Defaults to `1`.
   *
   * Value:
   * Range: 1..
   */
  required_successes?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Whether the test needs clear access to the sky. Defaults to `false`.
   * If `false`, test is enclosed in barrier blocks. If `true`, the top is left open.
   */
  sky_access?: boolean,
  /**
   * Additional padding in blocks placed around the structure. Defaults to `0`.
   *
   * Value:
   * Range: 0..128
   */
  padding?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonTestInstance = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:test_instance_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolTestInstance ? JsonSymbolTestInstance[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:test_instance_type'], string>])>
type JsonTestInstanceDispatcherMap = {
  'block_based': JsonTestInstanceBlockBased,
  'minecraft:block_based': JsonTestInstanceBlockBased,
  'function': JsonTestInstanceFunction,
  'minecraft:function': JsonTestInstanceFunction,
}
type JsonTestInstanceKeys = keyof JsonTestInstanceDispatcherMap
type JsonTestInstanceFallback = (JsonTestInstanceBlockBased | JsonTestInstanceFunction)
type JsonTestInstanceBlockBased = JsonBlockBasedTestInstance
type JsonTestInstanceFunction = JsonFunctionTestInstance
export type JsonSymbolTestInstance<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTestInstanceDispatcherMap
  : CASE extends 'keys' ? JsonTestInstanceKeys : CASE extends '%fallback' ? JsonTestInstanceFallback : never
