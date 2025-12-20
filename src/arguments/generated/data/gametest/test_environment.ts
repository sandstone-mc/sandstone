import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { MCFunctionClass, NBTInt } from 'sandstone'

export type AllOffTestEnvironment = {
    definitions: Array<TestEnvironment>
}

export type BoolGameRule = {
    rule: `${any}${string}`
    value: boolean
}

export type FunctionTestEnvironment = {
    setup?: (`${string}:${string}` | MCFunctionClass)
    teardown?: (`${string}:${string}` | MCFunctionClass)
}

export type GameRulesTestEnvironment = {
    rules: ({
        [Key in Extract<Registry['minecraft:game_rule'], string>]?: (Key extends keyof Dispatcher<'minecraft:game_rule'>
            ? Dispatcher<'minecraft:game_rule'>[Key]
            : Record<string, unknown>);
    })
}

export type IntGameRule = {
    rule: `${any}${string}`
    value: NBTInt
}

export type TestEnvironment = ({
    [S in Extract<Registry['minecraft:test_environment_definition_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:test_environment_definition'>
        ? Dispatcher<'minecraft:test_environment_definition'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:test_environment_definition_type']])

export type TimeOfDayTestEnvironment = {
    /**
     * Value:
     * Range: 0..
     */
    time: NBTInt<{
        min: 0
    }>
}

export type Weather = ('clear' | 'rain' | 'thunder')

export type WeatherTestEnvironment = {
    /**
     * Value:
     *
     *  - Clear(`clear`)
     *  - Rain(`rain`)
     *  - Thunder(`thunder`)
     */
    weather: Weather
}
type TestEnvironmentDefinitionDispatcherMap = {
    'all_of': TestEnvironmentDefinitionAllOf
    'minecraft:all_of': TestEnvironmentDefinitionAllOf
    'function': TestEnvironmentDefinitionFunction
    'minecraft:function': TestEnvironmentDefinitionFunction
    'game_rules': TestEnvironmentDefinitionGameRules
    'minecraft:game_rules': TestEnvironmentDefinitionGameRules
    'time_of_day': TestEnvironmentDefinitionTimeOfDay
    'minecraft:time_of_day': TestEnvironmentDefinitionTimeOfDay
    'weather': TestEnvironmentDefinitionWeather
    'minecraft:weather': TestEnvironmentDefinitionWeather
}
type TestEnvironmentDefinitionKeys = keyof TestEnvironmentDefinitionDispatcherMap
type TestEnvironmentDefinitionFallback = (
  | TestEnvironmentDefinitionAllOf
  | TestEnvironmentDefinitionFunction
  | TestEnvironmentDefinitionGameRules
  | TestEnvironmentDefinitionTimeOfDay
  | TestEnvironmentDefinitionWeather)
type TestEnvironmentDefinitionAllOf = AllOffTestEnvironment
type TestEnvironmentDefinitionFunction = FunctionTestEnvironment
type TestEnvironmentDefinitionGameRules = GameRulesTestEnvironment
type TestEnvironmentDefinitionTimeOfDay = TimeOfDayTestEnvironment
type TestEnvironmentDefinitionWeather = WeatherTestEnvironment
export type SymbolTestEnvironmentDefinition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? TestEnvironmentDefinitionDispatcherMap
    : CASE extends 'keys'
        ? TestEnvironmentDefinitionKeys
        : CASE extends '%fallback' ? TestEnvironmentDefinitionFallback : never
