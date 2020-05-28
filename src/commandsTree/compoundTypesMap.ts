/* eslint-disable */
type CompoundTypesMapObject<typesMap extends {[p: string]: any}, returnType, rootNode> = ({
  0:
    ((targets: typesMap['minecraft:entity']) => rootNode)
  1:
    ((advancement: typesMap['minecraft:resource_location']) => rootNode)
  2:
    ((advancement: typesMap['minecraft:resource_location']) => returnType) &
    ((advancement: typesMap['minecraft:resource_location'], criterion: typesMap['brigadier:string']) => rootNode)
  3:
    ((target: typesMap['minecraft:entity'], attribute: typesMap['minecraft:resource_location']) => rootNode)
  4:
    ((scale: typesMap['brigadier:double']) => rootNode)
  5:
    ((value: typesMap['brigadier:double']) => rootNode)
  6:
    ((uuid: typesMap['minecraft:uuid'], name: typesMap['brigadier:string'], value: typesMap['brigadier:double']) => rootNode)
  7:
    ((uuid: typesMap['minecraft:uuid']) => rootNode)
  8:
    ((get: typesMap['undefined'], uuid: typesMap['minecraft:uuid']) => returnType) &
    ((get: typesMap['undefined'], uuid: typesMap['minecraft:uuid'], scale: typesMap['brigadier:double']) => rootNode)
  9:
    ((targets: typesMap['minecraft:game_profile']) => returnType) &
    ((targets: typesMap['minecraft:game_profile'], reason: typesMap['minecraft:message']) => rootNode)
  10:
    ((target: typesMap['brigadier:string']) => returnType) &
    ((target: typesMap['brigadier:string'], reason: typesMap['minecraft:message']) => rootNode)
  11:
    ((id: typesMap['minecraft:resource_location'], name: typesMap['minecraft:component']) => rootNode)
  12:
    ((id: typesMap['minecraft:resource_location']) => rootNode)
  13:
    ((max: typesMap['brigadier:integer']) => rootNode)
  14:
    ((name: typesMap['minecraft:component']) => rootNode)
  15:
    ((value: typesMap['brigadier:integer']) => rootNode)
  16:
    ((visible: typesMap['brigadier:bool']) => rootNode)
  17:
    ((targets: typesMap['minecraft:entity']) => returnType) &
    ((targets: typesMap['minecraft:entity'], item: typesMap['minecraft:item_predicate']) => returnType) &
    ((targets: typesMap['minecraft:entity'], item: typesMap['minecraft:item_predicate'], maxCount: typesMap['brigadier:integer']) => rootNode)
  18:
    ((begin: typesMap['minecraft:block_pos'], end: typesMap['minecraft:block_pos'], destination: typesMap['minecraft:block_pos']) => rootNode)
  19:
    ((filter: typesMap['minecraft:block_predicate']) => rootNode)
  20:
    ((targetPos: typesMap['minecraft:block_pos']) => returnType) &
    ((targetPos: typesMap['minecraft:block_pos'], path: typesMap['minecraft:nbt_path']) => returnType) &
    ((targetPos: typesMap['minecraft:block_pos'], path: typesMap['minecraft:nbt_path'], scale: typesMap['brigadier:double']) => rootNode)
  21:
    ((target: typesMap['minecraft:entity']) => returnType) &
    ((target: typesMap['minecraft:entity'], path: typesMap['minecraft:nbt_path']) => returnType) &
    ((target: typesMap['minecraft:entity'], path: typesMap['minecraft:nbt_path'], scale: typesMap['brigadier:double']) => rootNode)
  22:
    ((target: typesMap['minecraft:resource_location']) => returnType) &
    ((target: typesMap['minecraft:resource_location'], path: typesMap['minecraft:nbt_path']) => returnType) &
    ((target: typesMap['minecraft:resource_location'], path: typesMap['minecraft:nbt_path'], scale: typesMap['brigadier:double']) => rootNode)
  23:
    ((targetPos: typesMap['minecraft:block_pos'], nbt: typesMap['minecraft:nbt_compound_tag']) => rootNode)
  24:
    ((target: typesMap['minecraft:entity'], nbt: typesMap['minecraft:nbt_compound_tag']) => rootNode)
  25:
    ((target: typesMap['minecraft:resource_location'], nbt: typesMap['minecraft:nbt_compound_tag']) => rootNode)
  26:
    ((targetPos: typesMap['minecraft:block_pos'], targetPath: typesMap['minecraft:nbt_path']) => rootNode)
  27:
    ((sourcePos: typesMap['minecraft:block_pos']) => returnType) &
    ((sourcePos: typesMap['minecraft:block_pos'], sourcePath: typesMap['minecraft:nbt_path']) => rootNode)
  28:
    ((source: typesMap['minecraft:entity']) => returnType) &
    ((source: typesMap['minecraft:entity'], sourcePath: typesMap['minecraft:nbt_path']) => rootNode)
  29:
    ((source: typesMap['minecraft:resource_location']) => returnType) &
    ((source: typesMap['minecraft:resource_location'], sourcePath: typesMap['minecraft:nbt_path']) => rootNode)
  30:
    ((value: typesMap['minecraft:nbt_tag']) => rootNode)
  31:
    ((index: typesMap['brigadier:integer']) => rootNode)
  32:
    ((target: typesMap['minecraft:entity'], targetPath: typesMap['minecraft:nbt_path']) => rootNode)
  33:
    ((target: typesMap['minecraft:resource_location'], targetPath: typesMap['minecraft:nbt_path']) => rootNode)
  34:
    ((targetPos: typesMap['minecraft:block_pos'], path: typesMap['minecraft:nbt_path']) => rootNode)
  35:
    ((target: typesMap['minecraft:entity'], path: typesMap['minecraft:nbt_path']) => rootNode)
  36:
    ((target: typesMap['minecraft:resource_location'], path: typesMap['minecraft:nbt_path']) => rootNode)
  37:
    ((name: typesMap['brigadier:string']) => rootNode)
  38:
    ((existing: typesMap['brigadier:string']) => rootNode)
  39:
    ((targets: typesMap['minecraft:game_profile']) => rootNode)
  40:
    ((targets: typesMap['minecraft:entity']) => returnType) &
    ((targets: typesMap['minecraft:entity'], effect: typesMap['minecraft:mob_effect']) => rootNode)
  41:
    ((targets: typesMap['minecraft:entity'], effect: typesMap['minecraft:mob_effect']) => returnType) &
    ((targets: typesMap['minecraft:entity'], effect: typesMap['minecraft:mob_effect'], seconds: typesMap['brigadier:integer']) => returnType) &
    ((targets: typesMap['minecraft:entity'], effect: typesMap['minecraft:mob_effect'], seconds: typesMap['brigadier:integer'], amplifier: typesMap['brigadier:integer']) => returnType) &
    ((targets: typesMap['minecraft:entity'], effect: typesMap['minecraft:mob_effect'], seconds: typesMap['brigadier:integer'], amplifier: typesMap['brigadier:integer'], hideParticles: typesMap['brigadier:bool']) => rootNode)
  42:
    ((targets: typesMap['minecraft:entity'], enchantment: typesMap['minecraft:item_enchantment']) => returnType) &
    ((targets: typesMap['minecraft:entity'], enchantment: typesMap['minecraft:item_enchantment'], level: typesMap['brigadier:integer']) => rootNode)
  43:
    ((targets: typesMap['minecraft:entity'], amount: typesMap['brigadier:integer']) => rootNode)
  44:
    ((from: typesMap['minecraft:block_pos'], to: typesMap['minecraft:block_pos'], block: typesMap['minecraft:block_state']) => rootNode)
  45:
    ((from: typesMap['minecraft:column_pos']) => returnType) &
    ((from: typesMap['minecraft:column_pos'], to: typesMap['minecraft:column_pos']) => rootNode)
  46:
    ((pos: typesMap['minecraft:column_pos']) => rootNode)
  47:
    ((from: typesMap['minecraft:column_pos']) => rootNode)
  48:
    ((to: typesMap['minecraft:column_pos']) => rootNode)
  49:
    ((name: typesMap['minecraft:function']) => rootNode)
  50:
    ((target: typesMap['minecraft:entity']) => rootNode)
  51:
    ((value: typesMap['brigadier:bool']) => rootNode)
  52:
    ((targets: typesMap['minecraft:entity'], item: typesMap['minecraft:item_stack']) => returnType) &
    ((targets: typesMap['minecraft:entity'], item: typesMap['minecraft:item_stack'], count: typesMap['brigadier:integer']) => rootNode)
  53:
    ((command: typesMap['brigadier:string']) => rootNode)
  54:
    ((targets: typesMap['minecraft:entity']) => returnType) &
    ((targets: typesMap['minecraft:entity'], reason: typesMap['minecraft:message']) => rootNode)
  55:
    ((biome: typesMap['minecraft:resource_location']) => rootNode)
  56:
    ((players: typesMap['minecraft:entity']) => rootNode)
  57:
    ((loot_table: typesMap['minecraft:resource_location'], pos: typesMap['minecraft:block_pos']) => rootNode)
  58:
    ((tool: typesMap['minecraft:item_stack']) => rootNode)
  59:
    ((loot_table: typesMap['minecraft:resource_location']) => rootNode)
  60:
    ((pos: typesMap['minecraft:block_pos']) => rootNode)
  61:
    ((targetPos: typesMap['minecraft:block_pos']) => rootNode)
  62:
    ((targetPos: typesMap['minecraft:block_pos'], slot: typesMap['minecraft:item_slot']) => rootNode)
  63:
    ((count: typesMap['brigadier:integer']) => rootNode)
  64:
    ((entities: typesMap['minecraft:entity'], slot: typesMap['minecraft:item_slot']) => rootNode)
  65:
    ((targetPos: typesMap['minecraft:vec3']) => rootNode)
  66:
    ((action: typesMap['brigadier:string']) => rootNode)
  67:
    ((targets: typesMap['minecraft:entity'], message: typesMap['minecraft:message']) => rootNode)
  68:
    ((target: typesMap['brigadier:string']) => rootNode)
  69:
    ((name: typesMap['minecraft:particle']) => returnType) &
    ((name: typesMap['minecraft:particle'], pos: typesMap['minecraft:vec3']) => returnType) &
    ((name: typesMap['minecraft:particle'], pos: typesMap['minecraft:vec3'], delta: typesMap['minecraft:vec3'], speed: typesMap['brigadier:float'], count: typesMap['brigadier:integer']) => rootNode)
  70:
    ((viewers: typesMap['minecraft:entity']) => rootNode)
  71:
    ((sound: typesMap['minecraft:resource_location']) => rootNode)
  72:
    ((targets: typesMap['minecraft:entity']) => returnType) &
    ((targets: typesMap['minecraft:entity'], pos: typesMap['minecraft:vec3']) => returnType) &
    ((targets: typesMap['minecraft:entity'], pos: typesMap['minecraft:vec3'], volume: typesMap['brigadier:float']) => returnType) &
    ((targets: typesMap['minecraft:entity'], pos: typesMap['minecraft:vec3'], volume: typesMap['brigadier:float'], pitch: typesMap['brigadier:float']) => returnType) &
    ((targets: typesMap['minecraft:entity'], pos: typesMap['minecraft:vec3'], volume: typesMap['brigadier:float'], pitch: typesMap['brigadier:float'], minVolume: typesMap['brigadier:float']) => rootNode)
  73:
    ((port: typesMap['brigadier:integer']) => rootNode)
  74:
    ((recipe: typesMap['minecraft:resource_location']) => rootNode)
  75:
    ((pos: typesMap['minecraft:block_pos'], slot: typesMap['minecraft:item_slot'], item: typesMap['minecraft:item_stack']) => returnType) &
    ((pos: typesMap['minecraft:block_pos'], slot: typesMap['minecraft:item_slot'], item: typesMap['minecraft:item_stack'], count: typesMap['brigadier:integer']) => rootNode)
  76:
    ((targets: typesMap['minecraft:entity'], slot: typesMap['minecraft:item_slot'], item: typesMap['minecraft:item_stack']) => returnType) &
    ((targets: typesMap['minecraft:entity'], slot: typesMap['minecraft:item_slot'], item: typesMap['minecraft:item_stack'], count: typesMap['brigadier:integer']) => rootNode)
  77:
    ((message: typesMap['minecraft:message']) => rootNode)
  78:
    ((function_: typesMap['brigadier:string']) => rootNode)
  79:
    ((function_: typesMap['minecraft:function'], time: typesMap['minecraft:time']) => rootNode)
  80:
    ((objective: typesMap['brigadier:string'], criteria: typesMap['minecraft:objective_criteria']) => returnType) &
    ((objective: typesMap['brigadier:string'], criteria: typesMap['minecraft:objective_criteria'], displayName: typesMap['minecraft:component']) => rootNode)
  81:
    ((objective: typesMap['minecraft:objective']) => rootNode)
  82:
    ((displayName: typesMap['minecraft:component']) => rootNode)
  83:
    ((slot: typesMap['minecraft:scoreboard_slot']) => returnType) &
    ((slot: typesMap['minecraft:scoreboard_slot'], objective: typesMap['minecraft:objective']) => rootNode)
  84:
    ((targets: typesMap['minecraft:score_holder'], objective: typesMap['minecraft:objective'], score: typesMap['brigadier:integer']) => rootNode)
  85:
    ((targets: typesMap['minecraft:score_holder'], objective: typesMap['minecraft:objective']) => rootNode)
  86:
    ((target: typesMap['minecraft:score_holder'], objective: typesMap['minecraft:objective']) => rootNode)
  87:
    ((target: typesMap['minecraft:score_holder']) => rootNode)
  88:
    ((targets: typesMap['minecraft:score_holder'], targetObjective: typesMap['minecraft:objective'], operation: typesMap['minecraft:operation'], source: typesMap['minecraft:score_holder'], sourceObjective: typesMap['minecraft:objective']) => rootNode)
  89:
    ((targets: typesMap['minecraft:score_holder']) => returnType) &
    ((targets: typesMap['minecraft:score_holder'], objective: typesMap['minecraft:objective']) => rootNode)
  90:
    ((pos: typesMap['minecraft:block_pos'], block: typesMap['minecraft:block_state']) => rootNode)
  91:
    ((minutes: typesMap['brigadier:integer']) => rootNode)
  92:
    ((targets: typesMap['minecraft:entity']) => returnType) &
    ((targets: typesMap['minecraft:entity'], pos: typesMap['minecraft:block_pos']) => rootNode)
  93:
    ((target: typesMap['minecraft:entity']) => returnType) &
    ((target: typesMap['minecraft:entity'], player: typesMap['minecraft:entity']) => rootNode)
  94:
    ((center: typesMap['minecraft:vec2'], spreadDistance: typesMap['brigadier:float'], maxRange: typesMap['brigadier:float'], respectTeams: typesMap['brigadier:bool'], targets: typesMap['minecraft:entity']) => rootNode)
  95:
    ((entity: typesMap['minecraft:entity_summon']) => returnType) &
    ((entity: typesMap['minecraft:entity_summon'], pos: typesMap['minecraft:vec3']) => returnType) &
    ((entity: typesMap['minecraft:entity_summon'], pos: typesMap['minecraft:vec3'], nbt: typesMap['minecraft:nbt_compound_tag']) => rootNode)
  96:
    ((team: typesMap['brigadier:string']) => returnType) &
    ((team: typesMap['brigadier:string'], displayName: typesMap['minecraft:component']) => rootNode)
  97:
    ((team: typesMap['minecraft:team']) => rootNode)
  98:
    ((team: typesMap['minecraft:team']) => returnType) &
    ((team: typesMap['minecraft:team'], members: typesMap['minecraft:score_holder']) => rootNode)
  99:
    ((members: typesMap['minecraft:score_holder']) => rootNode)
  100:
    ((value: typesMap['minecraft:color']) => rootNode)
  101:
    ((allowed: typesMap['brigadier:bool']) => rootNode)
  102:
    ((prefix: typesMap['minecraft:component']) => rootNode)
  103:
    ((suffix: typesMap['minecraft:component']) => rootNode)
  104:
    ((destination: typesMap['minecraft:entity']) => rootNode)
  105:
    ((location: typesMap['minecraft:vec3']) => rootNode)
  106:
    ((facingEntity: typesMap['minecraft:entity']) => returnType) &
    ((facingEntity: typesMap['minecraft:entity'], facingAnchor: typesMap['minecraft:entity_anchor']) => rootNode)
  107:
    ((facingLocation: typesMap['minecraft:vec3']) => rootNode)
  108:
    ((rotation: typesMap['minecraft:rotation']) => rootNode)
  109:
    ((targets: typesMap['minecraft:entity'], message: typesMap['minecraft:component']) => rootNode)
  110:
    ((time: typesMap['minecraft:time']) => rootNode)
  111:
    ((title: typesMap['minecraft:component']) => rootNode)
  112:
    ((fadeIn: typesMap['brigadier:integer'], stay: typesMap['brigadier:integer'], fadeOut: typesMap['brigadier:integer']) => rootNode)
  113:
    ((duration: typesMap['brigadier:integer']) => rootNode)
  114:
    ((distance: typesMap['brigadier:float']) => returnType) &
    ((distance: typesMap['brigadier:float'], time: typesMap['brigadier:integer']) => rootNode)
  115:
    ((pos: typesMap['minecraft:vec2']) => rootNode)
  116:
    ((damagePerBlock: typesMap['brigadier:float']) => rootNode)
  117:
    ((distance: typesMap['brigadier:float']) => rootNode)
  118:
    ((distance: typesMap['brigadier:integer']) => rootNode)
  119:
    ((time: typesMap['brigadier:integer']) => rootNode)
  120:
    ((axes: typesMap['minecraft:swizzle']) => rootNode)
  121:
    ((anchor: typesMap['minecraft:entity_anchor']) => rootNode)
  122:
    ((targets: typesMap['minecraft:entity'], anchor: typesMap['minecraft:entity_anchor']) => rootNode)
  123:
    ((pos: typesMap['minecraft:vec3']) => rootNode)
  124:
    ((pos: typesMap['minecraft:block_pos'], block: typesMap['minecraft:block_predicate']) => rootNode)
  125:
    ((start: typesMap['minecraft:block_pos'], end: typesMap['minecraft:block_pos'], destination: typesMap['minecraft:block_pos']) => rootNode)
  126:
    ((sourcePos: typesMap['minecraft:block_pos'], path: typesMap['minecraft:nbt_path']) => rootNode)
  127:
    ((source: typesMap['minecraft:entity'], path: typesMap['minecraft:nbt_path']) => rootNode)
  128:
    ((source: typesMap['minecraft:resource_location'], path: typesMap['minecraft:nbt_path']) => rootNode)
  129:
    ((entities: typesMap['minecraft:entity']) => rootNode)
  130:
    ((predicate: typesMap['minecraft:resource_location']) => rootNode)
  131:
    ((target: typesMap['minecraft:score_holder'], targetObjective: typesMap['minecraft:objective']) => rootNode)
  132:
    ((source: typesMap['minecraft:score_holder'], sourceObjective: typesMap['minecraft:objective']) => rootNode)
  133:
    ((range: typesMap['minecraft:int_range']) => rootNode)
  134:
    ((dimension: typesMap['minecraft:dimension']) => rootNode)
  135:
    ((rot: typesMap['minecraft:rotation']) => rootNode)
})

export type CompoundTypesMap<typesMap extends {[p: string]: any}, returnType, rootNode, k extends number>  = (
  k extends keyof CompoundTypesMapObject<typesMap, returnType, rootNode> ?
    CompoundTypesMapObject<typesMap, returnType, rootNode>[k] :
    never
)
