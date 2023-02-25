import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'

/**
 * A node representing a Minecraft font
 */
export class FontNode extends ContainerNode implements ResourceNode<FontClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: FontClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.fontJSON)
}

export type FontArguments = {
  /**
   * The font's JSON.
   */
  providers: Provider[]

} & ResourceClassArguments<'list'>

export class FontClass extends ResourceClass<FontNode> implements ListResource {
  fontJSON: { providers: FontArguments['providers'] }

  constructor(core: SandstoneCore, name: string, args: FontArguments) {
    super(core, { packType: core.pack.resourcePack }, FontNode, core.pack.resourceToPath(name, ['font']), args)

    this.fontJSON = { providers: args.providers }
  }

  push() {}

  unshift() {}
}

export namespace FontData {
  export async function load(loader: ResourceLoader, id: string): Promise<FontData | null> {
    const parsedId = parseNamespacedId(id)
    const rPath = getResourcePath(parsedId, 'font', 'json')
    const data = await loader.readResourceFile(rPath)
    if (data === null) return null
    else return JSON.parse(data.toString('utf8'))
  }

  export type Provider =
    | ProviderBitmap
    | ProviderLegacyUnicode
    | ProviderTrueType

  export type ProviderType = Provider['type']

  export type ProviderFor<T extends ProviderType> =
    T extends 'bitmap' ? ProviderBitmap
    : T extends 'legacy_unicode' ? ProviderLegacyUnicode
    : ProviderTrueType

  export type ProviderBitmap = {
    type: 'bitmap'
    file: string
    ascent: number
    chars: string[]
    height?: number
  }

  export type ProviderLegacyUnicode = {
    type: 'legacy_unicode'
    sizes: string
    template: string
  }

  export type ProviderTrueType = {
    type: 'ttf'
    file: string
    shift: [number, number]
    size: number
    oversample: number
    skip: string | string[]
  }
}

/**
 * A minecraft font asset
 */
export class Font {
  public providers: FontProvider[] = []

  /**
   * Creates a new font asset.
   * @param id Identifier of this font, like `my_pack:my_font`
   */
  public constructor() { }

  public addProvider(provider: FontProvider): this {
    this.providers.push(provider)
    return this
  }

  public static fromJSON(data: FontData): Font {
    const f = new Font()
    f.providers = data.providers.map(FontProvider.fromJSON)
    return f
  }

  public toJSON(): FontData {
    return {
      providers: this.providers.map(p => p.toJSON()),
    }
  }

  public toRaw(): string {
    return JSON.stringify(this)
      .replace(
        /[^\u0020-\u007e]/ug,
        s => '\\u' + s.charCodeAt(0).toString(16).padStart(4, '0')
      )
  }
}

export interface FontProviderConstructor<T extends FontData.ProviderType> {
  new(...args: any[]): FontProvider<T>
  _fromJSON(data: FontData.ProviderFor<T>): FontProvider<T>
}

export abstract class FontProvider<T extends FontData.ProviderType = FontData.ProviderType> {
  public static providers: {
    [Type in FontData.ProviderType]?: FontProviderConstructor<Type>
  } = {}

  public abstract readonly type: T
  public constructor() { }

  public static fromJSON<T extends FontData.ProviderType>(data: FontData.ProviderFor<T>): FontProvider<T> {
    if (data.type in this.providers) {
      return (FontProvider.providers[data.type] as any)._fromJSON(data) as FontProvider<T>
    } else {
      throw new TypeError(`Unknown font provider type: ${data.type}`)
    }
  }

  public abstract toJSON(): FontData.ProviderFor<T>
}

export class FontProviderBitmap extends FontProvider<'bitmap'> {
  public readonly type = 'bitmap'
  public constructor(
    public file: string,
    public chars: string[],
    public ascent: number = 0,
    public height: number = 8,
  ) {
    super()
  }

  public setAscent(n: number): this {
    this.ascent = n
    return this
  }

  public setHeight(n: number): this {
    this.height = n
    return this
  }

  public hasChar(c: string | number): boolean {
    if (typeof c === 'number') c = String.fromCharCode(c)
    return this.chars.some(chars => chars.indexOf(c as string) >= 0)
  }

  public static _fromJSON(data: FontData.ProviderFor<'bitmap'>): FontProviderBitmap {
    return new FontProviderBitmap(
      data.file,
      data.chars,
      typeof data.ascent === 'number' ? data.ascent : undefined,
      typeof data.height === 'number' ? data.height : undefined
    )
  }

  public override toJSON(): FontData.ProviderBitmap {
    return {
      type: 'bitmap',
      ascent: this.ascent,
      chars: this.chars.slice(),
      file: this.file,
      height: this.height,
    }
  }
}
FontProvider.providers.bitmap = FontProviderBitmap

export class FontProviderTrueType extends FontProvider<'ttf'> {
  public readonly type = 'ttf'
  public shift: {
    left: number
    down: number
  } = {
      left: 0,
      down: 0,
    }
  constructor(
    public file: string,
    public size: number,
    public oversample: number = size,
    shiftLeft: number = 0,
    shiftDown: number = 0,
    public skip: string | string[] = '',
  ) {
    super()
    this.shift.left = shiftLeft
    this.shift.down = shiftDown
  }

  public static _fromJSON(data: FontData.ProviderTrueType): FontProviderTrueType {
    return new FontProviderTrueType(data.file,
      data.size,
      data.oversample,
      data.shift[0],
      data.shift[1],
      data.skip
    )
  }
  public override toJSON(): FontData.ProviderTrueType {
    return {
      type: 'ttf',
      file: this.file,
      oversample: this.oversample,
      shift: [this.shift.left, this.shift.down],
      size: this.size,
      skip: this.skip,
    }
  }
}
FontProvider.providers.ttf = FontProviderTrueType
