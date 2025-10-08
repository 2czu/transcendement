export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface BallState {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface PaddleState {
	y: number;
	height: number;
}

interface GameBounds {
	minY: number;
	maxY: number;
	paddleX: number;
}

export class PongAI {
	private difficulty: AIDifficulty;
	private targetY: number = 0;
	private lastUpdateTime: number = 0;
	private updateInterval: number = 10;
	private reactionDelay: number = 0;
	private errorMargin: number = 0;
	private moveSpeed: number = 0;
	private aggressiveness: number = 0;
	
	private currentVelocity: number = 0;
	private acceleration: number = 0.008;
	private maxSpeed: number = 0.15;
	
	private predictedImpactY: number = 0;
	private confidence: number = 1.0;
	
	constructor(difficulty: AIDifficulty = 'medium') {
		this.difficulty = difficulty;
		this.configureDifficulty();
	}
	
	private configureDifficulty(): void {
		switch (this.difficulty) {
			case 'easy':
				this.reactionDelay = 200;
				this.errorMargin = 0.8;
				this.moveSpeed = 0.10;
				this.aggressiveness = 0.5;
				this.maxSpeed = 0.10;
				this.acceleration = 0.006;
				break;
				
			case 'medium':
				this.reactionDelay = 100;
				this.errorMargin = 0.4;
				this.moveSpeed = 0.13;
				this.aggressiveness = 0.7;
				this.maxSpeed = 0.13;
				this.acceleration = 0.007;
				break;
				
			case 'hard':
				this.reactionDelay = 50;
				this.errorMargin = -500;
				this.moveSpeed = 1.0;
				this.aggressiveness = 10000000;
				this.maxSpeed = 0.50;
				this.acceleration = 0.015;
				break;
		}
	}
	
	public update(
		currentTime: number,
		ball: BallState,
		paddle: PaddleState,
		bounds: GameBounds
	): void {
		if (currentTime - this.lastUpdateTime < this.updateInterval) {
			return;
		}
		
		this.lastUpdateTime = currentTime;
		
		const prediction = this.predictBallTrajectory(ball, bounds);
		
		if (prediction.willReachPaddle) {
			this.predictedImpactY = prediction.impactY;
			this.confidence = prediction.confidence;
			
			const error = (Math.random() - 0.5) * this.errorMargin;
			this.targetY = this.predictedImpactY + error;
			
			if (Math.random() > this.aggressiveness) {
				const strategicOffset = (Math.random() - 0.5) * 0.5;
				this.targetY += strategicOffset;
			}
			
			this.targetY = Math.max(bounds.minY, Math.min(bounds.maxY, this.targetY));
		} else {
			this.targetY = 0;
			this.confidence = 0.3;
		}
	}
	
	private predictBallTrajectory(
		ball: BallState,
		bounds: GameBounds
	): { willReachPaddle: boolean; impactY: number; confidence: number } {
		const isMovingTowardPaddle = ball.vx > 0;
		
		if (!isMovingTowardPaddle) {
			return { willReachPaddle: false, impactY: 0, confidence: 0 };
		}
		
		let simX = ball.x;
		let simY = ball.y;
		let simVx = ball.vx;
		let simVy = ball.vy;
		
		const maxIterations = 100;
		let iterations = 0;
		
		while (simX < bounds.paddleX && iterations < maxIterations) {
			const timeToWall = simVy > 0 
				? (bounds.maxY - simY) / simVy 
				: (bounds.minY - simY) / simVy;
			const timeToPaddle = (bounds.paddleX - simX) / simVx;
			
			if (timeToPaddle < timeToWall) {
				simY += simVy * timeToPaddle;
				simX = bounds.paddleX;
				break;
			} else {
				simX += simVx * timeToWall;
				simY += simVy * timeToWall;
				
				if (simY >= bounds.maxY) {
					simY = bounds.maxY;
					simVy = -Math.abs(simVy);
				} else if (simY <= bounds.minY) {
					simY = bounds.minY;
					simVy = Math.abs(simVy);
				}
			}
			
			iterations++;
		}
		
		const confidence = Math.max(0.3, 1.0 - (iterations * 0.1));
		
		return {
			willReachPaddle: true,
			impactY: simY,
			confidence: confidence
		};
	}
	
	public getMovementDirection(currentPaddleY: number): number {
		const diff = this.targetY - currentPaddleY;
		const threshold = 0.1;
		
		if (Math.abs(diff) < threshold) {
			this.currentVelocity *= 0.9;
			return 0;
		}
		
		const desiredDirection = diff > 0 ? 1 : -1;
		this.currentVelocity += desiredDirection * this.acceleration;
		
		this.currentVelocity = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.currentVelocity));
		
		const randomness = (Math.random() - 0.5) * 0.02;
		
		return this.currentVelocity + randomness;
	}
	
	public getKeyboardInput(currentPaddleY: number): { up: boolean; down: boolean } {
		const movement = this.getMovementDirection(currentPaddleY);
		
		return {
			up: movement > 0.02,
			down: movement < -0.02
		};
	}
	
	public getTargetPosition(): number {
		return this.targetY;
	}
	
	public getConfidence(): number {
		return this.confidence;
	}
	
	public setDifficulty(difficulty: AIDifficulty): void {
		this.difficulty = difficulty;
		this.configureDifficulty();
	}
	
	public reset(): void {
		this.targetY = 0;
		this.currentVelocity = 0;
		this.predictedImpactY = 0;
		this.confidence = 1.0;
		this.lastUpdateTime = 0;
	}
	
	public getDifficulty(): AIDifficulty {
		return this.difficulty;
	}
}
