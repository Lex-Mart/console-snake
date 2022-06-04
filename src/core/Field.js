import { EMPTY, FOOD, SNAKE_BODY, SNAKE_HEAD } from './types.js'

export class Field {
	constructor(size) {
		if (size < 8) throw new Error('min field size 8x8')

		this.size = size
		this.field = this.generateField(size)
		this.prevField = []
	}

	generateField() {
		const f = new Array(this.size).fill(0)
		return f.map(() => new Array(this.size).fill(EMPTY))
	}

	update(foodPostion, snakePostion) {
		this.prevField = [...this.field]
		this.field = this.generateField()

		const [fX, fY] = foodPostion
		this.field[fY][fX] = FOOD

		for (let [idx, s] of snakePostion.entries()) {
			const [sX, sY] = s
			if (idx === 0) {
				this.field[sY][sX] = SNAKE_HEAD
			} else {
				this.field[sY][sX] = SNAKE_BODY
			}
		}
	}
}
