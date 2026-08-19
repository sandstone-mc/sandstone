import type { JsonSymbolMcdocCustomDynamicEventKeys } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat, NBTInt, NonEmptyString } from 'sandstone'

export type JsonBooleanInput = {
  /**
   * Label displayed to the right of control.
   */
  label: JsonText,
  /**
   * Initial value of the control.
   * Defaults to `false` (unchecked).
   */
  initial?: boolean,
  /**
   * String to send when the control is checked.
   * Defaults to `"true"`.
   */
  on_true?: string,
  /**
   * String to send when the control is unchecked.
   * Defaults to `"false"`.
   */
  on_false?: string,
}

export type JsonInputControl = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:input_control_type'], string>, string>]?: ({
    type: S,
    /**
     * The input key, which is used to build macro command and generate custom action payload.
     *
     * Value:
     * *either*
     *
     * Must match regex of ^[A-Za-z0-9_]*$
     *
     * *or*
     *
     * *item 1*
     */
    key: (NonEmptyString | JsonSymbolMcdocCustomDynamicEventKeys<'%fallback'>),
  } & (S extends keyof JsonSymbolInputControl ? JsonSymbolInputControl[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:input_control_type'], string>])>

export type JsonMultiLine = {
  /**
   * Value:
   * Range: 1..
   */
  max_lines?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Height of the input.
   * If this field is not present:
   * - If `max_lines` is present, the height will be chosen to fit the maximum number of lines. The chosen height is capped at 512.
   * - If `max_lines` is also not present, the height will be chosen to fit 4 lines.
   *
   * Value:
   * Range: 1..512
   */
  height?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonNumberRangeInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Label displayed on the slider.
   */
  label: JsonText,
  /**
   * The translation to be used for building label.
   * `%1$s` is replaced by `label`; `%2$s` is replaced by current value of the slider.
   * Defaults to `options.generic_value`.
   */
  label_format?: JsonRegistry['minecraft:translation_key'],
  /**
   * Start value, inclusive.
   */
  start: (NBTFloat | number),
  /**
   * End value, inclusive.
   */
  end: (NBTFloat | number),
  /**
   * Step size of the input.
   * If not present, any value from range is allowed.
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  step?: (NBTFloat<{
    leftExclusive: true,
    min: 1,
  }> | number),
  /**
   * Initial value of the slider. Rounded down nearest step.
   * Defaults to the middle of the range.
   */
  initial?: (NBTFloat | number),
}

export type JsonOption = {
  /**
   * String to send on submit.
   */
  id: string,
  /**
   * Label displayed on the button.
   * When not present, `id` will be used instead.
   */
  display?: JsonText,
  /**
   * Whether this option is the initial value.
   * Only one option can have this field set to `true`.
   */
  initial?: boolean,
}

export type JsonSingleOptionInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Label displayed on the button.
   */
  label: JsonText,
  /**
   * Defaults to `true`.
   */
  label_visible?: boolean,
  /**
   * Value:
   * List length range: 1..
   */
  options: JsonNBTList<(JsonOption | string), {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonTextInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Label displayed to the left of control.
   */
  label: JsonText,
  /**
   * Defaults to `true`.
   */
  label_visible?: boolean,
  /**
   * Initial contents of the text input.
   * Defaults to `""` (empty string).
   */
  initial?: string,
  /**
   * Maximum length of input
   * Defaults to 32.
   *
   * Value:
   * Range: 1..
   */
  max_length?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * If present, allows users to input multiple lines.
   */
  multiline?: {
    /**
     * Value:
     * Range: 1..
     */
    max_lines?: (NBTInt<{
      min: 1,
    }> | number),
    /**
     * Height of the input.
     * If this field is not present:
     * - If `max_lines` is present, the height will be chosen to fit the maximum number of lines. The chosen height is capped at 512.
     * - If `max_lines` is also not present, the height will be chosen to fit 4 lines.
     *
     * Value:
     * Range: 1..512
     */
    height?: (NBTInt<{
      min: 1,
    }> | number),
  },
}
type JsonInputControlDispatcherMap = {
  'boolean': JsonInputControlBoolean,
  'minecraft:boolean': JsonInputControlBoolean,
  'number_range': JsonInputControlNumberRange,
  'minecraft:number_range': JsonInputControlNumberRange,
  'single_option': JsonInputControlSingleOption,
  'minecraft:single_option': JsonInputControlSingleOption,
  'text': JsonInputControlText,
  'minecraft:text': JsonInputControlText,
}
type JsonInputControlKeys = keyof JsonInputControlDispatcherMap
type JsonInputControlFallback = (
  | JsonInputControlBoolean
  | JsonInputControlNumberRange
  | JsonInputControlSingleOption
  | JsonInputControlText)
type JsonInputControlBoolean = JsonBooleanInput
type JsonInputControlNumberRange = JsonNumberRangeInput
type JsonInputControlSingleOption = JsonSingleOptionInput
type JsonInputControlText = JsonTextInput
export type JsonSymbolInputControl<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonInputControlDispatcherMap
  : CASE extends 'keys' ? JsonInputControlKeys : CASE extends '%fallback' ? JsonInputControlFallback : never
