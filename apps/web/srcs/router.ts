import { createHomePage } from './home';
import { createGameSetupPage } from './game';
import { createTournamentSetupPage } from './tournament';
import { createSignInPage } from './signIn';
import { createSignUpPage } from './signUp';
import { createDashboardPage } from './dashboard';
import { createProfilePage } from './profile';
import { createMatchesPage } from './matches';
import { createStatsPage } from './stats';
import { updateTranslations } from './lang';
import { GameMode } from './game3d'
import { AIDifficulty } from './game/ai'
import { getSocket } from './websocket';


export function showHomePage(): void {
	createHomePage();
}

export function showGamePage(): void {
	const mode = localStorage.getItem('gameMode') as GameMode | null;
	const diff = localStorage.getItem('difficulty') as AIDifficulty | null;
	createGameSetupPage(mode ?? 'pvp', diff ?? 'medium');
}

export function showTournamentPage(): void {
	createTournamentSetupPage();
}

export function showSignInPage(): void {
	createSignInPage();
}

export function showSignUpPage(): void {
	createSignUpPage();
}

export function showDashboardPage(): void {
	createDashboardPage();
}

export function showProfilePage(): void {
	createProfilePage();
}

export function showMatchesPage(): void {
	createMatchesPage();
}

export function showStatsPage(): void {
	createStatsPage();
}

export function handleRoute(): void {
	const path = window.location.pathname;

	try {
		const w = window as unknown as { pageCleanup?: () => void };
		w.pageCleanup?.();
		w.pageCleanup = undefined;
	} catch { }

	switch (path) {
		case '/':
		case '':
			showHomePage();
			break;
		case '/game':
			showGamePage();
			break;
		case '/tournament':
			showTournamentPage();
			break;
		case '/signIn':
			showSignInPage();
			break;
		case '/signUp':
			showSignUpPage();
			break;
		case '/dashboard':
			showDashboardPage();
			break;
		case '/profile':
			showProfilePage();
			break;
		case '/matches':
			showMatchesPage();
			break;
		case '/stats':
			showStatsPage();
			break;
		default:
			window.history.pushState({}, '', '/');
			showHomePage();
			break;
	}
	updateTranslations();
	const socket = getSocket();
	if (socket) {
		if (socket.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify({ type: "user_online" }));
		else {
			socket.addEventListener('open', () => {
				socket.send(JSON.stringify({ type: "user_online" }));
			});
		}
	}
}


export function initRouter(): void {
	handleRoute();
	window.addEventListener('popstate', handleRoute);

	const socket = getSocket();
	window.addEventListener('beforeunload', () => {
		if (socket && socket.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify({ type: "user_offline" }))
	})
} 