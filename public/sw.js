importScripts("/libcurl/index.js");
importScripts("/epoxy/index.js");
importScripts("/bare_transport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);
importScripts("./workerware/workerware.js");
importScripts("./marketplace/adblock/index.js")

const ww = new WorkerWare({
  debug: true,
});

ww.use({
  function: self.adblockExt.filterRequest,
  events: ["fetch"],
  name: "Adblock"
});

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
