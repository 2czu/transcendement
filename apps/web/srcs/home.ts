import { showGamePage, showDashboardPage, showTournamentPage, showStatsPage, handleRoute } from './router';
import { showSignInPage } from './router';
import { getLanguage, setLanguage, updateTranslations } from './lang';

export function createHomePage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white">
			<div class="absolute -left-32 -top-32 w-80 h-80 bg-indigo-800 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
			<div class="absolute right-0 top-20 w-72 h-72 bg-indigo-700 rounded-full opacity-20 filter blur-2xl animate-pulse"></div>
			<div class="absolute left-1/2 bottom-0 w-96 h-96 bg-indigo-900 rounded-full opacity-15 filter blur-3xl transform -translate-x-1/2 animate-pulse"></div>

			<header class="relative z-10 flex justify-end p-6">
				<select id="langSwitcher" class="bg-white/10 text-white rounded px-3 py-2 hover:bg-white/20 transition-colors">
					<option value="en">EN</option>
					<option value="fr">FR</option>
					<option value="es">ES</option>
				</select>
				<button id="userIcon" class="ml-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
					<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
					</svg>
				</button>
			</header>

			<main class="relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh] px-6">
				<style>
				@keyframes glossMove { 0% { transform: translateX(-140%) skewX(-20deg); opacity: 0 } 40% { opacity: .35 } 100% { transform: translateX(140%) skewX(-20deg); opacity: 0 } }
				.btn-gloss { position: absolute; top:0; left:0; width:40%; height:100%; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0)); transform: skewX(-20deg); animation: glossMove 1.8s linear infinite; mix-blend-mode: screen; pointer-events: none; }
				</style>
				<h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white/70 to-white/40 drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
					<span class="block transform-gpu animate-pulse">TRANSCENDENCE</span>
				</h1>

				<div class="flex flex-col md:flex-row items-center gap-4">
					<button id="singleBtn" class="relative overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg shadow-[0_25px_50px_rgba(0,0,0,0.75)] transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-400/20">
						<span class="relative z-10">Singleplayer</span>
						<span class="btn-gloss"></span>
					</button>
					<button id="multiBtn" class="relative overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg shadow-[0_25px_50px_rgba(0,0,0,0.75)] transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-400/20">
						<span class="relative z-10">Multiplayer</span>
						<span class="btn-gloss"></span>
					</button>
					<button id="tournamentBtn" class="relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white font-semibold transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-102 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
						<span class="relative z-10">Tournoi (8 joueurs)</span>
						<span class="btn-gloss" style="animation-duration: 2.4s"></span>
					</button>
				</div>

				<div class="mt-10 w-full max-w-xl bg-white/10 backdrop-blur-sm rounded-xl p-6">
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
							<span class="text-2xl">📊</span>
						</div>
						<div class="text-left">
							<h3 class="text-lg font-semibold">Statistics</h3>
							<p class="text-sm opacity-80">Graphana statistics</p>
						</div>
					</div>
					<div class="mt-4">
						<button id="statsBtn" class="w-full bg-white text-indigo-700 py-2 rounded-md font-medium hover:bg-white/90 transition-colors">View statistics</button>
					</div>
				</div>
			</main>
		</div>
	`;

	const statsBtn = document.getElementById('statsBtn') as HTMLButtonElement;
	if (statsBtn) {
		statsBtn.addEventListener("click", () => {
			window.history.pushState({}, '', '/game');
			handleRoute();
		});
	}
	const singleBtn = document.getElementById("singleBtn");
	if (singleBtn) {
		// Singleplayer is a placeholder button for now; no navigation attached
		singleBtn.addEventListener("click", () => {
			// TODO: implement singleplayer flow
		});
	}
	const multiBtn = document.getElementById("multiBtn");
	if (multiBtn) {
		multiBtn.addEventListener("click", () => {
			window.history.pushState({}, '', '/game');
			handleRoute();
		});
	}

	const tournamentBtn = document.getElementById("tournamentBtn");
	if (tournamentBtn) {
		tournamentBtn.addEventListener("click", () => {
			window.history.pushState({}, '', '/tournament');
			handleRoute();
		});
	}

	const userIcon = document.getElementById("userIcon");
	if (userIcon) {
		userIcon.addEventListener("click", () => {
			const token = localStorage.getItem('auth_token');
			if (token) {
				window.history.pushState({}, '', '/dashboard');
				handleRoute();
			} else {
				window.history.pushState({}, '', '/signIn');
				handleRoute();

			}
		});
	}

	const langSwitcher = document.getElementById("langSwitcher") as HTMLSelectElement;
	if (langSwitcher) {
		// Charger la langue sauvegardée
		const savedLang = getLanguage();
		langSwitcher.value = savedLang;

		langSwitcher.addEventListener("change", () => {
			setLanguage(langSwitcher.value as any);
		});
	}

	async function fetchUser(id) {
		try {
			const token = localStorage.getItem('auth_token');
			const res = await fetch(`https://localhost:8443/users/${id}`, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (res.ok) {
				const data = await res.json();
				console.log(`------------------Réponse /users/${id} :`, data);
			} else {
				console.log(`-------------------Erreur ${res.status} : ${res.statusText}`);
			}
		} catch (err) {
			console.error('///////////////////////Erreur lors de la requête :', err);
		}
	}

	// Exécution au chargement de la page
	window.addEventListener('load', () => {
		fetchUser(1); // remplace 1 par l'id que tu veux tester
	});
} 