import type { Registry } from 'sandstone/arguments/generated/registry.js'

type SoundTypeDispatcherMap = {
    'event': SoundTypeEvent
    'minecraft:event': SoundTypeEvent
    'file': SoundTypeFile
    'minecraft:file': SoundTypeFile
}
type SoundTypeKeys = keyof SoundTypeDispatcherMap
type SoundTypeFallback = (SoundTypeEvent | SoundTypeFile)
type SoundTypeNoneType = Registry['minecraft:sound']
type SoundTypeEvent = `${string}:${string}`
type SoundTypeFile = Registry['minecraft:sound']
export type SymbolSoundType<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? SoundTypeDispatcherMap
    : CASE extends 'keys'
        ? SoundTypeKeys
        : CASE extends '%fallback' ? SoundTypeFallback : CASE extends '%none' ? SoundTypeNoneType : never
