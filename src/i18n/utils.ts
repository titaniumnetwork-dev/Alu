import { ui, defaultLang } from "./ui";

type LanguageKeys = keyof typeof ui;
type TranslationKeys = keyof (typeof ui)[typeof defaultLang];

export const STATIC_PATHS = [{ params: { lang: "en" } }, { params: { lang: "jp" } }, { params: { lang: "fr" } }];

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

function useTranslations(lang: LanguageKeys) {
  return function t(translationKey: TranslationKeys) {
    let key = ui[lang][translationKey];
    if (key) return key;
    else return ui[defaultLang][translationKey];
  };
}

export const i18n = { getLangFromUrl, useTranslations, inferLangUseTranslations };
