import { execute, say, setblock } from './commandsTree'

execute.as('@s').in('minecraft:the_nether').say('Hello!')

execute.if.score('@s', 'kills')['<=']
