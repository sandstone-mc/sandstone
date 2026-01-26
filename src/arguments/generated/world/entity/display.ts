import type { ItemDisplayContext } from 'sandstone/arguments/generated/assets/model.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type AxisAngle = {
  /**
   * Local position of the axis in [x, y, z].
   *
   * Value:
   * List length range: 3
   */
  axis: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Angle to rotate around the axis in radians.
   */
  angle: NBTFloat,
}

export type Billboard = ('fixed' | 'vertical' | 'horizontal' | 'center')

export type BlockDisplay = (DisplayBase & {
  /**
   * Block state to display. Can display most block entities (eg. Chests, Beds, Furnaces, etc).
   *
   * Does not display specially rendered block entities (eg. The bell in a bell block, an end gateway, the book on an enchantment table, a banner, a sign, etc).
   */
  block_state?: BlockState,
})

export type Brightness = {
  /**
   * Value of skylight.
   *
   * Value:
   * Range: 0..15
   */
  sky: NBTInt<{
    min: 0,
    max: 15,
  }>,
  /**
   * Value of block light.
   *
   * Value:
   * Range: 0..15
   */
  block: NBTInt<{
    min: 0,
    max: 15,
  }>,
}

export type DisplayBase = (EntityBase & {
  /**
   * Transformation applied to model (after normal entity orientation). Defaults to identity. Interpolated.
   *
   * For an easy GUI, check out [Misode's tool](https://misode.github.io/transformation/).
   *
   * The value is stored in decomposed object form for interpolation & ease-of-use,
   *
   * Supports storing a [non-canonical matrix form](https://gist.github.com/MulverineX/f473dbfd7cc8dadb326074fef05ad76a) describing a row-major matrix, which is automatically decomposed by the game with a performance cost.
   */
  transformation?: Transformation,
  /**
   * Size of shadow. Defaults to 0 (no shadow). Interpolated.
   *
   * Value:
   * Range: 0..
   */
  shadow_radius?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Strength of the shadow. Controls the opacity of the shadow as a function of distance to the block below. Defaults to 1. Interpolated.
   *
   * Value:
   * Range: 0..1
   */
  shadow_strength?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Ticks after the next client tick to wait until starting the interpolation.
   *
   * Info:
   *
   * All interpolated properties are part of a single interpolation set.
   *
   * Any update to an interpolated property will cause all values of the interpolation set to be saved as "current".
   *  - Data command executions that do not change the value of a property (even if it's present in NBT) do not count as updates.
   *  - Updates are synchronized to clients at most once per tick, so multiple updates within a single command or a function will still count as a single update.
   *
   * Previous current values are saved as "previous".
   *
   * If interpolation is enabled, the entity will transition between "previous" and "current" values over time.
   *
   * `interpolation_duration` must be set every time an interpolatable property is updated to cause interpolation.
   *
   * Negative values are allowed, will cause an instant jump to the subtracted duration value, then interpolation will continue as normal.
   */
  start_interpolation?: NBTInt,
  /**
   * Ticks the interpolation should take to complete.
   *
   * Value:
   * Range: 0..
   */
  interpolation_duration?: NBTInt<{
    min: 0,
  }>,
  /**
   * How long in game ticks the entity takes to interpolate from its starting location to its destination when teleported. Defaults to 0 (no interpolation).
   *
   * Value:
   * Range: 0..59
   */
  teleport_duration?: NBTInt<{
    min: 0,
    max: 59,
  }>,
  /**
   * Controls if the model should pivot to face the player when rendered. Defaults to `fixed`.
   *
   * Value:
   *
   *  - Fixed(`fixed`): No rotation.
   *  - Vertical(`vertical`): Pivot around the vertical axis.
   *  - Horizontal(`horizontal`): Pivot around the horizontal axis.
   *  - Center(`center`): Pivot around both axes.
   */
  billboard?: Billboard,
  /**
   * When defined, overrides light values used for rendering. Omitted by default (which means rendering uses values from the entity position).
   */
  brightness?: Brightness,
  /**
   * Maximum view range of this entity. Actual distance depends on client-side render distance and entity distance scaling. Default value 1.0 (roughly the same as fireball).
   *
   * Value:
   * Range: 0..
   */
  view_range?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Describe width of the culling bounding box.
   *
   * Bounding box spans vertically from y to y+height and horizontally width/2 in all directions from the entity position.
   *
   * If set to 0, culling is disabled. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  width?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Describes height of the culling bounding box.
   *
   * Bounding box spans vertically from y to y+height and horizontally width/2 in all directions from the entity position.
   *
   * If set to 0, culling is disabled. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  height?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Override glow border color. If set to 0, uses team color. Defaults to 0.
   *
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  glow_color_override?: (0 | NBTInt),
})

export type ItemDisplay = (DisplayBase & {
  /**
   * Item stack to display.
   */
  item?: ItemStack,
  /**
   * Describes item model transform applied to item (as defined in the `display` section in model JSON). Defaults to `fixed`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - FirstPersonRighthand(`firstperson_righthand`)
   *  - FirstPersonLefthand(`firstperson_lefthand`)
   *  - ThirdPersonRighthand(`thirdperson_righthand`)
   *  - ThirdPersonLefthand(`thirdperson_lefthand`)
   *  - Gui(`gui`)
   *  - Head(`head`)
   *  - Ground(`ground`)
   *  - Fixed(`fixed`)
   *  - OnShelf(`on_shelf`)
   */
  item_display?: ItemDisplayContext,
})

/**
 * *either*
 *
 * List length range: 4
 *
 * *or*
 *
 * *item 1*
 */
export type Rotation = (NBTList<NBTFloat, {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
}> | AxisAngle)

export type TextAlignment = ('center' | 'left' | 'right')

export type TextDisplay = (DisplayBase & {
  /**
   * Text to display. Components are resolved with the executor set to the display entity and the position set to `0 0 0`.
   */
  text?: Text,
  /**
   * Line width in pixels used to split lines (note: new line can also be added with `\n` characters). Defaults to 200.
   *
   * Value:
   * Range: 0..
   */
  line_width?: NBTInt<{
    min: 0,
  }>,
  /**
   * Opacity (alpha component) of rendered text. Defaults to 255. Interpolated.
   *
   * Value:
   * Range: 0..255
   */
  text_opacity?: NBTInt<{
    min: 0,
  }>,
  /**
   * Color of background. Includes alpha channel. Defaults to 0x40000000. Interpolated.
   *
   * Calculated as `ALPHA << 24 | RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  background?: NBTInt,
  /**
   * If true, overrides `background` & rendering uses default text background color (same as in chat). Defaults to false.
   */
  default_background?: boolean,
  /**
   * Whether to display the text with shadows. Defaults to false.
   */
  shadow?: boolean,
  /**
   * Whether the text should be visible through opaque blocks. Defaults to false.
   */
  see_through?: boolean,
} & {
  /**
   * How text should be aligned. Defaults to `center`.
   *
   * Value:
   *
   *  - Center(`center`)
   *  - Left(`left`)
   *  - Right(`right`)
   */
  alignment?: TextAlignment,
})

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 16
 */
export type Transformation = ({
  /**
   * Translation in [x, y, z].
   *
   * Value:
   * List length range: 3
   */
  translation: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Using this rotation is enough for most transformations.
   */
  left_rotation: Rotation,
  /**
   * For more complex transformations. Applied **before** scaling.
   */
  right_rotation: Rotation,
  /**
   * Scale in [x, y, z].
   *
   * Value:
   * List length range: 3
   */
  scale: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
} | NBTList<NBTFloat, {
  leftExclusive: false,
  rightExclusive: false,
  min: 16,
  max: 16,
}>)
