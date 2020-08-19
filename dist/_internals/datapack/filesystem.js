"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDatapack = exports.getWorldPath = exports.getMinecraftPath = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
 * Create a directory.
 */
function createDirectory(directory) {
    // Create the path
    try {
        fs_1.default.mkdirSync(directory, { recursive: true });
    }
    catch (e) {
        // Folder already exists
    }
}
/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
function saveDatapack(resources, name, options) {
    var _a;
    const verbose = (_a = options === null || options === void 0 ? void 0 : options.verbose) !== null && _a !== void 0 ? _a : false;
    let savePath;
    if ((options === null || options === void 0 ? void 0 : options.world) !== undefined) {
        savePath = path_1.default.join(getWorldPath(options === null || options === void 0 ? void 0 : options.world, options === null || options === void 0 ? void 0 : options.minecraftPath), 'datapacks');
    }
    else {
        savePath = process.cwd();
    }
    savePath = path_1.default.join(savePath, name);
    createDirectory(savePath);
    const dataPath = path_1.default.join(savePath, 'data');
    function logFunction(resource) {
        if (resource.isResource) {
            const [namespace, ...folders] = resource.path;
            const commands = resource.commands.map((args) => args.join(' '));
            const functionsPath = path_1.default.join(dataPath, namespace, 'functions');
            const fileName = folders.pop();
            const mcFunctionFolder = path_1.default.join(functionsPath, ...folders);
            createDirectory(mcFunctionFolder);
            // Write the commands to the file system
            const mcFunctionPath = path_1.default.join(mcFunctionFolder, `${fileName}.mcfunction`);
            fs_1.default.writeFileSync(mcFunctionPath, commands.join('\n'));
            const GREEN = '\x1b[32m';
            const RESET = '\x1b[0m';
            if (options.verbose) {
                console.log(GREEN + '#', `${namespace}:${[...folders, fileName].join('/')}` + RESET);
                console.log(commands.join('\n'));
                console.log();
            }
        }
        Array.from(resource.children.values()).forEach(logFunction);
    }
    for (const n of resources.namespaces.values()) {
        for (const f of n.functions.values()) {
            logFunction(f);
        }
    }
    console.log(`Successfully wrote commands to "${savePath}"`);
}
exports.saveDatapack = saveDatapack;
//# sourceMappingURL=filesystem.js.map