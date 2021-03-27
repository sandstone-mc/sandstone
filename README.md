<div align="center"><img src=https://vignette.wikia.nocookie.net/minecraft/images/d/d6/Sandstone.png/></div>

# Sandstone

![GitHub](https://img.shields.io/github/license/TheMrZZ/sandstone)
![GitHub last commit](https://img.shields.io/github/last-commit/TheMrZZ/sandstone?color=blue)
![Version](https://img.shields.io/badge/version-alpha-success)
![Discord](https://img.shields.io/discord/800035701243772969?color=%237289DA&label=discord)

Sandstone is a Typescript library for Minecraft Datapacks. It allows easy creation, debug and sharing of Minecraft functions, loot tables, predicates etc...

Interested? Join our Discord:

[![Discord](https://invidget.switchblade.xyz/4tzM5aXDRe)](https://discord.gg/4tzM5aXDRe)

## Features

## 💻 Perfect autocompletion & IDE support

Sandstone tells you what a command expects, and autocompletes complicated arguments for you.

You don't need to remember commands syntax anymore.

![autocomplete](https://raw.githubusercontent.com/TheMrZZ/sandstone/4d3d74210b74ccf0bb807b90c35c1920ce1aa44a/docs/readme/autocomplete.gif)

This autocompletion works for all resources: commands, predicates, loot tables, advancements...

## 📂 Better organisation of resources
You can have multiple functions, advancements, loot tables per files - or you can keep the vanilla organisation, and have only 1 per file. Sandstone allows you to organise your data pack as you prefer, without sticking to Mojang's conventions.

You also benefit from all the capabilities of a real programming language: multiline comments, indentation, documentation...

## 🚀 Useful and heavily optimized abstractions

Sandstone includes common and heavily optimized abstractions:
- Control statements, with `if`, `else if` and `else`
- Boolean logic, with `or`, `and` and `not`
- Loops, with `while` and `for`
- Sleep statement, which waits a certain time before running the next commands

These statements are most of the time more optimized than hand-written code, since they switch between different implementations to get the fastest one. They have been studied and designed for performance.

However, you stay free: you can keep using only vanilla commands, if you prefer - Sandstone does not get in your way.

## 👐 Easy to share
Sharing commands has **never been easier**. Just publish your functions on NPM, and everyone can use them to improve their own datapacks. Whether it's some common code like raycasting, or some new abstractions like better `/tellraw`, the Sandstone ecosystem grows by the day.

You can finally stop reinventing the wheel.

# Supporting Sandstone

If you want to support Sandstone, the simplest way is to star the repository! It's actually very encouraging.
![stars](https://raw.githubusercontent.com/TheMrZZ/sandstone/master/star.png)

# Getting started

See the [Getting Started](https://www.sandstone.dev/docs/) section on [sandstone.dev](https://www.sandstone.dev/) to start using Sandstone!
