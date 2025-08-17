import { attribute } from 'sandstone'
import { describe, it } from 'vitest'
import { compareSingleOutputText } from '../../../utils'

describe('Attribute Command', () => {
  it('should generate attribute get command', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').get()
    }, ['attribute @p generic.max_health get'])
  })

  it('should generate attribute base get command', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').baseGet()
    }, ['attribute @p generic.max_health base get'])
  })

  it('should generate attribute base set command', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').baseSet(20)
    }, ['attribute @p generic.max_health base set 20'])
  })

  it('should generate attribute modifier add command', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').add('uuid', 'test_modifier', 5, 'add_value' as any)
    }, ['attribute @p generic.max_health modifier add uuid test_modifier 5 add_value'])
  })

  it('should generate attribute modifier remove command', async () => {
    await compareSingleOutputText(() => {
      attribute('@p', 'generic.max_health').remove('test_modifier')
    }, ['attribute @p generic.max_health modifier remove test_modifier'])
  })
})
