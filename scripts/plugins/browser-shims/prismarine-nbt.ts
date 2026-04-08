// Stub for prismarine-nbt - Structure features don't work in browser playground
// TODO: Replace with browser-compatible NBT library

const notSupported = () => {
  throw new Error('Structure features are not supported in the browser')
}

// Core functions
export const addTypesToCompiler = notSupported
export const addTypesToInterpreter = notSupported
export const writeUncompressed = notSupported
export const parseUncompressed = notSupported
export const simplify = notSupported
export const hasBedrockLevelHeader = notSupported
export const parse = notSupported
export const parseAs = notSupported
export const equal = notSupported

// Proto objects
export const proto = {}
export const protoLE = {}
export const protos = {}

// TagType enum stub
export const TagType = {}

// Builder functions
export const bool = notSupported
export const short = notSupported
export const byte = notSupported
export const string = notSupported
export const comp = notSupported
export const int = notSupported
export const float = notSupported
export const double = notSupported
export const long = notSupported
export const list = notSupported
export const byteArray = notSupported
export const shortArray = notSupported
export const intArray = notSupported
export const longArray = notSupported

export default {
  addTypesToCompiler,
  addTypesToInterpreter,
  writeUncompressed,
  parseUncompressed,
  simplify,
  hasBedrockLevelHeader,
  parse,
  parseAs,
  equal,
  proto,
  protoLE,
  protos,
  TagType,
  bool,
  short,
  byte,
  string,
  comp,
  int,
  float,
  double,
  long,
  list,
  byteArray,
  shortArray,
  intArray,
  longArray,
}
