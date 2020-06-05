"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDatapack = exports.getWorldPath = exports.getMinecraftPath = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const minecraft_1 = require("./minecraft");
/**
 * Get the .minecraft path
 */
function getMinecraftPath() {
    function getMCPath() {
        switch (os_1.default.platform()) {
            case 'win32':
                return path_1.default.join(os_1.default.homedir(), 'AppData/Roaming/.minecraft');
            case 'darwin':
                return path_1.default.join(os_1.default.homedir(), 'Library/Application Support/minecraft');
            case 'linux':
            default:
                return path_1.default.join(os_1.default.homedir(), '.minecraft');
        }
    }
    const mcPath = getMCPath();
    if (!fs_1.default.existsSync(mcPath)) {
        throw new Error('Unable to locate the .minecraft folder. Please specify it manually.');
    }
    return mcPath;
}
exports.getMinecraftPath = getMinecraftPath;
/**
 *
 * @param worldName The name of the world
 * @param minecraftPath The optional location of the .minecraft folder.
 * If left unspecified, the .minecraft will be found automatically.
 */
function getWorldPath(worldName, minecraftPath = undefined) {
    let mcPath;
    if (minecraftPath) {
        mcPath = minecraftPath;
    }
    else {
        mcPath = getMinecraftPath();
    }
    const worldPath = path_1.default.join(mcPath, 'saves', worldName);
    if (!fs_1.default.existsSync(worldPath)) {
        throw new Error(`Unable to locate the "${worldPath}" folder. Word ${worldName} does not exists.`);
    }
    return worldPath;
}
exports.getWorldPath = getWorldPath;
/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
function saveDatapack(functions, name, options) {
    const verbose = options?.verbose ?? false;
    let savePath;
    if (options?.world !== undefined) {
        savePath = path_1.default.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks');
    }
    else {
        savePath = process.cwd();
    }
    savePath = path_1.default.join(savePath, name);
    try {
        // Make the directory
        fs_1.default.mkdirSync(savePath);
    }
    catch (e) {
        // The folder already exists - don't do anything
    }
    const dataPath = path_1.default.join(savePath, 'data');
    for (const [fullFunctionName, commandsArgs] of functions) {
        const [namespace, ...foldersAndFile] = fullFunctionName;
        const functionsPath = path_1.default.join(dataPath, namespace, 'functions');
        const fileName = foldersAndFile.pop();
        const folders = foldersAndFile;
        const mcFunctionFolder = path_1.default.join(functionsPath, ...folders);
        // Create the path
        try {
            fs_1.default.mkdirSync(mcFunctionFolder, { recursive: true });
        }
        catch (e) {
            // Folder already exists
        }
        // Write the commands to the file system
        const mcFunctionPath = path_1.default.join(mcFunctionFolder, `${fileName}.mcfunction`);
        // Join the arguments of all commands with spaces
        const commands = commandsArgs.map((commandArgs) => commandArgs.join(' '));
        fs_1.default.writeFileSync(mcFunctionPath, commands.join('\n'));
        if (verbose) {
            const niceName = minecraft_1.toMcFunctionName(fullFunctionName);
            console.log('=====', niceName, '=====');
            console.log(commands.join('\n'));
            console.log(`======${niceName.replace(/./g, '=')}======\n`);
        }
    }
    // Write pack.mcmeta
    fs_1.default.writeFileSync(path_1.default.join(savePath, 'pack.mcmeta'), JSON.stringify({
        pack: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            pack_format: 5,
            description: 'Generated using Sandstone',
        },
    }));
    console.log('Successfully wrote commands to', savePath);
}
exports.saveDatapack = saveDatapack;
//# sourceMappingURL=filesystem.js.map