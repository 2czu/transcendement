export function createProfilePage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	const token = localStorage.getItem('auth_token');
	if (!token) {
		window.history.pushState({}, '', '/signIn');
		window.dispatchEvent(new PopStateEvent('popstate'));
		return;
	}

	let userId: number;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		userId = payload.userId;
	} catch (error) {
		console.error('Error decoding token:', error);
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
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
          <!-- Header with back button -->
          <div class="flex items-center mb-6">
            <button id="backBtn" class="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 data-i18n="profile.my_profile" class="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 data-i18n="profile.personal_info" class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div class="mb-6">
              <label data-i18n="profile.profile_pic" class="block text-sm font-medium text-gray-700 mb-2">Profile picture</label>
              <div class="flex items-center space-x-4">
                <div id="currentAvatar" class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                  <span class="text-3xl text-indigo-600">👤</span>
                </div>
                <div class="flex-1">
                  <input type="file" id="avatarInput" accept="image/*" class="hidden">
                  <button data-i18n="profile.upload_pic" id="changeAvatarBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Change photo
                  </button>
                  <p data-i18n="profile.formats" class="text-sm text-gray-500 mt-1">Accepted formats: JPG, PNG (max 1MB)</p>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <label data-i18n="profile.username" for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div class="flex space-x-2">
                <input data-i18n="profile.username_form"  type="text" id="username" placeholder="Your username" 
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button data-i18n="profile.save_button"  id="saveUsernameBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Save
                </button>
              </div>
              <p id="usernameMessage" class="text-sm mt-2"></p>
            </div>

						<div class="mb-6">
							<label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
							<div class="flex space-x-2">
								<input type="email" id="email" 
											 class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
								<button id="saveEmailBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Save</button>
							</div>
							<p id="emailMessage" class="text-sm mt-2 text-gray-500"></p>
						</div>

						<div class="mb-6 border-t pt-6">
							<h3 class="text-lg font-medium text-gray-900 mb-2">Change password</h3>
							<div class="space-y-3">
								<input id="currentPassword" type="password" placeholder="Current password" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
								<input id="newPassword" type="password" placeholder="New password" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
								<input id="confirmPassword" type="password" placeholder="Confirm new password" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
								<div class="flex items-center space-x-2">
									<button id="changePasswordBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Change password</button>
									<p id="passwordMessage" class="text-sm text-gray-500"></p>
								</div>
							</div>
						</div>

            <div class="mb-6">
              <label data-i18n="profile.connection_status" class="block text-sm font-medium text-gray-700 mb-2">Connection status</label>
              <div class="flex items-center space-x-2">
                <span id="statusIndicator" class="w-3 h-3 bg-green-500 rounded-full"></span>
                <span id="statusText" class="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-red-200">
            <h2 data-i18n="profile.danger_zone" class="text-xl font-semibold text-red-700 mb-4">Danger zone</h2>
            
            <div class="mb-4">
              <h3 data-i18n="profile.delete_my_acc" class="text-lg font-medium text-red-700 mb-2">Delete my account</h3>
              <p data-i18n="profile.irreversible" class="text-sm text-gray-600 mb-4">
                This action is irreversible. All your data, friends, and statistics will be permanently deleted.
              </p>
              <button data-i18n="profile.delete_button" id="deleteAccountBtn" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                Delete my account
              </button>
            </div>

            <div>
              <h3 data-i18n="profile.log_out" class="text-lg font-medium text-gray-700 mb-2">Log out</h3>
              <p data-i18n="profile.desc_log_out" class="text-sm text-gray-600 mb-4">
                Close your current session and return to the home page.
              </p>
              <button data-i18n="profile.log_out_button" id="logoutBtn" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                Log out
              </button>
            </div>
          </div>

          <!-- status message -->
          <div id="message" class="mt-6 text-center text-sm"></div>
        </div>
      </div>
    </div>
  `;

	const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
	const changeAvatarBtn = document.getElementById('changeAvatarBtn') as HTMLButtonElement;
	const avatarInput = document.getElementById('avatarInput') as HTMLInputElement;
	const username = document.getElementById('username') as HTMLInputElement;
	const saveUsernameBtn = document.getElementById('saveUsernameBtn') as HTMLButtonElement;
	const usernameMessage = document.getElementById('usernameMessage') as HTMLParagraphElement | null;
	const email = document.getElementById('email') as HTMLInputElement;
	const saveEmailBtn = document.getElementById('saveEmailBtn') as HTMLButtonElement | null;
	const emailMessage = document.getElementById('emailMessage') as HTMLParagraphElement | null;
	const currentPassword = document.getElementById('currentPassword') as HTMLInputElement | null;
	const newPassword = document.getElementById('newPassword') as HTMLInputElement | null;
	const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement | null;
	const changePasswordBtn = document.getElementById('changePasswordBtn') as HTMLButtonElement | null;
	const passwordMessage = document.getElementById('passwordMessage') as HTMLParagraphElement | null;
	const deleteAccountBtn = document.getElementById('deleteAccountBtn') as HTMLButtonElement;
	const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
	const message = document.getElementById('message') as HTMLDivElement;

	const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});
	}

	loadProfileData();

	backBtn.addEventListener('click', () => {
		window.history.pushState({}, '', '/dashboard');
		window.dispatchEvent(new PopStateEvent('popstate'));
	});

	changeAvatarBtn.addEventListener('click', () => {
		avatarInput.click();
	});

	avatarInput.addEventListener('change', async (event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;

		if (file.size > 1 * 1024 * 1024) {
			showMessage('The file is too large (max 1MB)', 'error');
			return;
		}

		if (!file.type.startsWith('image/')) {
			showMessage('Please select a valid image file', 'error');
			return;
		}

		try {

			const blobUrl = URL.createObjectURL(file);
			const currentAvatar = document.getElementById('currentAvatar');
			if (currentAvatar) {
				currentAvatar.innerHTML = `<img src="${blobUrl}" alt="Avatar" class="w-full h-full object-cover">`;
			}

			const formData = new FormData();
			formData.append('avatar', file);

			const token = localStorage.getItem('auth_token');
			if (!token) {
				showMessage('You must be logged in', 'error');
				return;
			}

			const res = await fetch('https://localhost:8443/avatar', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData,
				credentials: 'include'
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				showMessage(err.error || 'Error uploading avatar', 'error');
				URL.revokeObjectURL(blobUrl);
				return;
			}

			const tryExt = async (ext: string) => {
				const url = `https://localhost:8443/uploads/avatar_${userId}.${ext}`;
				try {
					const head = await fetch(url + `?t=${Date.now()}`, { method: 'HEAD' });
					if (head.ok) return url;
				} catch { }
				return null;
			};
			let avatarUrl = await tryExt('png');
			if (!avatarUrl) avatarUrl = await tryExt('jpg');
			if (!avatarUrl) avatarUrl = await tryExt('jpeg');
			if (currentAvatar) {
				currentAvatar.innerHTML = `<img src="${avatarUrl}?t=${Date.now()}" alt="Avatar" class="w-full h-full object-cover">`;
			}
			URL.revokeObjectURL(blobUrl);
			showMessage('Profile picture updated!', 'success');
		} catch (error) {
			showMessage('Error updating profile picture', 'error');
		}
	});

	saveUsernameBtn.addEventListener('click', async () => {
		const newUsername = username.value.trim();
		if (!newUsername) {
			showMessage('Please enter a username', 'error');
			return;
		}

		if (newUsername.length < 3) {
			showMessage('Username must be at least 3 characters', 'error');
			return;
		}

		try {
			const response = await fetch(`https://localhost:8443/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					username: newUsername
				}),
				credentials: 'include'
			});

			if (response.ok) {
				showMessage('Username updated successfully!', 'success');
			} else {
				const error = await response.json();
				showMessage(error.error || 'Error updating username', 'error');
			}
		} catch (error) {
			showMessage('Error updating username', 'error');
		}
	});

	if (saveEmailBtn) {
		saveEmailBtn.addEventListener('click', async () => {
			const newEmail = email.value.trim();
			if (!newEmail) {
				if (emailMessage) emailMessage.textContent = 'Please enter an email';
				return;
			}
			if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
				if (emailMessage) emailMessage.textContent = 'Invalid email format';
				return;
			}

			try {
				const response = await fetch(`https://localhost:8443/users/${userId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ email: newEmail }),
					credentials: 'include'
				});

				if (response.ok) {
					if (emailMessage) emailMessage.textContent = 'Email updated successfully!';
					showMessage('Email updated successfully!', 'success');
				} else {
					const err = await response.json().catch(() => ({}));
					if (emailMessage) emailMessage.textContent = err.error || 'Error updating email';
					showMessage(err.error || 'Error updating email', 'error');
				}
			} catch (err) {
				if (emailMessage) emailMessage.textContent = 'Error updating email';
				showMessage('Error updating email', 'error');
			}
		});
	}

	if (changePasswordBtn && currentPassword && newPassword && confirmPassword) {
		changePasswordBtn.addEventListener('click', async () => {
			const cur = currentPassword.value;
			const nw = newPassword.value;
			const conf = confirmPassword.value;
			if (!cur || !nw || !conf) {
				if (passwordMessage) passwordMessage.textContent = 'Please fill all password fields';
				return;
			}
			if (nw !== conf) {
				if (passwordMessage) passwordMessage.textContent = 'Passwords do not match';
				return;
			}

			const emailToUse = email.value || email.placeholder || '';
			try {
				const verifyRes = await fetch('https://localhost:8443/signIn', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: emailToUse, password: cur })
				});
				if (!verifyRes.ok) {
					if (passwordMessage) passwordMessage.textContent = 'Current password incorrect';
					return;
				}
				const verifyBody = await verifyRes.json().catch(() => ({}));
				if (!verifyBody.token) {
					if (passwordMessage) passwordMessage.textContent = 'Cannot verify current password (2FA?)';
					return;
				}

				const response = await fetch(`https://localhost:8443/users/${userId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ password_hash: nw }),
					credentials: 'include'
				});

				if (response.ok) {
					if (passwordMessage) passwordMessage.textContent = 'Password changed successfully!';
					showMessage('Password changed successfully!', 'success');
					currentPassword.value = '';
					newPassword.value = '';
					confirmPassword.value = '';
				} else {
					const err = await response.json().catch(() => ({}));
					if (passwordMessage) passwordMessage.textContent = err.error || 'Error changing password';
					showMessage(err.error || 'Error changing password', 'error');
				}
			} catch (err) {
				if (passwordMessage) passwordMessage.textContent = 'Error changing password';
				showMessage('Error changing password', 'error');
			}
		});
	}

	deleteAccountBtn.addEventListener('click', async () => {
		if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) {
			return;
		}

		try {
			const response = await fetch(`https://localhost:8443/users/${userId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include'
			});

			if (response.ok) {
				showMessage('Account deleted successfully. Redirecting...', 'success');
				localStorage.removeItem('auth_token');
				setTimeout(() => {
					window.history.pushState({}, '', '/');
					window.dispatchEvent(new PopStateEvent('popstate'));
				}, 2000);
			} else {
				const error = await response.json();
				showMessage(error.error || 'Error deleting account', 'error');
			}
		} catch (error) {
			showMessage('Error deleting account', 'error');
		}
	});


	logoutBtn.addEventListener('click', () => {
		localStorage.removeItem('auth_token');
		showMessage('Logged out successfully! Redirecting...', 'success');
		setTimeout(() => {
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		}, 1000);
	});

	async function loadProfileData() {
		try {
			const response = await fetch(`https://localhost:8443/myprofile`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ id: userId })
			});

			if (response.ok) {
				const data = await response.json();
				displayProfileData(data);
			} else {
				showMessage('Error loading profile', 'error');
			}
		} catch (error) {
			showMessage('Error loading profile', 'error');
		}
	}

	function displayProfileData(data: any) {
		if (data.user) {
			username.value = data.user.username || '';
			email.value = data.user.email || '';
			email.placeholder = data.user.email || '';

			if (data.user.avatar_url && data.user.avatar_url !== 'placeholder.jpg') {
				const currentAvatar = document.getElementById('currentAvatar');
				if (currentAvatar) {
					const url = `https://localhost:8443/uploads/${data.user.avatar_url}`;
					currentAvatar.innerHTML = `<img src="${url}" alt="Avatar" class="w-full h-full object-cover">`;
				}
			}

			const statusIndicator = document.getElementById('statusIndicator');
			const statusText = document.getElementById('statusText');
			if (statusIndicator && statusText) {
				if (data.user.isLogged === 'online') {
					statusIndicator.className = 'w-3 h-3 bg-green-500 rounded-full';
					statusText.textContent = 'Online';
				} else {
					statusIndicator.className = 'w-3 h-3 bg-gray-400 rounded-full';
					statusText.textContent = 'Offline';
				}
			}
		}
	}

	function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
		message.textContent = text;
		message.className = `mt-6 text-center text-sm ${type === 'success' ? 'text-green-600' :
			type === 'error' ? 'text-red-600' : 'text-blue-600'
			}`;

		if (usernameMessage) {
			usernameMessage.textContent = text;
			usernameMessage.className = `text-sm mt-2 ${type === 'success' ? 'text-green-600' :
				type === 'error' ? 'text-red-600' : 'text-blue-600'}`;
		}

		setTimeout(() => {
			message.textContent = '';
			message.className = 'mt-6 text-center text-sm';
			if (usernameMessage) {
				usernameMessage.textContent = '';
				usernameMessage.className = 'text-sm mt-2';
			}
		}, 5000);
	}
}
