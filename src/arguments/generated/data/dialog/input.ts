import type { SymbolMcdocCustomDynamicEventKeys } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type BooleanInput = {
  /**
   * Label displayed to the right of control.
   */
  label: Text,
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

export type InputControl = NonNullable<({
  [S in Extract<Registry['minecraft:input_control_type'], string>]?: ({
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
    key: (`${any}${string}` | SymbolMcdocCustomDynamicEventKeys<'%fallback'>),
  } & (S extends keyof SymbolInputControl ? SymbolInputControl[S] : RootNBT))
}[Registry['minecraft:input_control_type']])>

export type NumberRangeInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: NBTInt<{
    min: 1,
  }>,
  /**
   * Label displayed on the slider.
   */
  label: Text,
  /**
   * The translation to be used for building label.
   * `%1$s` is replaced by `label`; `%2$s` is replaced by current value of the slider.
   * Defaults to `options.generic_value`.
   */
  label_format?: Registry['minecraft:translation_key'],
  /**
   * Start value, inclusive.
   */
  start: NBTFloat,
  /**
   * End value, inclusive.
   */
  end: NBTFloat,
  /**
   * Step size of the input.
   * If not present, any value from range is allowed.
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  step?: NBTFloat<{
    leftExclusive: true,
    min: 1,
  }>,
  /**
   * Initial value of the slider. Rounded down nearest step.
   * Defaults to the middle of the range.
   */
  initial?: NBTFloat,
}

export type Option = {
  /**
   * String to send on submit.
   */
  id: string,
  /**
   * Label displayed on the button.
   * When not present, `id` will be used instead.
   */
  display?: Text,
  /**
   * Whether this option is the initial value.
   * Only one option can have this field set to `true`.
   */
  initial?: boolean,
}

export type SingleOptionInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: NBTInt<{
    min: 1,
  }>,
  /**
   * Label displayed on the button.
   */
  label: Text,
  /**
   * Defaults to `true`.
   */
  label_visible?: boolean,
  /**
   * Value:
   * List length range: 1..
   */
  options: NBTList<(Option | string), {
    leftExclusive: false,
    min: 1,
  }>,
}

export type TextInput = {
  /**
   * Defaults to 200.
   *
   * Value:
   * Range: 1..1024
   */
  width?: NBTInt<{
    min: 1,
  }>,
  /**
   * Label displayed to the left of control.
   */
  label: Text,
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
  max_length?: NBTInt<{
    min: 1,
  }>,
  /**
   * If present, allows users to input multiple lines.
   */
  multiline?: {
    /**
     * Value:
     * Range: 1..
     */
    max_lines?: NBTInt<{
      min: 1,
    }>,
    /**
     * Height of the input.
     * If this field is not present:
     * - If `max_lines` is present, the height will be chosen to fit the maximum number of lines. The chosen height is capped at 512.
     * - If `max_lines` is also not present, the height will be chosen to fit 4 lines.
     *
     * Value:
     * Range: 1..512
     */
    height?: NBTInt<{
      min: 1,
    }>,
  },
}
type InputControlDispatcherMap = {
  'boolean': InputControlBoolean,
  'minecraft:boolean': InputControlBoolean,
  'number_range': InputControlNumberRange,
  'minecraft:number_range': InputControlNumberRange,
  'single_option': InputControlSingleOption,
  'minecraft:single_option': InputControlSingleOption,
  'text': InputControlText,
  'minecraft:text': InputControlText,
}
type InputControlKeys = keyof InputControlDispatcherMap
type InputControlFallback = (
  | InputControlBoolean
  | InputControlNumberRange
  | InputControlSingleOption
  | InputControlText)
type InputControlBoolean = BooleanInput
type InputControlNumberRange = NumberRangeInput
type InputControlSingleOption = SingleOptionInput
type InputControlText = TextInput
export type SymbolInputControl<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? InputControlDispatcherMap
  : CASE extends 'keys' ? InputControlKeys : CASE extends '%fallback' ? InputControlFallback : never
