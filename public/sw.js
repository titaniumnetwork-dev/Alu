importScripts("/epoxy/index.js");
importScripts("/libcurl/index.cjs");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
