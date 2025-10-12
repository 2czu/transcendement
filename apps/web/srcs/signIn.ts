export function createSignInPage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col items-center justify-center">
		<button id="homeBtn" aria-label="Home" title="Home" class="absolute top-4 left-4 bg-white/10 border rounded p-2 shadow-sm hover:bg-white/20 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
				</svg>
		</button>
		<div class="text-center mb-8">
			<h1 data-i18n="signIn.connexion" class="text-4xl font-bold mb-2">Connexion</h1>
		</div>

	<form id="signinForm" class="bg-white/10 text-white rounded-lg shadow-lg p-8 w-96 space-y-4 backdrop-blur-sm border border-white/10">
			<div>
			<label data-i18n="signIn.email" class="block font-medium mb-1" for="email">Email</label>
	    <input id="email" name="email" type="email" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70">
			</div>

			<div>
			<label data-i18n="signIn.password" class="block font-medium mb-1" for="password">Mot de passe</label>
	    <input id="password" name="password" type="password" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70">
			</div>

			<button type="submit" data-i18n="signIn.signIn"
					class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
			Se connecter
			</button>
			<div id="google-button" class="mt-4 flex justify-center"></div>

			<p data-i18n="signIn.no_account" class="text-sm text-white/80 text-center">Pas de compte ? <a data-i18n="signIn.link" id="goSignUp" href="#" class="text-indigo-300 hover:underline">Créer un compte</a></p>
		</form>

	<div id="twofa" class="hidden bg-white/10 text-white rounded-lg shadow-lg p-8 w-96 space-y-4 mt-6 backdrop-blur-sm border border-white/10">
	    <p class="text-sm text-white/80">Entrez le code 2FA reçu (valide 5 min).</p>
	    <form id="twofaForm" class="space-y-4">
	    <input id="code2fa" name="code2fa" type="text" inputmode="numeric" pattern="^[0-9]{6}$" maxlength="6" minlength="6" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70" placeholder="Code à 6 chiffres">
	    <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Valider 2FA</button>
	    </form>
	</div>


		<p id="message" class="mt-4 text-sm text-yellow-200"></p>
		</div>
	`;

	const form = document.getElementById("signinForm") as HTMLFormElement;
	const message = document.getElementById("message") as HTMLParagraphElement;
	const twofaContainer = document.getElementById("twofa") as HTMLDivElement;
	const twofaForm = document.getElementById("twofaForm") as HTMLFormElement | null;
	const goSignUp = document.getElementById("goSignUp") as HTMLAnchorElement | null;
	let pendingUserIdFor2FA: number | null = null;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const payload =
		{
			email: formData.get("email") as string,
			password: formData.get("password") as string
		};

		try {
			const res = await fetch("https://localhost:8443/signIn",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),

					// self signed
					mode: 'cors',
					credentials: "include"
				});
			const data = await res.json();
			if (!res.ok) {
				message.textContent = data?.error || "Identifiants invalides";
				return;
			}

			if (data?.require2FA && data?.userId) {
				pendingUserIdFor2FA = Number(data.userId);
				twofaContainer.classList.remove('hidden');
				message.textContent = "2FA requis: entrez le code";
				return;
			}
			message.textContent = "Connecté ! Redirection...";
			setTimeout(() => {
				window.history.pushState({}, '', '/');
				window.dispatchEvent(new PopStateEvent('popstate'));
			}, 500);
		}
		catch (err) {
			console.error(err);
			message.textContent = "Erreur de connexion au serveur";
		}
	});

	if (twofaForm) {
		twofaForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!pendingUserIdFor2FA) {
				message.textContent = "Session 2FA invalide";
				return;
			}
			const codeInput = document.getElementById('code2fa') as HTMLInputElement;
			const code = codeInput.value.trim();
			if (!/^[0-9]{6}$/.test(code)) {
				message.textContent = "Code 2FA invalide";
				return;
			}
			try {
				const res = await fetch("https://localhost:8443/2fa_req",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id: pendingUserIdFor2FA, secret_2fa: code }),
						mode: 'cors'
					});
				const data = await res.json();
				if (!res.ok) {
					message.textContent = data?.error || "Code 2FA incorrect";
					return;
				}
					message.textContent = "Connecté ! Redirection...";
					setTimeout(() => {
						window.history.pushState({}, '', '/');
						window.dispatchEvent(new PopStateEvent('popstate'));
					}, 500);
			}
			catch (err) {
				console.error(err);
				message.textContent = "Erreur de connexion au serveur";
			}
		});
	}

	if (goSignUp) {
		goSignUp.addEventListener('click', (e) => {
			e.preventDefault();
			window.history.pushState({}, '', '/signUp');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});
	}

	const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			window.history.pushState({}, '', '/');
			window.dispatchEvent(new PopStateEvent('popstate'));
		});
	}
	loadGoogleScript("1047189652036-miitijufimvv2qct8rrimpqmcbc5fu64.apps.googleusercontent.com", (response) => {
		if (!response.credential) {
			message.textContent = "Erreur Google : token manquant";
			return;
		}
		fetch("https://localhost:8443/auth/google/callback", {
			method: "POST",
			headers: { "Content-Type": "application/json", },
			body: JSON.stringify({ id_token: response.credential }),
			credentials: "include"
		})
			.then(res => res.json())
			.then(data => {
				message.textContent = data.message;
				setTimeout(() => {
					window.history.pushState({}, '', '/');
					window.dispatchEvent(new PopStateEvent('popstate'));
				}, 500);
			})
			.catch(err => console.error(err));
	});
	if ((window as any).googleLoaded && (window as any).google?.accounts) {
		const btn = document.getElementById("google-button");
		if (btn) {
			google.accounts.id.renderButton(
				btn,
				{ theme: "outline", width: 320 }
			);
		}
	}
}


declare const google: any

function loadGoogleScript(clientId: string, callback: (res: any) => void) {
	if ((window as any).googleLoaded) return;
	(window as any).googleLoaded = true;
	const script = document.createElement('script');
	script.src = "https://accounts.google.com/gsi/client";
	script.async = true;
	script.defer = true;

	script.onload = () => {
		google.accounts.id.initialize({
			client_id: clientId,
			callback: callback
		});

		const btn = document.getElementById("google-button");
		if (btn) {
			google.accounts.id.renderButton(
				btn,
				{ theme: "outline", width: 320 }
			);
		}
	}
	document.body.appendChild(script);
};
