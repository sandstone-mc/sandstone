/** relativePath can have variables $worldName$ & $packName$ */
export type handlerReadFile = (relativePath: string) => Promise<void>

/** relativePath & contents can have variables $worldName$ & $packName$ */
export type handlerWriteFile = (relativePath: string, contents: string) => Promise<void>

export abstract class PackType {
  readonly type: string

  readonly clientPath: string

  readonly serverPath: string

  readonly rootPath: string

  readonly networkSides: 'client' | 'server' | 'both'

  readonly resourceSubFolder?: string

  readonly namespaced: boolean

  readonly archiveOutput: boolean

  /** `output` executes from `<workspace>/.sandstone/output/$packName$_<type>`*/
  readonly handleOutput: undefined | ((type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => Promise<void>)

  /**
   * @param type eg. datapack or resource_pack
   * @param clientPath from active client directory (eg. .minecraft), can use variables $worldName$ & $packName$; eg. 'saves/$worldName$/datapacks/$packName$' or 'saves/$worldName$/resources'
   * @param serverPath from active server directory, can use variable $packName$; eg. 'world/datapacks/$packName$'
   * @param rootPath from active client directory (eg. .minecraft), can use variable $packName$; eg. 'datapacks/$packName$' or 'resource_packs/$packName$'
   * @param networkSides which sides of the network the pack needs to be exported to; if both the client & server are defined which side this pack needs to be exported to
   * @param archiveOutput whether to archive the directory on output
   * @param resourceSubFolder Optional. Defines sub folder for resources to go; eg. data or assets (use handleOutput if you want to bypass this)
   */
  // eslint-disable-next-line max-len
  constructor(type: string, clientPath: string, serverPath: string, rootPath: string, networkSides: 'client' | 'server' | 'both', archiveOutput: boolean = false, resourceSubFolder?: string, namespaced: boolean = false) {
    this.type = type

    this.clientPath = clientPath
    this.serverPath = serverPath
    this.rootPath = rootPath

    this.networkSides = networkSides
    this.archiveOutput = archiveOutput

    this.resourceSubFolder = resourceSubFolder
    this.namespaced = namespaced
  }
}
