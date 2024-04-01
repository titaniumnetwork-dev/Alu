import { ui, defaultLang } from "./ui";

export const STATIC_PATHS = [{ params: { lang: "en" } }, { params: { lang: "jp" } }];

function getLangFromUrl(url: URL) {
  // comma lol
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

function inferLangUseTranslations(url: URL) {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}

function useTranslations(lang: keyof typeof ui) {
  return function t(translationKey: keyof (typeof ui)[typeof defaultLang]) {
    if (ui[lang][translationKey]) return ui[lang][translationKey];
    else return ui[defaultLang][translationKey];
  };
}

export const i18n = { getLangFromUrl, useTranslations, inferLangUseTranslations };
