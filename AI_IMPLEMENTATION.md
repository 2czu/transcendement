# AI Opponent Implementation - Transcendence Pong Game

## Overview
This document describes the implementation of an AI opponent for the Pong game, following the requirements specified in the project documentation.

## Requirements Met

### ✅ Major Module Requirements
1. **No A* Algorithm**: The AI uses physics-based trajectory prediction instead of A* pathfinding
2. **Human Behavior Simulation**: AI simulates keyboard input (up/down movements)
3. **1-Second Refresh Rate**: AI updates its decision-making once per second as required
4. **Challenging Gameplay**: Three difficulty levels (Easy, Medium, Hard) provide varying challenge
5. **Intelligent Moves**: AI predicts ball trajectory with wall bounces
6. **Adaptive Behavior**: AI adjusts strategy based on ball position and velocity
7. **Capable of Winning**: AI can win games, especially on higher difficulties
8. **Same 3D Design**: Player vs AI uses identical 3D rendering as Player vs Player

## Implementation Details

### Files Created/Modified

#### 1. **apps/web/srcs/game/ai.ts** (NEW)
- `PongAI` class implementing the AI logic
- Physics-based ball trajectory prediction
- Wall bounce anticipation
- Three difficulty levels with different parameters:
  - **Easy**: Slower reaction (200ms), large error margin (0.8), slower movement
  - **Medium**: Balanced reaction (100ms), moderate error (0.4), moderate speed
  - **Hard**: Fast reaction (50ms), small error (0.15), fast movement
- Human-like acceleration and deceleration
- Strategic positioning with intentional imperfection

#### 2. **apps/web/srcs/game3d.ts** (MODIFIED)
- Added `GameMode` type: 'pvp' | 'pve'
- Integrated `PongAI` instance for PvE mode
- Constructor now accepts game mode and AI difficulty
- `updateAI()` method called once per second
- AI controls paddle 2 in PvE mode
- Maintains all existing physics and rendering
- Added methods: `getGameMode()`, `getAIDifficulty()`, `setAIDifficulty()`

#### 3. **apps/web/srcs/game.ts** (MODIFIED)
- Added game mode selection functionality
- `createGamePage()` now accepts optional game mode and difficulty parameters
- Added difficulty selector UI (visible only in PvE mode)
- Added "Change Mode" button to switch between PvP and PvE
- `showGameModeSelection()` function for mode selection screen
- Dynamic player name display (shows "AI (difficulty)" for AI opponent)

#### 4. **apps/web/srcs/home.ts** (MODIFIED)
- Added "Play vs AI" button on home page
- Direct link to start PvE game with medium difficulty
- Updated button styling for better UX

## AI Algorithm Design

### Prediction System
```
1. Check if ball is moving toward AI paddle
2. Simulate ball trajectory step-by-step
3. Calculate wall bounces using reflection physics
4. Determine impact point at paddle X position
5. Add human-like error based on difficulty
6. Apply strategic offset for variety
```

### Movement System
```
1. Calculate difference between current and target position
2. Apply acceleration toward target (human-like)
3. Clamp velocity to maximum speed
4. Add slight randomness for imperfection
5. Simulate keyboard input (up/down)
```

### Difficulty Tuning
- **Reaction Delay**: Time before AI responds to ball changes
- **Error Margin**: Random offset from perfect position
- **Move Speed**: Maximum paddle velocity
- **Aggressiveness**: Probability of strategic positioning

## Game Modes

### Player vs Player (PvP)
- Player 1: Arrow Up/Down keys (left paddle)
- Player 2: W/S keys (right paddle)
- Traditional two-player local gameplay

### Player vs AI (PvE)
- Player: Arrow Up/Down keys (left paddle)
- AI: Automated control (right paddle)
- Three difficulty levels selectable in-game
- AI updates decision once per second
- AI simulates human-like behavior

## User Interface

### Home Page
- "🎮 Play Game" - Opens game mode selection
- "🤖 Play vs AI" - Directly starts PvE with medium difficulty
- "🏆 Tournament" - 8-player tournament mode

### Game Mode Selection
- Visual cards for PvP and PvE modes
- Difficulty selection for AI (Easy/Medium/Hard)
- Clear control instructions for each mode

### In-Game UI
- Game mode indicator at top
- AI difficulty display in PvE mode
- Difficulty selector buttons (PvE only)
- "Change Mode" button to switch modes
- Score display with player names

## Technical Highlights

1. **Physics-Based Prediction**: Uses actual game physics to predict ball trajectory
2. **Wall Bounce Calculation**: Accurately simulates ball reflections
3. **Human-Like Behavior**: Acceleration, deceleration, and intentional errors
4. **Performance**: Efficient 1-second update cycle as required
5. **Maintainability**: Clean separation of AI logic from game engine
6. **Extensibility**: Easy to add new difficulty levels or AI strategies

## Testing Recommendations

1. Test all three difficulty levels
2. Verify AI can win occasionally (especially on Hard)
3. Confirm 1-second refresh rate constraint
4. Test mode switching during gameplay
5. Verify PvP mode still works correctly
6. Test difficulty changes during game
7. Ensure 3D rendering is identical in both modes

## Future Enhancements (Optional)

- Add AI personality types (aggressive, defensive, balanced)
- Implement learning AI that adapts to player style
- Add power-up utilization for AI
- Tournament mode with AI opponents
- Multiplayer online with AI fill-in
- AI difficulty auto-adjustment based on player skill

## Compliance with Requirements

✅ AI opponent implemented (Major Module)
✅ No A* algorithm used
✅ Simulates keyboard input
✅ 1-second refresh rate enforced
✅ Challenging and engaging gameplay
✅ Intelligent and strategic moves
✅ Adapts to gameplay scenarios
✅ Capable of winning occasionally
✅ Same 3D design as PvP mode

## Conclusion

The AI opponent implementation successfully meets all requirements specified in the project documentation. The AI provides a challenging single-player experience while maintaining the same high-quality 3D gameplay as the multiplayer mode.
