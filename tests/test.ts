import { tellraw } from 'src/commands'
import { MCFunction, Predicate, savePack } from 'src/core'

MCFunction('display_message', () => {
  tellraw('@a', [
    ['hi'],
    '\n========= Congratulations! =========\n\n',
    { text: ' Sandstone', color: 'gold', bold: true }, ' is ', { text: 'successfully installed.\n\n', color: 'green' },
    ' Add files to the ', { text: 'src', underlined: true }, ' folder\n',
    ' and start creating your data pack!\n',
    '==============', { text: '🏹', color: '#D2691E' }, { text: '⚔', color: '#45ACA5' }, { text: '⛏', color: '#FFD700' }, '==============',
  ])
}, {
  runOnLoad: true,
})

savePack('My Datapack', {
  verbose: true,
  world: 'Crea1_15',
})
