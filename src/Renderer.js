import chalk from 'chalk'
import { Rline } from './Rline.js'
import { EMPTY, FOOD, SNAKE_BODY, SNAKE_HEAD } from './core/types.js'

const logo = `\n\n░██████╗███╗░░██╗░█████╗░██╗░░██╗███████╗\n██╔════╝████╗░██║██╔══██╗██║░██╔╝██╔════╝\n╚█████╗░██╔██╗██║███████║█████═╝░█████╗░░\n░╚═══██╗██║╚████║██╔══██║██╔═██╗░██╔══╝░░\n██████╔╝██║░╚███║██║░░██║██║░╚██╗███████╗\n╚═════╝░╚═╝░░╚══╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝\n\n`

export class Renderer {
	constructor() {
		this.rline = new Rline()
		this.paddingTop = logo.split('\n').length
	}

	renderLogo() {
		this.rline.write(logo)
	}

	async settingsQuestions() {
		const speed = await this.rline.questionWithCohices(
			'Game mode? (1=easy 2=medium 3=hard): ',
			[
				{ name: '1', value: 1 },
				{ name: '2', value: 1.5 },
				{ name: '3', value: 2 },
			]
		)
		const size = await this.rline.questionWithCohices(
			'Field size? (1=small 2=average 3=big): ',
			[
				{ name: '1', value: 10 },
				{ name: '2', value: 12 },
				{ name: '3', value: 14 },
			]
		)
		return { size, speed }
	}

	async retryQuestion() {
		return await this.rline.questionWithCohices('GAME OVER! MAY RETRY? (Y/n): ', [
			{ name: 'Y', value: true },
			{ name: 'y', value: true },
			{ name: 'N', value: false },
			{ name: 'n', value: false },
		])
	}

	async renderTimer(delay = 3) {
		return new Promise((res) => {
			this.clearField()
			let delta = delay
			this.rline.write(`Game will start in ${delta}`)
			const timerId = setInterval(() => {
				this.rline.clearLine(this.paddingTop)
				delta -= 1
				if (delta === 0) {
					return clearInterval(timerId, res())
				}
				this.rline.write(`Game will start in ${delta}`)
			}, 1000)
		})
	}

	renderField(field) {
		this.clearField()
		let r = ''
		for (let row of field) {
			for (let cell of row) {
				r += this.getCellValue(cell)
			}
			r += '\n'
		}
		this.rline.write(r)
	}

	getCellValue(cellType) {
		if (cellType === EMPTY) return chalk.bgGray('  ')
		if (cellType === FOOD) return chalk.bgRed('  ')
		if (cellType === SNAKE_HEAD) return chalk.bgGreenBright('  ')
		if (cellType === SNAKE_BODY) return chalk.bgGreen('  ')
	}

	clearAll() {
		this.rline.clearAll()
	}

	clearField() {
		this.rline.clearAll(this.paddingTop)
	}
}
