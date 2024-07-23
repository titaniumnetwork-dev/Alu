importScripts("/uv/uv.bundle.js", "/uv.config.js", "/workerware/workerware.js");
importScripts( __uv$config.sw);

const ww = new WorkerWare({
  debug: false,
});

self.__uv$config.inject = [{
  host: "discord.com",
  html: `
      <script src="https://raw.githubusercontent.com/Vencord/builds/main/browser.js"></script>
      <link rel="stylesheet" href="https://raw.githubusercontent.com/Vencord/builds/main/browser.css">
  `,
  injectTo: "head",
}];


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
          // The function defined should NOT immediately execute any function.
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

const uv = new UVServiceWorker();

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