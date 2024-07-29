import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://aluu.xyz",
  integrations: [
    sitemap({
      priority: 0.5,
      lastmod: new Date(),
      i18n: {
        locales: {
          en: "en-US",
          jp: "ja-JP",
          fr: "fr-FR",
          ru: "ru-RU",
          zh: "zh-CN",
        },
        defaultLocale: "en",
      },
    }),
  ],
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
