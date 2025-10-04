import en from '../locales/en.js';
import fr from '../locales/fr.js';
import es from '../locales/es.js';

type Lang = "en" | "fr" | "es";
const languages: Record<Lang, any> = {en, fr, es};

let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "en";

export function getTranslation(key: string, lang: Lang): string {
	const parts = key.split(".");
	let value: any = languages[lang];

	for (const part of parts) {
		if (value && part in value)
			value = value[part];
		else
			return key;
	}
	return value;
}

export function updateTranslations() {
	document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(el => {
		const key = el.dataset.i18n!;
		const translation = getTranslation(key, currentLang);

		el.childNodes.forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				node.textContent = translation;
			}
		});
		if (!el.hasChildNodes())
			el.textContent = translation;
	})
}

export function setLanguage(lang: Lang) {
	currentLang = lang;
	localStorage.setItem("lang", lang);
	updateTranslations();
}

export function getLanguage(): Lang {
	return currentLang;
}