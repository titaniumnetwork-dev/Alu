import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@inox-tools/sitemap-ext";
import dotenv from "dotenv-flow";
dotenv.config();

// Check if node is running in production mode
// const prodBuild = process.env.NODE_ENV === "production";
const prodBuild = process.env.IS_PROD === "true";

const site = prodBuild ? "https://aluu.xyz" : "http://localhost:3000";

export default defineConfig({
  site: site,
  integrations: [
    sitemap({
      includeByDefault: true,
      lastmod: new Date(),
    }),
  ],
  output: "server",
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
