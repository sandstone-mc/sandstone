import { MCFunction, Selector, tellraw } from 'sandstone'

MCFunction('test', () => {
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
