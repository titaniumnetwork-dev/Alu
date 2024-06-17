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

function logContext(event) {
  console.log("Event:", event);
  return undefined;
}

ww.use({
  function: logContext,
  events: ["fetch"],
});

const uv = new UVServiceWorker();

self.addEventListener("fetch", async (event) => {
  let mwResponse = await ww.run(event)();
  if (mwResponse.includes(null)) {
    console.log("Aborting Request!");
    return;
  }
  event.respondWith(
    (async () => {
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
