self.vencordExt = {};

async function loadVC() {
  console.log("Loading Vencord...");
  const vencordJS = await fetch("/marketplace/vencord/bundle/browser.js");
  const vencordCSS = await fetch("https://raw.githubusercontent.com/Vencord/builds/main/browser.css");
  self.vencordJS = await vencordJS.text();
  self.vencordCSS = await vencordCSS.text();
  if (uv.config.inject === undefined) {
    uv.config.inject = [];
  };
  uv.config.inject.push({
    "host": "discord.com",
    "html": `<script>${self.vencordJS}</script><style>${self.vencordCSS}</style>`,
    "injectTo": "head",
  });
}

self.vencordExt.loadVC = loadVC;