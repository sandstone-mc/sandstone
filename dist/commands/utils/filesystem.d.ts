import { ResourcesTree } from './resourcesTree';
/**
 * Get the .minecraft path
 */
export declare function getMinecraftPath(): string;
/**
 *
 * @param worldName The name of the world
 * @param minecraftPath The optional location of the .minecraft folder.
 * If left unspecified, the .minecraft will be found automatically.
 */
export declare function getWorldPath(worldName: string, minecraftPath?: string | undefined): string;
export declare type SaveOptions = {
    /**
     * The name of the world to save the datapack in.
     * If unspecified, the datapack will be saved to the current folder.
     */
    world?: string;
    /**
     * The location of the `.minecraft` folder.
     * If unspecified, the location of the `.minecraft` folder will be automatically discovered.
     */
    minecraftPath?: string;
    /**
     * If true, will display the resulting commands in the console.
     * Defaults to false.
     */
    verbose?: boolean;
};
/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
export declare function saveDatapack(resources: ResourcesTree, name: string, options: SaveOptions): void;
