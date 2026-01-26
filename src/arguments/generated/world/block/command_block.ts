import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { BlockEntity, Nameable } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTInt, NBTLong } from 'sandstone'

export type BaseCommandBlock = {
  /**
   * The command to run.
   */
  Command?: `${any}${string}`,
  /**
   * Success count of the last command.
   */
  SuccessCount?: NBTInt,
  /**
   * Output of the last command.
   */
  LastOutput?: Text,
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
  LastExecution?: NBTLong,
}

export type CommandBlock = (BlockEntity & Nameable & BaseCommandBlock & {
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
