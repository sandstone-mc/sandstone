import type { SymbolGameRule } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { MCFunctionClass, NBTInt } from 'sandstone'

export type AllOffTestEnvironment = {
  definitions: Array<TestEnvironment>,
}

export type BoolGameRule = {
  rule: `${any}${string}`,
  value: boolean,
}

export type ClockTimeTestEnvironment = {
  clock: `${string}:${string}`,
  /**
   * Value:
   * Range: 0..
   */
  time: NBTInt<{
    min: 0,
  }>,
}

export type FunctionTestEnvironment = {
  setup?: (`${string}:${string}` | MCFunctionClass),
  teardown?: (`${string}:${string}` | MCFunctionClass),
}

export type GameRulesTestEnvironment = {
  rules: ({
    [Key in Extract<Registry['minecraft:game_rule'], string>]?: (Key extends keyof SymbolGameRule
      ? SymbolGameRule[Key]
      : RootNBT)
  }),
}

export type IntGameRule = {
  rule: `${any}${string}`,
  value: NBTInt,
}

export type TestEnvironment = NonNullable<({
  [S in Extract<Registry['minecraft:test_environment_definition_type'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolTestEnvironmentDefinition ? SymbolTestEnvironmentDefinition[S] : RootNBT))
}[Registry['minecraft:test_environment_definition_type']])>

export type TimeOfDayTestEnvironment = {
  /**
   * Value:
   * Range: 0..
   */
  time: NBTInt<{
    min: 0,
  }>,
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
  weather: Weather,
}
type TestEnvironmentDefinitionDispatcherMap = {
  'all_of': TestEnvironmentDefinitionAllOf,
  'minecraft:all_of': TestEnvironmentDefinitionAllOf,
  'clock_time': TestEnvironmentDefinitionClockTime,
  'minecraft:clock_time': TestEnvironmentDefinitionClockTime,
  'function': TestEnvironmentDefinitionFunction,
  'minecraft:function': TestEnvironmentDefinitionFunction,
  'game_rules': TestEnvironmentDefinitionGameRules,
  'minecraft:game_rules': TestEnvironmentDefinitionGameRules,
  'time_of_day': TestEnvironmentDefinitionTimeOfDay,
  'minecraft:time_of_day': TestEnvironmentDefinitionTimeOfDay,
  'weather': TestEnvironmentDefinitionWeather,
  'minecraft:weather': TestEnvironmentDefinitionWeather,
}
type TestEnvironmentDefinitionKeys = keyof TestEnvironmentDefinitionDispatcherMap
type TestEnvironmentDefinitionFallback = (
  | TestEnvironmentDefinitionAllOf
  | TestEnvironmentDefinitionClockTime
  | TestEnvironmentDefinitionFunction
  | TestEnvironmentDefinitionGameRules
  | TestEnvironmentDefinitionTimeOfDay
  | TestEnvironmentDefinitionWeather)
type TestEnvironmentDefinitionAllOf = AllOffTestEnvironment
type TestEnvironmentDefinitionClockTime = ClockTimeTestEnvironment
type TestEnvironmentDefinitionFunction = FunctionTestEnvironment
type TestEnvironmentDefinitionGameRules = GameRulesTestEnvironment
type TestEnvironmentDefinitionTimeOfDay = TimeOfDayTestEnvironment
type TestEnvironmentDefinitionWeather = WeatherTestEnvironment
export type SymbolTestEnvironmentDefinition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? TestEnvironmentDefinitionDispatcherMap
  : CASE extends 'keys'
    ? TestEnvironmentDefinitionKeys
    : CASE extends '%fallback' ? TestEnvironmentDefinitionFallback : never
