import { sequence } from "astro/middleware"
import config from "../../astro-i18n.config.ts"
import { useAstroI18n } from "astro-i18n"

const astroI18n = useAstroI18n(
	config,
	undefined /* custom formatters */,
)

export const onRequest = sequence(astroI18n)