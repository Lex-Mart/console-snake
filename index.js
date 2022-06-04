import { Game } from './src/core/Game.js'
import { Renderer } from './src/Renderer.js'
import { Rline } from './src/Rline.js'
import { STATUS_GAME_OVER } from './src/core/types.js'

const renderer = new Renderer()
const startGame = async () => {
	renderer.clearAll()
	renderer.renderLogo()
	const { size, speed } = await renderer.settingsQuestions()
	await renderer.renderTimer(3)

	const game = new Game(size, speed)
	Rline.onArrowKeypress((key) => game.controlHandler(key))
	game.onUpdate(({ field }) => renderer.renderField(field))
	game.onUpdate(async ({ status }) => {
		if (status === STATUS_GAME_OVER) {
			const retry = await renderer.retryQuestion()
			if (retry) {
				startGame()
				process.stdin.setRawMode(true)
			} else {
				process.exit(0)
			}
		}
	})
	game.start()
}

startGame()
