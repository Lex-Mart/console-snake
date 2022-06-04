import { Food } from './Food.js'
import { Field } from './Field.js'
import { Snake } from './Snake.js'
import { STATUS_GAME_OVER, STATUS_PENDING, STATUS_PLAY } from './types.js'

export class Game {
	constructor(fieldSize, speed) {
		if (speed < 0.4) throw new Error('min speed 0.4')
		if (speed > 2) throw new Error('max speed 2')

		this.speed = 200 / speed
		this.field = new Field(fieldSize)
		this.snake = new Snake(fieldSize)
		this.foodPosition = Food.generatePosition(fieldSize, this.snake.position)
		this.status = STATUS_PENDING
		this.dirWasChangeInThisTick = false

		this.listeners = []
	}

	updateField() {
		this.field.update(this.foodPosition, this.snake.position)
		this.callListeners()
	}

	callListeners() {
		this.listeners.forEach((l) => l({ field: this.field.field, status: this.status }))
	}

	controlHandler(direction) {
		if (!this.dirWasChangeInThisTick) {
			const isSet = this.snake.setMoveDirection(direction)
			if (isSet) this.dirWasChangeInThisTick = true
		}
	}

	mainCycle() {
		const timer = setInterval(() => {
			this.snake.move()
			this.dirWasChangeInThisTick = false
			const isEaten = this.snake.eat(this.foodPosition)
			if (isEaten) {
				this.foodPosition = Food.generatePosition(this.field.size, this.snake.position)
			}
			const hasCollision = this.snake.checkCollision()
			if (hasCollision) {
				clearInterval(timer)
				this.status = STATUS_GAME_OVER
			}
			this.updateField()
		}, this.speed)
	}

	onUpdate(listener) {
		this.listeners.push(listener)
	}

	start() {
		this.updateField()
		this.mainCycle()
		this.status = STATUS_PLAY
	}
}
