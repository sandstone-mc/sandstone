import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonBlockEntity, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTInt, NBTLong, NonEmptyString } from 'sandstone'

export type JsonBaseCommandBlock = {
  /**
   * The command to run.
   */
  Command?: NonEmptyString,
  /**
   * Success count of the last command.
   */
  SuccessCount?: (NBTInt | number),
  /**
   * Output of the last command.
   */
  LastOutput?: JsonText,
  /**
   * Whether to record command output.
   */
  TrackOutput?: boolean,
  /**
   * Whether to record the tick of the latest command execution.
   */
  UpdateLastExecution?: boolean,
  /**
   * Tick of the latest command execution.
   */
  LastExecution?: (NBTLong | number),
}

export type JsonCommandBlock = (JsonBlockEntity & JsonNameable & JsonBaseCommandBlock & {
  /**
   * Whether it is powered by redstone.
   */
  powered?: boolean,
  /**
   * Whether it is automatically powered.
   */
  auto?: boolean,
  /**
   * Whether the previous command block was successful when the command block was executed.
   * This is always true for non-conditional command blocks.
   */
  conditionMet?: boolean,
})
