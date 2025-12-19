import type { Rotation } from 'sandstone/generated/data/gametest'
import type { Registry } from 'sandstone/generated/registry'
import type { Text } from 'sandstone/generated/util/text'
import type { BlockEntity } from 'sandstone/generated/world/block'
import type { NBTIntArray } from 'sandstone'

export type TestInstanceBlock = (BlockEntity & {
    data?: {
        test?: Registry['minecraft:test_instance']
        /**
         * Value:
         * Array length range: 3
         */
        size: NBTIntArray<{
            leftExclusive: false
            rightExclusive: false
            min: 3
            max: 3
        }>
        /**
         * Value:
         *
         *  - None(`none`)
         *  - Clockwise90(`clockwise_90`)
         *  - Clockwise180(`180`)
         *  - CounterClockwise90(`counterclockwise_90`)
         */
        rotation: Rotation
        ignore_entities: boolean
        /**
         * Value:
         *
         *  - Cleared(`cleared`)
         *  - Running(`running`)
         *  - Finished(`finished`)
         */
        status: TestInstanceBlockStatus
        error_message?: Text
    }
    errors?: Array<{
        /**
         * Value:
         * Array length range: 3
         */
        pos: NBTIntArray<{
            leftExclusive: false
            rightExclusive: false
            min: 3
            max: 3
        }>
        text: Text
    }>
})

export type TestInstanceBlockStatus = ('cleared' | 'running' | 'finished')
