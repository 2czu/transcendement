export function createDashboardPage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	// token check
	const token = localStorage.getItem('auth_token');
	if (!token) {
		window.history.pushState({}, '', '/signIn');
		window.dispatchEvent(new PopStateEvent('popstate'));
		return;
	}

	app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">

          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center">
              <div>
                <h1 data-i18n="dashboard.dashboard" class="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p data-i18n="dashboard.welcome" class="text-gray-600 mt-1">Welcome to your personal space</p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">Connected</span>
                <button data-i18n="dashboard.anonymise" id="anonymiseBtn" class="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Anonymise
                </button>
                <button data-i18n="dashboard.log_out" id="logoutBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">

            <!-- profile -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-2xl text-indigo-600">👤</span>
                </div>
                <div>
                  <h3 data-i18n="dashboard.profile" class="text-lg font-semibold text-gray-900">Profile</h3>
                  <p data-i18n="dashboard.desc_profile" class="text-gray-600">Manage your information</p>
                </div>
              </div>
              <div class="mt-4">
                <button data-i18n="dashboard.button_profile" id="profileBtn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors">
                  View profile
                </button>
              </div>
            </div>


            <!--  matches   -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-2xl text-blue-600">🎮</span>
                </div>
                <div>
                  <h3 data-i18n="dashboard.matches" class="text-lg font-semibold text-gray-900">Matches</h3>
                  <p data-i18n="dashboard.desc_matches" class="text-gray-600">Match history</p>
                </div>
              </div>
              <div class="mt-4">
                <button data-i18n="dashboard.button_matches" id="matchesBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  View matches
                </button>
              </div>
            </div>


            <!-- Game -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span class="text-2xl text-red-600">🎮</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Pong</h3>
                  <p data-i18n="dashboard.desc_pong" class="text-gray-600">Start a Pong game</p>
                </div>
              </div>
              <div class="mt-4">
                <button data-i18n="dashboard.button_pong" id="playGameBtn" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                  Play
                </button>
              </div>
            </div>

            <!-- tournament -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-2xl text-purple-600">🏆</span>
                </div>
                <div>
                  <h3 data-i18n="dashboard.tournament" class="text-lg font-semibold text-gray-900">Tournament</h3>
                  <p data-i18n="dashboard.desc_tournament" class="text-gray-600">Join the tournament</p>
                </div>
              </div>
              <div class="mt-4">
                <button data-i18n="dashboard.button_tournament" id="tournamentBtn" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Join tournament
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 data-i18n="dashboard.friends" class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="text-2xl mr-3">👥</span>
              Friends Management
            </h2>
            
            <!-- friend request -->
            <div class="mb-8">
              <h3 data-i18n="dashboard.send_request" class="text-lg font-semibold text-gray-800 mb-4">Send a friend request</h3>
              <div class="flex gap-4 items-end">
                <div class="flex-1">
                  <label data-i18n="dashboard.search" class="block text-sm font-medium text-gray-700 mb-2">Search for a user</label>
                  <input data-i18n="dashboard.username_form" type="text" id="searchUser" placeholder="Username..." 
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <button data-i18n="dashboard.search_button" id="searchBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Search
                </button>
              </div>
              
              <div id="searchResults" class="mt-4 hidden">
                <h4 data-i18n="dashboard.result" class="text-md font-medium text-gray-700 mb-2">Results:</h4>
                <div id="usersList" class="space-y-2"></div>
              </div>
            </div>

            <div class="mb-8">
              <h3 data-i18n="dashboard.received_req" class="text-lg font-semibold text-gray-800 mb-4">Received friend requests</h3>
              <div id="friendRequests" class="space-y-3">
                <p data-i18n="dashboard.load" class="text-gray-500 text-sm">Loading requests...</p>
              </div>
            </div>

            <div>
              <h3 data-i18n="dashboard.my_friends" class="text-lg font-semibold text-gray-800 mb-4">My friends</h3>
              <div id="friendsList" class="space-y-3">
                <p class="text-gray-500 text-sm">Loading friends list...</p>
              </div>
            </div>
          </div>

          <!-- status-->
          <div id="message" class="mt-6 text-center text-sm"></div>
        </div>
      </div>
    </div>
  `;

	const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
	const anonymiseBtn = document.getElementById('anonymiseBtn') as HTMLButtonElement;
	const playGameBtn = document.getElementById('playGameBtn') as HTMLButtonElement;
	const message = document.getElementById('message') as HTMLDivElement;
	const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
	const searchUser = document.getElementById('searchUser') as HTMLInputElement;
	const profileBtn = document.getElementById('profileBtn') as HTMLButtonElement;
	const matchesBtn = document.getElementById('matchesBtn') as HTMLButtonElement;
	const tournamentBtn = document.getElementById('tournamentBtn') as HTMLButtonElement;

	// cache pour limiter les requetes au back
	const usernameCache = new Map<number, string>();

	// la fonction parle d'elle meme
	async function getUsernameById(id: number): Promise<string> {
		if (usernameCache.has(id)) return usernameCache.get(id)!;
		try {
			const token = localStorage.getItem('auth_token');
			const res = await fetch(`https://localhost:8443/users/${id}`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			if (res.ok) {
				const data = await res.json();
				const name = data?.user?.username ?? 'User';
				usernameCache.set(id, name);
				return name;
			}
		} catch { }
		return 'User';
	}

	async function preloadAllUsernames(): Promise<void> {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			let userId: number;
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				userId = payload.userId;
			} catch { return; }

			const ids = new Set<number>();
			try {
				const resF = await fetch(`https://localhost:8443/friendlist/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
				if (resF.ok) {
					const list = await resF.json();
					if (Array.isArray(list)) {
						for (const item of list) {
							if (typeof item.user_id === 'number') ids.add(item.user_id);
							if (typeof item.friend_id === 'number') ids.add(item.friend_id);
						}
					}
				}
			} catch { }

			try {
				const resR = await fetch(`https://localhost:8443/friendReq/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
				if (resR.ok) {
					const list = await resR.json();
					if (Array.isArray(list)) {
						for (const item of list) {
							if (typeof item.user_id === 'number') ids.add(item.user_id);
							if (typeof item.friend_id === 'number') ids.add(item.friend_id);
						}
					}
				}
			} catch { }

			ids.delete(userId); // osef de notre propre id
			await Promise.all(Array.from(ids).map(async (id) => {
				try {
					const name = await getUsernameById(id);
					usernameCache.set(id, name);
				} catch { }
			}));
		} catch { }
	}

	// deconnexion
	logoutBtn.addEventListener('click', () => {

		localStorage.removeItem('auth_token');

		message.textContent = 'Successfully logged out! Redirecting...';
		message.className = 'mt-6 text-center text-sm text-green-600';

		setTimeout(() => {
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		}, 1000);
	});

	// anonymise
	anonymiseBtn.addEventListener('click', async () => {
		if (!confirm('Confirmer l\'anonymisation de votre compte ? Cette action est irréversible.')) {
			return;
		}
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) {
				showMessage('You must be logged in', 'error');
				return;
			}
			let userId: number | null = null;
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				userId = payload.userId;
			} catch { }
			const res = await fetch('https://localhost:8443/anonymise', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include',
				body: JSON.stringify({ id: userId ?? 0 })
			});
			if (res.ok) {
				const data = await res.json().catch(() => ({} as any));
				const uname = (data as any)?.username ?? 'unknown';
				const mail = (data as any)?.email ?? 'unknown';
				showMessage(`Anonymised. New username: ${uname}, email: ${mail}`, 'success');
			} else {
				const err = await res.json().catch(() => ({}));
				showMessage(err.error || 'Failed to anonymise account', 'error');
			}
		} catch {
			showMessage('Failed to anonymise account', 'error');
		}
	});


	// events quand on click sur les boutons + redireciton popstate
	playGameBtn.addEventListener('click', () => {
		window.history.pushState({}, '', '/game');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	profileBtn.addEventListener('click', () => {
		window.history.pushState({}, '', '/profile');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	matchesBtn.addEventListener('click', () => {
		window.history.pushState({}, '', '/matches');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});


	tournamentBtn.addEventListener('click', () => {
		window.history.pushState({}, '', '/tournament');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	searchBtn.addEventListener('click', async () => {
		const searchTerm = searchUser.value.trim();
		if (!searchTerm) {
			showMessage('Please enter a username', 'error');
			return;
		}

		try {
			const token = localStorage.getItem('auth_token');
			const url = `https://localhost:8443/checkUser/${encodeURIComponent(searchTerm)}`;
			const headers: Record<string, string> = {};
			if (token) headers['Authorization'] = `Bearer ${token}`;

			const response = await fetch(url, { method: 'GET', headers });

			if (response.status === 200) {
				const data = await response.json();
				const id = data?.id ?? data?.user?.id ?? null;
				if (!id) {
					showMessage('No user found', 'info');
					displaySearchResults([]);
					return;
				}
				const username = await getUsernameById(id).catch(() => searchTerm);
				const userObj = { id, username, isLogged: 'offline' };
				displaySearchResults([userObj]);
				return;
			}

			if (response.status === 404) {
				showMessage('No user found', 'info');
				displaySearchResults([]);
				return;
			}
			showMessage('Error during search', 'error');
		} catch (error) {
			showMessage('Error during search', 'error');
		}
	});

	searchUser.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			searchBtn.click();
		}
	});

	// preload
	preloadAllUsernames().finally(() => {
		loadFriendRequests();
		loadFriendsList();
	});

	function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
		message.textContent = text;
		message.className = `mt-6 text-center text-sm ${type === 'success' ? 'text-green-600' :
			type === 'error' ? 'text-red-600' : 'text-blue-600'
			}`;

		setTimeout(() => {
			message.textContent = '';
			message.className = 'mt-6 text-center text-sm';
		}, 5000);
	}

	function displaySearchResults(users: any[]) {
		const searchResults = document.getElementById('searchResults');
		const usersList = document.getElementById('usersList');

		if (!searchResults || !usersList) return;

		if (users.length === 0) {
			usersList.innerHTML = '<p class="text-gray-500 text-sm">No user found</p>';
		} else {
			usersList.innerHTML = users.map(user => `
					<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
								<span class="text-lg text-purple-600">👤</span>
							</div>
							<div>
								<p class="font-medium text-gray-900">${user.username}</p>
								<p class="text-sm text-gray-500">${user.isLogged === 'online' ? '🟢 Online' : '🔴 Offline'}</p>
							</div>
						</div>
						<button onclick="sendFriendRequest(${user.id})" 
								class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
							Add
						</button>
					</div>
				`).join('');
		}

		searchResults.classList.remove('hidden');
	}

	async function loadFriendRequests() {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			let userId: number;
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				userId = payload.userId;
			} catch (error) {
				console.error('Error decoding token:', error);
				return;
			}

			if (!userId) return;

			const response = await fetch(`https://localhost:8443/friendReq/${userId}`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			if (!response.ok) {
				await displayFriendRequests([], userId);
				return;
			}
			const requests = await response.json();
			await displayFriendRequests(Array.isArray(requests) ? requests : [], userId);
		} catch (error) {
			await displayFriendRequests([], 0 as any);
		}
	}

	async function loadFriendsList() {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			let userId: number;
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				userId = payload.userId;
			} catch (error) {
				console.error('Error decoding token:', error);
				return;
			}

			if (!userId) return;

			const response = await fetch(`https://localhost:8443/friendlist/${userId}`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			if (!response.ok) {
				await displayFriendsList([], userId);
				return;
			}
			const friends = await response.json();
			await displayFriendsList(Array.isArray(friends) ? friends : [], userId);
		} catch (error) {
			await displayFriendsList([], 0 as any);
		}
	}

	async function displayFriendRequests(requests: any[], userId: number) {
		const friendRequests = document.getElementById('friendRequests');
		if (!friendRequests) return;

		if (requests.length === 0) {
			friendRequests.innerHTML = '<p data-i18n="dashboard.no_req" class="text-gray-500 text-sm">No pending friend requests</p>';
			return;
		}

		const uniqueIds = Array.from(new Set(requests.map(r => r.user_id)));
		const names = await Promise.all(uniqueIds.map(id => getUsernameById(id)));
		const idToName = new Map(uniqueIds.map((id, idx) => [id, names[idx]]));
		friendRequests.innerHTML = requests.map(request => `
				<div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
							<span class="text-lg text-yellow-600">👤</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">Request from ${request.user_id === userId ? 'you' : idToName.get(request.user_id)}</p>
							<p class="text-sm text-gray-500">Awaiting response</p>
						</div>
					</div>
					<div class="flex space-x-2">
						<button onclick="acceptFriendRequest(${request.user_id}, ${request.friend_id})" 
								class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
							Accept
						</button>
						<button onclick="refuseFriendRequest(${request.user_id}, ${request.friend_id})" 
								class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
							Decline
						</button>
					</div>
				</div>
			`).join('');
	}

	async function displayFriendsList(friends: any[], userId: number) {
		const friendsList = document.getElementById('friendsList');
		if (!friendsList) return;

		if (friends.length === 0) {
			friendsList.innerHTML = '<p data-i18n="dashboard.no_friends" class="text-gray-500 text-sm">You have no friends yet</p>';
			return;
		}

		const otherIds = friends.map(f => (f.friend_id === userId ? f.user_id : f.friend_id));
		const uniqueFriendIds = Array.from(new Set(otherIds));
		const friendNames = await Promise.all(uniqueFriendIds.map(id => getUsernameById(id)));
		const idToFriendName = new Map(uniqueFriendIds.map((id, idx) => [id, friendNames[idx]]));
		friendsList.innerHTML = friends.map(friend => `
				<div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
							<span class="text-lg text-green-600">👤</span>
						</div>
						<div>
							<p class="font-medium text-gray-900">${idToFriendName.get(friend.friend_id === userId ? friend.user_id : friend.friend_id)}</p>
							<p class="text-sm text-gray-500">Friendship established</p>
						</div>
					</div>
					<button onclick="removeFriend(${userId}, ${friend.friend_id === userId ? friend.user_id : friend.friend_id})" 
							class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
						Remove
					</button>
				</div>
			`).join('');
	}

	(window as any).sendFriendRequest = async (friendId: number) => {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) {
				showMessage('Missing authentication token', 'error');
				return;
			}

			let userId: number;
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				userId = payload.userId;
				console.log('Decoded token:', payload);
				console.log('Extracted User ID:', userId);
			} catch (error) {
				console.error('Error decoding token:', error);
				showMessage('Error decoding token', 'error');
				return;
			}

			if (!userId) {
				showMessage('User ID not found in token', 'error');
				return;
			}

			console.log('Sending friend request:', { userId, friendId });

			const response = await fetch('https://localhost:8443/friendRequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					user_id: userId,
					friend_id: friendId
				})
			});

			console.log('API response:', response.status, response.statusText);

			if (response.ok) {
				showMessage('Friend request sent successfully!', 'success');
				searchUser.value = '';
				document.getElementById('searchResults')?.classList.add('hidden');
			} else {
				const error = await response.json();
				console.error('API error:', error);
				showMessage(error.error || 'Error sending friend request', 'error');
			}
		} catch (error) {
			console.error('Error sending friend request:', error);
			showMessage('Error sending friend request', 'error');
		}
	};

	(window as any).acceptFriendRequest = async (userId: number, friendId: number) => {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			const response = await fetch('https://localhost:8443/friendAccept', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					user_id: userId,
					friend_id: friendId
				})
			});

			if (response.ok) {
				showMessage('Friend request accepted!', 'success');
				loadFriendRequests();
				loadFriendsList();
			} else {
				showMessage('Error accepting friend request', 'error');
			}
		} catch (error) {
			showMessage('Error accepting friend request', 'error');
		}
	};

	(window as any).refuseFriendRequest = async (userId: number, friendId: number) => {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			const response = await fetch('https://localhost:8443/friendRefuse', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					user_id: userId,
					friend_id: friendId
				})
			});

			if (response.ok) {
				showMessage('Friend request declined', 'success');
				loadFriendRequests();
			} else {
				showMessage('Error declining friend request', 'error');
			}
		} catch (error) {
			showMessage('Error declining friend request', 'error');
		}
	};

	(window as any).removeFriend = async (userId: number, friendId: number) => {
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) return;

			const response = await fetch('https://localhost:8443/deleteFriend', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					user_id: userId,
					friend_id: friendId
				})
			});

			if (response.ok) {
				showMessage('Friend removed from your list', 'success');
				loadFriendsList();
			} else {
				showMessage('Error removing friend', 'error');
			}
		} catch (error) {
			showMessage('Error removing friend', 'error');
		}
	};
}
