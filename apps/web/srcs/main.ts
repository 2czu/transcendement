import "./style.css";
import { initRouter } from './router';

document.addEventListener('DOMContentLoaded', () => {
	initRouter();
});

export async function getUserId(): Promise<number | null> {
	let userId: number;
	try {
		const res = await fetch('https://localhost:8443/userId', {
			method: 'GET',
			credentials: "include"
		});
		if (!res.ok)
			return null;
		const data = await res.json();
		return userId = data?.userId ?? null;
	} catch (err) {
		console.error("Erreur réseau:", err);
    	return null;
	}
}