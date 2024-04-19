importScripts("/libcurl/index.js");
importScripts("/epoxy/index.js");
importScripts("/bare_transport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);

const uv = new UVServiceWorker();

async function loadHooks() {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open("AluDB", 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });

  const transaction = db.transaction("InstalledExtensions", "readwrite");
  const objectStore = transaction.objectStore("InstalledExtensions");
  const extensions = await new Promise((resolve, reject) => {
    const request = objectStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });

  extensions.forEach((extension) => {
    if (extension.serviceWorkerExtension) {
      // Load the base64 encoded script contents;
      importScripts(`data:text/plain;base64,${extension.script}`);
    }
  });
}

loadHooks();
