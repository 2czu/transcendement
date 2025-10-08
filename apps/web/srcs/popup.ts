export function popup(message: string) {
	return new Promise((res: any) => {
		const popup = document.createElement("div");
		popup.id = "popup";

		popup.innerHTML = `
		<div class="fixed inset-0 flex items-center justify-center z-[1000]">
			<div class=" bg-gradient-to-tr from-indigo-900 to-black  rounded-xl p-6 rounded-2xl shadow-xl p-6 text-center min-w-[280px] max-w-[90%] animate-fadeIn">
				<p class="text-lg text-white mb-5">${message}</p>
				<div class="flex justify-center gap-4">
					<button id="yes" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-200">
						Yes
					</button>
					<button id="no" class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200">
						No
					</button>
				</div>
			</div>
		</div>
		`;

		document.body.appendChild(popup);
		const yes = popup.querySelector("#yes") as HTMLButtonElement | null;
		const no = popup.querySelector("#no") as HTMLButtonElement | null;

		if (!yes || !no)
		{
			popup.remove();
			res(false);
			return;
		}

		yes.onclick = () => {
			popup.remove();
			res(true);
		}

		no.onclick = () => {
			popup.remove();
			res(false);
		}
	});
};