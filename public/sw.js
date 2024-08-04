importScripts("/uv/uv.bundle.js", "/uv.config.js", "/workerware/workerware.js");
importScripts( __uv$config.sw);
importScripts("/marketplace/scriptInjector/index.js")

const uv = new UVServiceWorker();
const ww = new WorkerWare({
  debug: false,
});

async function getVencordJS() {
  const vencordJS = await fetch("/marketplace/vencord/browser.js");
  self.vencordJS = await vencordJS.text();
  uv.config.inject = [{
    "host": "discord.com",
    "html": `<script>${self.vencordJS}</script><link rel="stylesheet" href="https://raw.githubusercontent.com/Vencord/builds/main/browser.css"></link>`,
    "injectTo": "head",
  }];
}
// getVencordJS();

function loadExtensionScripts() {
  try {
    let db = indexedDB.open("AluDB", 1);
    db.onsuccess = () => {
      let transaction = db.result.transaction("InstalledExtensions", "readonly");
      let store = transaction.objectStore("InstalledExtensions");
      let request = store.getAll();
      request.onsuccess = () => {
        let extensions = request.result;
        extensions.forEach((extension) => {
          if (extension.type != "serviceWorker") return;
          // Loads the function to be added as a middleware into global scope.
          eval(atob(extension.scriptCopy));
          ww.use({
            function: self[extension.entryNamespace][extension.entryFunc],
            name: extension.title,
            events: ["fetch"],
          });
        });
      };
    };
  } catch (err) {
    console.error(`Failed load extension scripts: ${err}`);
  }
}
loadExtensionScripts();

self.addEventListener("fetch", async (event) => {
  event.respondWith(
    (async () => {
      let mwResponse = await ww.run(event)();
      if (mwResponse.includes(null)) {
        return;
      }
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});