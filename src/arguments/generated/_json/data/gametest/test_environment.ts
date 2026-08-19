import type { JsonSymbolGameRule } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  MCFunctionClass,
  NamespacedString,
  NBTInt,
  NonEmptyString,
  TimelineClass,
  WorldClockClass,
} from 'sandstone'

export type JsonAllOffTestEnvironment = {
  definitions: Array<JsonTestEnvironment>,
}

export type JsonBoolGameRule = {
  rule: NonEmptyString,
  value: boolean,
}

export type JsonClockTimeTestEnvironment = {
  clock: (JsonRegistry['minecraft:world_clock'] | WorldClockClass),
  /**
   * Value:
   * Range: 0..
   */
  time: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonDifficulty = ('peaceful' | 'easy' | 'normal' | 'hard')

export type JsonDifficultyTestEnvironment = {
  /**
   * Value:
   *
   *  - Peaceful(`peaceful`)
   *  - Easy(`easy`)
   *  - Normal(`normal`)
   *  - Hard(`hard`)
   */
  difficulty: JsonDifficulty,
}

export type JsonFunctionTestEnvironment = {
  setup?: (NamespacedString | MCFunctionClass),
  teardown?: (NamespacedString | MCFunctionClass),
}

export type JsonGameRuleMap = ({
  [Key in Extract<JsonRegistry['minecraft:game_rule'], string>]?: (Key extends keyof JsonSymbolGameRule
    ? JsonSymbolGameRule[Key]
    : JsonRootNBT)
})

export type JsonGameRulesTestEnvironment = {
  rules: ({
    [Key in Extract<JsonRegistry['minecraft:game_rule'], string>]?: (Key extends keyof JsonSymbolGameRule
      ? JsonSymbolGameRule[Key]
      : JsonRootNBT)
  }),
}

export type JsonIntGameRule = {
  rule: NonEmptyString,
  value: (NBTInt | number),
}

export type JsonTestEnvironment = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:test_environment_definition_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolTestEnvironmentDefinition ? JsonSymbolTestEnvironmentDefinition[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:test_environment_definition_type'], string>])>

export type JsonTimelineAttributesTestEnvironment = {
  timelines: Array<(JsonRegistry['minecraft:timeline'] | TimelineClass)>,
}

export type JsonTimeOfDayTestEnvironment = {
  /**
   * Value:
   * Range: 0..
   */
  time: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonWeather = ('clear' | 'rain' | 'thunder')

export type JsonWeatherTestEnvironment = {
  /**
   * Value:
   *
   *  - Clear(`clear`)
   *  - Rain(`rain`)
   *  - Thunder(`thunder`)
   */
  weather: JsonWeather,
}
type JsonTestEnvironmentDefinitionDispatcherMap = {
  'all_of': JsonTestEnvironmentDefinitionAllOf,
  'minecraft:all_of': JsonTestEnvironmentDefinitionAllOf,
  'clock_time': JsonTestEnvironmentDefinitionClockTime,
  'minecraft:clock_time': JsonTestEnvironmentDefinitionClockTime,
  'difficulty': JsonTestEnvironmentDefinitionDifficulty,
  'minecraft:difficulty': JsonTestEnvironmentDefinitionDifficulty,
  'function': JsonTestEnvironmentDefinitionFunction,
  'minecraft:function': JsonTestEnvironmentDefinitionFunction,
  'game_rules': JsonTestEnvironmentDefinitionGameRules,
  'minecraft:game_rules': JsonTestEnvironmentDefinitionGameRules,
  'timeline_attributes': JsonTestEnvironmentDefinitionTimelineAttributes,
  'minecraft:timeline_attributes': JsonTestEnvironmentDefinitionTimelineAttributes,
  'weather': JsonTestEnvironmentDefinitionWeather,
  'minecraft:weather': JsonTestEnvironmentDefinitionWeather,
}
type JsonTestEnvironmentDefinitionKeys = keyof JsonTestEnvironmentDefinitionDispatcherMap
type JsonTestEnvironmentDefinitionFallback = (
  | JsonTestEnvironmentDefinitionAllOf
  | JsonTestEnvironmentDefinitionClockTime
  | JsonTestEnvironmentDefinitionDifficulty
  | JsonTestEnvironmentDefinitionFunction
  | JsonTestEnvironmentDefinitionGameRules
  | JsonTestEnvironmentDefinitionTimelineAttributes
  | JsonTestEnvironmentDefinitionWeather)
type JsonTestEnvironmentDefinitionAllOf = JsonAllOffTestEnvironment
type JsonTestEnvironmentDefinitionClockTime = JsonClockTimeTestEnvironment
type JsonTestEnvironmentDefinitionDifficulty = JsonDifficultyTestEnvironment
type JsonTestEnvironmentDefinitionFunction = JsonFunctionTestEnvironment
type JsonTestEnvironmentDefinitionGameRules = JsonGameRulesTestEnvironment
type JsonTestEnvironmentDefinitionTimelineAttributes = JsonTimelineAttributesTestEnvironment
type JsonTestEnvironmentDefinitionWeather = JsonWeatherTestEnvironment
export type JsonSymbolTestEnvironmentDefinition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTestEnvironmentDefinitionDispatcherMap
  : CASE extends 'keys'
    ? JsonTestEnvironmentDefinitionKeys
    : CASE extends '%fallback' ? JsonTestEnvironmentDefinitionFallback : never
