import { randomInt } from './utils.js'

export class Food {
	static generatePosition(fieldSize, snakePosition) {
		const pos = [randomInt(0, fieldSize - 1), randomInt(0, fieldSize - 1)]
		let isNotEmptyCell = snakePosition.some((sp) => sp[0] === pos[0] && sp[1] === pos[1])
		return isNotEmptyCell ? Food.generatePosition(fieldSize, snakePosition) : pos
	}
}
