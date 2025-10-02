/**
 * AI Opponent for Pong Game
 * 
 * Requirements:
 * - NO A* algorithm usage
 * - Simulates human behavior with keyboard-like input
 * - Refreshes view once per second (must anticipate bounces)
 * - Provides challenging and engaging gameplay
 * - Makes intelligent and strategic moves
 * - Adapts to different gameplay scenarios
 * - Capable of winning occasionally
 */

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
	private updateInterval: number = 1000; // 1 second refresh rate as per requirements
	private reactionDelay: number = 0;
	private errorMargin: number = 0;
	private moveSpeed: number = 0;
	private aggressiveness: number = 0;
	
	// Human-like behavior parameters
	private currentVelocity: number = 0;
	private acceleration: number = 0.008;
	private maxSpeed: number = 0.15;
	
	// Strategic parameters
	private predictedImpactY: number = 0;
	private confidence: number = 1.0;
	
	constructor(difficulty: AIDifficulty = 'medium') {
		this.difficulty = difficulty;
		this.configureDifficulty();
	}
	
	/**
	 * Configure AI parameters based on difficulty level
	 */
	private configureDifficulty(): void {
		switch (this.difficulty) {
			case 'easy':
				this.reactionDelay = 200; // Slower reaction
				this.errorMargin = 0.8; // Large error margin
				this.moveSpeed = 0.10; // Slower movement
				this.aggressiveness = 0.5; // Less aggressive positioning
				this.maxSpeed = 0.10;
				this.acceleration = 0.006;
				break;
				
			case 'medium':
				this.reactionDelay = 100; // Moderate reaction
				this.errorMargin = 0.4; // Moderate error
				this.moveSpeed = 0.13; // Moderate speed
				this.aggressiveness = 0.7; // Balanced positioning
				this.maxSpeed = 0.13;
				this.acceleration = 0.007;
				break;
				
			case 'hard':
				this.reactionDelay = 50; // Fast reaction
				this.errorMargin = 0.15; // Small error margin
				this.moveSpeed = 0.15; // Fast movement
				this.aggressiveness = 0.9; // Aggressive positioning
				this.maxSpeed = 0.15;
				this.acceleration = 0.008;
				break;
		}
	}
	
	/**
	 * Main AI decision-making function
	 * Called once per second as per requirements
	 */
	public update(
		currentTime: number,
		ball: BallState,
		paddle: PaddleState,
		bounds: GameBounds
	): void {
		// Only update decision once per second (requirement)
		if (currentTime - this.lastUpdateTime < this.updateInterval) {
			return;
		}
		
		this.lastUpdateTime = currentTime;
		
		// Predict where the ball will be when it reaches the paddle
		const prediction = this.predictBallTrajectory(ball, bounds);
		
		if (prediction.willReachPaddle) {
			this.predictedImpactY = prediction.impactY;
			this.confidence = prediction.confidence;
			
			// Add human-like error based on difficulty
			const error = (Math.random() - 0.5) * this.errorMargin;
			this.targetY = this.predictedImpactY + error;
			
			// Strategic positioning: don't always go to exact center
			// Sometimes position slightly off to create angles
			if (Math.random() > this.aggressiveness) {
				const strategicOffset = (Math.random() - 0.5) * 0.5;
				this.targetY += strategicOffset;
			}
			
			// Clamp target to valid bounds
			this.targetY = Math.max(bounds.minY, Math.min(bounds.maxY, this.targetY));
		} else {
			// Ball is moving away, return to center position
			this.targetY = 0;
			this.confidence = 0.3;
		}
	}
	
	/**
	 * Predict ball trajectory with wall bounces
	 * Uses physics-based prediction, NOT A* algorithm
	 */
	private predictBallTrajectory(
		ball: BallState,
		bounds: GameBounds
	): { willReachPaddle: boolean; impactY: number; confidence: number } {
		// Check if ball is moving toward the AI paddle
		const isMovingTowardPaddle = ball.vx > 0;
		
		if (!isMovingTowardPaddle) {
			return { willReachPaddle: false, impactY: 0, confidence: 0 };
		}
		
		// Simulate ball trajectory with bounces
		let simX = ball.x;
		let simY = ball.y;
		let simVx = ball.vx;
		let simVy = ball.vy;
		
		const maxIterations = 100; // Prevent infinite loops
		let iterations = 0;
		
		// Simulate until ball reaches paddle X position
		while (simX < bounds.paddleX && iterations < maxIterations) {
			// Calculate time to reach paddle or wall
			const timeToWall = simVy > 0 
				? (bounds.maxY - simY) / simVy 
				: (bounds.minY - simY) / simVy;
			const timeToPaddle = (bounds.paddleX - simX) / simVx;
			
			if (timeToPaddle < timeToWall) {
				// Ball reaches paddle before hitting wall
				simY += simVy * timeToPaddle;
				simX = bounds.paddleX;
				break;
			} else {
				// Ball hits wall first
				simX += simVx * timeToWall;
				simY += simVy * timeToWall;
				
				// Bounce off wall
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
		
		// Calculate confidence based on distance and iterations
		const confidence = Math.max(0.3, 1.0 - (iterations * 0.1));
		
		return {
			willReachPaddle: true,
			impactY: simY,
			confidence: confidence
		};
	}
	
	/**
	 * Get the desired paddle movement direction
	 * Returns a value between -1 and 1 for smooth, human-like movement
	 */
	public getMovementDirection(currentPaddleY: number): number {
		const diff = this.targetY - currentPaddleY;
		const threshold = 0.1; // Dead zone to prevent jittering
		
		if (Math.abs(diff) < threshold) {
			// Close enough, slow down
			this.currentVelocity *= 0.9;
			return 0;
		}
		
		// Accelerate toward target (human-like acceleration)
		const desiredDirection = diff > 0 ? 1 : -1;
		this.currentVelocity += desiredDirection * this.acceleration;
		
		// Clamp velocity to max speed
		this.currentVelocity = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.currentVelocity));
		
		// Add slight randomness for human-like imperfection
		const randomness = (Math.random() - 0.5) * 0.02;
		
		return this.currentVelocity + randomness;
	}
	
	/**
	 * Simulate keyboard input (as per requirements)
	 * Returns whether to move up or down
	 */
	public getKeyboardInput(currentPaddleY: number): { up: boolean; down: boolean } {
		const movement = this.getMovementDirection(currentPaddleY);
		
		return {
			up: movement > 0.02,
			down: movement < -0.02
		};
	}
	
	/**
	 * Get target position for direct control (alternative to keyboard simulation)
	 */
	public getTargetPosition(): number {
		return this.targetY;
	}
	
	/**
	 * Get current confidence level (for debugging/visualization)
	 */
	public getConfidence(): number {
		return this.confidence;
	}
	
	/**
	 * Change difficulty level during gameplay
	 */
	public setDifficulty(difficulty: AIDifficulty): void {
		this.difficulty = difficulty;
		this.configureDifficulty();
	}
	
	/**
	 * Reset AI state
	 */
	public reset(): void {
		this.targetY = 0;
		this.currentVelocity = 0;
		this.predictedImpactY = 0;
		this.confidence = 1.0;
		this.lastUpdateTime = 0;
	}
	
	/**
	 * Get AI difficulty
	 */
	public getDifficulty(): AIDifficulty {
		return this.difficulty;
	}
}
