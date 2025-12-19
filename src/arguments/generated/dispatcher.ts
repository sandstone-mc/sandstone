import type { SymbolMcdocBlockItemStates } from 'sandstone/generated/_builtin/block_item_states'
import type { SymbolMcdocBlockStateKeys } from 'sandstone/generated/_builtin/block_state_keys'
import type { SymbolMcdocBlockStates } from 'sandstone/generated/_builtin/block_states'
import type { SymbolMcdocCustomData } from 'sandstone/generated/_builtin/custom_data'
import type {
    SymbolMcdocCustomDynamicEventAdditions,
} from 'sandstone/generated/_builtin/custom_dynamic_event_additions'
import type { SymbolMcdocCustomDynamicEventKeys } from 'sandstone/generated/_builtin/custom_dynamic_event_keys'
import type { SymbolMcdocCustomEvent } from 'sandstone/generated/_builtin/custom_event'
import type { SymbolMcdocFluidStateKeys } from 'sandstone/generated/_builtin/fluid_state_keys'
import type { SymbolMcdocFluidStates } from 'sandstone/generated/_builtin/fluid_states'
import type { SymbolMcdocMarkerData } from 'sandstone/generated/_builtin/marker_data'
import type { SymbolBlockEntity } from 'sandstone/generated/_dispatcher/block_entity'
import type { SymbolBlock } from 'sandstone/generated/_dispatcher/block'
import type { SymbolDialogAction } from 'sandstone/generated/_dispatcher/dialog_action'
import type {
    SymbolEnvironmentAttributeColorModifier,
} from 'sandstone/generated/_dispatcher/environment_attribute_color_modifier'
import type { SymbolGameRule } from 'sandstone/generated/_dispatcher/game_rule'
import type { SymbolReputationPartValue } from 'sandstone/generated/_dispatcher/reputation_part_value'
import type { SymbolResource } from 'sandstone/generated/_dispatcher/resource'
import type { SymbolSoundType } from 'sandstone/generated/_dispatcher/sound_type'
import type { SymbolStatisticType } from 'sandstone/generated/_dispatcher/statistic_type'
import type { SymbolUniformValue } from 'sandstone/generated/_dispatcher/uniform_value'
import type { SymbolSpriteSource } from 'sandstone/generated/assets/atlas'
import type { SymbolGlyphProvider } from 'sandstone/generated/assets/font'
import type {
    SymbolConditionalItemProperty,
    SymbolItemModel,
    SymbolNumericItemProperty,
    SymbolSelectItemProperty,
    SymbolSpecialItemModel,
    SymbolTintSource,
} from 'sandstone/generated/assets/item_definition'
import type { SymbolGuiSpriteScaling } from 'sandstone/generated/assets/texture_meta'
import type { SymbolEntitySubPredicate } from 'sandstone/generated/data/advancement/predicate'
import type { SymbolTrigger } from 'sandstone/generated/data/advancement/trigger'
import type { SymbolDialogBody } from 'sandstone/generated/data/dialog/body'
import type { SymbolInputControl } from 'sandstone/generated/data/dialog/input'
import type { SymbolDialog } from 'sandstone/generated/data/dialog'
import type { SymbolEffectComponent } from 'sandstone/generated/data/enchantment/effect_component'
import type {
    SymbolEntityEffect,
    SymbolLocationBasedEffect,
    SymbolValueEffect,
} from 'sandstone/generated/data/enchantment/effect'
import type { SymbolLevelBasedValue } from 'sandstone/generated/data/enchantment/level_based_value'
import type { SymbolEnchantmentProvider } from 'sandstone/generated/data/enchantment/provider'
import type { SymbolTestInstance } from 'sandstone/generated/data/gametest'
import type { SymbolTestEnvironmentDefinition } from 'sandstone/generated/data/gametest/test_environment'
import type { SymbolLootCondition } from 'sandstone/generated/data/loot/condition'
import type {
    SymbolApplyBonusFormula,
    SymbolListOperation,
    SymbolLootFunction,
} from 'sandstone/generated/data/loot/function'
import type { SymbolLootPoolEntry } from 'sandstone/generated/data/loot'
import type { SymbolRecipeSerializer } from 'sandstone/generated/data/recipe'
import type { SymbolStorage } from 'sandstone/generated/data/storage'
import type {
    SymbolNbtProvider,
    SymbolNumberProvider,
    SymbolRandomIntGenerator,
    SymbolScoreProvider,
} from 'sandstone/generated/data/util'
import type { SymbolSpawnCondition } from 'sandstone/generated/data/variants'
import type { SymbolEnvironmentAttributeFloatModifier } from 'sandstone/generated/data/worldgen/attribute/modifier'
import type { SymbolEnvironmentAttribute } from 'sandstone/generated/data/worldgen/attribute'
import type { SymbolCarverConfig } from 'sandstone/generated/data/worldgen/carver'
import type { SymbolDensityFunction } from 'sandstone/generated/data/worldgen/density_function'
import type {
    SymbolBiomeSource,
    SymbolMultiNoiseBiomeSource,
} from 'sandstone/generated/data/worldgen/dimension/biome_source'
import type { SymbolChunkGenerator } from 'sandstone/generated/data/worldgen/dimension/chunk_generator'
import type { SymbolBlockPredicate } from 'sandstone/generated/data/worldgen/feature/block_predicate'
import type { SymbolBlockStateProvider } from 'sandstone/generated/data/worldgen/feature/block_state_provider'
import type { SymbolDecoratorConfig } from 'sandstone/generated/data/worldgen/feature/decorator'
import type { SymbolPlacementModifier } from 'sandstone/generated/data/worldgen/feature/placement'
import type { SymbolBlockPlacer, SymbolFeatureConfig } from 'sandstone/generated/data/worldgen/feature'
import type {
    SymbolFeatureSize,
    SymbolFoliagePlacer,
    SymbolRootPlacer,
    SymbolTreeDecorator,
    SymbolTrunkPlacer,
} from 'sandstone/generated/data/worldgen/feature/tree'
import type {
    SymbolPosRuleTest,
    SymbolRuleBlockEntityModifier,
    SymbolRuleTest,
    SymbolTemplateProcessor,
} from 'sandstone/generated/data/worldgen/processor_list'
import type { SymbolStructurePlacement } from 'sandstone/generated/data/worldgen/structure_set'
import type {
    SymbolJigsawMaxDistanceFromCenter,
    SymbolStructureConfig,
    SymbolWorldgenPoolAliasBinding,
} from 'sandstone/generated/data/worldgen/structure'
import type { SymbolSurfaceCondition, SymbolSurfaceRule } from 'sandstone/generated/data/worldgen/surface_rule'
import type { SymbolFloatProvider, SymbolHeightProvider, SymbolIntProvider } from 'sandstone/generated/data/worldgen'
import type { SymbolTemplatePoolElement } from 'sandstone/generated/data/worldgen/template_pool'
import type { SymbolEnvironmentAttributeArgbColorModifier } from 'sandstone/generated/util/color'
import type { SymbolPositionSource } from 'sandstone/generated/util/game_event'
import type { SymbolMemoryModule } from 'sandstone/generated/util/memory'
import type { SymbolParticle } from 'sandstone/generated/util/particle'
import type { SymbolSlotSource } from 'sandstone/generated/util/slot'
import type { SymbolClickEvent, SymbolHoverEvent } from 'sandstone/generated/util/text'
import type {
    SymbolAttributeDisplay,
    SymbolConsumeEffect,
    SymbolDataComponent,
} from 'sandstone/generated/world/component/item'
import type { SymbolDataComponentPredicate } from 'sandstone/generated/world/component/predicate'
import type { SymbolEntity } from 'sandstone/generated/world/entity/boat'
import type { SymbolItem } from 'sandstone/generated/world/item/spawn_item'

type DispatcherRequiredArgs = {
    'mcdoc:block_item_states': [
    ]
    'mcdoc:block_state_keys': [
    ]
    'mcdoc:block_states': [
    ]
    'mcdoc:custom_data': [
    ]
    'mcdoc:custom_dynamic_event_additions': [
    ]
    'mcdoc:custom_dynamic_event_keys': [
    ]
    'mcdoc:custom_event': [
    ]
    'mcdoc:fluid_states': [
    ]
    'mcdoc:marker_data': [
    ]
    'minecraft:apply_bonus_formula': [
    ]
    'minecraft:attribute_display': [
    ]
    'minecraft:biome_source': [
    ]
    'minecraft:block': [
    ]
    'minecraft:block_entity': [
    ]
    'minecraft:block_placer': [
    ]
    'minecraft:block_predicate': [
    ]
    'minecraft:block_state_provider': [
    ]
    'minecraft:carver_config': [
    ]
    'minecraft:chunk_generator': [
    ]
    'minecraft:click_event': [
    ]
    'minecraft:conditional_item_property': [
    ]
    'minecraft:consume_effect': [
    ]
    'minecraft:data_component': [
    ]
    'minecraft:data_component_predicate': [
    ]
    'minecraft:decorator_config': [
    ]
    'minecraft:density_function': [
    ]
    'minecraft:dialog': [
    ]
    'minecraft:dialog_action': [
    ]
    'minecraft:dialog_body': [
    ]
    'minecraft:effect_component': [
    ]
    'minecraft:enchantment_provider': [
    ]
    'minecraft:entity': [
    ]
    'minecraft:entity_effect': [
    ]
    'minecraft:entity_sub_predicate': [
    ]
    'minecraft:environment_attribute': [
    ]
    'minecraft:environment_attribute_argb_color_modifier': [
    ]
    'minecraft:environment_attribute_color_modifier': [
    ]
    'minecraft:environment_attribute_float_modifier': [
        unknown,
    ]
    'minecraft:feature_config': [
    ]
    'minecraft:feature_size': [
    ]
    'minecraft:float_provider': [
        unknown,
    ]
    'minecraft:foliage_placer': [
    ]
    'minecraft:game_rule': [
    ]
    'minecraft:glyph_provider': [
    ]
    'minecraft:gui_sprite_scaling': [
    ]
    'minecraft:height_provider': [
    ]
    'minecraft:hover_event': [
    ]
    'minecraft:input_control': [
    ]
    'minecraft:int_provider': [
        unknown,
    ]
    'minecraft:item': [
    ]
    'minecraft:item_model': [
    ]
    'minecraft:jigsaw_max_distance_from_center': [
    ]
    'minecraft:level_based_value': [
    ]
    'minecraft:list_operation': [
    ]
    'minecraft:location_based_effect': [
    ]
    'minecraft:loot_condition': [
    ]
    'minecraft:loot_function': [
    ]
    'minecraft:loot_pool_entry': [
    ]
    'minecraft:memory_module': [
    ]
    'minecraft:multi_noise_biome_source': [
    ]
    'minecraft:nbt_provider': [
    ]
    'minecraft:number_provider': [
    ]
    'minecraft:numeric_item_property': [
    ]
    'minecraft:particle': [
    ]
    'minecraft:placement_modifier': [
    ]
    'minecraft:pos_rule_test': [
    ]
    'minecraft:position_source': [
    ]
    'minecraft:random_int_generator': [
    ]
    'minecraft:recipe_serializer': [
    ]
    'minecraft:reputation_part_value': [
    ]
    'minecraft:resource': [
    ]
    'minecraft:root_placer': [
    ]
    'minecraft:rule_block_entity_modifier': [
    ]
    'minecraft:rule_test': [
    ]
    'minecraft:score_provider': [
    ]
    'minecraft:select_item_property': [
    ]
    'minecraft:slot_source': [
    ]
    'minecraft:sound_type': [
    ]
    'minecraft:spawn_condition': [
    ]
    'minecraft:special_item_model': [
    ]
    'minecraft:sprite_source': [
    ]
    'minecraft:statistic_type': [
    ]
    'minecraft:storage': [
    ]
    'minecraft:structure_config': [
    ]
    'minecraft:structure_placement': [
    ]
    'minecraft:surface_condition': [
    ]
    'minecraft:surface_rule': [
    ]
    'minecraft:template_pool_element': [
    ]
    'minecraft:template_processor': [
    ]
    'minecraft:test_environment_definition': [
    ]
    'minecraft:test_instance': [
    ]
    'minecraft:tint_source': [
    ]
    'minecraft:tree_decorator': [
    ]
    'minecraft:trigger': [
    ]
    'minecraft:trunk_placer': [
    ]
    'minecraft:uniform_value': [
    ]
    'minecraft:value_effect': [
    ]
    'minecraft:worldgen/pool_alias_binding': [
    ]
    'mcdoc:fluid_state_keys': [
    ]
}
type DefaultArgs<R extends keyof DispatcherRequiredArgs> = DispatcherRequiredArgs[R]['length'] extends 0 ? [
] : never
type ApplyDispatcher<R extends keyof DispatcherRequiredArgs, Args extends Array<unknown>> = R extends 'mcdoc:fluid_state_keys' ? Args extends [
    '%fallback',
] ? SymbolMcdocFluidStateKeys<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocFluidStateKeys<'%none'> : Args extends [
        ] ? SymbolMcdocFluidStateKeys<'map'> : never : R extends 'minecraft:worldgen/pool_alias_binding' ? Args extends [
    '%fallback',
] ? SymbolWorldgenPoolAliasBinding<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolWorldgenPoolAliasBinding<'%none'> : Args extends [
        ] ? SymbolWorldgenPoolAliasBinding<'map'> : never : R extends 'minecraft:value_effect' ? Args extends [
    '%fallback',
] ? SymbolValueEffect<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolValueEffect<'%none'> : Args extends [
        ] ? SymbolValueEffect<'map'> : never : R extends 'minecraft:uniform_value' ? Args extends [
    '%fallback',
] ? SymbolUniformValue<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolUniformValue<'%none'> : Args extends [
        ] ? SymbolUniformValue<'map'> : never : R extends 'minecraft:trunk_placer' ? Args extends [
    '%fallback',
] ? SymbolTrunkPlacer<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTrunkPlacer<'%none'> : Args extends [
        ] ? SymbolTrunkPlacer<'map'> : never : R extends 'minecraft:trigger' ? Args extends [
    '%fallback',
] ? SymbolTrigger<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTrigger<'%none'> : Args extends [
        ] ? SymbolTrigger<'map'> : never : R extends 'minecraft:tree_decorator' ? Args extends [
    '%fallback',
] ? SymbolTreeDecorator<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTreeDecorator<'%none'> : Args extends [
        ] ? SymbolTreeDecorator<'map'> : never : R extends 'minecraft:tint_source' ? Args extends [
    '%fallback',
] ? SymbolTintSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTintSource<'%none'> : Args extends [
        ] ? SymbolTintSource<'map'> : never : R extends 'minecraft:test_instance' ? Args extends [
    '%fallback',
] ? SymbolTestInstance<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTestInstance<'%none'> : Args extends [
        ] ? SymbolTestInstance<'map'> : never : R extends 'minecraft:test_environment_definition' ? Args extends [
    '%fallback',
] ? SymbolTestEnvironmentDefinition<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTestEnvironmentDefinition<'%none'> : Args extends [
        ] ? SymbolTestEnvironmentDefinition<'map'> : never : R extends 'minecraft:template_processor' ? Args extends [
    '%fallback',
] ? SymbolTemplateProcessor<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTemplateProcessor<'%none'> : Args extends [
        ] ? SymbolTemplateProcessor<'map'> : never : R extends 'minecraft:template_pool_element' ? Args extends [
    '%fallback',
] ? SymbolTemplatePoolElement<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolTemplatePoolElement<'%none'> : Args extends [
        ] ? SymbolTemplatePoolElement<'map'> : never : R extends 'minecraft:surface_rule' ? Args extends [
    '%fallback',
] ? SymbolSurfaceRule<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSurfaceRule<'%none'> : Args extends [
        ] ? SymbolSurfaceRule<'map'> : never : R extends 'minecraft:surface_condition' ? Args extends [
    '%fallback',
] ? SymbolSurfaceCondition<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSurfaceCondition<'%none'> : Args extends [
        ] ? SymbolSurfaceCondition<'map'> : never : R extends 'minecraft:structure_placement' ? Args extends [
    '%fallback',
] ? SymbolStructurePlacement<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolStructurePlacement<'%none'> : Args extends [
        ] ? SymbolStructurePlacement<'map'> : never : R extends 'minecraft:structure_config' ? Args extends [
    '%fallback',
] ? SymbolStructureConfig<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolStructureConfig<'%none'> : Args extends [
        ] ? SymbolStructureConfig<'map'> : never : R extends 'minecraft:storage' ? Args extends [
    '%fallback',
] ? SymbolStorage<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolStorage<'%none'> : Args extends [
        ] ? SymbolStorage<'map'> : never : R extends 'minecraft:statistic_type' ? Args extends [
    '%fallback',
] ? SymbolStatisticType<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolStatisticType<'%none'> : Args extends [
        ] ? SymbolStatisticType<'map'> : never : R extends 'minecraft:sprite_source' ? Args extends [
    '%fallback',
] ? SymbolSpriteSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSpriteSource<'%none'> : Args extends [
        ] ? SymbolSpriteSource<'map'> : never : R extends 'minecraft:special_item_model' ? Args extends [
    '%fallback',
] ? SymbolSpecialItemModel<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSpecialItemModel<'%none'> : Args extends [
        ] ? SymbolSpecialItemModel<'map'> : never : R extends 'minecraft:spawn_condition' ? Args extends [
    '%fallback',
] ? SymbolSpawnCondition<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSpawnCondition<'%none'> : Args extends [
        ] ? SymbolSpawnCondition<'map'> : never : R extends 'minecraft:sound_type' ? Args extends [
    '%fallback',
] ? SymbolSoundType<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSoundType<'%none'> : Args extends [
        ] ? SymbolSoundType<'map'> : never : R extends 'minecraft:slot_source' ? Args extends [
    '%fallback',
] ? SymbolSlotSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSlotSource<'%none'> : Args extends [
        ] ? SymbolSlotSource<'map'> : never : R extends 'minecraft:select_item_property' ? Args extends [
    '%fallback',
] ? SymbolSelectItemProperty<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolSelectItemProperty<'%none'> : Args extends [
        ] ? SymbolSelectItemProperty<'map'> : never : R extends 'minecraft:score_provider' ? Args extends [
    '%fallback',
] ? SymbolScoreProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolScoreProvider<'%none'> : Args extends [
        ] ? SymbolScoreProvider<'map'> : never : R extends 'minecraft:rule_test' ? Args extends [
    '%fallback',
] ? SymbolRuleTest<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolRuleTest<'%none'> : Args extends [
        ] ? SymbolRuleTest<'map'> : never : R extends 'minecraft:rule_block_entity_modifier' ? Args extends [
    '%fallback',
] ? SymbolRuleBlockEntityModifier<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolRuleBlockEntityModifier<'%none'> : Args extends [
        ] ? SymbolRuleBlockEntityModifier<'map'> : never : R extends 'minecraft:root_placer' ? Args extends [
    '%fallback',
] ? SymbolRootPlacer<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolRootPlacer<'%none'> : Args extends [
        ] ? SymbolRootPlacer<'map'> : never : R extends 'minecraft:resource' ? Args extends [
    '%fallback',
] ? SymbolResource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolResource<'%none'> : Args extends [
        ] ? SymbolResource<'map'> : never : R extends 'minecraft:reputation_part_value' ? Args extends [
    '%fallback',
] ? SymbolReputationPartValue<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolReputationPartValue<'%none'> : Args extends [
        ] ? SymbolReputationPartValue<'map'> : never : R extends 'minecraft:recipe_serializer' ? Args extends [
    '%fallback',
] ? SymbolRecipeSerializer<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolRecipeSerializer<'%none'> : Args extends [
        ] ? SymbolRecipeSerializer<'map'> : never : R extends 'minecraft:random_int_generator' ? Args extends [
    '%fallback',
] ? SymbolRandomIntGenerator<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolRandomIntGenerator<'%none'> : Args extends [
        ] ? SymbolRandomIntGenerator<'map'> : never : R extends 'minecraft:position_source' ? Args extends [
    '%fallback',
] ? SymbolPositionSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolPositionSource<'%none'> : Args extends [
        ] ? SymbolPositionSource<'map'> : never : R extends 'minecraft:pos_rule_test' ? Args extends [
    '%fallback',
] ? SymbolPosRuleTest<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolPosRuleTest<'%none'> : Args extends [
        ] ? SymbolPosRuleTest<'map'> : never : R extends 'minecraft:placement_modifier' ? Args extends [
    '%fallback',
] ? SymbolPlacementModifier<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolPlacementModifier<'%none'> : Args extends [
        ] ? SymbolPlacementModifier<'map'> : never : R extends 'minecraft:particle' ? Args extends [
    '%fallback',
] ? SymbolParticle<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolParticle<'%none'> : Args extends [
        ] ? SymbolParticle<'map'> : never : R extends 'minecraft:numeric_item_property' ? Args extends [
    '%fallback',
] ? SymbolNumericItemProperty<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolNumericItemProperty<'%none'> : Args extends [
        ] ? SymbolNumericItemProperty<'map'> : never : R extends 'minecraft:number_provider' ? Args extends [
    '%fallback',
] ? SymbolNumberProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolNumberProvider<'%none'> : Args extends [
        ] ? SymbolNumberProvider<'map'> : never : R extends 'minecraft:nbt_provider' ? Args extends [
    '%fallback',
] ? SymbolNbtProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolNbtProvider<'%none'> : Args extends [
        ] ? SymbolNbtProvider<'map'> : never : R extends 'minecraft:multi_noise_biome_source' ? Args extends [
    '%fallback',
] ? SymbolMultiNoiseBiomeSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMultiNoiseBiomeSource<'%none'> : Args extends [
        ] ? SymbolMultiNoiseBiomeSource<'map'> : never : R extends 'minecraft:memory_module' ? Args extends [
    '%fallback',
] ? SymbolMemoryModule<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMemoryModule<'%none'> : Args extends [
        ] ? SymbolMemoryModule<'map'> : never : R extends 'minecraft:loot_pool_entry' ? Args extends [
    '%fallback',
] ? SymbolLootPoolEntry<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolLootPoolEntry<'%none'> : Args extends [
        ] ? SymbolLootPoolEntry<'map'> : never : R extends 'minecraft:loot_function' ? Args extends [
    '%fallback',
] ? SymbolLootFunction<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolLootFunction<'%none'> : Args extends [
        ] ? SymbolLootFunction<'map'> : never : R extends 'minecraft:loot_condition' ? Args extends [
    '%fallback',
] ? SymbolLootCondition<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolLootCondition<'%none'> : Args extends [
        ] ? SymbolLootCondition<'map'> : never : R extends 'minecraft:location_based_effect' ? Args extends [
    '%fallback',
] ? SymbolLocationBasedEffect<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolLocationBasedEffect<'%none'> : Args extends [
        ] ? SymbolLocationBasedEffect<'map'> : never : R extends 'minecraft:list_operation' ? Args extends [
    '%fallback',
] ? SymbolListOperation<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolListOperation<'%none'> : Args extends [
        ] ? SymbolListOperation<'map'> : never : R extends 'minecraft:level_based_value' ? Args extends [
    '%fallback',
] ? SymbolLevelBasedValue<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolLevelBasedValue<'%none'> : Args extends [
        ] ? SymbolLevelBasedValue<'map'> : never : R extends 'minecraft:jigsaw_max_distance_from_center' ? Args extends [
    '%fallback',
] ? SymbolJigsawMaxDistanceFromCenter<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolJigsawMaxDistanceFromCenter<'%none'> : Args extends [
        ] ? SymbolJigsawMaxDistanceFromCenter<'map'> : never : R extends 'minecraft:item_model' ? Args extends [
    '%fallback',
] ? SymbolItemModel<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolItemModel<'%none'> : Args extends [
        ] ? SymbolItemModel<'map'> : never : R extends 'minecraft:item' ? Args extends [
    '%fallback',
] ? SymbolItem<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolItem<'%none'> : Args extends [
        ] ? SymbolItem<'map'> : never : R extends 'minecraft:input_control' ? Args extends [
    '%fallback',
] ? SymbolInputControl<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolInputControl<'%none'> : Args extends [
        ] ? SymbolInputControl<'map'> : never : R extends 'minecraft:hover_event' ? Args extends [
    '%fallback',
] ? SymbolHoverEvent<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolHoverEvent<'%none'> : Args extends [
        ] ? SymbolHoverEvent<'map'> : never : R extends 'minecraft:height_provider' ? Args extends [
    '%fallback',
] ? SymbolHeightProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolHeightProvider<'%none'> : Args extends [
        ] ? SymbolHeightProvider<'map'> : never : R extends 'minecraft:gui_sprite_scaling' ? Args extends [
    '%fallback',
] ? SymbolGuiSpriteScaling<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolGuiSpriteScaling<'%none'> : Args extends [
        ] ? SymbolGuiSpriteScaling<'map'> : never : R extends 'minecraft:glyph_provider' ? Args extends [
    '%fallback',
] ? SymbolGlyphProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolGlyphProvider<'%none'> : Args extends [
        ] ? SymbolGlyphProvider<'map'> : never : R extends 'minecraft:game_rule' ? Args extends [
    '%fallback',
] ? SymbolGameRule<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolGameRule<'%none'> : Args extends [
        ] ? SymbolGameRule<'map'> : never : R extends 'minecraft:foliage_placer' ? Args extends [
    '%fallback',
] ? SymbolFoliagePlacer<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolFoliagePlacer<'%none'> : Args extends [
        ] ? SymbolFoliagePlacer<'map'> : never : R extends 'minecraft:feature_size' ? Args extends [
    '%fallback',
] ? SymbolFeatureSize<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolFeatureSize<'%none'> : Args extends [
        ] ? SymbolFeatureSize<'map'> : never : R extends 'minecraft:feature_config' ? Args extends [
    '%fallback',
] ? SymbolFeatureConfig<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolFeatureConfig<'%none'> : Args extends [
        ] ? SymbolFeatureConfig<'map'> : never : R extends 'minecraft:environment_attribute_color_modifier' ? Args extends [
    '%fallback',
] ? SymbolEnvironmentAttributeColorModifier<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEnvironmentAttributeColorModifier<'%none'> : Args extends [
        ] ? SymbolEnvironmentAttributeColorModifier<'map'> : never : R extends 'minecraft:environment_attribute_argb_color_modifier' ? Args extends [
    '%fallback',
] ? SymbolEnvironmentAttributeArgbColorModifier<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEnvironmentAttributeArgbColorModifier<'%none'> : Args extends [
        ] ? SymbolEnvironmentAttributeArgbColorModifier<'map'> : never : R extends 'minecraft:environment_attribute' ? Args extends [
    '%fallback',
] ? SymbolEnvironmentAttribute<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEnvironmentAttribute<'%none'> : Args extends [
        ] ? SymbolEnvironmentAttribute<'map'> : never : R extends 'minecraft:entity_sub_predicate' ? Args extends [
    '%fallback',
] ? SymbolEntitySubPredicate<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEntitySubPredicate<'%none'> : Args extends [
        ] ? SymbolEntitySubPredicate<'map'> : never : R extends 'minecraft:entity_effect' ? Args extends [
    '%fallback',
] ? SymbolEntityEffect<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEntityEffect<'%none'> : Args extends [
        ] ? SymbolEntityEffect<'map'> : never : R extends 'minecraft:entity' ? Args extends [
    '%fallback',
] ? SymbolEntity<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEntity<'%none'> : Args extends [
        ] ? SymbolEntity<'map'> : never : R extends 'minecraft:enchantment_provider' ? Args extends [
    '%fallback',
] ? SymbolEnchantmentProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEnchantmentProvider<'%none'> : Args extends [
        ] ? SymbolEnchantmentProvider<'map'> : never : R extends 'minecraft:effect_component' ? Args extends [
    '%fallback',
] ? SymbolEffectComponent<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolEffectComponent<'%none'> : Args extends [
        ] ? SymbolEffectComponent<'map'> : never : R extends 'minecraft:dialog_body' ? Args extends [
    '%fallback',
] ? SymbolDialogBody<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDialogBody<'%none'> : Args extends [
        ] ? SymbolDialogBody<'map'> : never : R extends 'minecraft:dialog_action' ? Args extends [
    '%fallback',
] ? SymbolDialogAction<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDialogAction<'%none'> : Args extends [
        ] ? SymbolDialogAction<'map'> : never : R extends 'minecraft:dialog' ? Args extends [
    '%fallback',
] ? SymbolDialog<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDialog<'%none'> : Args extends [
        ] ? SymbolDialog<'map'> : never : R extends 'minecraft:density_function' ? Args extends [
    '%fallback',
] ? SymbolDensityFunction<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDensityFunction<'%none'> : Args extends [
        ] ? SymbolDensityFunction<'map'> : never : R extends 'minecraft:decorator_config' ? Args extends [
    '%fallback',
] ? SymbolDecoratorConfig<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDecoratorConfig<'%none'> : Args extends [
        ] ? SymbolDecoratorConfig<'map'> : never : R extends 'minecraft:data_component_predicate' ? Args extends [
    '%fallback',
] ? SymbolDataComponentPredicate<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDataComponentPredicate<'%none'> : Args extends [
        ] ? SymbolDataComponentPredicate<'map'> : never : R extends 'minecraft:data_component' ? Args extends [
    '%fallback',
] ? SymbolDataComponent<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolDataComponent<'%none'> : Args extends [
        ] ? SymbolDataComponent<'map'> : never : R extends 'minecraft:consume_effect' ? Args extends [
    '%fallback',
] ? SymbolConsumeEffect<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolConsumeEffect<'%none'> : Args extends [
        ] ? SymbolConsumeEffect<'map'> : never : R extends 'minecraft:conditional_item_property' ? Args extends [
    '%fallback',
] ? SymbolConditionalItemProperty<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolConditionalItemProperty<'%none'> : Args extends [
        ] ? SymbolConditionalItemProperty<'map'> : never : R extends 'minecraft:click_event' ? Args extends [
    '%fallback',
] ? SymbolClickEvent<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolClickEvent<'%none'> : Args extends [
        ] ? SymbolClickEvent<'map'> : never : R extends 'minecraft:chunk_generator' ? Args extends [
    '%fallback',
] ? SymbolChunkGenerator<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolChunkGenerator<'%none'> : Args extends [
        ] ? SymbolChunkGenerator<'map'> : never : R extends 'minecraft:carver_config' ? Args extends [
    '%fallback',
] ? SymbolCarverConfig<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolCarverConfig<'%none'> : Args extends [
        ] ? SymbolCarverConfig<'map'> : never : R extends 'minecraft:block_state_provider' ? Args extends [
    '%fallback',
] ? SymbolBlockStateProvider<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBlockStateProvider<'%none'> : Args extends [
        ] ? SymbolBlockStateProvider<'map'> : never : R extends 'minecraft:block_predicate' ? Args extends [
    '%fallback',
] ? SymbolBlockPredicate<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBlockPredicate<'%none'> : Args extends [
        ] ? SymbolBlockPredicate<'map'> : never : R extends 'minecraft:block_placer' ? Args extends [
    '%fallback',
] ? SymbolBlockPlacer<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBlockPlacer<'%none'> : Args extends [
        ] ? SymbolBlockPlacer<'map'> : never : R extends 'minecraft:block_entity' ? Args extends [
    '%fallback',
] ? SymbolBlockEntity<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBlockEntity<'%none'> : Args extends [
        ] ? SymbolBlockEntity<'map'> : never : R extends 'minecraft:block' ? Args extends [
    '%fallback',
] ? SymbolBlock<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBlock<'%none'> : Args extends [
        ] ? SymbolBlock<'map'> : never : R extends 'minecraft:biome_source' ? Args extends [
    '%fallback',
] ? SymbolBiomeSource<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolBiomeSource<'%none'> : Args extends [
        ] ? SymbolBiomeSource<'map'> : never : R extends 'minecraft:attribute_display' ? Args extends [
    '%fallback',
] ? SymbolAttributeDisplay<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolAttributeDisplay<'%none'> : Args extends [
        ] ? SymbolAttributeDisplay<'map'> : never : R extends 'minecraft:apply_bonus_formula' ? Args extends [
    '%fallback',
] ? SymbolApplyBonusFormula<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolApplyBonusFormula<'%none'> : Args extends [
        ] ? SymbolApplyBonusFormula<'map'> : never : R extends 'mcdoc:marker_data' ? Args extends [
    '%fallback',
] ? SymbolMcdocMarkerData<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocMarkerData<'%none'> : Args extends [
        ] ? SymbolMcdocMarkerData<'map'> : never : R extends 'mcdoc:fluid_states' ? Args extends [
    '%fallback',
] ? SymbolMcdocFluidStates<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocFluidStates<'%none'> : Args extends [
        ] ? SymbolMcdocFluidStates<'map'> : never : R extends 'mcdoc:custom_event' ? Args extends [
    '%fallback',
] ? SymbolMcdocCustomEvent<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocCustomEvent<'%none'> : Args extends [
        ] ? SymbolMcdocCustomEvent<'map'> : never : R extends 'mcdoc:custom_dynamic_event_keys' ? Args extends [
    '%fallback',
] ? SymbolMcdocCustomDynamicEventKeys<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocCustomDynamicEventKeys<'%none'> : Args extends [
        ] ? SymbolMcdocCustomDynamicEventKeys<'map'> : never : R extends 'mcdoc:custom_dynamic_event_additions' ? Args extends [
    '%fallback',
] ? SymbolMcdocCustomDynamicEventAdditions<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocCustomDynamicEventAdditions<'%none'> : Args extends [
        ] ? SymbolMcdocCustomDynamicEventAdditions<'map'> : never : R extends 'mcdoc:custom_data' ? Args extends [
    '%fallback',
] ? SymbolMcdocCustomData<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocCustomData<'%none'> : Args extends [
        ] ? SymbolMcdocCustomData<'map'> : never : R extends 'mcdoc:block_states' ? Args extends [
    '%fallback',
] ? SymbolMcdocBlockStates<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocBlockStates<'%none'> : Args extends [
        ] ? SymbolMcdocBlockStates<'map'> : never : R extends 'mcdoc:block_state_keys' ? Args extends [
    '%fallback',
] ? SymbolMcdocBlockStateKeys<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocBlockStateKeys<'%none'> : Args extends [
        ] ? SymbolMcdocBlockStateKeys<'map'> : never : R extends 'mcdoc:block_item_states' ? Args extends [
    '%fallback',
] ? SymbolMcdocBlockItemStates<'%fallback'> : Args extends [
        '%none',
    ] ? SymbolMcdocBlockItemStates<'%none'> : Args extends [
        ] ? SymbolMcdocBlockItemStates<'map'> : never : R extends 'minecraft:int_provider' ? Args extends [
    infer A,
    '%fallback',
] ? SymbolIntProvider<A, '%fallback'> : Args extends [
        infer A,
        '%none',
    ] ? SymbolIntProvider<A, '%none'> : Args extends [
            infer A,
        ] ? SymbolIntProvider<A, 'map'> : never : R extends 'minecraft:float_provider' ? Args extends [
    infer A,
    '%fallback',
] ? SymbolFloatProvider<A, '%fallback'> : Args extends [
        infer A,
        '%none',
    ] ? SymbolFloatProvider<A, '%none'> : Args extends [
            infer A,
        ] ? SymbolFloatProvider<A, 'map'> : never : R extends 'minecraft:environment_attribute_float_modifier' ? Args extends [
    infer A,
    '%fallback',
] ? SymbolEnvironmentAttributeFloatModifier<A, '%fallback'> : Args extends [
        infer A,
        '%none',
    ] ? SymbolEnvironmentAttributeFloatModifier<A, '%none'> : Args extends [
            infer A,
        ] ? SymbolEnvironmentAttributeFloatModifier<A, 'map'> : never : never
export type Dispatcher<R extends keyof DispatcherRequiredArgs, Args extends Array<unknown> = DefaultArgs<R>> = ApplyDispatcher<R, Args>
