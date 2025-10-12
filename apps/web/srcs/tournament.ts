import { Pong3D } from './game3d';
import { getLanguage, getTranslation } from './lang';
import { getUserId } from './main';

interface Player {
	id: number;
	name: string;
	isAI: boolean;
	wins: number;
	losses: number;
}

interface Match {
	id: number;
	player1: Player;
	player2: Player;
	winner?: Player;
	score1: number;
	score2: number;
	isFinished: boolean;
	isCurrent: boolean;
}

interface Tournament {
	players: Player[];
	matches: Match[];
	currentRound: number;
	isFinished: boolean;
	winner?: Player;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

let tournament: Tournament;
let game3D: Pong3D;
let currentMatch: Match | null = null;
let player1Name: string = "Player 1";
let player2Name: string = "Player 2";
let nextMatchScheduled: boolean = false;
let tournamentOverlayShown: boolean = false;

export function createTournamentSetupPage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	const defaultNames = [
		'Player 1', 'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'
	];

	app.innerHTML = `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col justify-center items-center">
      <button id="homeBtn" aria-label="Home" title="Home" class="absolute z-30 top-4 left-4 bg-white/10 text-white border rounded p-2 shadow-sm hover:bg-white/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
        </svg>
      </button>
      <div class="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-indigo-700">
        <h2 class="text-3xl font-bold mb-6">${getTranslation("tournament.tournament", getLanguage())}</h2>
        <form id="tSetupForm" class="w-full grid grid-cols-1 gap-3">
          ${defaultNames.map((n, i) => `
          <div>
            <label class="block text-sm mb-1">${getTranslation(`tournament.player${i + 1}`, getLanguage())}</label>
            <input id="tp${i + 1}" type="text" class="w-full px-3 py-2 rounded bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none" placeholder="${n}" />
          </div>`).join('')}
          <p id="tSetupHint" class="text-xs text-white/60"></p>
          <div class="mt-4 flex gap-3 justify-center">
            <button type="submit" class="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-700">${getTranslation("tournament.start", getLanguage())}</button>
            <button type="button" id="tSetupBack" class="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700">${getTranslation("tournament.back_button", getLanguage())}</button>
          </div>
        </form>
      </div>
    </div>`;

	const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
	homeBtn?.addEventListener('click', () => {
		window.history.pushState({}, '', '/');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	const hint = document.getElementById('tSetupHint') as HTMLParagraphElement | null;
	getUserId().then((uid) => {
		if (!uid) player1Name = 'Player 1';
		return loadPlayerNames();
	}).then(() => {
		for (let i = 1; i <= 8; i++) {
			const el = document.getElementById(`tp${i}`) as HTMLInputElement | null;
			if (!el) continue;
			if (i === 1) {
				el.value = player1Name || defaultNames[0];
				const isConnected = player1Name && player1Name !== 'Player 1';
				if (isConnected) {
					el.disabled = true;
					el.classList.add('opacity-60');
					if (hint) hint.textContent = getTranslation("tournament.edited", getLanguage());
				} else {
					el.disabled = false;
					el.classList.remove('opacity-60');
					el.value = defaultNames[0];
				}
			} else {
				if (!el.value || el.value.trim() === '') el.value = defaultNames[i - 1];
			}
		}
	});

	const form = document.getElementById('tSetupForm') as HTMLFormElement | null;
	form?.addEventListener('submit', (e) => {
		e.preventDefault();
		const names: string[] = [];
		for (let i = 1; i <= 8; i++) {
			const el = document.getElementById(`tp${i}`) as HTMLInputElement | null;
			const v = (el?.value || '').trim();
			names.push(v || defaultNames[i - 1]);
		}
		initializeTournamentWithNames(names);
		createTournamentPage();
	});

	const back = document.getElementById('tSetupBack') as HTMLButtonElement | null;
	back?.addEventListener('click', () => {
		history.back();
	});
}

export function createTournamentPage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	tournamentOverlayShown = false;

	app.innerHTML = `
    <div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col justify-center items-center">
      <div class="absolute -left-32 -top-32 w-80 h-80 bg-indigo-800 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
      <div class="absolute right-0 top-20 w-72 h-72 bg-indigo-700 rounded-full opacity-20 filter blur-2xl animate-pulse"></div>
      <div class="absolute left-1/2 bottom-0 w-96 h-96 bg-indigo-900 rounded-full opacity-15 filter blur-3xl transform -translate-x-1/2 animate-pulse"></div>
      <button id="homeBtn" aria-label="Home" title="Home" class="absolute z-30 top-4 left-4 bg-white/10 text-white border rounded p-2 shadow-sm hover:bg-white/20 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
        </svg>
      </button>
      <div class="mt-8 mb-8 w-full max-w-6xl bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-indigo-700">
        <div class="w-full text-center mb-8">
          <h1 data-i18n="tournament.tournament" class="text-5xl font-extrabold mb-2 text-white drop-shadow-lg animate-pulse">
            TOURNAMENT
          </h1>
          <p data-i18n="tournament.desc_tournament" class="text-lg text-white/80 mb-1 tracking-wide">8-player tournament</p>
        </div>
        
        <div class="w-full flex flex-col gap-8 mb-8">
        <div class="w-full bg-gray-900/50 rounded-2xl p-6 border border-gray-600">
            <h2 data-i18n="tournament.brackets" class="text-2xl font-bold text-white mb-4 text-center">Brackets</h2>
            <div id="tournamentBracket" class="space-y-4">
            </div>
          </div>
          
          <div class="w-full bg-gray-900/50 rounded-2xl p-6 border border-gray-600">
            <h2 data-i18n="tournament.current_match" class="text-2xl font-bold text-white mb-4 text-center">🎮 Current Match</h2>
            <div id="currentMatch" class="text-center">
              <p data-i18n="tournament.progress" class="text-gray-400">No match in progress</p>
            </div>
            
            <div class="mt-6 relative bg-black border-4 rounded-2xl shadow-lg overflow-hidden">
              <canvas id="game3d" width="800" height="500" class="rounded-xl shadow-inner block mx-auto"></canvas>
              <div class="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-blue-400/30 animate-pulse"></div>
            </div>
            
            <div class="mt-4 flex justify-center items-center gap-6">
              <div class="flex flex-col items-center">
                <span id="player1Name" class="text-lg font-bold text-blue-400">Player 1</span>
                <span id="score1" class="text-2xl font-extrabold text-blue-200 bg-blue-900/60 px-3 py-1 rounded-lg">0</span>
              </div>
              <span class="text-xl font-bold text-gray-400">|</span>
              <div class="flex flex-col items-center">
                <span id="player2Name" class="text-lg font-bold text-red-400">Player 2</span>
                <span id="score2" class="text-2xl font-extrabold text-red-200 bg-red-900/60 px-3 py-1 rounded-lg">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-4 justify-center w-full">
          <button data-i18n="tournament.startmatch_button" id="startMatchBtn" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200">
        	Start match
          </button>
          <button data-i18n="tournament.nextmatch_button" id="nextMatchBtn" class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200">
            Next match
          </button>
          <button data-i18n="tournament.new_tournament_button" id="restartTournamentBtn" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200">
            New tournament
          </button>
          <button data-i18n="tournament.back_button" id="backBtn" class="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200">
            🏠 Back
          </button>
        </div>
      </div>
    </div>
  `;

	if (!tournament) initializeTournament();
	updateTournamentDisplay();
	if (currentMatch) {
		player1Name = currentMatch.player1.name;
		player2Name = currentMatch.player2.name;
		updatePlayerNames();
	}

	loadPlayerNames().then(() => {
		if (tournament?.players) {
			// ovveride le joueur 1 par le username connecte
			if (player1Name && player1Name !== 'Player 1') {
				const me = tournament.players.find(p => p.id === 1);
				if (me) me.name = player1Name;
				updateTournamentDisplay();
				if (currentMatch) {
					player1Name = currentMatch.player1.name;
					player2Name = currentMatch.player2.name;
					updatePlayerNames();
				}
			}
		}
	});

	const canvas = document.getElementById('game3d') as HTMLCanvasElement;
	if (canvas) {
		try {
			canvas.addEventListener('wheel', (e) => {
				e.preventDefault();
			}, { passive: false });
		} catch { }

		if (game3D) {
			game3D.dispose();
		}

		game3D = new Pong3D(canvas);
		game3D.setShowOverlayOnGameOver(false);
		game3D.render();

		resetScoreDisplay();
	}

	const startMatchBtn = document.getElementById('startMatchBtn');
	const nextMatchBtn = document.getElementById('nextMatchBtn');
	const restartTournamentBtn = document.getElementById('restartTournamentBtn');
	const backBtn = document.getElementById('backBtn');

	if (startMatchBtn) {
		startMatchBtn.addEventListener('click', startCurrentMatch);
	}

	if (nextMatchBtn) {
		nextMatchBtn.addEventListener('click', nextMatch);
	}

	if (restartTournamentBtn) {
		restartTournamentBtn.addEventListener('click', restartTournament);
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
}

async function loadPlayerNames(): Promise<void> {
	try {
		const userId = await getUserId();
		if (!userId) {
			return;
		}
		try {
			const res = await fetch('https://localhost:8443/myprofile', {
				method: 'GET',
				credentials: "include"
			});
			if (res.ok) {
				const data = await res.json();
				const name = data?.user?.username || data?.user?.name || null;
				if (name) {
					player1Name = name;
					updatePlayerNames();
					if (tournament?.players) {
						const me = tournament.players.find(p => p.id === 1);
						if (me) me.name = player1Name;
						updateTournamentDisplay();
					}
					return;
				}
			}
		} catch {

		}
		try {
			const res2 = await fetch(`https://localhost:8443/users/${userId}`, {
				credentials: "include"
			});
			if (res2.ok) {
				const data2 = await res2.json();
				const name2 = data2?.user?.username || data2?.user?.name || null;
				if (name2) {
					player1Name = name2;
					updatePlayerNames();
					if (tournament?.players) {
						const me = tournament.players.find(p => p.id === 1);
						if (me) me.name = player1Name;
						updateTournamentDisplay();
					}
					return;
				}
			}
		} catch { }
	} catch {
	}
}

function initializeTournament(): void {
	const players: Player[] = [
		{ id: 1, name: player1Name, isAI: false, wins: 0, losses: 0 },
		{ id: 2, name: "Alfa", isAI: true, wins: 0, losses: 0 },
		{ id: 3, name: "Bravo", isAI: true, wins: 0, losses: 0 },
		{ id: 4, name: "Charlie", isAI: true, wins: 0, losses: 0 },
		{ id: 5, name: "Delta", isAI: true, wins: 0, losses: 0 },
		{ id: 6, name: "Echo", isAI: true, wins: 0, losses: 0 },
		{ id: 7, name: "Foxtrot", isAI: true, wins: 0, losses: 0 },
		{ id: 8, name: "Golf", isAI: true, wins: 0, losses: 0 }
	];

	for (let i = players.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[players[i], players[j]] = [players[j], players[i]];
	}

	const matches: Match[] = [];
	for (let i = 0; i < players.length; i += 2) {
		matches.push({
			id: matches.length + 1,
			player1: players[i],
			player2: players[i + 1],
			score1: 0,
			score2: 0,
			isFinished: false,
			isCurrent: false
		});
	}

	for (let round = 2; round <= 3; round++) {
		const matchesInRound = Math.pow(2, 4 - round);
		for (let i = 0; i < matchesInRound; i++) {
			matches.push({
				id: matches.length + 1,
				player1: { id: 0, name: getTranslation("tournament.to_be_determined", getLanguage()), isAI: true, wins: 0, losses: 0 },
				player2: { id: 0, name: getTranslation("tournament.to_be_determined", getLanguage()), isAI: true, wins: 0, losses: 0 },
				score1: 0,
				score2: 0,
				isFinished: false,
				isCurrent: false
			});
		}
	}

	tournament = {
		players,
		matches,
		currentRound: 1,
		isFinished: false
	};

	if (matches.length > 0) {
		matches[0].isCurrent = true;
		currentMatch = matches[0];
	}
}

function initializeTournamentWithNames(names: string[]): void {
	const players: Player[] = names.map((n, idx) => ({
		id: idx + 1,
		name: idx === 0 ? (n || player1Name || 'Player 1') : n,
		isAI: idx !== 0,
		wins: 0,
		losses: 0
	}));

	player1Name = players[0].name;

	const matches: Match[] = [];
	for (let i = 0; i < players.length; i += 2) {
		matches.push({
			id: matches.length + 1,
			player1: players[i],
			player2: players[i + 1],
			score1: 0,
			score2: 0,
			isFinished: false,
			isCurrent: false
		});
	}

	for (let round = 2; round <= 3; round++) {
		const matchesInRound = Math.pow(2, 4 - round);
		for (let i = 0; i < matchesInRound; i++) {
			matches.push({
				id: matches.length + 1,
				player1: { id: 0, name: getTranslation("tournament.to_be_determined", getLanguage()), isAI: true, wins: 0, losses: 0 },
				player2: { id: 0, name: getTranslation("tournament.to_be_determined", getLanguage()), isAI: true, wins: 0, losses: 0 },
				score1: 0,
				score2: 0,
				isFinished: false,
				isCurrent: false
			});
		}
	}

	tournament = {
		players,
		matches,
		currentRound: 1,
		isFinished: false
	};

	if (matches.length > 0) {
		matches[0].isCurrent = true;
		currentMatch = matches[0];
	}
}

function updateTournamentDisplay(): void {
	const bracketElement = document.getElementById('tournamentBracket');
	const currentMatchElement = document.getElementById('currentMatch');

	if (!bracketElement || !currentMatchElement) return;

	bracketElement.innerHTML = generateBracketHTML();

	if (currentMatch) {
		currentMatchElement.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-bold text-white mb-2">Match #${currentMatch.id}</h3>
        <div class="flex justify-between items-center">
          <div class="text-blue-400 font-semibold">${escapeHtml(currentMatch.player1.name)}</div>
          <div class="text-gray-400">vs</div>
          <div class="text-red-400 font-semibold">${escapeHtml(currentMatch.player2.name)}</div>
        </div>
        ${currentMatch.isFinished ? `
          <div class="mt-2 text-center">
            <span class="text-green-400 font-bold">🏆 ${escapeHtml(currentMatch.winner ? currentMatch.winner.name : '')} wins!</span>
          </div>
        ` : ''}
      </div>
    `;
	} else {
		currentMatchElement.innerHTML = `<p class="text-gray-400">${getTranslation("tournament.finished", getLanguage())}</p>`;
	}

	updatePlayerNames();
}

function generateBracketHTML(): string {
	let html = '';

	html += '<div class="mb-6">';
	html += `<h3 class="text-lg font-bold text-blue-400 mb-2">${getTranslation("tournament.first_round", getLanguage())}</h3>`;
	for (let i = 0; i < 4; i++) {
		const match = tournament.matches[i];
		html += generateMatchHTML(match, i);
	}
	html += '</div>';

	html += '<div class="mb-6">';
	html += `<h3 data-i18n="tournament.semi_finals" class="text-lg font-bold text-green-400 mb-2">${getTranslation("tournament.semi_finals", getLanguage())}</h3>`;
	for (let i = 4; i < 6; i++) {
		const match = tournament.matches[i];
		html += generateMatchHTML(match, i);
	}
	html += '</div>';

	html += '<div>';
	html += `<h3 data-i18n="tournament.final" class="text-lg font-bold text-yellow-400 mb-2">${getTranslation("tournament.final", getLanguage())}</h3>`;
	const finalMatch = tournament.matches[6];
	html += generateMatchHTML(finalMatch, 6);
	html += '</div>';

	return html;
}

function generateMatchHTML(match: Match, index: number): string {
	const isCurrent = match.isCurrent;
	const isFinished = match.isFinished;
	const bgColor = isCurrent ? 'bg-blue-900/50 border-blue-500' :
		isFinished ? 'bg-green-900/50 border-green-500' :
			'bg-gray-800/50 border-gray-600';

	return `
    <div class="${bgColor} border rounded-lg p-3 mb-2">
      <div class="flex justify-between items-center text-sm">
        <div class="flex-1">
          <div class="text-blue-400 font-medium">${escapeHtml(match.player1.name)}</div>
          <div class="text-red-400 font-medium">${escapeHtml(match.player2.name)}</div>
        </div>
        <div class="text-center mx-2">
          <div class="text-lg font-bold text-white">${match.score1}</div>
          <div class="text-lg font-bold text-white">${match.score2}</div>
        </div>
        <div class="text-right">
          ${isCurrent ? '🎮' : isFinished ? '✅' : '⏳'}
        </div>
      </div>
    </div>
  `;
}

function startCurrentMatch(): void {
	if (!currentMatch || currentMatch.isFinished) return;

	player1Name = currentMatch.player1.name;
	player2Name = currentMatch.player2.name;
	updatePlayerNames();

	if (game3D) {
		game3D.restartGame();
		resetScoreDisplay();
		game3D.startGame();
	}
}

function nextMatch(): void {
	if (!currentMatch) return;

	currentMatch.isFinished = true;
	currentMatch.isCurrent = false;

	const score = game3D.getScore();
	currentMatch.score1 = score.p1;
	currentMatch.score2 = score.p2;
	currentMatch.winner = score.p1 > score.p2 ? currentMatch.player1 : currentMatch.player2;

	currentMatch.winner.wins++;
	const loser = currentMatch.winner === currentMatch.player1 ? currentMatch.player2 : currentMatch.player1;
	loser.losses++;

	// a chaque match ca regarde si on peut afficher le reste des matchs
	// dans les brakcets
	populateNextRounds();

	const nextMatchIndex = findNextMatch();
	if (nextMatchIndex !== -1) {
		const nextM = tournament.matches[nextMatchIndex];
		nextM.isCurrent = true;
		currentMatch = nextM;

		if (nextMatchIndex >= 4) {
			updateNextRoundPlayers(nextMatchIndex);
		}

		player1Name = currentMatch.player1.name;
		player2Name = currentMatch.player2.name;
		updatePlayerNames();
		updateTournamentDisplay();

		if (game3D) {
			game3D.restartGame();
			resetScoreDisplay();
			game3D.startGame();
		}

		nextMatchScheduled = false;
	} else {
		tournament.isFinished = true;
		tournament.winner = currentMatch.winner;
		currentMatch = null;

		if (!tournamentOverlayShown) {
			showTournamentWinnerOverlay(tournament.winner?.name || 'Unknown');
		}
		nextMatchScheduled = false;
	}
}

function findNextMatch(): number {
	for (let i = 0; i < tournament.matches.length; i++) {
		if (i > 6)
			return (-1);
		if (!tournament.matches[i].isFinished && !tournament.matches[i].isCurrent) {
			return i;
		}

	}
	return -1;
}

function updateNextRoundPlayers(matchIndex: number): void {
	const match = tournament.matches[matchIndex];

	if (matchIndex >= 4 && matchIndex < 6) {
		const match1Index = (matchIndex - 4) * 2;
		const match2Index = (matchIndex - 4) * 2 + 1;

		const winner1 = tournament.matches[match1Index].winner;
		const winner2 = tournament.matches[match2Index].winner;

		if (winner1 && winner2) {
			match.player1 = winner1;
			match.player2 = winner2;
		}
	} else if (matchIndex === 6) {
		const winner1 = tournament.matches[4].winner;
		const winner2 = tournament.matches[5].winner;

		if (winner1 && winner2) {
			match.player1 = winner1;
			match.player2 = winner2;
		}
	}
}

function populateNextRounds(): void {
	const qf0 = tournament.matches[0];
	const qf1 = tournament.matches[1];
	const sf1 = tournament.matches[4];
	if (qf0?.winner && qf1?.winner) {
		sf1.player1 = qf0.winner;
		sf1.player2 = qf1.winner;
	}

	const qf2 = tournament.matches[2];
	const qf3 = tournament.matches[3];
	const sf2 = tournament.matches[5];
	if (qf2?.winner && qf3?.winner) {
		sf2.player1 = qf2.winner;
		sf2.player2 = qf3.winner;
	}

	const finalMatch = tournament.matches[6];
	if (sf1?.winner && sf2?.winner) {
		finalMatch.player1 = sf1.winner;
		finalMatch.player2 = sf2.winner;
	}

	updateTournamentDisplay();
}

function restartTournament(): void {
	tournamentOverlayShown = false;
	initializeTournament();
	updateTournamentDisplay();

	if (game3D) {
		game3D.restartGame();
	}
}

function updatePlayerNames(): void {
	const player1NameElement = document.getElementById('player1Name');
	const player2NameElement = document.getElementById('player2Name');

	if (player1NameElement) {
		player1NameElement.textContent = player1Name;
	}
	if (player2NameElement) {
		player2NameElement.textContent = player2Name;
	}
}


function updateScore(): void {
	if (!game3D) return;

	const score = game3D.getScore();
	const score1Element = document.getElementById('score1');
	const score2Element = document.getElementById('score2');

	if (score1Element) score1Element.textContent = score.p1.toString();
	if (score2Element) score2Element.textContent = score.p2.toString();

	if (game3D.isGameOver() && currentMatch && !currentMatch.isFinished && !nextMatchScheduled) {
		nextMatchScheduled = true;
		setTimeout(() => {
			nextMatch();
		}, 1200);
	}
}

function resetScoreDisplay(): void {
	const score1Element = document.getElementById('score1');
	const score2Element = document.getElementById('score2');

	if (score1Element) score1Element.textContent = '0';
	if (score2Element) score2Element.textContent = '0';
}

function showTournamentWinnerOverlay(name: string): void {
	tournamentOverlayShown = true;
	const overlay = document.createElement('div');
	overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
	overlay.innerHTML = `
		<div class="bg-gray-900 border-2 border-yellow-500 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
		<div class="mb-6">
			<h2 data-i18n="tournament.finished" class="text-3xl font-bold text-white mb-2">🏆 Tournament finished</h2>
			<div class="text-6xl mb-4">🥇</div>
			<h3 class="text-2xl font-bold text-yellow-400 mb-2">${escapeHtml(name)} won the tournament!</h3>
			<p data-i18n="tournament.restart" class="text-sm text-gray-400">Tournament will automatically restart in 2.5s…</p>
		</div>
		<div class="flex flex-col gap-3">
			<button data-i18n="tournament.new_tournament_button" id="tournamentRestartBtn" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
			🔄 New tournament
			</button>
			<button data-i18n="tournament.back_menu_button" id="tournamentBackBtn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
			🏠 Back to menu
			</button>
		</div>
		</div>
	`;
	document.body.appendChild(overlay);

	const restartBtn = overlay.querySelector('#tournamentRestartBtn');
	const backBtn = overlay.querySelector('#tournamentBackBtn');
	const autoTimer = setTimeout(() => {
		overlay.remove();
		restartTournament();
	}, 2500);

	restartBtn?.addEventListener('click', () => {
		clearTimeout(autoTimer);
		overlay.remove();
		restartTournament();
	});
	backBtn?.addEventListener('click', () => {
		clearTimeout(autoTimer);
		overlay.remove();
		history.back();
	});
}