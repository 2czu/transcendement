export function createSignUpPage(): void {
	const app = document.getElementById('app');
	if (!app) return;

	app.innerHTML = `
		<div class="min-h-screen relative overflow-hidden bg-gradient-to-tr from-indigo-900 to-black text-white flex flex-col items-center justify-center">
		<button id="homeBtn" aria-label="Home" title="Home" class="absolute top-4 left-4 bg-white text-black border rounded p-2 shadow-sm hover:bg-gray-100">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
			</svg>
		</button>
		<div class="text-center mb-8">
			<h1 data-i18n="signUp.create" class="text-4xl font-bold mb-2">Créer un compte</h1>
		</div>

	<form id="signupForm" class="bg-white/10 text-white rounded-lg shadow-lg p-8 w-96 space-y-4 backdrop-blur-sm border border-white/10">
			<div>
			<label data-i18n="signUp.username" class="block font-medium mb-1" for="username">Nom d'utilisateur</label>
	    <input id="username" name="username" type="text" required minlength="3"
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70">
			</div>

			<div>
			<label data-i18n="signUp.email" class="block font-medium mb-1" for="email">Email</label>
	    <input id="email" name="email" type="email" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70">
			</div>

			<div>
			<label data-i18n="signUp.password" class="block font-medium mb-1" for="password">Mot de passe</label>
	    <input id="password" name="password" type="password" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white placeholder:text-white/70">
			</div>

			<div>
			<label data-i18n="signUp.activate" class="block font-medium mb-1" for="is_2fa">Activer 2FA</label>
	    <select id="is_2fa" name="is_2fa" required
		    class="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:ring focus:ring-indigo-400 bg-transparent text-white">
				<option data-i18n="signUp.no" value="0">Non</option>
				<option data-i18n="signUp.yes" value="1">Oui</option>
			</select>
			</div>

			<button type="submit" data-i18n="signUp.signUp"
					class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
			S'inscrire
			</button>

			<p  data-i18n="signUp.account" class="text-sm text-white/80 text-center">Déjà un compte ? <a data-i18n="signUp.link" id="goSignIn" href="#" class="text-indigo-300 hover:underline">Se connecter</a></p>
		</form>

		<p id="message" class="mt-4 text-sm text-yellow-200"></p>
		</div>
	`;

	const form = document.getElementById("signupForm") as HTMLFormElement;
	const message = document.getElementById("message") as HTMLParagraphElement;
	const goSignIn = document.getElementById("goSignIn") as HTMLAnchorElement | null;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const payload =
		{
			username: formData.get("username") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
			is_2fa: Number(formData.get("is_2fa")),
			avatar_url: "placeholder.jpg",
			isLogged: "offline",
			secret_2fa: null
		};

		try {
			const res = await fetch("https://localhost:8443/signUp",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					mode: 'cors'
				});
			const data = await res.json();
			if (res.status === 201) {
				message.textContent = "Compte créé ! Redirection vers la connexion...";
				setTimeout(() => {
					window.history.pushState({}, '', '/signIn');
					window.dispatchEvent(new PopStateEvent('popstate'));
				}, 600);
				return;
			}
			message.textContent = data?.error || "Inscription échouée";
		}
		catch (err) {
			console.error(err);
			message.textContent = "Erreur de connexion au serveur";
		}
	});

	if (goSignIn) {
		goSignIn.addEventListener('click', (e) => {
			e.preventDefault();
			window.history.pushState({}, '', '/signIn');
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
}

