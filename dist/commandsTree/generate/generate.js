"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsJsonToJS = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const treeModifiers_1 = require("./treeModifiers");
const utils_1 = require("./utils");
async function commandsJsonToJS(commandsJsonPath, registriesJsonPath) {
    console.log('Reading file', commandsJsonPath, '...');
    const data = await promises_1.default.readFile(commandsJsonPath);
    const commandsTree = JSON.parse(data.toString('utf-8'));
    // Delete the 'run' sub-command, to be able to directly call execute.as().at().say('Hello!')
    delete commandsTree.children.execute.children.run;
    commandsTree.children.execute.children.run = {
        type: 'literal',
        children: {
            callback: {
                type: 'argument',
                executable: true,
                parser: 'sandstone:callback',
            },
        },
    };
    delete commandsTree.children.list;
    // Remove commands that are not usable by datapacks.
    treeModifiers_1.removeOpCommands(commandsTree);
    // Change all commands to camel case
    treeModifiers_1.commandsToCamelCase(commandsTree);
    // Normalize all nodes
    treeModifiers_1.normalizeNodes(commandsTree);
    // Merge literal siblings
    treeModifiers_1.mergeLiteralSiblings(commandsTree);
    // Now, literals with only 1 possibility (like "as", it only has the "targets" child) should be collapsed
    // to 1 node with the "literalArgument" type.
    treeModifiers_1.setLiteralArguments(commandsTree);
    // Literal leafs should be literalArguments too
    treeModifiers_1.setLeafLiteralsToArguments(commandsTree);
    // Change argument types of "biome" and "sound" to a custom type
    // (instead of the generic "resource_location" which can be used for nbts, functions, etc...),
    // so we can provide autocompletion.
    treeModifiers_1.changeBiomeSoundParser(commandsTree);
    // Map parsers to IDs. We're going to transform each parser into a TypeScript type later.
    const compoundTypesMap = treeModifiers_1.setParserIds(commandsTree);
    // Make all execute subcommands both redirect to execute & root
    treeModifiers_1.redirectExecutesToRoot(commandsTree);
    // Remove all useless properties
    treeModifiers_1.cleanUselessProperties(commandsTree);
    /** Output dir for our commands tree */
    const parentDir = path_1.default.join(__dirname, '..');
    /** Output dir for our generated types */
    const typesDir = path_1.default.join(parentDir, 'types/');
    const commandsTemplate = await promises_1.default.readFile(path_1.default.join(__dirname, 'templateCommands'));
    await promises_1.default.writeFile(path_1.default.join(parentDir, 'commands.ts'), commandsTemplate.toString('utf-8').replace(/\$1/g, utils_1.toJS(commandsTree, false)));
    console.log('Successfully wrote commands tree.');
    /**
     * This types map links multi-argument commands to their corresponding TypeScript types.
     */
    const typesMapResult = [...compoundTypesMap.entries()].map(([id, parserInfo]) => {
        const { arguments: names, parsers, literalValues } = parserInfo;
        if (parsers.length) {
            return `${id}:\n    ${parsers.map((types, parserIndex) => {
                function getResultingType(i) {
                    if (types[i] === 'sandstone:literals') {
                        return literalValues[i].map((v) => `'${v}'`).join(' | ');
                    }
                    return `ParsersMap['${types[i]}']`;
                }
                const funcArgs = types.map((_, i) => `${utils_1.safeName(names[i])}: ${getResultingType(i)}`).join(', ');
                return `((${funcArgs}) => returnType)`;
            }).join(' &\n    ')}`;
        }
        // Node with no arguments
        return `${id}:\n    () => returnType`;
    }).join('\n  ');
    /** Read the template for types map */
    const parsersMapTemplate = await promises_1.default.readFile(path_1.default.join(__dirname, 'templateParsersIdMap'));
    await promises_1.default.writeFile(path_1.default.join(typesDir, 'parsersIdMap.ts'), parsersMapTemplate.toString('utf-8').replace(/\$1/g, typesMapResult));
    console.log('Successfully wrote types map.');
    // Now, we are going to generate all possibilities for the following types, from registries.json.
    // These possibilities are not restrictive, they are only here for autocomplete.
    const toGenerate = new Set(['block', 'sound_event', 'mob_effect', 'enchantment', 'entity_type', 'item', 'biome', 'particle_type', 'dimension_type', 'attributes']);
    const registries = JSON.parse((await promises_1.default.readFile(registriesJsonPath)).toString());
    const promises = [];
    for (const type of toGenerate) {
        const { entries } = registries[`minecraft:${type}`];
        const values = Object.keys(entries);
        // The name of the type will be uppercase, and pluzalized if not already
        const typeName = type.toUpperCase() + (type.endsWith('s') ? '' : 'S');
        const result = `/* eslint-disable */\n/* Auto-generated */\nexport type ${typeName} = ${values.map((v) => `'${v}'`).join(' | ')}`;
        promises.push(promises_1.default.writeFile(path_1.default.join(typesDir, `${type}.ts`), result));
    }
    await Promise.allSettled(promises);
    console.log('All types successfully generated:', ...toGenerate);
    console.log('Auto-generation suceeded.');
}
exports.commandsJsonToJS = commandsJsonToJS;
if (require.main !== module) {
    console.error('This script is not made to be imported, but used via CLI.');
}
else if (process.argv.length !== 4) {
    console.error('Incorrect number of arguments.\nUsage: ts-node generate.ts path/to/commands.json path/to/registries.json');
}
else {
    commandsJsonToJS(process.argv[2], process.argv[3]);
}
//# sourceMappingURL=generate.js.map