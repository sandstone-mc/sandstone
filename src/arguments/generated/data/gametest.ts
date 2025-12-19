import type { TestEnvironment } from 'sandstone/generated/data/gametest/test_environment'
import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { Registry } from 'sandstone/generated/registry'
import type { NBTInt } from 'sandstone'

export type BlockBasedTestInstance = TestData

export type FunctionTestInstance = (TestData & {
    /**
     * Test function (Java code) to run.
     */
    function: Registry['minecraft:test_function']
})

export type Rotation = ('none' | 'clockwise_90' | '180' | 'counterclockwise_90')

export type TestData = {
    /**
     * The test environment to run this test as part of.
     */
    environment: (Registry['minecraft:test_environment'] | TestEnvironment)
    /**
     * Structure NBT file to use for the test.
     */
    structure: Registry['minecraft:structure']
    /**
     * Maximum number of ticks allowed to pass before the test is considered timed out.
     *
     * Value:
     * Range: 1..
     */
    max_ticks: NBTInt<{
        min: 1
    }>
    /**
     * Ticks to wait after placing the structure before starting the test. Defaults to `0`.
     *
     * Value:
     * Range: 0..
     */
    setup_ticks?: NBTInt<{
        min: 0
    }>
    /**
     * Whether the test is considered required to pass for the full test suite to pass. Defaults to `true`.
     */
    required?: boolean
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
    rotation?: Rotation
    /**
     * If `true`, test is not included as part of automated test runs. Defaults to `false`.
     */
    manual_only?: boolean
    /**
     * Number of attempts to run the test. Defaults to `1`.
     *
     * Value:
     * Range: 1..
     */
    max_attempts?: NBTInt<{
        min: 1
    }>
    /**
     * Number of attempts that must succeed for the test to be considered successful. Defaults to `1`.
     *
     * Value:
     * Range: 1..
     */
    required_successes?: NBTInt<{
        min: 1
    }>
    /**
     * Whether the test needs clear access to the sky. Defaults to `false`.
     * If `false`, test is enclosed in barrier blocks. If `true`, the top is left open.
     */
    sky_access?: boolean
}

export type TestInstance = ({
    [S in Extract<Registry['minecraft:test_instance_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:test_instance'>
        ? Dispatcher<'minecraft:test_instance'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:test_instance_type']])
type TestInstanceDispatcherMap = {
    'block_based': TestInstanceBlockBased
    'minecraft:block_based': TestInstanceBlockBased
    'function': TestInstanceFunction
    'minecraft:function': TestInstanceFunction
}
type TestInstanceKeys = keyof TestInstanceDispatcherMap
type TestInstanceFallback = (TestInstanceBlockBased | TestInstanceFunction)
type TestInstanceBlockBased = BlockBasedTestInstance
type TestInstanceFunction = FunctionTestInstance
export type SymbolTestInstance<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? TestInstanceDispatcherMap
    : CASE extends 'keys' ? TestInstanceKeys : CASE extends '%fallback' ? TestInstanceFallback : never
