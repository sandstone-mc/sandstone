import {
  MCFunction,
  Selector,
  type SelectorClass,
  tellraw,
} from 'sandstone'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
    ? true
    : false
type Expect<T extends true> = T
type IsAny<T> = 0 extends (1 & T) ? true : false

const allEntities = Selector('@e')
const allPlayers = Selector('@a')
const self = Selector('@s')
const nearestEntity = Selector('@n')
const nearestPlayer = Selector('@p')
const randomPlayer = Selector('@r')

type _AllEntities = Expect<Equal<typeof allEntities, SelectorClass<false, false, false>>>
type _AllPlayers = Expect<Equal<typeof allPlayers, SelectorClass<false, false, true>>>
type _Self = Expect<Equal<typeof self, SelectorClass<false, true, false>>>
type _NearestEntity = Expect<Equal<typeof nearestEntity, SelectorClass<false, true, false>>>
type _NearestPlayer = Expect<Equal<typeof nearestPlayer, SelectorClass<false, true, true>>>
type _RandomPlayer = Expect<Equal<typeof randomPlayer, SelectorClass<false, true, true>>>
type _NoAny = Expect<Equal<IsAny<typeof allEntities>, false>>

const oneEntity = Selector('@e', { limit: 1 })
const zeroLimit = Selector('@e', { limit: 0 })
const onePlayer = Selector('@e', { limit: 1, type: 'minecraft:player' })
const manyPlayers = Selector('@e', { type: 'player' })
const limitedAllPlayers = Selector('@a', { limit: 1 })
const typedSelf = Selector('@s', { type: 'minecraft:player' })
const typedNearestEntity = Selector('@n', { type: 'minecraft:zombie' })
const widenedArguments = { limit: 1 }
const widenedLimit = Selector('@e', widenedArguments)
const literalArguments = { limit: 1 } as const
const literalLimit = Selector('@e', literalArguments)

type _OneEntity = Expect<Equal<typeof oneEntity, SelectorClass<false, true, false>>>
type _ZeroLimit = Expect<Equal<typeof zeroLimit, SelectorClass<false, false, false>>>
type _OnePlayer = Expect<Equal<typeof onePlayer, SelectorClass<false, true, true>>>
type _ManyPlayers = Expect<Equal<typeof manyPlayers, SelectorClass<false, false, true>>>
type _LimitedAllPlayers = Expect<Equal<typeof limitedAllPlayers, SelectorClass<false, true, true>>>
type _TypedSelf = Expect<Equal<typeof typedSelf, SelectorClass<false, true, true>>>
type _TypedNearestEntity = Expect<Equal<typeof typedNearestEntity, SelectorClass<false, true, false>>>
type _WidenedLimit = Expect<Equal<typeof widenedLimit, SelectorClass<false, false, false>>>
type _LiteralLimit = Expect<Equal<typeof literalLimit, SelectorClass<false, true, false>>>

Selector('@e', { type: 'minecraft:zombie', nbt: { IsBaby: true } })
Selector('@e', { type: 'minecraft:creeper', nbt: { powered: true } })
Selector('@p', { tag: 'tracked' })
Selector('@r', { distance: [0, 10] })

MCFunction('selector_type_regression', () => {
  tellraw(
    Selector('@a', {
      advancements: {
        'story/obtain_armor': {
          iron_helmet: true,
        },
      },
    }),
    'Hello, world!',
  )
})

// @ts-expect-error Player selectors do not accept an explicit type filter.
Selector('@p', { type: 'minecraft:zombie' })
// @ts-expect-error Player selectors do not accept an explicit limit.
Selector('@r', { limit: 1 })
// @ts-expect-error @a selectors do not accept an explicit type filter.
Selector('@a', { type: 'minecraft:zombie' })
// @ts-expect-error @s selectors do not accept an explicit limit.
Selector('@s', { limit: 1 })
// @ts-expect-error Invalid advancement filter shapes stay rejected.
Selector('@a', { advancements: '' })
// @ts-expect-error Unknown selector properties stay rejected.
Selector('@e', { unknownProperty: true })

type _CovariantTogether = Expect<
  SelectorClass<false, true, true> extends SelectorClass<boolean, boolean, boolean>
    ? true
    : false
>
type _NotNarrowableTogether = Expect<
  SelectorClass<boolean, boolean, boolean> extends SelectorClass<false, true, true>
    ? false
    : true
>
type _MacroCovariant = Expect<
  SelectorClass<false, boolean, boolean> extends SelectorClass<boolean, boolean, boolean>
    ? true
    : false
>
type _MacroNotNarrowable = Expect<
  SelectorClass<boolean, boolean, boolean> extends SelectorClass<false, boolean, boolean>
    ? false
    : true
>
type _SingleCovariant = Expect<
  SelectorClass<boolean, true, boolean> extends SelectorClass<boolean, boolean, boolean>
    ? true
    : false
>
type _SingleNotNarrowable = Expect<
  SelectorClass<boolean, boolean, boolean> extends SelectorClass<boolean, true, boolean>
    ? false
    : true
>
type _PlayerCovariant = Expect<
  SelectorClass<boolean, boolean, true> extends SelectorClass<boolean, boolean, boolean>
    ? true
    : false
>
type _PlayerNotNarrowable = Expect<
  SelectorClass<boolean, boolean, boolean> extends SelectorClass<boolean, boolean, true>
    ? false
    : true
>

declare const neverPlayer: SelectorClass<false, false, never>
declare const booleanPlayer: SelectorClass<false, false, boolean>
const neverPlayerToBoolean: SelectorClass<false, false, boolean> = neverPlayer
// @ts-expect-error A boolean player constraint cannot be narrowed to never.
const booleanPlayerToNever: SelectorClass<false, false, never> = booleanPlayer
void neverPlayerToBoolean
void booleanPlayerToNever

function assertUnresolvedPlayer<T extends boolean>(
  generic: SelectorClass<false, false, T>,
  broad: SelectorClass<false, false, boolean>,
  literal: SelectorClass<false, false, false>,
) {
  const genericToBroad: SelectorClass<false, false, boolean> = generic
  // @ts-expect-error A broad selector cannot be narrowed to unresolved T.
  const broadToGeneric: SelectorClass<false, false, T> = broad
  // @ts-expect-error false is not assignable to every possible T.
  const literalToGeneric: SelectorClass<false, false, T> = literal
  // @ts-expect-error Unresolved T cannot be narrowed to false.
  const genericToLiteral: SelectorClass<false, false, false> = generic
  void genericToBroad
  void broadToGeneric
  void literalToGeneric
  void genericToLiteral
}

void assertUnresolvedPlayer
