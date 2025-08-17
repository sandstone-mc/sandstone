/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
import { VectorClass } from 'sandstone/variables'

import { ContainerNode } from '../../nodes.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'

const assert = (condition: any, errorMessage: string) => {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

type ElementFace = {
  texture: `#${string}`
  uv?: [number, number, number, number]
  cullface?: 'north' | 'east' | 'south' | 'west' | 'up' | 'down'
  rotation?: 0 | 90 | 180 | 270
  tintindex?: number
}

/**
 * The maximum custom model data is the maximum integer a float can store
 * without losing precision because the predicate value is internally converted
 * to a float
 */
export const MAX_CUSTOM_MODEL_DATA = 16777216

/**
 * @see https://minecraft.wiki/w/Model
 */
export type ModelData = {
  parent?: string
  /**
   * Whether to shade the block using ambient occlusion
   * @see https://en.wikipedia.org/wiki/Ambient_occlusion
   */
  ambientocclusion?: boolean
  textures?: { particle?: string } & { [name: string]: string }
  display?: Partial<
    Record<
      DisplayPosition,
      Partial<{
        rotation: [number, number, number]
        translation: [number, number, number]
        scale: [number, number, number]
      }>
    >
  >
  elements?: {
    from: [number, number, number]
    to: [number, number, number]
    rotation?: {
      origin: [number, number, number]
      axis: 'x' | 'y' | 'z'
      angle: -45 | -22.5 | 0 | 22.5 | 45
      rescale?: boolean
    }
    shade?: boolean
    faces?: {
      down?: ElementFace
      up?: ElementFace
      north?: ElementFace
      east?: ElementFace
      south?: ElementFace
      west?: ElementFace
    }
  }[]
  overrides?: {
    predicate: Partial<Record<OverridePredicate, number>>
    model: string
  }[]
}

const DisplayPositions = [
  'thirdpirson_righthand',
  'thirdpirson_lefthand',
  'firstpirson_righthand',
  'firstpirson_lefthand',
  'gui',
  'head',
  'ground',
  'fixed',
] as const

type DisplayPosition = (typeof DisplayPositions)[number]

const OverridePredicates = [
  'angle',
  'blocking',
  'broken',
  'cast',
  'cooldown',
  'damage',
  'damaged',
  'lefthanded',
  'pull',
  'pulling',
  'charged',
  'firework',
  'throwing',
  'time',
  'custom_model_data',
  'trim_material',
] as const

/**
 * - `angle` Used on compasses to determine the current angle, expressed in a decimal value of less than one.
 * - `blocking` Used on shields to determine if currently blocking. If `1`, the player is blocking.
 * - `broken` Used on Elytra to determine if broken. If `1`, the Elytra is broken.
 * - `cast` Used on fishing rods to determine if the fishing rod has been cast. If `1`, the fishing rod has been cast.
 * - `cooldown` Used on ender pearls and chorus fruit to determine the remaining cooldown, expressed in a decimal value between `0` and `1`.
 * - `damage` Used on items with durability to determine the amount of damage, expressed in a decimal value between `0` and `1`.
 * - `damaged` Used on items with durability to determine if it is damaged. If 1, the item is damaged. Note that if an item has the unbreakable tag,
 * this may be `0` while the item has a non-zero `'damage'` tag.
 * - `lefthanded` Determines the model used by left handed players. It affects the item they see in inventories, along with the item players see them holding or wearing.
 * - `pull` Determines the amount a bow or crossbow has been pulled, expressed in a decimal value of less than one.
 * - `pulling` Used on bows and crossbows to determine if the bow is being pulled. If `1`, the bow is currently being pulled.
 * - `charged` Used on crossbows to determine if they are charged with any projectile. If `1`, the crossbow is charged.
 * - `firework` Used on crossbows. If `1`, the crossbow is charged with a firework rocket.
 * - `throwing` Used on the trident to determine if the trident is ready to be thrown by the player. If `1`, the trident is ready for fire.
 * - `time` Used on clocks to determine the current time, expressed in a decimal value of less than one.
 * - `custom_model_data` Used on any item and is compared to the CustomModelData NBT, expressed in an integer value. The number is still internally converted to
 * float, causing a precision loss for some numbers above 16 million. If the value read from the item data is greater than or equal to the value used for the predicate, the predicate is positive.
 */
type OverridePredicate = (typeof OverridePredicates)[number]

export class ModelNode extends ContainerNode implements ResourceNode<ModelClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ModelClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.toJSON())
}

export type ModelClassArguments = {
  /**
   * The model's path or its JSON.
   */
  model?: string | ModelData
} & ResourceClassArguments<'default'>

/**
 * Helper class for modifying Minecraft model data
 */
export class ModelClass extends ResourceClass<ModelNode> {
  existingPath?: string

  parent: string | null = null

  ambientocclusion: boolean = true

  textures: { [name: string]: string } = {}

  elements: ElementClass[] = []

  display: { [type in DisplayPosition]?: DisplayTransformClass } = {}

  // TODO: Helper methods
  overrides: ModelData['overrides'] = []

  constructor(
    core: SandstoneCore,
    public type: 'block' | 'item',
    name: string,
    args: ModelClassArguments,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      ModelNode,
      core.pack.resourceToPath(name, ['models', type]),
      args,
    )

    const data = args.model
    if (data) {
      if (typeof data === 'string') {
        this.existingPath = data
      } else {
        this.fromJSON(data)
      }
    }

    this.handleConflicts()
  }

  toString = () => `${this.path[0]}:${this.path.slice(2)}`

  /**
   * Generates the Minecraft model JSON
   */
  toJSON(): ModelData {
    const obj: ModelData = {}

    if (this.parent) {
      obj.parent = this.parent
    }
    if (Object.keys(this.textures).length > 0) {
      obj.textures = this.textures
    }

    if (!this.ambientocclusion) {
      obj.ambientocclusion = false
    }
    if (this.elements && this.elements.length > 0) {
      obj.elements = this.elements.map((e) => e.toJSON())
    }
    if (Object.keys(this.display).length > 0) {
      obj.display = {}

      const entries = Object.entries(this.display) as [DisplayPosition, DisplayTransformClass][]

      entries.forEach(([type, t]) => {
        obj.display![type] = t.toJSON()
      })
    }
    if (this.overrides && this.overrides.length > 0) {
      obj.overrides = this.overrides
    }

    return obj
  }

  generatedItem(...layers: string[]): ModelData {
    const textures: ModelData['textures'] = {}
    layers.forEach((texture, idx) => {
      textures[`layer${idx}`] = texture
    })
    return {
      parent: 'minecraft:item/generated',
    }
  }

  fromJSON(data: ModelData) {
    if (data.parent) {
      this.parent = data.parent
    }
    if (data.textures) {
      this.textures = data.textures
    }
    if (data.display) {
      Object.values(DisplayPositions)
        .filter((t) => t in data.display!)
        .forEach((t) => {
          this.display[t] = new DisplayTransformClass(data.display?.[t]!)
        })
    }
    if (typeof data.ambientocclusion === 'boolean') {
      this.ambientocclusion = data.ambientocclusion
    }
    if (data.elements) {
      this.elements = data.elements.map((element) => new ElementClass(element))
    }
    if (data.overrides) {
      this.overrides = data.overrides
    }
  }

  async load() {
    this.fromJSON(JSON.parse(await this.core.getExistingResource(this)))

    return this
  }
}

type ElementArguments = NonNullable<NonNullable<ModelData['elements']>[0]>

/**
 * Helper class for modifying model elements (cubes)
 */
export class ElementClass {
  to: Vector3

  from: Vector3

  faces: NonNullable<ElementArguments['faces']> = {}

  rotation: ElementArguments['rotation']

  shade: boolean = true

  /**
   * Creates a new cube without any faces
   */
  constructor(data: ElementArguments) {
    this.to = new Vector(...data.to)

    this.from = new Vector(...data.from)

    if (data.faces) this.faces = data.faces
    if (data.rotation) this.rotation = data.rotation
    if (data.shade) this.shade = data.shade
  }

  hasFace(face: BlockFace): boolean {
    if (this.hasFaces) {
      return face.name in this.faces
    }
    return false
  }

  get hasFaces(): boolean {
    return Object.keys(this.faces).length > 0
  }

  setFace(blockFace: BlockFace, face: ElementFace) {
    this.faces[blockFace.name] = face
  }

  deleteFace(blockFace: BlockFace) {
    delete this.faces[blockFace.name]
  }

  /**
   * Returns a new element with only the filtered faces
   */
  filterFaces(predicate: (blockFace: BlockFace, face: ElementFace) => boolean): ElementClass {
    const clone = this.clone()

    const faces = Object.entries(this.faces) as [BlockFaceName, ElementFace][]

    faces
      .filter(([fname, face]) => predicate(BlockFace.fromName(fname), face))
      .forEach(([fname, face]) => {
        clone.faces[fname] = face
      })
    return clone
  }

  /**
   * Gets the culling for a face
   */
  getFaceCull(face: BlockFace): BlockFace {
    const _face = this.faces[face.name]
    return _face?.cullface ? BlockFace.fromName(_face.cullface) : face
  }

  /**
   * Returns a shallow copy of this element
   */
  clone(): ElementClass {
    const clone = new ElementClass(this.toJSON())

    clone.rotation = this.rotation
    clone.shade = this.shade

    return clone
  }

  /**
   * Generates the Minecraft model JSON
   */
  toJSON(): ElementArguments {
    const obj: ElementArguments = {
      from: this.from.components,
      to: this.to.components,
    }

    if (this.hasFaces) {
      obj.faces = this.faces
    }
    if (this.rotation) {
      obj.rotation = this.rotation
    }
    if (!this.shade) {
      obj.shade = false
    }

    return obj
  }
}

type DisplayTransformArguments = NonNullable<NonNullable<ModelData['display']>['head']>

/**
 * Helper class for modifying the model transformation when displayed
 */
export class DisplayTransformClass {
  rotation: Vector3 = Vector3Props.ZERO

  translation: Vector3 = Vector3Props.ZERO

  scale: Vector3 = Vector3Props.ONE

  constructor(data: DisplayTransformArguments) {
    if (data.rotation) this.rotation = new Vector(data.rotation)
    if (data.translation) this.translation = new Vector(data.translation)
    if (data.scale) this.scale = new Vector(data.scale)
  }

  /**
   * Returns a shallow copy of this transform
   */
  clone(): DisplayTransformClass {
    const clone = new DisplayTransformClass(this.toJSON())

    clone.rotation = this.rotation
    clone.translation = this.translation
    clone.scale = this.scale

    return clone
  }

  toJSON(): NonNullable<DisplayTransformArguments> {
    const obj: DisplayTransformArguments = {}

    if (this.rotation.every((n) => n === 0)) obj.rotation = this.rotation.components
    if (this.translation.every((n) => n === 0)) obj.translation = this.translation.components
    if (this.scale.every((n) => n === 1)) obj.scale = this.scale.components

    return obj
  }
}

/**
 * All possible values of an index for a specific array as a type.
 * @example
 * ```ts
 * const array = [2, 3, 6, 9, 'f'] as const
 * type Index = 0 | 1 | 2 | 3 | 4
 * type Index = IndexOf<typeof array>
 * ```
 */
type IndexOf<A extends unknown[] | readonly unknown[]> = _IndexOf<A>
type _IndexOf<A extends unknown[] | readonly unknown[], _S extends number[] = []> = _S['length'] extends A['length']
  ? _S[number]
  : _IndexOf<A, [_S['length'], ..._S]>
/**
 * An array of type T with length L.
 * This is a short way of writing homogenous array types with a fixed length
 * and is at the same time more readable.
 * @example
 * ```ts
 * type Vec4 = [number, number, number, number]
 * type Vec4 = ArrayOfLength<4, number>
 * ```
 */
type ArrayOfLength<L extends number, T> = _ArrayOfLength<L, T>
type _ArrayOfLength<L extends number, T, _S extends T[] = []> = _S['length'] extends L
  ? _S
  : _ArrayOfLength<L, T, [..._S, T]>

/**
 * Enumerates all numbers from 0 to exlusively A as a type.
 * @example
 * ```ts
 * type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
 * type Digits = EnumerateInt<10>
 * ```
 */
type EnumerateInt<A extends number> = _EnumerateInt<A>
type _EnumerateInt<A extends number, _S extends number[] = []> = A extends _S['length']
  ? _S[number]
  : _EnumerateInt<A, [..._S, _S['length']]>

/**
 * Enumerates all numbers from A to exclusively B as a type.
 * @example
 * ```
 * type Nums = 2 | 3 | 4 | 5
 * type Nums = EnumerateRange<2, 6>
 * ```
 */
// type EnumerateRange<A extends number, B extends number> = _EnumerateRange<B, ArrayOfLength<A, 0>>
// type _EnumerateRange<A extends number, B extends number[], C extends number[] = []> = A extends B['length']
//  ? C[number]
//  : _EnumerateRange<A, [...B, 0], [...C, B['length']]>

/**
 * Get the length of an array as a type.
 */
// type Length<A extends unknown[] | readonly unknown[]> = A['length']

type Stringifyable = string | number | bigint | boolean | null | undefined
type StringifyList<L extends Stringifyable[] | readonly Stringifyable[]> = _StringifyList<L>
type _StringifyList<
  L extends Stringifyable[] | readonly Stringifyable[],
  R extends string[] = [],
> = L['length'] extends R['length'] ? R : _StringifyList<L, [...R, `${L[R['length']]}`]>
type PrefixStrings<P extends Stringifyable, S extends Stringifyable[] | readonly Stringifyable[]> = _PrefixStrings<P, S>
type _PrefixStrings<
  P extends Stringifyable,
  S extends Stringifyable[] | readonly Stringifyable[],
  R extends string[] = [],
> = S['length'] extends R['length'] ? R : _PrefixStrings<P, S, [...R, `${P}${S[R['length']]}`]>

// Compatible vector / array
type CArray<T extends readonly number[]> = ArrayOfLength<T['length'], number>
type CVector<T extends readonly number[]> = Vector<CArray<T>>

// type Vector4 = Vector<ArrayOfLength<4, number>>
type Vector3 = Vector<ArrayOfLength<3, number>>
// type Vector2 = Vector<ArrayOfLength<2, number>>

class Vector<T extends number[]> {
  readonly dimensions: T['length']

  private readonly _values: Readonly<T>

  /**
   * This is a strict vector constructor. In some cases it is useful because
   * Typescript knows the exact inner values, though this may lead to some type
   * incompatibility issues. Prefer to use the dedicated `vec2/3/4/N` functions.
   */
  constructor(vector: Readonly<T> | Vector<T>)

  constructor(...vector: T)

  constructor(...args: T | [T] | [Vector<T>]) {
    if (typeof args[0] === 'number') {
      this._values = args.slice() as T
    } else {
      const arg = args[0] as T | Vector<T>
      if (arg instanceof Vector) {
        this._values = arg._values
      } else {
        this._values = arg
      }
    }
    this.dimensions = args.length
    Object.freeze(this._values)
    Object.freeze(this)
  }

  /**
   * Gets a component of this vector
   */
  get<I extends IndexOf<T>>(idx: I): T[I]

  get(idx: number): T[number] | undefined

  get(idx: number): T[number] | undefined {
    return this._values[idx]
  }

  get components(): T {
    return Object.freeze(this._values.slice()) as T
  }

  get lengthSquared() {
    return this._values.reduce((a, b) => a + b * b, 0)
  }

  get length() {
    return Math.sqrt(this.lengthSquared)
  }

  [Symbol.iterator]() {
    return this._values[Symbol.iterator]()
  }

  every(predicate: (value: T[IndexOf<T>], index: IndexOf<T>) => boolean): boolean {
    return this._values.every(predicate as any)
  }

  /**
   * Dot product
   */
  dot(...vector: CArray<T>): number

  dot(...vector: [CVector<T>]): number

  dot(...args: CArray<T> | [CVector<T>]): number {
    // @ts-ignore TS is broken here
    if (typeof args[0] === 'number') {
      // @ts-ignore TS is broken here
      assert(args.length === this.dimensions, 'Vectors do not have a matching length')
      // @ts-ignore TS is broken here
      return this._values.map((n, i) => n * (args as T)[i as IndexOf<T>]).reduce((a, b) => a + b)
    }
    // @ts-ignore TS is broken here
    const other = args[0] as Vector<T>
    assert(other.dimensions === this.dimensions, 'Vectors do not have a matching length')
    // @ts-ignore TS is broken here
    return this._values.map((n, i) => n * other._values[i as IndexOf<T>]).reduce((a, b) => a + b)
  }

  /**
   * Applies a map function to each component
   */
  map(mapFn: (n: T[IndexOf<T>], i: IndexOf<T>) => number): CVector<T> {
    // @ts-ignore TS can't handle the types
    return new Vector(this._values.map(mapFn as (n: number, i: number) => number)) as CVector<T>
  }

  round(): Vector<T> {
    // @ts-ignore TS broken https://github.com/Microsoft/TypeScript/issues/29112
    return this.map(Math.round)
  }

  floor(): Vector<T> {
    // @ts-ignore TS broken https://github.com/Microsoft/TypeScript/issues/29112
    return this.map(Math.floor)
  }

  ceil(): Vector<T> {
    // @ts-ignore TS broken https://github.com/Microsoft/TypeScript/issues/29112
    return this.map(Math.ceil)
  }

  square(): Vector<T> {
    // @ts-ignore TS broken https://github.com/Microsoft/TypeScript/issues/29112
    return this.map((n) => n * n)
  }

  add(vector: CVector<T>): CVector<T>

  add(...vector: CArray<T>): CVector<T>

  add(all: number): CVector<T>

  add(...args: CArray<T> | [CVector<T>] | [number]): CVector<T> {
    // @ts-ignore TS is broken here
    if (typeof args[0] === 'number') {
      // @ts-ignore TS is broken here
      assert(args.length === this.dimensions, 'Vectors do not have a matching length')
      // @ts-ignore TS can't handle the types
      return new Vector(Object.freeze(this._values.map((n, i) => n + (args as any)[i]))) as Vector<T>
    }
    // @ts-ignore TS is broken here
    const other = args[0]
    if (other instanceof Vector) {
      assert(other.dimensions === this.dimensions, 'Vectors do not have a matching length')
      return new Vector<CArray<T>>(
        Object.freeze(this._values.map<number>((n, i) => n + other._values[i]!) as any),
      ) as unknown as CVector<T>
    }
    return new Vector(Object.freeze(this._values.map((n) => n + other))) as unknown as CVector<T>
  }

  sub(vector: CVector<T>): CVector<T>

  sub(...vector: CArray<T>): CVector<T>

  sub(all: number): CVector<T>

  sub(...args: CArray<T> | [CVector<T>] | [number]): CVector<T> {
    // @ts-ignore TS is broken here
    if (typeof args[0] === 'number') {
      // @ts-ignore TS is broken here
      assert(args.length === this.dimensions, 'Vectors do not have a matching length')
      // @ts-ignore TS can't handle the types
      return new Vector(Object.freeze(this._values.map((n, i) => n - (args as any)[i]))) as Vector<T>
    }
    // @ts-ignore TS is broken here
    const other = args[0]
    if (other instanceof Vector) {
      assert(other.dimensions === this.dimensions, 'Vectors do not have a matching length')
      return new Vector<CArray<T>>(
        Object.freeze(this._values.map<number>((n, i) => n - other._values[i]!) as any),
      ) as unknown as CVector<T>
    }
    return new Vector(Object.freeze(this._values.map((n) => n - other))) as unknown as CVector<T>
  }

  mul(vector: CVector<T>): CVector<T>

  mul(...vector: CArray<T>): CVector<T>

  mul(all: number): CVector<T>

  mul(...args: CArray<T> | [CVector<T>] | [number]): CVector<T> {
    // @ts-ignore TS is broken here
    if (typeof args[0] === 'number') {
      // @ts-ignore TS is broken here
      assert(args.length === this.dimensions, 'Vectors do not have a matching length')
      // @ts-ignore TS can't handle the types
      return new Vector(Object.freeze(this._values.map((n, i) => n * (args as any)[i]))) as Vector<T>
    }
    // @ts-ignore TS is broken here
    const other = args[0]
    if (other instanceof Vector) {
      assert(other.dimensions === this.dimensions, 'Vectors do not have a matching length')
      return new Vector<CArray<T>>(
        Object.freeze(this._values.map<number>((n, i) => n * other._values[i]!) as any),
      ) as unknown as CVector<T>
    }
    return new Vector(Object.freeze(this._values.map((n) => n * other))) as unknown as CVector<T>
  }

  div(vector: CVector<T>): CVector<T>

  div(...vector: CArray<T>): CVector<T>

  div(all: number): CVector<T>

  div(...args: CArray<T> | [CVector<T>] | [number]): CVector<T> {
    // @ts-ignore TS is broken here
    if (typeof args[0] === 'number') {
      // @ts-ignore TS is broken here
      assert(args.length === this.dimensions, 'Vectors do not have a matching length')
      // @ts-ignore TS can't handle the types
      return new Vector(Object.freeze(this._values.map((n, i) => n / (args as any)[i]))) as Vector<T>
    }
    // @ts-ignore TS is broken here
    const other = args[0]
    if (other instanceof Vector) {
      assert(other.dimensions === this.dimensions, 'Vectors do not have a matching length')
      return new Vector<CArray<T>>(
        Object.freeze(this._values.map<number>((n, i) => n / other._values[i]!) as any),
      ) as unknown as CVector<T>
    }
    return new Vector(Object.freeze(this._values.map((n) => n / other))) as unknown as CVector<T>
  }

  toCoordsAbs(): VectorClass<StringifyList<T>> {
    return new VectorClass(this._values.map((n) => `${n}` as const) as StringifyList<T>)
  }

  toCoordsRel(): VectorClass<PrefixStrings<'~', T>> {
    return new VectorClass(this._values.map((n) => `~${n}` as const) as PrefixStrings<'~', T>)
  }

  toCoordsLoc(): VectorClass<PrefixStrings<'^', T>> {
    return new VectorClass(this._values.map((n) => `^${n}` as const) as PrefixStrings<'^', T>)
  }
}

// const _Vector2Props = {
//   ZERO: new Vector(0, 0) as Vector2,
//   ONE: new Vector(1, 1) as Vector2,
// }

// function vec2(x: number, y: number): Vector2
// function vec2(array: ArrayOfLength<2, number>): Vector2
// function vec2(vector: Vector2): Vector2
// function vec2(x: number | ArrayOfLength<2, number> | Vector2, y?: number): Vector2 {
//   if (typeof x === 'number') {
//     return new Vector(x, y!)
//   }
//   return new Vector(x)
// }

const Vector3Props = {
  ZERO: new Vector(0, 0, 0) as Vector3,
  ONE: new Vector(1, 1, 1) as Vector3,
}

// function vec3(x: number, y: number, z: number): Vector3
// function vec3(array: ArrayOfLength<3, number>): Vector3
// function vec3(vector: Vector3): Vector3
// function vec3(x: number | ArrayOfLength<3, number> | Vector3, y?: number, z?: number): Vector3 {
//   if (typeof x === 'number') {
//     return new Vector(x, y!, z!)
//   }
//   return new Vector(x)
// }

// const _Vector4Props = {
//   ZERO: new Vector(0, 0, 0, 0) as Vector4,
//   ONE: new Vector(1, 1, 1, 1) as Vector4,
// }

// function vec4(x: number, y: number, z: number, w: number): Vector4
// function vec4(array: ArrayOfLength<4, number>): Vector4
// function vec4(vector: Vector4): Vector4
// function vec4(x: number | ArrayOfLength<4, number> | Vector4, y?: number, z?: number, w?: number): Vector4 {
//   if (typeof x === 'number') {
//     return new Vector(x, y!, z!, w!)
//   }
//   return new Vector(x)
// }

// function vecN<N extends number>(...comps: ArrayOfLength<N, number>): Vector<ArrayOfLength<N, number>>
// function vecN<N extends number>(array: ArrayOfLength<N, number>): Vector<ArrayOfLength<N, number>>
// function vecN<N extends number>(vector: ArrayOfLength<N, number>): Vector<ArrayOfLength<N, number>>
// function vecN<N extends number>(
//   ...args: ArrayOfLength<N, number> | [ArrayOfLength<N, number> | Vector<ArrayOfLength<N, number>>]
// ): Vector<ArrayOfLength<N, number>> {
//   if (typeof (args as unknown[])[0] === 'number') {
//     return new Vector(args as ArrayOfLength<N, number>)
//   }
//   return new Vector((args as unknown[])[0] as ArrayOfLength<N, number> | Vector<ArrayOfLength<N, number>>)
// }

export type BlockFaceName = 'north' | 'east' | 'south' | 'west' | 'up' | 'down'
export type BlockAxisName = 'x' | 'y' | 'z'

type Unconst<A extends readonly unknown[], _S extends unknown[] = []> = A['length'] extends _S['length']
  ? _S
  : Unconst<A, [..._S, A[_S['length']]]>

export class BlockFace<
  Name extends BlockFaceName = BlockFaceName,
  Idx extends EnumerateInt<6> = EnumerateInt<6>,
  Normal extends Readonly<ArrayOfLength<3, -1 | 0 | 1>> = Readonly<ArrayOfLength<3, -1 | 0 | 1>>,
  OppositeName extends 'North' | 'East' | 'South' | 'West' | 'Up' | 'Down' =
    | 'North'
    | 'East'
    | 'South'
    | 'West'
    | 'Up'
    | 'Down',
> {
  public static readonly North = new BlockFace('north' as const, 0, [0, 0, -1] as const, 'South' as const)

  public static readonly East = new BlockFace('east' as const, 1, [1, 0, 0] as const, 'West' as const)

  public static readonly South = new BlockFace('south' as const, 2, [0, 0, 1] as const, 'North' as const)

  public static readonly West = new BlockFace('west' as const, 3, [-1, 0, 0] as const, 'East' as const)

  public static readonly Up = new BlockFace('up' as const, 4, [0, 1, 0] as const, 'Down' as const)

  public static readonly Down = new BlockFace('down' as const, 5, [0, -1, 0] as const, 'Up' as const)

  public static fromName(name: 'north'): (typeof BlockFace)['North']

  public static fromName(name: 'east'): (typeof BlockFace)['East']

  public static fromName(name: 'south'): (typeof BlockFace)['South']

  public static fromName(name: 'west'): (typeof BlockFace)['West']

  public static fromName(name: 'up'): (typeof BlockFace)['Up']

  public static fromName(name: 'down'): (typeof BlockFace)['Down']

  public static fromName(name: BlockFaceName): BlockFace

  public static fromName(name: string): BlockFace | null

  public static fromName(name: string): BlockFace | null {
    switch (name) {
      case 'north':
        return this.North
      case 'east':
        return this.East
      case 'south':
        return this.South
      case 'west':
        return this.West
      case 'up':
        return this.Up
      case 'down':
        return this.Down
      default:
        return null
    }
  }

  public static [Symbol.iterator]() {
    return BLOCK_FACES[Symbol.iterator]()
  }

  public static get filter() {
    return BLOCK_FACES.filter
  }

  public static forEach(callback: (face: BlockFace, id: number) => void) {
    BLOCK_FACES.forEach((face, id) => callback(face, id))
  }

  public readonly opposite!: (typeof BlockFace)[OppositeName]

  /* @ts-ignore */
  public readonly normal: Vector<Unconst<Normal>>

  public readonly isSide: Name extends 'north' | 'east' | 'south' | 'west' ? true : false

  public readonly axis: Name extends 'east' | 'west' ? 'x' : Name extends 'up' | 'down' ? 'y' : 'z'

  private constructor(
    public readonly name: Name,
    public readonly id: Idx,
    normal: Normal,
    opposite: OppositeName,
  ) {
    /* @ts-ignore */
    this.normal = new Vector(normal as Unconst<typeof normal>)
    if (normal[0] !== 0) this.axis = 'x' as any
    else if (normal[1] !== 0) this.axis = 'y' as any
    else this.axis = 'z' as any
    this.isSide = (this.axis !== 'y') as any
    // is set correctly later
    ;(this as any).opposite = opposite
  }

  public toString(): Name {
    return this.name
  }

  public toJSON(): Name {
    return this.name
  }
}

const BLOCK_FACES = Object.freeze([
  BlockFace.North,
  BlockFace.East,
  BlockFace.South,
  BlockFace.West,
  BlockFace.Up,
  BlockFace.Down,
] as const)

BlockFace.forEach((face) => {
  const opp: keyof typeof BlockFace = face.opposite as any
  ;(face as any).opposite = BlockFace[opp]
})
