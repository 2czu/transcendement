import Chart from 'chart.js/auto';
import { getUserId } from './main';

export async function createStatsPage(): Promise<void> {
    const app = document.getElementById('app');
    if (!app) return;

    const userId = await getUserId();
    if (!userId) {
        console.log("--------------");
        window.history.pushState({}, '', '/signIn');
        window.dispatchEvent(new PopStateEvent('popstate'));
    return;
    }

    app.innerHTML = `
      <div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col justify-center items-center">
			<div class="absolute -left-32 -top-32 w-80 h-80 bg-indigo-800 rounded-full opacity-30 filter blur-3xl animate-pulse"></div>
			<div class="absolute right-0 top-20 w-72 h-72 bg-indigo-700 rounded-full opacity-20 filter blur-2xl animate-pulse"></div>
			<div class="absolute left-1/2 bottom-0 w-96 h-96 bg-indigo-900 rounded-full opacity-15 filter blur-3xl transform -translate-x-1/2 animate-pulse"></div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6 mt-10">
              <div class="flex items-center justify-between mb-6">
                  <h1 class="text-2xl font-bold text-white">Mes statistiques</h1>
                  <button id="backBtn" class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">Retour</button>
              </div>
              <div class="bg-white rounded-lg shadow p-6 mb-8">
              <h2 class="text-lg font-semibold mb-2">Victory Ratio</h2>
              <canvas id="winRatioChart" width="400" height="200"></canvas>
              <h2 class="text-lg font-semibold mt-8 mb-2">Ratio Goaled / Taken</h2>
              <canvas id="goalRatioChart" width="400" height="200"></canvas>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl shadow-sm p-4 mb-4 mt-10">
                  <h2 class="text-lg font-semibold mb-2">Détails des statistiques</h2>
                  <div id="statsContent" class="text-sm text-black"></div>
              </div>
              <div id="statsDetails" class="space-y-3"></div>
          </div>
      </div>
      `;

    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
    });
    const res = await fetch(`https://localhost:8443/stats`, {
            credentials: "include"
        });
        if (!res.ok) {
            app.innerHTML += `<div class="text-sm text-gray-500">Aucune statistique trouvée</div>`;
            return;
        }
    const stats = await res.json();

    const winRatio = stats.game_played > 0 ? (stats.games_won / stats.game_played) : 0;

    const winCtx = (document.getElementById('winRatioChart') as HTMLCanvasElement).getContext('2d');
    if (winCtx) {
        new Chart(winCtx, {
            type: 'doughnut',
            data: {
                labels: ['Victory', 'Defeat'],
                datasets: [{
                    data: [stats.games_won, stats.game_played - stats.games_won],
                    backgroundColor: ['#10b981','#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { enabled: true }
                }
            }
        });
    }

    const goalCtx = (document.getElementById('goalRatioChart') as HTMLCanvasElement).getContext('2d');
    if (goalCtx) {
        new Chart(goalCtx, {
            type: 'pie',
            data: {
                labels: ['Goaled', 'Taken'],
                datasets: [{
                    data: [stats.total_score, stats.goal_taken],
                    backgroundColor: ['#3b4ef6ff', '#f56642ff']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { enabled: true }
                }
            }
        });
    }

    const statsDetails = document.getElementById('statsDetails');
    if (statsDetails) {
        statsDetails.innerHTML = `
            <div class="p-4 bg-gray-100 rounded text-black">
                <p><strong>Parties jouées :</strong> ${stats.game_played}</p>
                <p><strong>Parties gagnées :</strong> ${stats.games_won}</p>
                <p><strong>Score total :</strong> ${stats.total_score}</p>
                <p><strong>Buts encaissés :</strong> ${stats.goal_taken}</p>
                <p><strong>Ratio de victoire :</strong> ${(winRatio * 100).toFixed(1)}%</p>
            </div>
        `;
    }
}