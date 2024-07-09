importScripts("/libcurl/index.js");
importScripts("/epoxy/index.js");
importScripts("/bare_transport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);
importScripts("./workerware/workerware.js");

const ww = new WorkerWare({
  debug: true,
});

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
