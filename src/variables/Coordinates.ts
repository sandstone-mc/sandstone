export type Relative = string | '~ ~ ~'
export type Local = string | '^ ^ ^'
export type Absolute = string | '0 0 0'

export type Coordinates = Relative & Local & Absolute
