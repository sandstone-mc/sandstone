import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NamespacedString, SoundEventClass } from 'sandstone'

type JsonSoundTypeDispatcherMap = {
  'event': JsonSoundTypeEvent,
  'minecraft:event': JsonSoundTypeEvent,
  'file': JsonSoundTypeFile,
  'minecraft:file': JsonSoundTypeFile,
}
type JsonSoundTypeKeys = keyof JsonSoundTypeDispatcherMap
type JsonSoundTypeFallback = (JsonSoundTypeEvent | JsonSoundTypeFile)
type JsonSoundTypeNoneType = (JsonRegistry['minecraft:sound'] | SoundEventClass)
type JsonSoundTypeEvent = NamespacedString
type JsonSoundTypeFile = (JsonRegistry['minecraft:sound'] | SoundEventClass)
export type JsonSymbolSoundType<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSoundTypeDispatcherMap
  : CASE extends 'keys'
    ? JsonSoundTypeKeys
    : CASE extends '%fallback' ? JsonSoundTypeFallback : CASE extends '%none' ? JsonSoundTypeNoneType : never
