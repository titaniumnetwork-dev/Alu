import { ui, defaultLang } from "./ui";

type LanguageKeys = keyof typeof ui;
type TranslationKeys = keyof (typeof ui)[typeof defaultLang];
type StaticPath = { params: { lang: string } };

const STATIC_PATHS: StaticPath[] = [];
for (const lang in ui) {
  STATIC_PATHS.push({ params: { lang } });
}

function getLangFromUrl(url: URL) {
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
    const key = ui[lang][translationKey];
    if (key) return key;
    else return ui[defaultLang][translationKey];
  };
}

export const i18n = { getLangFromUrl, useTranslations, inferLangUseTranslations };
export { STATIC_PATHS };
