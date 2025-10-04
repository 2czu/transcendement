import { getUserId } from "./main";
import { getTranslation, getLanguage } from "./lang";

export async function createMatchesPage(): Promise<void> {
	const app = document.getElementById('app');
	if (!app) return;

	const userId = await getUserId();
	if (!userId) {
		window.history.pushState({}, '', '/signIn');
		window.dispatchEvent(new PopStateEvent('popstate'));
		return;
	}

	app.innerHTML = `
	<div class="min-h-screen bg-gray-50">
	<button id="homeBtn" aria-label="Home" title="Home" class="absolute top-4 left-4 bg-white border rounded p-2 shadow-sm hover:bg-gray-100">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
		</svg>
	</button>
	<div class="max-w-3xl mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-6">
		<h1 data-i18n="matches.history" class="text-2xl font-bold text-gray-900">Historique des matchs</h1>
		<button data-i18n="matches.previous_button" id="backBtn" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">Retour</button>
		</div>
		<div id="list" class="space-y-3">
		<div data-i18n="matches.load" class="text-gray-500 text-sm">Chargement...</div>
		</div>
	</div>
	</div>
	`;

	const backBtn = document.getElementById('backBtn');
	backBtn?.addEventListener('click', () => {
		window.history.pushState({}, '', '/dashboard');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});
	}

	const list = document.getElementById('list');
	try {
		const res = await fetch(`https://localhost:8443/matches`, {
			credentials: "include"
		});
		if (!res.ok) {
			list!.innerHTML = `<div class="text-sm text-gray-500">${getTranslation("matches.no_matches", getLanguage())}</div>`;
			return;
		}
		const matches = await res.json();
		if (!Array.isArray(matches) || matches.length === 0) {
			list!.innerHTML = `<div class="text-sm text-gray-500">${getTranslation("matches.no_matches", getLanguage())}</div>`;
			return;
		}

		const userIds = new Set<number>();
		matches.forEach((m: any) => {
			userIds.add(m.player1_id);
		});

		const usernameCache = new Map<number, string>();
		await Promise.all(Array.from(userIds).map(async (id) => {
			try {
				const userRes = await fetch(`https://localhost:8443/users/${id}`, {
					credentials: "include"
				});
				if (userRes.ok) {
					const userData = await userRes.json();
					usernameCache.set(id, userData?.user?.username || `Utilisateur ${id}`);
				} else {
					usernameCache.set(id, "Not found player");
				}
			} catch {
				usernameCache.set(id, "Not found player");
			}
		}));

		list!.innerHTML = matches.map((m: any) => {
			const youAreP1 = m.player1_id === userId;
			const meScore = youAreP1 ? m.score_player1 : m.score_player2;
			const oppScore = youAreP1 ? m.score_player2 : m.score_player1;
			const result = m.winner_id === userId ? getTranslation("matches.victory", getLanguage()) : getTranslation("matches.defeat", getLanguage());

			const player1Name = usernameCache.get(m.player1_id) || `Utilisateur ${m.player1_id}`;
			const player2Name = getTranslation("matches.random", getLanguage());

			return `
		<div class="p-4 bg-white rounded shadow flex items-center justify-between">
		<div>
			<div class="text-sm text-gray-600">Match ID #${m.id}</div>
			<div class="text-lg font-semibold">${result} ${meScore} - ${oppScore}</div>
			<div class="text-sm text-gray-500">${player1Name} vs ${player2Name}</div>
		</div>
		<div class="text-xs text-gray-500">${youAreP1 ? getTranslation("matches.youareP1", getLanguage()) : getTranslation("matches.youareP2", getLanguage())}</div>
		</div>
	`;
		}).join('');
	} catch (e) {
		list!.innerHTML = `<div class="text-sm text-red-600">${getTranslation("matches.loading", getLanguage())}</div>`;
	}
}


