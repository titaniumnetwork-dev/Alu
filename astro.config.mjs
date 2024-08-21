import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";

// Check if node is running in production mode
const prodBuild = process.env.NODE_ENV === "production";

const site = prodBuild ? "https://aluu.xyz" : "http://localhost:3000";

export default defineConfig({
  site: site,
  integrations: [
    sitemap({
      priority: 0.5,
      lastmod: new Date(),
      i18n: {
        locales: {
          en: "en-US",
          es: "es-ES",
          fr: "fr-FR",
          jp: "ja-JP",
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
