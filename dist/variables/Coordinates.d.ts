export declare type Relative = string | '~ ~ ~';
export declare type Local = string | '^ ^ ^';
export declare type Absolute = string | '0 0 0';
export declare type Coordinates = Relative & Local & Absolute;
