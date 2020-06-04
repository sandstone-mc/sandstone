<div align="center"><img src=https://vignette.wikia.nocookie.net/minecraft/images/d/d6/Sandstone.png/></div>

# Sandstone

![GitHub](https://img.shields.io/github/license/TheMrZZ/sandstone) ![GitHub last commit](https://img.shields.io/github/last-commit/TheMrZZ/sandstone?color=blue) ![Version](https://img.shields.io/badge/version-alpha-success)

Sandstone is a Typescript library for Minecraft Datapacks. It allows easy creation, debug and sharing of Minecraft functions, loot tables, predicates etc...

## Features

### Perfect autocompletion

Sandstone tells you what a command expects, and autocomplete complicated arguments for you.

You don't need to remember commands syntax anymore.

![autocomplete](./docs/readme/autocomplete.gif)

This autocompletion works for commands, predicates, loot tables, advancements...

*For the moment, autocompletion only works for commands.*

## Always up-to-date

Sandstone is divided in two parts. The core part is version-agnostic, and the commands part is *automatically generated* for each version of the game.
10 minutes after a new snapshot is released, Sandstone is already updated. You will always have access to **the latest commands**. Minecraft gets new blocks, enchantments, items, mobs? Sandstone knows it, and will autocomplete them for you.

*For the moment, Sandstone has not yet been splitted in two.*

## Easy to share
Sharing commands has **never been easier**. Just publish your functions on NPM, and everyone can use them to improve their own datapacks.

# Getting started

## Installation

The first step is to install [Node.JS](https://nodejs.org/en/). You will then need a code editor: I personnaly recommend [Visual Studio Code](https://code.visualstudio.com/Download).

Create an empty folder named "My Datapack", and run the following commands in order:

```bash
npm init
```

Answer the different questions (nothing of importance here). Then add the needed packages:

```bash
npm add typescript ts-node git+https://git@github.com/TheMrZZ/sandstone.git
npx tsc --init
```

You've now installed Sandstone, congratulations!

## Your first function

Let's write your first Minecraft function. Start VSCode, and open the folder you created. In the directory, create a new file named `helloworld.ts`, with the following content:
```js
import { say, mcfunction, saveDatapack } from 'sandstone'

mcfunction('hello', () => {
  say('Hello world!')
})

saveDatapack('My datapack')
```
To run this file, type the following command in your terminal:

*Hint: to start a Terminal in VSCode, look at the top bar, click on Terminal > New Terminal.*


```bash
npx ts-node helloworld.ts
```

You should see a new folder in your current working directory, named `My datapack`. If you do, congratulations! You just wrote your first Minecraft function using Sandstone.

### Explanation
Let's do a line-by-line explanation.

```js
import { say, mcfunction, saveDatapack } from 'sandstone'
```
This line tells Sandstone what we need to use. Here, we need one command, `say`, and two Sandstone functions, `mcfunction` and `saveDatapack`.


```js
mcfunction('hello', () => {...})
```
This line tells Sandstone we want to create a new mcfunction, called `hello`. We do not have to specify the namespace: here, the default namespace will be used. If you want, you can specify the namespace yourself, like you would in Minecraft: `mynamespace:hello`.
Inside the curly brackets `{...}`, we will specify the commands we want to write inside this mcfunction.

*For the moment, you cannot change the default namespace.*

```js
  say('Hello world!')
```
This line tells Sandstone that we want to write the `/say` command in the current mcfunction, with the `Hello world!` argument. It will result in the command `say Hello world!`.

```js
saveDatapack('My datapack')
```
This line tells Sandstone to save the all mcfunctions to the actual file system. Here, you only specified the datapack's name: it will therefore be saved to your current directory. As a 2nd argument, you can specify a world's name, and it will add the datapack directly to your world.

*Note 1: one day, Sandstone will have its own CLI, and manual saving won't be required anymore.*

## How to write a command

### The basics

In Sandstone, all commands can directly be imported from `sandstone`:

```ts
import { advancement, execute, kill, say, scoreboard } from 'sandstone'
```

When typing a command or a subcommand, there are two possibilities:

* The command/subcommand has several subcommands, like `effect give|clear`. To access a subcommand, access it as a property: `effect.give` or `effect.clear`

* The command/subcommand has no subcommands. It directly has argument, like `enchant`. To specify the arguments, call it as a normal function: `enchant("@a", "minecraft:sharpness")`

A command can have multiple subcommands, which all have arguments: `effect.give('@a', 'minecraft:speed', 30, 2)` or `effect.clear('@a', 'minecraft:night_vision')`.

**Important**: A command is only written to the datapack if it has been called. For example, some commands do not have any arguments, like `/reload`. In Sandstone, you'd have to type `reload()`. Only typing `reload` will **not** call the command, and nothing will appear in your datapacK.

### Optional arguments

In Minecraft, some commands have optional arguments. Let's stay with the `/effect give` command. According to the [Wiki](https://minecraft.gamepedia.com/Commands/effect#Syntax), It has 2 to 5 arguments:

```/effect give <targets> <effect> [<seconds>] [<amplifier>] [<hideParticles>]```

As you can see, the `targets` and the `effect` arguments are **mandatory**. Minecraft doesn't know what to do if you do not provide them. However, the `seconds`, `amplifier` and `hideParticles` arguments are all optionals. If you do not specify them, Minecraft uses default values.

In this aspect, Sandstone is identical to Minecraft. When typing `effect.give()`, your IDE will show you the possible arguments:
![argumentshint1](docs/readme/argumentshint1.png)

On the left, you can see there are 4 different ways to call `effect.give`. The first one is shown here: you can just give a target and an effect, and Minecraft will be happy. If you type them and try to enter a **third** argument, your IDE will automatically show the next possible argument:
![argumentshint2](docs/readme/argumentshint2.png).

It's telling you the third argument is the number of seconds. If you keep going (or type the Down arrow to display all possibilities), you will see that Sandstone allows what Minecraft allows. It's very useful: **you don't have to remember the syntax of all commands**, Sandstone does that for you.

### Execute

Sandstone has a special syntax for the `/execute` command. At its core, it looks just like Minecraft:

```js
execute.as("@a").at("@s")
```

The divergent part is the command call:

```js
// Sets a block of dirt under all players
execute.as("@a").at("@s").setblock('~ ~-1 ~', 'minecraft:dirt')
```

This will result in `execute as @a at @s run setblock ~ ~-1 ~ minecraft:dirt`. As you can see, you **don't specify the run subcommand**. It is automatically infered.

However, the `run` subcommand still exists, but it is used to execute *several commands*:

```js
execute.as("@a").at("@s").run(() => {
  // All this commands are executed "as @a at @s".
  // Sets a block of dirt under all players, and air on their body & head.
  setblock('~ ~-1 ~', 'minecraft:dirt')
  setblock('~ ~ ~', 'minecraft:air')
  setblock('~ ~1 ~', 'minecraft:air')
})
```

If you try running such commands, under a mcfunction named "main", you'll have the following results:

```
==== default:main ====

execute as @a at @s run function default:main/execute_as

================

==== default:main/execute_as ====

setblock ~ ~-1 ~ minecraft:dirt
setblock ~ ~ ~ minecraft:air
setblock ~ ~1 ~ minecraft:air

================
```

As you can see, Sandstone automatically created a new mcfunction for you. It contains all your nested commands (all the setblocks), and is called by the `execute` command. Therefore, you achieve the desired effect **without managing several files youself**.

## Saving the datapack

Using sandstone, you can choose to either save the datapack to the current directory, or to save it directly in one of your Minecraft world. The first argument to the `saveDatapack` method is the name of the datapack. If you only provide this argument, the datapack will be saved to your current directory.

```js
// Save the datapack to the current directory
saveDatapack('My datapack')
```

If you specify the name of one of your Minecraft worlds as second argument, Sandstone will save the datapack in the specified world.

```js
// Save the datapack in "An awesome world"
saveDatapack('My datapack', 'An awesome world')
```

To achieve this, Sandstone automatically detects where your `.minecraft` folder is located. In that case, Sandstone will give you a clear error message. You will then have to manually specify your `.minecraft` location:
```js
// Save the datapack in "An awesome world", in a custom .minecraft folder
saveDatapack('My datapack', 'An awesome world', 'C:/Program Files/.minecraft')
```

# Contributing

For the moment, Sandstone is not opened to external contributions *(honestly, I don't know how to do that)*. However, feel free to open Issues, or to contact @TheMrZZ#9307 on the [Minecraft Commands Discord](https://discord.gg/9wNcfsH) for discussing this project!
