import { Coordinates, Rotation, SelectorArgument } from '@arguments';
import { Command } from '../Command';
export declare class TeleportFacing extends Command {
    /**
     * Specifies the coordinates to make the target(s) facing to.
     * May use tilde and caret notation to specify a position relative to the position where the command is executed.
     */
    facing: (location: Coordinates) => void;
    /**
     * Specifies the entity to make the target(s) facing to.
     *
     * @param entity Must be a player name, a target selector, or a UUID‌.
     *             Permits entity other than players.
     *
     * @param anchor Specifies whether the entity'eyes or feet to make the target(s) facing to.
     *             Must be one of eyes and feet. If not specified, defaults to eyes.
     */
    facingEntity: (entity: SelectorArgument<true>, anchor?: "eyes" | "feet" | undefined) => void;
}
export declare class Teleport extends Command {
    teleport: ((
    /**
     * Teleports the executer to a given entity.
     *
     * @param destinationEntity
     *  Specifies the entity to teleport the executer to. Must be a player name, a target selector, or a UUID‌.
     *  Permits entity other than players.
     */
    (destinationEntity: SelectorArgument<true>) => void) & (
    /**
     * Teleports the executer to a given location.
     *
     * @param location
     *  Specifies the coordinates to teleport the executer to.
     *  May use tilde and caret notation to specify a position relative to the position where the command is executed.
     */
    (location: Coordinates) => void) & (
    /**
     * Teleports entities (players, mobs, etc.) to the given entity.
     *
     * @param targets
     *  Specifies the entity(s) to be teleported. Must be a player name, a target selector, or a UUID‌.
     *  Permits entities other than players.
     *
     * @param destinationEntity
     *  Specifies the entity to teleport the executer to. Must be a player name, a target selector, or a UUID‌.
     *  Permits entity other than players.
     */
    (targets: SelectorArgument<false>, destinationEntity: string) => void) & (
    /**
     * Teleports entities (players, mobs, etc.) to the given location.
     *
     * @param targets
     *  Specifies the entity(s) to be teleported. Must be a player name, a target selector, or a UUID‌.
     *  Permits entities other than players.
     *
     * @param location
     *  Specifies the coordinates to teleport the target(s) to.
     *  May use tilde and caret notation to specify a position relative to the position where the command is executed.
     *
     * @returns
     *  An object with two optional possibilities: `facing` or `facingEntity`,
     *  to change the direction the player is facing.
     */
    (targets: SelectorArgument<false>, location: Coordinates) => TeleportFacing) & (
    /**
     * Teleports entities (players, mobs, etc.) to the given location, with the given rotation.
     *
     * @param targets
     *  Specifies the entity(s) to be teleported. Must be a player name, a target selector, or a UUID‌.
     *  Permits entities other than players.
     *
     * @param location
     *  Specifies the coordinates to teleport the target(s) to.
     *  May use tilde and caret notation to specify a position relative to the position where the command is executed.
     *
     * @param rotation
     *  Specifies the rotation.
     *  Tilde notation can be used to specify a rotation relative to the target's previous rotation.
     */
    (targets: SelectorArgument<false>, location: Coordinates, rotation: Rotation) => void));
}
