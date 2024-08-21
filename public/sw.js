importScripts("/uv/uv.bundle.js", "/uv.config.js", "/workerware/workerware.js");
importScripts( __uv$config.sw);
importScripts("/marketplace/scriptInjector/index.js")

const uv = new UVServiceWorker();
const ww = new WorkerWare({
  debug: false,
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
          eval(atob(extension.scriptCopy));
          const func = self[extension.entryNamespace][extension.entryFunc];
          switch (extension.type) {
            case "serviceWorker": 
              // Loads the function to be added as a middleware into global scope.
              
              ww.use({
                function: self[extension.entryNamespace][extension.entryFunc],
                name: extension.title,
                events: ["fetch"],
              });
              break;
            case "page":
              console.log("Calling " + extension.entryFunc);
              func();
              break;
            
          }
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