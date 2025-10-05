import { getUserId } from './main';
import { Pong3D, GameMode } from './game3d';
import { AIDifficulty } from './game/ai';

let game3D: Pong3D;
let player1Name: string = "Player 1";
let player2Name: string = "Player 2";
let selectedGameMode: GameMode = 'pvp';
let selectedDifficulty: AIDifficulty = 'medium';

export function createGamePage(gameMode?: GameMode, difficulty?: AIDifficulty): void {
	if (gameMode) {
		selectedGameMode = gameMode;
	}
	if (difficulty) {
		selectedDifficulty = difficulty;
	}
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col justify-center items-center">
			<div class="absolute -left-32 -top-32 w-80 h-80 bg-indigo-800 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
			<div class="absolute right-0 top-20 w-72 h-72 bg-indigo-700 rounded-full opacity-20 filter blur-2xl animate-pulse"></div>
			<div class="absolute left-1/2 bottom-0 w-96 h-96 bg-indigo-900 rounded-full opacity-15 filter blur-3xl transform -translate-x-1/2 animate-pulse"></div>
			<button id="homeBtn" aria-label="Home" title="Home" class="absolute top-4 left-4 bg-white/10 border rounded p-2 shadow-sm hover:bg-white/20 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
				</svg>
			</button>
		<div class="w-full max-w-6xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-indigo-700">

		<div class="w-full max-w-3xl bg-gray-800/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-gray-700 backdrop-blur-md">
			<div class="w-full text-center mb-8">
			<h1 class="text-5xl font-extrabold mb-2 text-white drop-shadow-lg animate-pulse">
				${selectedGameMode === 'pve' ? `SINGLEPLAYER` : 'MULTIPLAYER'}
			</h1>
			<p class="text-lg text-gray-300 mt-2">
				${selectedGameMode === 'pve' ? `🤖 Player vs AI (${selectedDifficulty})` : '👥 Player vs Player'}
			</p>
			</div>
			
			
			<!-- 3d canvas -->
			<div class="relative bg-black border-4 rounded-2xl shadow-lg overflow-hidden">
			<canvas id="game3d" width="800" height="500" class="rounded-xl shadow-inner"></canvas>
			<div class="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-blue-400/30 animate-pulse"></div>
			</div>
			
			<!-- score -->
			<div class="mt-6 w-full flex justify-center items-center gap-8">
			<div class="flex flex-col items-center">
				<span id="player1Name" class="text-2xl font-bold text-blue-400 drop-shadow">Player 1</span>
				<span id="score1" class="text-4xl font-extrabold text-blue-200 bg-blue-900/60 px-4 py-1 rounded-lg mt-1 shadow">0</span>
			</div>
			<span class="text-3xl font-bold text-gray-400 select-none">|</span>
			<div class="flex flex-col items-center">
				<span id="player2Name" class="text-2xl font-bold text-red-400 drop-shadow">Player 2</span>
				<span id="score2" class="text-4xl font-extrabold text-red-200 bg-red-900/60 px-4 py-1 rounded-lg mt-1 shadow">0</span>
			</div>
			</div>
			
			<!-- AI Difficulty Selector (only shown in PvE mode) -->
			${selectedGameMode === 'pve' ? `
			<div class="mt-6 w-full flex justify-center items-center gap-4">
				<span class="text-white font-semibold">AI Difficulty:</span>
				<div class="flex gap-2">
				<button id="difficultyEasy" class="px-4 py-2 ${selectedDifficulty === 'easy' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 text-white font-bold rounded-lg transition-colors">
					Easy
				</button>
				<button id="difficultyMedium" class="px-4 py-2 ${selectedDifficulty === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'} hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors">
					Medium
				</button>
				<button id="difficultyHard" class="px-4 py-2 ${selectedDifficulty === 'hard' ? 'bg-red-600' : 'bg-gray-600'} hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
					Hard
				</button>
				</div>
			</div>
			` : ''}
			
			<!-- buttons -->
			<div class="mt-10 flex flex-wrap gap-6 justify-center w-full">
			<button data-i18n="pong.play_button" id="playBtn" class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
				<span class="inline-flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 3v18l15-9L5 3z"/></svg>Play</span>
			</button>
			<button data-i18n="pong.replay_button" id="replayBtn" class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300">
				<span class="inline-flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582M20 20v-5h-.581M5.455 19.045A9 9 0 1 1 19.045 5.455"/></svg>Replay</span>
			</button>
			<button id="changeModeBtn" class="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300">
				<span class="inline-flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"/></svg>Change Mode</span>
			</button>
			<button  data-i18n="pong.back_button" id="backBtn" class="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
				<span class="inline-flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>Back</span>
			</button>
			
				</div>
			</div>
			</div>
		`;

	loadPlayerNames().then(() => {
		updatePlayerNames();
	});

	const canvas = document.getElementById('game3d') as HTMLCanvasElement;

	if (game3D) {
		game3D.dispose();
	}

	game3D = new Pong3D(canvas, selectedGameMode, selectedDifficulty);

	game3D.render();

	const score1Element = document.getElementById('score1');
	const score2Element = document.getElementById('score2');
	if (score1Element) score1Element.textContent = '0';
	if (score2Element) score2Element.textContent = '0';

	function startGame() {
		game3D.startGame();
	}

	function updateScore() {
		const score = game3D.getScore();
		const score1Element = document.getElementById('score1');
		const score2Element = document.getElementById('score2');

		if (score1Element) score1Element.textContent = score.p1.toString();
		if (score2Element) score2Element.textContent = score.p2.toString();

		if (game3D.isGameOver()) {
			postMatchIfNeeded();
		}
	}

	const playBtn = document.getElementById('playBtn');
	const replayBtn = document.getElementById('replayBtn');
	const backBtn = document.getElementById('backBtn');
	const changeModeBtn = document.getElementById('changeModeBtn');

	// Difficulty buttons (only in PvE mode)
	if (selectedGameMode === 'pve') {
		const difficultyEasy = document.getElementById('difficultyEasy');
		const difficultyMedium = document.getElementById('difficultyMedium');
		const difficultyHard = document.getElementById('difficultyHard');

		if (difficultyEasy) {
			difficultyEasy.addEventListener('click', () => {
				selectedDifficulty = 'easy';
				game3D.setAIDifficulty('easy');
				updatePlayerNames();
				createGamePage('pve', 'easy');
			});
		}

		if (difficultyMedium) {
			difficultyMedium.addEventListener('click', () => {
				selectedDifficulty = 'medium';
				game3D.setAIDifficulty('medium');
				updatePlayerNames();
				createGamePage('pve', 'medium');
			});
		}

		if (difficultyHard) {
			difficultyHard.addEventListener('click', () => {
				selectedDifficulty = 'hard';
				game3D.setAIDifficulty('hard');
				updatePlayerNames();
				createGamePage('pve', 'hard');
			});
		}
	}

	if (playBtn) {
		playBtn.addEventListener('click', startGame);
	}

	if (replayBtn) {
		replayBtn.addEventListener('click', () => {
			game3D.restartGame();
			updateScore();
		});
	}

	if (changeModeBtn) {
		changeModeBtn.addEventListener('click', () => {
			if (game3D) {
				game3D.dispose();
			}
			showGameModeSelection();
		});
	}

	if (backBtn) {
		backBtn.addEventListener('click', () => {
			if (game3D) {
				game3D.dispose();
			}
			history.back();
		});
	}

	const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			if (game3D) game3D.dispose();
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});
	}

	const scoreInterval = setInterval(updateScore, 100);

	try {
		const w = window as unknown as { pageCleanup?: () => void };
		w.pageCleanup = () => {
			clearInterval(scoreInterval);
			if (game3D) {
				game3D.dispose();
			}
			w.pageCleanup = undefined;
		};
	} catch { }

	window.addEventListener('beforeunload', () => {
		clearInterval(scoreInterval);
		if (game3D) {
			game3D.dispose();
		}
	});

	let posted = false;
	async function postMatchIfNeeded() {
		if (posted) return;
		posted = true;

		try {
			const { winner, score1, score2 } = game3D.getFinal();
			let winner_id;
			if (winner === 1)
				winner_id = 1;
			else
				winner_id = -1;
			await fetch('https://localhost:8443/newMatch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					winner_id,
					score_player1: score1,
					score_player2: score2,
				}),
				credentials: "include"
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function loadPlayerNames(): Promise<void> {
		try {
			let userId = await getUserId();
			try {
				const res2 = await fetch(`https://localhost:8443/users/${userId}`, {
					method: 'GET',
					credentials: "include"
				});
				if (res2.ok) {
					const data2 = await res2.json();
					const name = data2?.user?.username || data2?.user?.name || null;
					if (name) {
						player1Name = name;
						return;
					}
				}
			} catch {}
		} catch {
			player1Name = "Player 1";
		}
	}

	function updatePlayerNames(): void {
		const player1NameElement = document.getElementById('player1Name');
		const player2NameElement = document.getElementById('player2Name');

		if (selectedGameMode === 'pve') {
			if (player1NameElement) {
				player1NameElement.textContent = player1Name;
			}
			if (player2NameElement) {
				player2NameElement.textContent = `AI (${selectedDifficulty})`;
			}
		} else {
			if (player1NameElement) {
				player1NameElement.textContent = player1Name;
			}
			if (player2NameElement) {
				player2NameElement.textContent = player2Name;
			}
		}
	}
}

function showGameModeSelection(): void {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
		<div class="w-full max-w-2xl bg-gray-800/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-gray-700 backdrop-blur-md">
			<div class="w-full text-center mb-8">
			<h1 class="text-5xl font-extrabold mb-2 text-white drop-shadow-lg animate-pulse">
				TRANSCENDENCE
			</h1>
			<p class="text-xl text-gray-300 mt-4">Select Game Mode</p>
			</div>
			
			<div class="w-full space-y-6">
			<!-- Player vs Player -->
			<div class="bg-gray-900/50 rounded-2xl p-6 border-2 border-blue-500 hover:border-blue-400 transition-all cursor-pointer" id="pvpMode">
				<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="text-5xl">👥</div>
					<div>
					<h3 class="text-2xl font-bold text-white">Player vs Player</h3>
					<p class="text-gray-400 mt-1">Play against a friend locally</p>
					<p class="text-sm text-gray-500 mt-2">Controls: Player 1 (↑↓) | Player 2 (W/S)</p>
					</div>
				</div>
				<svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M9 5l7 7-7 7"/>
				</svg>
				</div>
			</div>
			
			<!-- Player vs AI -->
			<div class="bg-gray-900/50 rounded-2xl p-6 border-2 border-purple-500 hover:border-purple-400 transition-all cursor-pointer" id="pveMode">
				<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="text-5xl">🤖</div>
					<div>
					<h3 class="text-2xl font-bold text-white">Player vs AI</h3>
					<p class="text-gray-400 mt-1">Challenge the AI opponent</p>
					<p class="text-sm text-gray-500 mt-2">Controls: Player (↑↓)</p>
					</div>
				</div>
				<svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M9 5l7 7-7 7"/>
				</svg>
				</div>
			</div>
			</div>
			
			<!-- AI Difficulty Selection (initially hidden) -->
			<div id="difficultySelection" class="w-full mt-6 hidden">
			<h3 class="text-xl font-bold text-white mb-4 text-center">Select AI Difficulty</h3>
			<div class="grid grid-cols-3 gap-4">
				<button id="selectEasy" class="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all">
				<div class="text-3xl mb-2">😊</div>
				<div>Easy</div>
				</button>
				<button id="selectMedium" class="px-6 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-lg transition-all">
				<div class="text-3xl mb-2">😐</div>
				<div>Medium</div>
				</button>
				<button id="selectHard" class="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all">
				<div class="text-3xl mb-2">😈</div>
				<div>Hard</div>
				</button>
			</div>
			</div>
			
			<div class="mt-8">
			<button id="backToHome" class="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all">
				<span class="inline-flex items-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path d="M15 19l-7-7 7-7"/>
				</svg>
				Back
				</span>
			</button>
			</div>
		</div>
		</div>
	`;

	const pvpMode = document.getElementById('pvpMode');
	const pveMode = document.getElementById('pveMode');
	const difficultySelection = document.getElementById('difficultySelection');
	const backToHome = document.getElementById('backToHome');

	if (pvpMode) {
		pvpMode.addEventListener('click', () => {
			selectedGameMode = 'pvp';
			createGamePage('pvp');
		});
	}

	if (pveMode) {
		pveMode.addEventListener('click', () => {
			if (difficultySelection) {
				difficultySelection.classList.remove('hidden');
			}
		});
	}

	const selectEasy = document.getElementById('selectEasy');
	const selectMedium = document.getElementById('selectMedium');
	const selectHard = document.getElementById('selectHard');

	if (selectEasy) {
		selectEasy.addEventListener('click', () => {
			selectedGameMode = 'pve';
			selectedDifficulty = 'easy';
			createGamePage('pve', 'easy');
		});
	}

	if (selectMedium) {
		selectMedium.addEventListener('click', () => {
			selectedGameMode = 'pve';
			selectedDifficulty = 'medium';
			createGamePage('pve', 'medium');
		});
	}

	if (selectHard) {
		selectHard.addEventListener('click', () => {
			selectedGameMode = 'pve';
			selectedDifficulty = 'hard';
			createGamePage('pve', 'hard');
		});
	}

	if (backToHome) {
		backToHome.addEventListener('click', () => {
			history.back();
		});
	}
}
