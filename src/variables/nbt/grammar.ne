@preprocessor typescript

# Matches a NBT
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "string.ne"     # `dqstring` for "", `sqstring` for '', `bqstring` for `` 

@{%
export const isCompoundSymbol = Symbol("isCompound")

type DataType<TYPE extends string, VALUE, PROPERTIES extends Record<string, unknown> | unknown = unknown> = {
	dataType: TYPE,
	value: VALUE,
} & PROPERTIES;

export type NBTExpression = NBTCompound | NBTArray | NBTLongArray | NBTByteArray | NBTIntArray | NBTString | NBTLong | NBTDouble | NBTFloat | NBTByte | NBTNumber | NBTShort | NBTBoolean

export type NBTCompound = { [k: string]: NBTExpression }
export type NBTArray = NBTExpression[]
export type NBTByteArray = DataType<"byteArray", NBTByte[]>
export type NBTLongArray = DataType<"longArray", NBTLong[]>
export type NBTIntArray = DataType<"intArray", NBTShort[]>


export type NBTString = DataType<"string", string>

export type NBTLong = DataType<"long", number>
export type NBTShort = DataType<"short", number>
export type NBTByte = DataType<"byte", number>

export type NBTNumber = DataType<"number", number>

export type NBTDouble = DataType<"double", number>
export type NBTFloat = DataType<"float", number>
export type NBTBoolean = DataType<"boolean", boolean>
%}


expression 	-> (string | typedNum | number | boolean | byteArray | intArray | longArray | array | object ) {% (data: NBTExpression[][]) => data[0][0] %}

# Object definition
object 		-> "{" objectInner "}" {% (data: any) => Object.fromEntries([...data[1].map(({ key, value }: {key: string, value: NBTExpression}) => [key, value]), [isCompoundSymbol, true]]) %}

objectInner -> _ {% data => ([]) %}
			 | _ (objectKeyValue _ "," _):* objectKeyValue (_ ","):? _ {% (data) => {
	const firstKeyValues = data[1].map(([keyValue]: [key: string, value: NBTExpression][]) => keyValue)
	const keyValues = [...firstKeyValues, data[2]]
	return keyValues
} %}

objectKeyValue -> [a-zA-Z]:+ _ ":" _ expression {% (data) => ({ key: data[0].join(''), value: data[4] }) %}
			    |     string _ ":" _ expression {% (data) => ({ key: data[0].value,    value: data[4] }) %}

# Array definition
arrayInner[X] -> _ {% () => [] %}
			   | _ ($X _ "," _):* $X (_ ","):? _ {% (data) => {
	const firstArray = data[1].map(([expression]: NBTExpression[][]) => expression[0])
	return [...firstArray, data[2][0]]
} %}

array 		-> "[" arrayInner[expression] "]" {% (data) => data[1] %}

byteArray	-> "[" _ "B" _ ";" arrayInner[typedByte] "]" {% (data) => ({ dataType: "byteArray", value: data[5] }) %}
intArray	-> "[" _ "I" _ ";" arrayInner[number] 	 "]" {% (data) => ({ dataType: "intArray",  value: data[5] }) %}
longArray	-> "[" _ "L" _ ";" arrayInner[typedLong] "]" {% (data) => ({ dataType: "longArray", value: data[5] }) %}

# Primitives
string 		-> (dqstring | sqstring) {% (data) => ({ dataType: "string", value: data[0][0] }) %}

typedNum    -> (typedByte | typedShort | typedLong | typedFloat) {% (data) => (data[0][0]) %}

typedByte 	-> int "b"i {% (data) => ({ dataType: "byte", value: data[0] }) %}
typedShort	-> int "s"i {% (data) => ({ dataType: "short", value: data[0] }) %}
typedLong	  -> int "l"i {% (data) => ({ dataType: "long", value: data[0] }) %}

typedFloat	-> decimal "d"i {% (data) => ({ dataType: "double", value: data[0] }) %}
					   | decimal "f"i {% (data) => ({ dataType: "float", value: data[0] }) %}

number			-> (decimal) {% (data) => ({ dataType: "number", value: data[0][0] }) %}

boolean     -> ("true" | "false") {% (data) => ({ dataType: "boolean", value: data[0].join('') === "true" }) %}