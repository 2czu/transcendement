import { showGamePage, showDashboardPage, showTournamentPage, showStatsPage, handleRoute } from './router';
import { showSignInPage } from './router';
import { getLanguage, setLanguage, updateTranslations } from './lang';
import { getUserId } from './main';

export function createHomePage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white">
			<div class="absolute -left-32 -top-32 w-80 h-80 bg-indigo-800 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
			<div class="absolute right-0 top-20 w-72 h-72 bg-indigo-700 rounded-full opacity-20 filter blur-2xl animate-pulse"></div>
			<div class="absolute left-1/2 bottom-0 w-96 h-96 bg-indigo-900 rounded-full opacity-15 filter blur-3xl transform -translate-x-1/2 animate-pulse"></div>

			<header class="relative z-30 flex justify-end p-6">
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
				@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;500;600;800;900&family=Lobster+Two:ital,wght@0,400;0,700;1,400&display=swap');
				:root {
				  --primary-color: #5c5fc4;
				  --second-color: #c4c15c;
				  --first-shadow: rgba(0,0,0,0.3);
				}
				.container {
				  display: flex;
				  justify-content: center;
				  align-items: center;
				  position: relative;
				  height: 180px;
				  margin-bottom: 2.5rem;
				}
				.box {
				  position: relative;
				  width: 100%;
				  height: 120px;
				  transform-style: preserve-3d;
				  animation: animate 7s ease-in-out infinite alternate;
				}
				.box span {
				  background: linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5) 90%, transparent);
				  text-transform: uppercase;
				  line-height: 0.76em;
				  position: absolute;
				  left: 50%;
				  top: 50%;
				  color: #fff;
				  font-size: 3.5em;
				  white-space: nowrap;
				  font-weight: bold;
				  padding: 0 10px;
				  transform-style: preserve-3d;
				  text-shadow: 0 10px 15px var(--first-shadow);
				  font-family: 'Poppins', sans-serif;
				  transform: translate(-50%, -50%) rotateX(calc(var(--i) * 22.5deg)) translateZ(109px);
				}
				.box span i {
				  font-style: initial;
				}
				.box span i:first-child {
				  /* color: var(--primary-color); */
				}
				.box span i:last-child {
				  color: var(--second-color);
				}
				@keyframes animate {
				  0% {
				    transform: perspective(500px) rotateX(90deg) rotate(5deg);
				  }
				  100% {
				    transform: perspective(50px) rotateX(450deg) rotate(5deg);
				  }
				}
				</style>
				<div class="container">
				  <div class="box">
				    <span style="--i:1">TRANSCENDENCE</span>
				    <span style="--i:2">TRANSCENDENCE</span>
				    <span style="--i:3">TRANSCENDENCE</span>
				    <span style="--i:4">TRANSCENDENCE</span>
				    <span style="--i:5">TRANSCENDENCE</span>
				    <span style="--i:6">TRANSCENDENCE</span>
				    <span style="--i:7">TRANSCENDENCE</span>
				    <span style="--i:8">TRANSCENDENCE</span>
				    <span style="--i:9">TRANSCENDENCE</span>
				    <span style="--i:10">TRANSCENDENCE</span>
				    <span style="--i:11">TRANSCENDENCE</span>
				    <span style="--i:12">TRANSCENDENCE</span>
				    <span style="--i:13">TRANSCENDENCE</span>
				    <span style="--i:14">TRANSCENDENCE</span>
				    <span style="--i:15">TRANSCENDENCE</span>
				    <span style="--i:16">TRANSCENDENCE</span>
				  </div>
				</div>

				<div class="flex flex-col md:flex-row items-center gap-4">
					<button id="singleBtn" class="relative overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg shadow-[0_25px_50px_rgba(0,0,0,0.75)] transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-400/20">
						<span data-i18n="home.singleplayer" class="relative z-10">Singleplayer</span>
						<span class="btn-gloss"></span>
					</button>
					<button id="multiBtn" class="relative overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold text-lg shadow-[0_25px_50px_rgba(0,0,0,0.75)] transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-400/20">
						<span data-i18n="home.multiplayer" class="relative z-10">Multiplayer</span>
						<span class="btn-gloss"></span>
					</button>
					<button id="tournamentBtn" class="relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white font-semibold transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-102 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
						<span data-i18n="home.tournament" class="relative z-10">Tournoi (8 joueurs)</span>
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
		singleBtn.addEventListener("click", () => {
			// todo
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
			getUserId().then(userId => {
			if (!userId) {
				window.history.pushState({}, '', '/signIn');
				handleRoute();
			}
			else {
				window.history.pushState({}, '', '/dashboard');
				handleRoute();
			}
			});
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

	async function fetchUser() {
		let userId = await getUserId ();
		try {
			const res = await fetch(`https://localhost:8443/users/${userId}`, {
				method: 'GET',
				credentials: "include"
			});
			if (res.ok) {
				const data = await res.json();
			}
		} catch (err) {
			console.error('Erreur lors de la requête :', err);
		}
	}

	// Exécution au chargement de la page
	window.addEventListener('load', () => {
		fetchUser(); // remplace 1 par l'id que tu veux tester
	});
}