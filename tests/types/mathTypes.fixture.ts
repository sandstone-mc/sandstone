import {
  Float,
  Integer,
  MCFunction,
  _,
  type FloatNumberProviderClass,
  type IntegerNumberProviderClass,
} from 'sandstone'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
    ? true
    : false
type Expect<T extends true> = T

type HasToProvider<T> = 'toProvider' extends keyof T ? true : false

MCFunction('math_to_provider_types', () => {
  // The math block's inputs are handles — the provider takes the same
  // kinds of values.
  let intInput!: Integer
  let floatInput!: Float

  // A singleton schema has a provider equivalent: the whole math chain
  // collapses into a single number provider.
  const intMath = _.Math(Integer, (math, x: Integer) => {
    intInput = x
    math.return(x.multiply(math.integer(2)))
  })

  const floatMath = _.Math(Float, (math, x: Float) => {
    floatInput = x
    math.return(x.multiply(math.float(2)))
  })

  // A record schema does not — a provider holds exactly one value.
  const recordMath = _.Math({ x: Float, y: Float }, (math, x: Float) => {
    math.return({ x, y: x })
  })

  type _IntHasToProvider = Expect<Equal<HasToProvider<typeof intMath>, true>>
  type _FloatHasToProvider = Expect<Equal<HasToProvider<typeof floatMath>, true>>
  type _RecordHasNoToProvider = Expect<Equal<HasToProvider<typeof recordMath>, false>>

  type _IntProvider = Expect<Equal<
    ReturnType<typeof intMath.toProvider>,
    IntegerNumberProviderClass
  >>
  type _FloatProvider = Expect<Equal<
    ReturnType<typeof floatMath.toProvider>,
    FloatNumberProviderClass
  >>

  // The provider takes the same inputs the math block takes.
  const intProvider = intMath.toProvider(intInput)
  const floatProvider = floatMath.toProvider(floatInput)

  type _IntProviderValue = Expect<Equal<typeof intProvider, IntegerNumberProviderClass>>
  type _FloatProviderValue = Expect<Equal<typeof floatProvider, FloatNumberProviderClass>>
})
