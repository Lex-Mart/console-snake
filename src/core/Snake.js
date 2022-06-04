import { randomInt } from './utils.js'
import { UP, DOWN, RIGHT, LEFT } from './types.js'

export class Snake {
	constructor(fieldSize) {
		this.fieldSize = fieldSize
		this.position = this.generateStartPosition()
		this.prevPositon = []
		this.moveDirection = UP
	}

	setMoveDirection(newDir) {
		const prevDir = this.moveDirection
		if ((newDir === UP || newDir === DOWN) && (prevDir === RIGHT || prevDir === LEFT)) {
			this.moveDirection = newDir
			return true
		}
		if ((newDir === RIGHT || newDir === LEFT) && (prevDir === UP || prevDir === DOWN)) {
			this.moveDirection = newDir
			return true
		}
	}

	generateStartPosition() {
		const padding = 2
		const min = padding
		const max = this.fieldSize - padding - 1

		const headX = randomInt(min, max)
		const headY = randomInt(min, max)
		const tailX = headX
		const tailY = headY + 1

		return [
			[headX, headY],
			[tailX, tailY],
		]
	}

	move() {
		this.prevPositon = [...this.position]
		this.removeTail()
		this.addHead(this.newHeadPosition())
	}

	newHeadPosition() {
		const prevHead = this.getHead()
		let newHead = prevHead

		if (this.moveDirection === UP) {
			newHead = [prevHead[0], prevHead[1] - 1]
			if (newHead[1] < 0) newHead[1] = this.fieldSize - 1
		}
		if (this.moveDirection === DOWN) {
			newHead = [prevHead[0], prevHead[1] + 1]
			if (newHead[1] > this.fieldSize - 1) newHead[1] = 0
		}
		if (this.moveDirection === LEFT) {
			newHead = [prevHead[0] - 1, prevHead[1]]
			if (newHead[0] < 0) newHead[0] = this.fieldSize - 1
		}
		if (this.moveDirection === RIGHT) {
			newHead = [prevHead[0] + 1, prevHead[1]]
			if (newHead[0] > this.fieldSize - 1) newHead[0] = 0
		}

		return newHead
	}

	getHead() {
		return this.position[0]
	}

	checkCollision() {
		const map = new Map()
		this.position.forEach((pos) => map.set(pos.join(',', pos)))
		if (map.size < this.position.length) {
			return true
		}
		return false
	}

	addHead(cell) {
		this.position.unshift(cell)
	}

	addTail(cell) {
		this.position.push(cell)
	}

	removeTail() {
		this.position.splice(-1)
	}

	eat(foodPosition) {
		const [fX, fY] = foodPosition
		const [hX, hY] = this.getHead()
		if (fX === hX && fY === hY) {
			this.addTail(this.prevPositon.at(-1))
			return true
		}
		return false
	}
}
