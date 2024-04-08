import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://aluu.xyz",
  integrations: [
    sitemap({
      lastmod: new Date(),
      i18n: {
        locales: {
          en: "en-US",
          jp: "ja-JP",
        },
        defaultLocale: "en",
      },
    }),
  ],
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),
});
