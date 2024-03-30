importScripts("/libcurl/index.js");
if (!navigator.userAgent.includes("Firefox")) {
    importScripts("/epoxy/index.js");
}
importScripts("/bare_transport.js")
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
