import { promisify } from 'util'
import readline from 'readline'

export class Rline {
	constructor() {
		this.stdout = process.stdout
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			historySize: 0,
		})
		this.question = promisify(this.rl.question).bind(this.rl)
	}

	write(text) {
		console.log(text)
	}

	async questionWithCohices(message, choices = []) {
		const ans = await this.question(message)
		const isChoice = choices.find((el) => el.name == ans)
		if (isChoice) {
			return isChoice.value
		} else {
			this.stdout.moveCursor(0, -1)
			return await this.questionWithCohices(message, choices)
		}
	}

	clearLine(lineIndex) {
		if (lineIndex) {
			this.stdout.cursorTo(0, lineIndex)
		}
		this.stdout.clearLine(0)
		if (this.stdout.isPaused()) {
			htis.stdout.resume()
		}
	}

	clearAll(fromLineIndex = 0) {
		this.stdout.cursorTo(0, fromLineIndex)
		this.stdout.clearScreenDown()
		if (this.stdout.isPaused()) {
			this.stdout.resume()
		}
	}

	static onArrowKeypress(fn) {
		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		process.stdin.on('keypress', async (_, { name, ctrl }) => {
			if (ctrl && name == 'c') process.exit()
			if (name === 'up' || name === 'down' || name === 'left' || name === 'right') {
				fn(name)
			}
			if (process.stdin.isPaused()) {
				process.stdin.resume()
			}
		})
	}
}
