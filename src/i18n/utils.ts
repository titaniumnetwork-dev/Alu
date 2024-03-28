import { ui, defaultLang } from "./ui";

export const STATIC_PATHS = [{ params: { lang: "en" } }, { params: { lang: "jp" } }];

export function getLangFromUrl(url: URL) {
  // comma lol
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(translationKey: keyof (typeof ui)[typeof defaultLang]) {
    if (ui[lang][translationKey]) return ui[lang][translationKey];
    else return ui[defaultLang][translationKey];
  };
}
