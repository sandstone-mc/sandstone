"use strict";
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { nested, register } from './utils'
// import { Coordinates, Selector } from './variables'
// // import { title } from './commands'
// import Datapack from './commands/Datapack'
// export default class Sandstone {
//   // INTERNALS //
//   protected datapack: Datapack
//   protected arguments: any[]
//   protected inExecute: boolean
//   constructor(datapack: Datapack, baseArguments: any[]) {
//     this.arguments = baseArguments
//     this.datapack = datapack
//     this.inExecute = false
//   }
//   protected reset() {
//     this.arguments = []
//     this.inExecute = false
//   }
//   /**
//    * Register the current arguments as a command.
//    * Resets the object.
//    */
//   protected register(): void {
//     this.datapack.registerCommand(this.arguments)
//     this.reset()
//   }
//   mcfunction(name: string, func: () => void) {
//     this.datapack.enterRootFunction(name)
//     func()
//     this.datapack.exitRootFunction()
//   }
//   /**
//    * Save the datapack to the file system.
//    */
//   save() {
//     this.datapack.save()
//   }
//   /**
//    * Calls a given callback, and ensure no properties is lost from the original Sandstone object
//    */
//   private callCallback(callback: () => void) {
//     // The callback will use the same "Sandstone" object, overriding the current properties. We save them,
//     // reset them, and take them back once the callback is over.
//     const oldProperties = { ...this }
//     this.reset()
//     callback()
//     // Put everything back
//     Object.assign(this, oldProperties)
//   }
//   /**
//    * Enters a new mcfunction, calls the given callback, then exits it.
//    */
//   private enterFunctionCallback(name: string, callback: () => void) {
//     const functionName = this.datapack.enterChildFunction(name)
//     this.callCallback(callback)
//     this.datapack.exitChildFunction()
//     this.function(functionName)
//     return this
//   }
//   // LOOPS //
//   forEach<T>(collection: T[], callback: (item: T) => void) {
//     for (const item of collection) {
//       this.enterFunctionCallback('forEach', callback.bind(this, item))
//     }
//   }
// }
//# sourceMappingURL=Sandstone.js.map