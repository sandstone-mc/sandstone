import sand from '../src'

sand.mcfunction('coucou', () => {
  sand.say('hi')
  sand.execute.as('@a').at('@s').say('hey')

  sand.execute.as('@a').run(() => {
    sand.say('child function')
    sand.say('This is too bad')
  })
})

sand.save()
